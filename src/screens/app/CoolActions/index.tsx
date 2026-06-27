import { SelectInput } from "@/components/inputs/SelectInput";
import { DeleteModal } from "@/components/miscellaneous/DeleteModal";
import { Pagination } from "@/components/miscellaneous/Pagination";
import {
  createCoolAction,
  deleteCoolAction,
  listCoolActions,
  updateCoolAction,
  type CoolActionCategory,
  type CoolActionResponseDTO,
  type CreateCoolActionDTO,
  type UpdateCoolActionDTO,
} from "@/services/cool-actions";
import {
  getErrorMessage,
  showAlertError,
  showAlertSuccess,
} from "@/utils/alerts";
import {
  HandHeartIcon,
  PencilSimpleLineIcon,
  PlusIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";

type FormMode = "create" | "edit";

const ITEMS_PER_PAGE = 5;

const CATEGORY_OPTIONS: Array<{ value: CoolActionCategory; label: string }> = [
  { value: "LIMPEZA_URBANA", label: "Limpeza urbana" },
  { value: "MEIO_AMBIENTE", label: "Meio ambiente" },
  { value: "EDUCACAO", label: "Educação" },
  { value: "BEM_ESTAR_ANIMAL", label: "Bem-estar animal" },
  { value: "ZELADORIA", label: "Zeladoria" },
  { value: "SEGURANCA_COMUNITARIA", label: "Segurança comunitária" },
  { value: "ENGAJAMENTO_COMUNITARIO", label: "Engajamento comunitário" },
];

const categoryLabel = (category: CoolActionCategory) =>
  CATEGORY_OPTIONS.find((option) => option.value === category)?.label ??
  category;

export function CoolActions() {
  const [coolActions, setCoolActions] = useState<CoolActionResponseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>("create");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState<CoolActionCategory | "">("");
  const [formPoints, setFormPoints] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [deleting, setDeleting] = useState<CoolActionResponseDTO | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchCoolActions() {
      setIsLoading(true);
      try {
        const result = await listCoolActions({ page: 1, perPage: 100 });
        if (!cancelled) setCoolActions(result.data);
      } catch (error) {
        if (!cancelled) {
          showAlertError(
            getErrorMessage(error, "Não foi possível carregar as ações."),
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchCoolActions();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleOpenCreate = () => {
    setFormMode("create");
    setEditingId(null);
    setFormTitle("");
    setFormCategory("");
    setFormPoints("");
    setFormModalOpen(true);
  };

  const handleOpenEdit = (coolAction: CoolActionResponseDTO) => {
    setFormMode("edit");
    setEditingId(coolAction.id);
    setFormTitle(coolAction.title);
    setFormCategory(coolAction.category);
    setFormPoints(String(coolAction.points));
    setFormModalOpen(true);
  };

  const handleCloseForm = () => {
    if (isSaving) return;
    setFormModalOpen(false);
  };

  const pointsNumber = Number(formPoints);
  const isFormValid =
    formTitle.trim().length > 0 &&
    formCategory !== "" &&
    formPoints.trim().length > 0 &&
    Number.isInteger(pointsNumber) &&
    pointsNumber > 0;

  const handleSave = async () => {
    if (!isFormValid) return;

    const title = formTitle.trim();

    setIsSaving(true);
    try {
      if (formMode === "create") {
        const payload: CreateCoolActionDTO = {
          title,
          category: formCategory,
          points: pointsNumber,
        };
        const created = await createCoolAction(payload);
        setCoolActions((current) => [created, ...current]);
        showAlertSuccess("Ação cadastrada com sucesso.");
      } else if (editingId) {
        const payload: UpdateCoolActionDTO = {
          title,
          category: formCategory,
          points: pointsNumber,
        };
        const updated = await updateCoolAction(editingId, payload);
        setCoolActions((current) =>
          current.map((item) => (item.id === updated.id ? updated : item)),
        );
        showAlertSuccess("Ação atualizada com sucesso.");
      }
      setFormModalOpen(false);
    } catch (error) {
      showAlertError(getErrorMessage(error, "Não foi possível salvar a ação."));
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleting) return;

    setIsDeleting(true);
    try {
      await deleteCoolAction(deleting.id);
      setCoolActions((current) =>
        current.filter((item) => item.id !== deleting.id),
      );
      showAlertSuccess("Ação removida com sucesso.");
      setDeleting(null);
    } catch (error) {
      showAlertError(
        getErrorMessage(error, "Não foi possível remover a ação."),
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const totalPages = Math.max(
    1,
    Math.ceil(coolActions.length / ITEMS_PER_PAGE),
  );
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * ITEMS_PER_PAGE;
  const paginatedCoolActions = coolActions.slice(
    pageStart,
    pageStart + ITEMS_PER_PAGE,
  );

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <section className="flex flex-col gap-4 rounded-[2rem] border border-border-card/70 bg-white/80 p-5 shadow-[0_32px_80px_-52px_rgba(15,23,42,0.45)] backdrop-blur-sm dark:bg-bg-card/80 sm:p-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <div className="inline-flex w-fit items-center gap-3 rounded-sm bg-background px-4 py-2 text-sm font-medium text-foreground/80">
                <HandHeartIcon size={22} weight="fill" />
                <span>Ações</span>
              </div>
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                Gerenciar ações
              </h1>
              <p className="max-w-3xl text-sm leading-6 text-foreground/70 sm:text-base">
                Cadastre, edite e remova as ações que os cidadãos podem realizar
                e a pontuação concedida por cada uma.
              </p>
              {!isLoading && (
                <p className="text-sm font-medium text-foreground/70 sm:text-base">
                  Atualmente existem{" "}
                  <span className="font-bold text-foreground">
                    {coolActions.length}{" "}
                    {coolActions.length === 1
                      ? "ação cadastrada"
                      : "ações cadastradas"}
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
              Cadastrar ação
            </button>
          </div>
        </section>

        {isLoading ? (
          <div className="rounded-[2rem] border border-border-card bg-bg-card p-10 text-center shadow-sm">
            <p className="text-sm text-foreground/65">Carregando ações...</p>
          </div>
        ) : coolActions.length > 0 ? (
          <>
            <section className="flex flex-col gap-4">
              {paginatedCoolActions.map((coolAction) => (
                <article
                  key={coolAction.id}
                  className="flex flex-col gap-4 rounded-[1.6rem] border border-border-card/70 bg-bg-card p-5 shadow-[0_28px_64px_-48px_rgba(15,23,42,0.45)] sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 flex-col gap-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">
                      Ação
                    </p>
                    <h3 className="text-lg font-black tracking-tight">
                      {coolAction.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex w-fit items-center gap-2 rounded-sm bg-foreground/5 px-3 py-1.5 text-sm font-semibold text-foreground/70 dark:bg-white/5">
                        {categoryLabel(coolAction.category)}
                      </span>
                      <span className="inline-flex w-fit items-center gap-2 rounded-sm bg-primary-500/10 px-3 py-1.5 text-sm font-semibold text-primary-700 dark:text-primary-200">
                        {coolAction.points}{" "}
                        {coolAction.points === 1 ? "ponto" : "pontos"}
                      </span>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <button
                      type="button"
                      title="Editar ação"
                      aria-label="Editar ação"
                      onClick={() => handleOpenEdit(coolAction)}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-sm border border-foreground/10 bg-background/80 text-foreground transition hover:border-foreground/20 hover:bg-foreground/5 dark:bg-white/[0.03]"
                    >
                      <PencilSimpleLineIcon size={20} weight="bold" />
                    </button>
                    <button
                      type="button"
                      title="Remover ação"
                      aria-label="Remover ação"
                      onClick={() => setDeleting(coolAction)}
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
            <h3 className="text-lg font-bold">Nenhuma ação cadastrada</h3>
            <p className="mt-2 text-sm text-foreground/65">
              Cadastre a primeira ação para disponibilizá-la aos cidadãos.
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
              {formMode === "create" ? "Cadastrar ação" : "Editar ação"}
            </h2>
            <p className="mt-2 text-sm text-foreground/65">
              Informe o título, a categoria e a pontuação da ação.
            </p>

            <div className="mt-4 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="cool-action-title"
                  className="text-sm font-medium text-foreground/80"
                >
                  Título <span className="text-destructive-500">*</span>
                </label>
                <input
                  id="cool-action-title"
                  type="text"
                  value={formTitle}
                  onChange={(event) => setFormTitle(event.target.value)}
                  placeholder="Ex.: Mutirão de limpeza"
                  className="w-full rounded-sm border border-border-card bg-background px-3 py-2.5 text-sm text-foreground outline-none transition placeholder:text-foreground/40 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="cool-action-category"
                  className="text-sm font-medium text-foreground/80"
                >
                  Categoria <span className="text-destructive-500">*</span>
                </label>
                <SelectInput
                  label="Categoria"
                  labelClassName="sr-only"
                  widthVariant="full"
                  disableSort
                  isSearchable={false}
                  placeholder="Selecione uma categoria"
                  value={formCategory || null}
                  options={CATEGORY_OPTIONS}
                  onSelectOption={(option) =>
                    setFormCategory(option.value as CoolActionCategory)
                  }
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="cool-action-points"
                  className="text-sm font-medium text-foreground/80"
                >
                  Pontuação <span className="text-destructive-500">*</span>
                </label>
                <input
                  id="cool-action-points"
                  type="number"
                  min={5}
                  step={5}
                  max={100}
                  value={formPoints}
                  onChange={(event) => setFormPoints(event.target.value)}
                  placeholder="Ex.: 10"
                  className="w-full rounded-sm border border-border-card bg-background px-3 py-2.5 text-sm text-foreground outline-none transition placeholder:text-foreground/40 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30"
                />
                {!isFormValid && (
                  <p className="text-xs text-destructive-500">
                    Informe o título, a categoria e uma pontuação inteira maior
                    que zero.
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
                    ? "Cadastrar ação"
                    : "Salvar alterações"}
              </button>
            </div>
          </div>
        </div>
      )}

      <DeleteModal
        resource="ação"
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
