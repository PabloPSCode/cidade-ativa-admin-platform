import { DeleteModal } from "@/components/miscellaneous/DeleteModal";
import { Pagination } from "@/components/miscellaneous/Pagination";
import { deletePoll, listPolls, type PollResponseDTO } from "@/services/polls";
import {
  getErrorMessage,
  showAlertError,
  showAlertSuccess,
} from "@/utils/alerts";
import { ChartBarIcon, PlusIcon } from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import CreatePollModal from "./components/CreatePollModal";
import EditPollModal from "./components/EditPollModal";
import PollCard from "./components/PollCard";
import PollDetailsModal from "./components/PollDetailsModal";
import PollFilterCard from "./components/PollFilterCard";
import { pollStatusOptions, type PollStatus } from "./constants/polls";

const ITEMS_PER_PAGE = 5;

export function Polls() {
  const [polls, setPolls] = useState<PollResponseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [detailsPoll, setDetailsPoll] = useState<PollResponseDTO | null>(null);
  const [editingPoll, setEditingPoll] = useState<PollResponseDTO | null>(null);
  const [deletingPoll, setDeletingPoll] = useState<PollResponseDTO | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<PollStatus | "all">(
    "all",
  );
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;

    async function fetchPolls() {
      setIsLoading(true);
      try {
        const result = await listPolls({ page: 1, perPage: 100 });
        if (!cancelled) setPolls(result.data);
      } catch (error) {
        if (!cancelled) {
          setPolls([]);
          showAlertError(
            getErrorMessage(error, "Não foi possível carregar as enquetes."),
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchPolls();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, selectedStatus]);

  const normalizedSearch = search.trim().toLowerCase();

  const filteredPolls = useMemo(
    () =>
      polls.filter((poll) => {
        const matchesSearch =
          normalizedSearch.length === 0 ||
          [poll.title, poll.description].some((value) =>
            value.toLowerCase().includes(normalizedSearch),
          );

        const matchesStatus =
          selectedStatus === "all" || poll.status === selectedStatus;

        return matchesSearch && matchesStatus;
      }),
    [polls, normalizedSearch, selectedStatus],
  );

  const hasActiveFilters = search.trim().length > 0 || selectedStatus !== "all";

  const handleResetFilters = () => {
    setSearch("");
    setSelectedStatus("all");
  };

  const handleConfirmDelete = async () => {
    if (!deletingPoll) return;

    setIsDeleting(true);
    try {
      await deletePoll(deletingPoll.id);
      setPolls((current) =>
        current.filter((item) => item.id !== deletingPoll.id),
      );
      showAlertSuccess("Enquete removida com sucesso.");
      setDeletingPoll(null);
    } catch (error) {
      showAlertError(
        getErrorMessage(error, "Não foi possível remover a enquete."),
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPolls.length / ITEMS_PER_PAGE),
  );
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * ITEMS_PER_PAGE;
  const paginatedPolls = filteredPolls.slice(
    pageStart,
    pageStart + ITEMS_PER_PAGE,
  );

  const totalPolls = polls.length;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-stretch gap-10 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <section className="flex flex-col gap-4 rounded-[2rem] border border-border-card/70 bg-white/80 p-5 shadow-[0_32px_80px_-52px_rgba(15,23,42,0.45)] backdrop-blur-sm dark:bg-bg-card/80 sm:p-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <div className="inline-flex w-fit items-center gap-3 rounded-sm bg-background px-4 py-2 text-sm font-medium text-foreground/80">
                <ChartBarIcon size={22} weight="fill" />
                <span>Enquetes</span>
              </div>
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                Painel de enquetes
              </h1>
              <p className="max-w-3xl text-sm leading-6 text-foreground/70 sm:text-base">
                Acompanhe as enquetes da comunidade e filtre entre as que estão
                ativas e as que já foram finalizadas.
              </p>
              {!isLoading && (
                <p className="text-sm font-medium text-foreground/70 sm:text-base">
                  Atualmente existem{" "}
                  <span className="font-bold text-foreground">
                    {totalPolls} {totalPolls === 1 ? "enquete" : "enquetes"}
                  </span>
                  .
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-sm px-5 py-3 text-sm font-medium !bg-primary-500 !text-white transition hover:!bg-primary-600"
            >
              <PlusIcon size={18} weight="bold" />
              Cadastrar enquete
            </button>
          </div>
        </section>

        <PollFilterCard
          search={search}
          setSearch={setSearch}
          status={selectedStatus}
          statuses={pollStatusOptions}
          onStatusChange={setSelectedStatus}
          onResetFilters={handleResetFilters}
        />

        <section className="flex flex-col gap-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-black tracking-tight sm:text-2xl">
                Listagem de enquetes
              </h2>
              <p className="text-sm text-foreground/65">
                {isLoading
                  ? "Carregando enquetes..."
                  : hasActiveFilters
                    ? `Exibindo ${filteredPolls.length} de ${totalPolls} resultados encontrados.`
                    : `Exibindo ${filteredPolls.length} enquetes.`}
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="rounded-[2rem] border border-border-card bg-bg-card p-10 text-center shadow-sm">
              <p className="text-sm text-foreground/65">
                Carregando enquetes...
              </p>
            </div>
          ) : filteredPolls.length > 0 ? (
            <>
              <div className="flex flex-col gap-5">
                {paginatedPolls.map((poll) => (
                  <PollCard
                    key={poll.id}
                    title={poll.title}
                    description={poll.description}
                    status={poll.status}
                    pollCoverUrl={poll.pollCoverUrl}
                    startedAt={poll.startedAt}
                    finishedAt={poll.finishedAt}
                    onSee={() => setDetailsPoll(poll)}
                    onEdit={() => setEditingPoll(poll)}
                    onDelete={() => setDeletingPoll(poll)}
                  />
                ))}
              </div>

              <Pagination
                currentPage={safePage}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-border-card bg-bg-card p-10 text-center shadow-sm">
              <h3 className="text-lg font-bold">Nenhuma enquete encontrada</h3>
              <p className="mt-2 text-sm text-foreground/65">
                Ajuste a busca ou limpe os filtros para visualizar as enquetes
                novamente.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mx-auto mt-6 rounded-sm px-5 py-3 text-sm font-medium !bg-primary-500 !text-white transition hover:!bg-primary-600"
              >
                Limpar filtros
              </button>
            </div>
          )}
        </section>
      </div>

      <CreatePollModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={(poll) => setPolls((current) => [poll, ...current])}
      />

      {detailsPoll && (
        <PollDetailsModal
          poll={detailsPoll}
          onClose={() => setDetailsPoll(null)}
        />
      )}

      {editingPoll && (
        <EditPollModal
          key={editingPoll.id}
          poll={editingPoll}
          onClose={() => setEditingPoll(null)}
          onUpdated={(updated) =>
            setPolls((current) =>
              current.map((item) => (item.id === updated.id ? updated : item)),
            )
          }
        />
      )}

      <DeleteModal
        resource="enquete"
        isOpen={!!deletingPoll}
        onRequestClose={() => {
          if (!isDeleting) setDeletingPoll(null);
        }}
        onClose={() => {
          if (!isDeleting) setDeletingPoll(null);
        }}
        onConfirmAction={handleConfirmDelete}
      />
    </main>
  );
}
