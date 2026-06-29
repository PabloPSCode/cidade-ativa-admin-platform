import {
  listDoneCoolActionsRanking,
  type DoneCoolActionRankingDTO,
} from "@/services/done-cool-actions";
import { getErrorMessage, showAlertError } from "@/utils/alerts";
import { useEffect, useMemo, useState } from "react";
import RankingCard from "./components/RankingCard";
import { MedalIcon } from "@phosphor-icons/react";

const formatMonthLabel = (date: Date) => {
  const month = date.toLocaleString("pt-BR", { month: "long" });
  return `${month.charAt(0).toUpperCase()}${month.slice(1)} ${date.getFullYear()}`;
};

export function LegalCitizenRanking() {
  const [ranking, setRanking] = useState<DoneCoolActionRankingDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const monthLabel = useMemo(() => formatMonthLabel(new Date()), []);

  useEffect(() => {
    let cancelled = false;

    async function fetchRanking() {
      setIsLoading(true);
      try {
        const result = await listDoneCoolActionsRanking();
        if (!cancelled) setRanking(result);
      } catch (error) {
        if (!cancelled) {
          setRanking([]);
          showAlertError(
            getErrorMessage(
              error,
              "Não foi possível carregar o ranking Cidadão Legal.",
            ),
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchRanking();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="min-h-screen w-full bg-gray-100 dark:bg-slate-800">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
       <section className="flex flex-col gap-3 rounded-[2rem] border border-border-card/70 bg-white/70 p-5 shadow-[0_32px_80px_-52px_rgba(15,23,42,0.45)] backdrop-blur-sm dark:bg-bg-card/80 sm:p-7">
          <div className="inline-flex items-center gap-3 rounded-sm bg-background px-4 py-2 text-sm font-medium text-foreground/80">
            <MedalIcon size={22} weight="fill" />
            <span>Cidadão Legal - {monthLabel}</span>
          </div>

          <div>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl mb-2">
              Ranking de boas ações para a cidade
            </h1>
            <p className="max-w-3xl text-sm leading-6 text-foreground/70 sm:text-base">
              Boas ações merecem reconhecimento e destaque.
            </p>
            <p className="max-w-3xl text-sm leading-6 text-foreground/70 sm:text-base">
              Veja abaixo o ranking Cidadão Legal com os 10 cidadãos mais
              engajados neste ciclo.
            </p>
          </div>
        </section>

        {isLoading ? (
          <div className="rounded-md border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 p-10 text-center shadow-sm">
            <p className="text-sm text-slate-600 dark:text-gray-300">
              Carregando ranking Cidadão Legal...
            </p>
          </div>
        ) : ranking.length > 0 ? (
          <section className="flex flex-col gap-4">
            {ranking.map((citizen) => (
              <RankingCard
                key={citizen.userId}
                position={citizen.rank}
                fullName={citizen.userName}
                points={citizen.totalPoints}
                actionsCount={citizen.actionsCount}
                actionsHref={`/dashboard/cidadao-legal/${citizen.userId}/acoes`}
              />
            ))}
          </section>
        ) : (
          <div className="rounded-md border border-dashed border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 p-10 text-center shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 dark:text-gray-100">
              Nenhum cidadão no ranking ainda
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-gray-300">
              Assim que os cidadãos realizarem ações pontuáveis, o ranking
              Cidadão Legal será exibido aqui.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
