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
import { useSearchParams } from "react-router-dom";
import FilterSearchCard from "./components/FilterSearchCard";
import SolicitationCard from "./components/SolicitationCard";

const ITEMS_PER_PAGE = 5;
const PAGES_TO_SHOW = 4;

const VALID_STATUSES: SolicitationStatus[] = [
  "not_resolved",
  "in_progress",
  "resolved",
  "disregarded",
];

const parseStatusParam = (
  value: string | null
): SolicitationStatus | "all" => {
  if (value && (VALID_STATUSES as string[]).includes(value)) {
    return value as SolicitationStatus;
  }
  return "all";
};

export function GeneralSolicitations() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState("");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState<
    SolicitationStatus | "all"
  >(() => parseStatusParam(searchParams.get("status")));
  const [selectedRequestingUserId, setSelectedRequestingUserId] =
    useState("all");
  const [dateOrder, setDateOrder] = useState<"recent" | "oldest">("recent");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setSelectedStatus(parseStatusParam(searchParams.get("status")));
  }, [searchParams]);

  const handleStatusChange = (value: SolicitationStatus | "all") => {
    setSelectedStatus(value);
    setSearchParams(
      (prev) => {
        if (value === "all") {
          prev.delete("status");
        } else {
          prev.set("status", value);
        }
        return prev;
      },
      { replace: true }
    );
  };

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
    handleStatusChange("all");
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


        <FilterSearchCard
          search={search}
          setSearch={setSearch}
          neighborhood={selectedNeighborhood}
          neighborhoods={neighborhoodOptions}
          onNeighborhoodChange={setSelectedNeighborhood}
          status={selectedStatus}
          statuses={statusOptions}
          onStatusChange={(value) =>
            handleStatusChange(value as SolicitationStatus | "all")
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
                    className="min-w-[9rem] rounded-md border border-gray-200 dark:border-slate-600 px-6 py-3 text-sm font-semibold text-slate-700 dark:text-gray-200 transition hover:border-slate-300 dark:hover:border-slate-500 hover:bg-gray-50 dark:hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
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
                          className={`h-10 w-10 rounded-md text-sm font-semibold transition ${isActive
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
                    className="min-w-[9rem] rounded-md border border-gray-200 dark:border-slate-600 px-6 py-3 text-sm font-semibold text-slate-700 dark:text-gray-200 transition hover:border-slate-300 dark:hover:border-slate-500 hover:bg-gray-50 dark:hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Próximo
                  </button>
                </nav>
              ) : null}
            </>
          ) : (
            <div className="rounded-md border border-dashed border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 p-10 text-center shadow-sm">
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
                className="mx-auto mt-6 rounded-md bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
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
