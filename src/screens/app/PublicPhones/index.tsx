import { DeleteModal } from "@/components/miscellaneous/DeleteModal";
import { Pagination } from "@/components/miscellaneous/Pagination";
import {
  createPublicPhone,
  deletePublicPhone,
  listPublicPhones,
  updatePublicPhone,
  type CreatePublicPhoneDTO,
  type PublicPhoneResponseDTO,
  type UpdatePublicPhoneDTO,
} from "@/services/public-phones";
import {
  getErrorMessage,
  showAlertError,
  showAlertSuccess,
} from "@/utils/alerts";
import {
  PencilSimpleLineIcon,
  PhoneCallIcon,
  PlusIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";

type FormMode = "create" | "edit";

const ITEMS_PER_PAGE = 5;

export function PublicPhones() {
  const [phones, setPhones] = useState<PublicPhoneResponseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>("create");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formInstitutionName, setFormInstitutionName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [deleting, setDeleting] = useState<PublicPhoneResponseDTO | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchPhones() {
      setIsLoading(true);
      try {
        const result = await listPublicPhones({ page: 1, perPage: 100 });
        if (!cancelled) setPhones(result.data);
      } catch (error) {
        if (!cancelled) {
          showAlertError(
            getErrorMessage(
              error,
              "Não foi possível carregar os telefones públicos.",
            ),
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchPhones();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleOpenCreate = () => {
    setFormMode("create");
    setEditingId(null);
    setFormInstitutionName("");
    setFormPhone("");
    setFormModalOpen(true);
  };

  const handleOpenEdit = (phone: PublicPhoneResponseDTO) => {
    setFormMode("edit");
    setEditingId(phone.id);
    setFormInstitutionName(phone.institutionName);
    setFormPhone(phone.phone);
    setFormModalOpen(true);
  };

  const handleCloseForm = () => {
    if (isSaving) return;
    setFormModalOpen(false);
  };

  const isFormValid =
    formInstitutionName.trim().length > 0 && formPhone.trim().length > 0;

  const handleSave = async () => {
    if (!isFormValid) return;

    const institutionName = formInstitutionName.trim();
    const phone = formPhone.trim();

    setIsSaving(true);
    try {
      if (formMode === "create") {
        const payload: CreatePublicPhoneDTO = { institutionName, phone };
        const created = await createPublicPhone(payload);
        setPhones((current) => [created, ...current]);
        showAlertSuccess("Telefone público cadastrado com sucesso.");
      } else if (editingId) {
        const payload: UpdatePublicPhoneDTO = { institutionName, phone };
        const updated = await updatePublicPhone(editingId, payload);
        setPhones((current) =>
          current.map((item) => (item.id === updated.id ? updated : item)),
        );
        showAlertSuccess("Telefone público atualizado com sucesso.");
      }
      setFormModalOpen(false);
    } catch (error) {
      showAlertError(
        getErrorMessage(error, "Não foi possível salvar o telefone público."),
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleting) return;

    setIsDeleting(true);
    try {
      await deletePublicPhone(deleting.id);
      setPhones((current) => current.filter((item) => item.id !== deleting.id));
      showAlertSuccess("Telefone público removido com sucesso.");
      setDeleting(null);
    } catch (error) {
      showAlertError(
        getErrorMessage(error, "Não foi possível remover o telefone público."),
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(phones.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * ITEMS_PER_PAGE;
  const paginatedPhones = phones.slice(pageStart, pageStart + ITEMS_PER_PAGE);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <section className="flex flex-col gap-4 rounded-[2rem] border border-border-card/70 bg-white/80 p-5 shadow-[0_32px_80px_-52px_rgba(15,23,42,0.45)] backdrop-blur-sm dark:bg-bg-card/80 sm:p-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <div className="inline-flex w-fit items-center gap-3 rounded-sm bg-background px-4 py-2 text-sm font-medium text-foreground/80">
                <PhoneCallIcon size={22} weight="fill" />
                <span>Telefones públicos</span>
              </div>
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                Gerenciar telefones públicos
              </h1>
              <p className="max-w-3xl text-sm leading-6 text-foreground/70 sm:text-base">
                Cadastre, edite e remova os telefones públicos de instituições
                disponibilizados para a comunidade.
              </p>
              {!isLoading && (
                <p className="text-sm font-medium text-foreground/70 sm:text-base">
                  Atualmente existem{" "}
                  <span className="font-bold text-foreground">
                    {phones.length}{" "}
                    {phones.length === 1
                      ? "telefone cadastrado"
                      : "telefones cadastrados"}
                  </span>
                  .
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleOpenCreate}
              className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-sm px-5 py-3 text-sm font-medium !bg-primary-500 !text-white transition hover:!bg-primary-600"
            >
              <PlusIcon size={18} weight="bold" />
              Cadastrar telefone
            </button>
          </div>
        </section>

        {isLoading ? (
          <div className="rounded-[2rem] border border-border-card bg-bg-card p-10 text-center shadow-sm">
            <p className="text-sm text-foreground/65">
              Carregando telefones públicos...
            </p>
          </div>
        ) : phones.length > 0 ? (
          <>
            <section className="flex flex-col gap-4">
              {paginatedPhones.map((phone) => (
                <article
                  key={phone.id}
                  className="flex flex-col gap-4 rounded-[1.6rem] border border-border-card/70 bg-bg-card p-5 shadow-[0_28px_64px_-48px_rgba(15,23,42,0.45)] sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 flex-col gap-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">
                      Instituição
                    </p>
                    <h3 className="text-lg font-black tracking-tight">
                      {phone.institutionName}
                    </h3>
                    <span className="inline-flex w-fit items-center gap-2 rounded-sm bg-foreground/5 px-3 py-1.5 text-sm font-semibold text-foreground/70 dark:bg-white/5">
                      <PhoneCallIcon size={16} weight="fill" />
                      {phone.phone}
                    </span>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <button
                      type="button"
                      title="Editar telefone público"
                      aria-label="Editar telefone público"
                      onClick={() => handleOpenEdit(phone)}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-sm border border-foreground/10 bg-background/80 text-foreground transition hover:border-foreground/20 hover:bg-foreground/5 dark:bg-white/[0.03]"
                    >
                      <PencilSimpleLineIcon size={20} weight="bold" />
                    </button>
                    <button
                      type="button"
                      title="Remover telefone público"
                      aria-label="Remover telefone público"
                      onClick={() => setDeleting(phone)}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-sm border border-destructive-500/25 bg-destructive-500/10 text-destructive-600 transition hover:bg-destructive-500/15 dark:text-destructive-300"
                    >
                      <TrashIcon size={20} weight="fill" />
                    </button>
                  </div>
                </article>
              ))}
            </section>
            <Pagination
              currentPage={safePage}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        ) : (
          <div className="rounded-[2rem] border border-dashed border-border-card bg-bg-card p-10 text-center shadow-sm">
            <h3 className="text-lg font-bold">
              Nenhum telefone público cadastrado
            </h3>
            <p className="mt-2 text-sm text-foreground/65">
              Cadastre o primeiro telefone público para disponibilizá-lo à
              comunidade.
            </p>
          </div>
        )}
      </div>

      {formModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          onClick={handleCloseForm}
        >
          <div
            className="w-full max-w-lg rounded-[1.75rem] border border-border-card/70 bg-bg-card p-6 shadow-[0_32px_80px_-40px_rgba(15,23,42,0.6)]"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className="text-xl font-black tracking-tight">
              {formMode === "create"
                ? "Cadastrar telefone público"
                : "Editar telefone público"}
            </h2>
            <p className="mt-2 text-sm text-foreground/65">
              Informe o nome da instituição e o telefone público de contato.
            </p>

            <div className="mt-4 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="phone-institution"
                  className="text-sm font-medium text-foreground/80"
                >
                  Instituição <span className="text-destructive-500">*</span>
                </label>
                <input
                  id="phone-institution"
                  type="text"
                  value={formInstitutionName}
                  onChange={(event) =>
                    setFormInstitutionName(event.target.value)
                  }
                  placeholder="Ex.: Defesa Civil"
                  className="w-full rounded-sm border border-border-card bg-background px-3 py-2.5 text-sm text-foreground outline-none transition placeholder:text-foreground/40 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="phone-number"
                  className="text-sm font-medium text-foreground/80"
                >
                  Telefone <span className="text-destructive-500">*</span>
                </label>
                <input
                  id="phone-number"
                  type="text"
                  inputMode="tel"
                  value={formPhone}
                  onChange={(event) => setFormPhone(event.target.value)}
                  placeholder="Ex.: 199 ou (31) 3333-4444"
                  className="w-full rounded-sm border border-border-card bg-background px-3 py-2.5 text-sm text-foreground outline-none transition placeholder:text-foreground/40 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30"
                />
                {!isFormValid && (
                  <p className="text-xs text-destructive-500">
                    Informe a instituição e o telefone.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleCloseForm}
                disabled={isSaving}
                className="rounded-sm border border-foreground/15 bg-background px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-foreground/5 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving || !isFormValid}
                className="inline-flex items-center justify-center gap-2 rounded-sm px-5 py-3 text-sm font-medium !bg-primary-500 !text-white transition hover:!bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSaving
                  ? "Salvando..."
                  : formMode === "create"
                    ? "Cadastrar telefone"
                    : "Salvar alterações"}
              </button>
            </div>
          </div>
        </div>
      )}

      <DeleteModal
        resource="telefone público"
        isOpen={!!deleting}
        onRequestClose={() => {
          if (!isDeleting) setDeleting(null);
        }}
        onClose={() => {
          if (!isDeleting) setDeleting(null);
        }}
        onConfirmAction={handleConfirmDelete}
      />
    </main>
  );
}
