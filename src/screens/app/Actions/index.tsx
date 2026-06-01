import { HeaderNavigation } from "@/components/miscellaneous/HeaderNavigation";
import { getCitizenById } from "@/data/mockedLegalCitizens";
import {
  buildSolicitationDetailsHref,
  getSolicitationsByRequester,
} from "@/data/mockedSolicitations";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import SolicitationCard from "../GeneralSolicitations/components/SolicitationCard";

const ITEMS_PER_PAGE = 5;
const PAGES_TO_SHOW = 4;

export function Actions() {
  const { citizenId } = useParams<{ citizenId: string }>();
  const [page, setPage] = useState(1);

  const citizen = useMemo(
    () => (citizenId ? getCitizenById(citizenId) : undefined),
    [citizenId]
  );

  const actions = useMemo(
    () => (citizen ? getSolicitationsByRequester(citizen.name) : []),
    [citizen]
  );

  useEffect(() => {
    setPage(1);
  }, [citizenId]);

  const totalPages = Math.max(1, Math.ceil(actions.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * ITEMS_PER_PAGE;
  const visibleActions = actions.slice(pageStart, pageStart + ITEMS_PER_PAGE);

  const pageNumbers = useMemo(() => {
    const half = Math.floor(PAGES_TO_SHOW / 2);
    let start = Math.max(1, safePage - half);
    const end = Math.min(totalPages, start + PAGES_TO_SHOW - 1);
    start = Math.max(1, end - PAGES_TO_SHOW + 1);

    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }, [safePage, totalPages]);

  return (
    <main className="min-h-screen w-full bg-gray-100 dark:bg-slate-800 text-slate-800 dark:text-gray-100">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <header className="flex w-full flex-row items-center">
          <HeaderNavigation
            screenTitle={
              citizen ? `Ações de ${citizen.name}` : "Ações do cidadão"
            }
          />
        </header>

        {!citizen ? (
          <div className="rounded-md border border-dashed border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 p-10 text-center shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 dark:text-gray-100">
              Cidadão não encontrado
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-gray-300">
              O identificador informado não corresponde a nenhum cidadão do
              ranking Cidadão Legal.
            </p>
          </div>
        ) : (
          <section className="flex flex-col gap-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-black tracking-tight text-slate-800 dark:text-gray-100 sm:text-2xl font-secondary">
                  Listagem de ações
                </h2>
                <p className="text-sm text-slate-600 dark:text-gray-300">
                  Exibindo {actions.length}{" "}
                  {actions.length === 1 ? "ação" : "ações"} realizadas por{" "}
                  <span className="font-semibold">{citizen.name}</span>.
                </p>
              </div>
            </div>

            {actions.length > 0 ? (
              <>
                <div className="flex flex-col gap-5">
                  {visibleActions.map((solicitation) => (
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
                      onClick={() =>
                        setPage(Math.min(totalPages, safePage + 1))
                      }
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
                  Nenhuma ação registrada
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-gray-300">
                  Este cidadão ainda não possui ações cadastradas no período
                  atual.
                </p>
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
