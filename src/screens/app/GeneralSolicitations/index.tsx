import {
  buildSolicitationDetailsHref,
  mockedSolicitations,
  neighborhoodOptions,
  requestingUserOptions,
  solicitationStats,
  statusOptions,
} from "@/data/mockedSolicitations";
import type { SolicitationStatus } from "@/interfaces/dtos/Solicitation";
import { useEffect, useMemo, useState } from "react";
import {
  PiBuildings,
  PiChartBar,
  PiCheckCircle,
  PiClockCountdown,
} from "react-icons/pi";
import FilterSearchCard from "./components/FilterSearchCard";
import SolicitationCard from "./components/SolicitationCard";

const ITEMS_PER_PAGE = 5;
const PAGES_TO_SHOW = 4;

const formatCountLabel = (value: number, singular: string, plural: string) =>
  `${value} ${value === 1 ? singular : plural}`;

export function GeneralSolicitations() {
  const [search, setSearch] = useState("");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState<
    SolicitationStatus | "all"
  >("all");
  const [selectedRequestingUserId, setSelectedRequestingUserId] =
    useState("all");
  const [dateOrder, setDateOrder] = useState<"recent" | "oldest">("recent");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [
    search,
    selectedNeighborhood,
    selectedStatus,
    selectedRequestingUserId,
    dateOrder,
  ]);

  const normalizedSearch = search.trim().toLowerCase();

  const filteredSolicitations = useMemo(
    () =>
      mockedSolicitations
        .filter((item) => {
          const matchesSearch =
            normalizedSearch.length === 0 ||
            [
              item.title,
              item.description,
              item.neighborhood,
              item.street,
              item.requestingUserId,
              item.protocolNumber,
            ].some((value) =>
              value.toLowerCase().includes(normalizedSearch)
            );

          const matchesNeighborhood =
            selectedNeighborhood === "all" ||
            item.neighborhood === selectedNeighborhood;

          const matchesStatus =
            selectedStatus === "all" || item.status === selectedStatus;

          const matchesRequestingUser =
            selectedRequestingUserId === "all" ||
            item.requestingUserId === selectedRequestingUserId;

          return (
            matchesSearch &&
            matchesNeighborhood &&
            matchesStatus &&
            matchesRequestingUser
          );
        })
        .sort((left, right) => {
          const leftDate = new Date(left.createdAt).getTime();
          const rightDate = new Date(right.createdAt).getTime();

          return dateOrder === "recent"
            ? rightDate - leftDate
            : leftDate - rightDate;
        }),
    [
      normalizedSearch,
      selectedNeighborhood,
      selectedStatus,
      selectedRequestingUserId,
      dateOrder,
    ]
  );

  const hasActiveFilters =
    search.trim().length > 0 ||
    selectedNeighborhood !== "all" ||
    selectedStatus !== "all" ||
    selectedRequestingUserId !== "all" ||
    dateOrder !== "recent";

  const handleResetFilters = () => {
    setSearch("");
    setSelectedNeighborhood("all");
    setSelectedStatus("all");
    setSelectedRequestingUserId("all");
    setDateOrder("recent");
  };

  const totalPages = Math.max(
    1,
    Math.ceil(filteredSolicitations.length / ITEMS_PER_PAGE)
  );
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * ITEMS_PER_PAGE;
  const visibleSolicitations = filteredSolicitations.slice(
    pageStart,
    pageStart + ITEMS_PER_PAGE
  );

  const pageNumbers = useMemo(() => {
    const half = Math.floor(PAGES_TO_SHOW / 2);
    let start = Math.max(1, safePage - half);
    const end = Math.min(totalPages, start + PAGES_TO_SHOW - 1);
    start = Math.max(1, end - PAGES_TO_SHOW + 1);

    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }, [safePage, totalPages]);

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-slate-800 text-slate-800 dark:text-gray-100">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-stretch gap-10 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <section className="flex flex-col gap-6 rounded-[2rem] border border-gray-200 dark:border-slate-600 bg-white/70 dark:bg-slate-700/80 p-5 shadow-[0_32px_80px_-52px_rgba(15,23,42,0.45)] backdrop-blur-sm sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-3 rounded-full bg-gray-50 dark:bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-gray-200 shadow-sm">
                <PiBuildings size={22} />
                <span>Solicitações gerais</span>
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl font-black tracking-tight text-slate-800 dark:text-gray-100 sm:text-4xl font-secondary">
                  Painel administrativo de solicitações urbanas
                </h1>
                <p className="max-w-3xl text-sm leading-6 text-slate-600 dark:text-gray-300 sm:text-base">
                  Consulte situações reportadas pela comunidade, filtre por
                  bairro, status e requerente, e acompanhe a data de cadastro
                  das ocorrências.
                </p>
              </div>

              <p className="text-sm font-medium text-slate-600 dark:text-gray-300 sm:text-base">
                Atualmente existem{" "}
                <span className="font-bold text-slate-800 dark:text-gray-100">
                  {solicitationStats.total} solicitações cadastradas
                </span>
                .
              </p>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-4">
            <article className="rounded-[1.75rem] border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-gray-100 dark:bg-white/5 p-3 text-slate-700 dark:text-gray-200">
                  <PiChartBar size={22} />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-gray-400">
                    Total
                  </p>
                  <p className="text-2xl font-black text-slate-800 dark:text-gray-100">
                    {solicitationStats.total}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-600 dark:text-gray-300">
                {formatCountLabel(
                  solicitationStats.total,
                  "registro",
                  "registros"
                )}{" "}
                da comunidade nesta listagem mockada.
              </p>
            </article>

            <article className="rounded-[1.75rem] border border-amber-500/20 bg-white dark:bg-slate-700 p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-amber-500/15 p-3 text-amber-600 dark:text-amber-300">
                  <PiClockCountdown size={22} />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-gray-400">
                    Pendentes
                  </p>
                  <p className="text-2xl font-black text-slate-800 dark:text-gray-100">
                    {solicitationStats.pending}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-600 dark:text-gray-300">
                Casos que ainda aguardam uma resposta definitiva.
              </p>
            </article>

            <article className="rounded-[1.75rem] border border-sky-500/20 bg-white dark:bg-slate-700 p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-sky-500/15 p-3 text-sky-600 dark:text-sky-300">
                  <PiBuildings size={22} />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-gray-400">
                    Em andamento
                  </p>
                  <p className="text-2xl font-black text-slate-800 dark:text-gray-100">
                    {solicitationStats.inProgress}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-600 dark:text-gray-300">
                Demandas acompanhadas pelos setores responsáveis.
              </p>
            </article>

            <article className="rounded-[1.75rem] border border-emerald-500/20 bg-white dark:bg-slate-700 p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-emerald-500/15 p-3 text-emerald-600 dark:text-emerald-300">
                  <PiCheckCircle size={22} />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-gray-400">
                    Resolvidas
                  </p>
                  <p className="text-2xl font-black text-slate-800 dark:text-gray-100">
                    {solicitationStats.resolved}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-600 dark:text-gray-300">
                Solicitações marcadas como concluídas no fluxo atual.
              </p>
            </article>
          </div>
        </section>

        <FilterSearchCard
          search={search}
          setSearch={setSearch}
          neighborhood={selectedNeighborhood}
          neighborhoods={neighborhoodOptions}
          onNeighborhoodChange={setSelectedNeighborhood}
          status={selectedStatus}
          statuses={statusOptions}
          onStatusChange={(value) =>
            setSelectedStatus(value as SolicitationStatus | "all")
          }
          requestingUserId={selectedRequestingUserId}
          requestingUsers={requestingUserOptions}
          onRequestingUserIdChange={setSelectedRequestingUserId}
          dateOrder={dateOrder}
          onDateOrderChange={setDateOrder}
          onResetFilters={handleResetFilters}
        />

        <section className="flex flex-col gap-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-black tracking-tight text-slate-800 dark:text-gray-100 sm:text-2xl font-secondary">
                Listagem de solicitações
              </h2>
              <p className="text-sm text-slate-600 dark:text-gray-300">
                {hasActiveFilters
                  ? `Exibindo ${filteredSolicitations.length} de ${solicitationStats.total} resultados encontrados.`
                  : `Exibindo ${filteredSolicitations.length} resultados mais recentes.`}
              </p>
            </div>
          </div>

          {filteredSolicitations.length > 0 ? (
            <>
              <div className="flex flex-col gap-5">
                {visibleSolicitations.map((solicitation) => (
                  <SolicitationCard
                    key={solicitation.id}
                    title={solicitation.title}
                    requestingUserId={solicitation.requestingUserId}
                    description={solicitation.description}
                    imageUrls={solicitation.imageUrls}
                    neighborhood={solicitation.neighborhood}
                    createdAt={solicitation.createdAt}
                    street={solicitation.street}
                    status={solicitation.status}
                    detailsHref={buildSolicitationDetailsHref(solicitation.id)}
                  />
                ))}
              </div>

              {totalPages > 1 ? (
                <nav className="flex flex-col gap-3 rounded-[1.75rem] border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-4 shadow-[0_24px_56px_-40px_rgba(15,23,42,0.45)] sm:flex-row sm:items-center sm:justify-between sm:px-5">
                  <button
                    type="button"
                    onClick={() => setPage(Math.max(1, safePage - 1))}
                    disabled={safePage === 1}
                    className="min-w-[9rem] rounded-2xl border border-gray-200 dark:border-slate-600 px-6 py-3 text-sm font-semibold text-slate-700 dark:text-gray-200 transition hover:border-slate-300 dark:hover:border-slate-500 hover:bg-gray-50 dark:hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Anterior
                  </button>

                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {pageNumbers.map((pageNumber) => {
                      const isActive = pageNumber === safePage;
                      return (
                        <button
                          key={pageNumber}
                          type="button"
                          onClick={() => setPage(pageNumber)}
                          className={`h-10 w-10 rounded-full text-sm font-semibold transition ${
                            isActive
                              ? "border border-slate-200 bg-slate-800 text-white dark:border-slate-500 dark:bg-gray-100 dark:text-slate-800"
                              : "border border-transparent text-slate-600 dark:text-gray-300 hover:border-gray-200 hover:bg-gray-50 dark:hover:border-slate-500 dark:hover:bg-white/5"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => setPage(Math.min(totalPages, safePage + 1))}
                    disabled={safePage === totalPages}
                    className="min-w-[9rem] rounded-2xl border border-gray-200 dark:border-slate-600 px-6 py-3 text-sm font-semibold text-slate-700 dark:text-gray-200 transition hover:border-slate-300 dark:hover:border-slate-500 hover:bg-gray-50 dark:hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Próximo
                  </button>
                </nav>
              ) : null}
            </>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 p-10 text-center shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 dark:text-gray-100">
                Nenhum resultado encontrado
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-gray-300">
                Ajuste a busca ou limpe os filtros para visualizar as
                solicitações mockadas novamente.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mx-auto mt-6 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
              >
                Limpar filtros
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
