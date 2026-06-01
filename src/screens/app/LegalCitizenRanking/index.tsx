import { getTopLegalCitizens } from "@/data/mockedLegalCitizens";
import { useMemo } from "react";
import { PiTrophyFill } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import RankingCard from "./components/RankingCard";

const TOP_LIMIT = 10;

const formatMonthLabel = (date: Date) => {
  const month = date.toLocaleString("pt-BR", { month: "long" });
  return `${month.charAt(0).toUpperCase()}${month.slice(1)} ${date.getFullYear()}`;
};

export function LegalCitizenRanking() {
  const navigate = useNavigate();
  const topCitizens = useMemo(() => getTopLegalCitizens(TOP_LIMIT), []);
  const monthLabel = useMemo(() => formatMonthLabel(new Date()), []);

  const handleSeeActions = (citizenId: string) => {
    navigate(`/dashboard/cidadao-legal/${citizenId}/acoes`);
  };

  return (
    <main className="min-h-screen w-full bg-gray-100 dark:bg-slate-800">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <header className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <PiTrophyFill
              size={36}
              className="text-yellow-500 dark:text-yellow-400"
            />
            <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-gray-100 sm:text-3xl font-secondary">
              Cidadão Legal - {monthLabel}
            </h1>
          </div>
          <p className="text-sm text-slate-600 dark:text-gray-300 sm:text-base">
            Boas ações merecem reconhecimento e destaque. Veja abaixo o ranking
            Cidadão Legal.
          </p>
        </header>

        <section className="flex flex-col gap-4">
          {topCitizens.map((citizen, index) => (
            <RankingCard
              key={citizen.id}
              position={index + 1}
              citizenName={citizen.name}
              points={citizen.points}
              onSeeActions={() => handleSeeActions(citizen.id)}
            />
          ))}
        </section>
      </div>
    </main>
  );
}
