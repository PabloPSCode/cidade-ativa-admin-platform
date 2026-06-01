import { PiMedalFill } from "react-icons/pi";

interface RankingCardProps {
  position: number;
  citizenName: string;
  points: number;
  onSeeActions: () => void;
}

const medalStyleByPosition: Record<
  number,
  { iconClassName: string; positionClassName: string }
> = {
  1: {
    iconClassName: "text-yellow-500",
    positionClassName: "text-slate-900 dark:text-gray-100",
  },
  2: {
    iconClassName: "text-slate-400",
    positionClassName: "text-slate-900 dark:text-gray-100",
  },
  3: {
    iconClassName: "text-amber-700",
    positionClassName: "text-slate-900 dark:text-gray-100",
  },
};

export default function RankingCard({
  position,
  citizenName,
  points,
  onSeeActions,
}: RankingCardProps) {
  const isPodium = position >= 1 && position <= 3;
  const medalStyle = medalStyleByPosition[position];
  const initial = citizenName.trim().charAt(0).toUpperCase() || "?";

  return (
    <article className="flex flex-col gap-4 rounded-md border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 p-4 shadow-sm sm:flex-row sm:items-center sm:gap-5 sm:p-5">
      <div className="flex shrink-0 items-center gap-2 sm:min-w-[96px]">
        <span
          className={`text-4xl font-black sm:text-5xl ${medalStyle?.positionClassName ?? "text-slate-800 dark:text-gray-100"
            }`}
        >
          {position}
        </span>
        {isPodium && medalStyle ? (
          <PiMedalFill size={28} className={medalStyle.iconClassName} />
        ) : null}
      </div>

      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-pink-300 text-2xl font-bold text-white">
        {initial}
      </div>

      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-slate-500 dark:text-gray-400">
            Nome
          </p>
          <p className="truncate text-sm font-semibold text-slate-800 dark:text-gray-100 sm:text-base">
            {citizenName}
          </p>
        </div>

        <div className="shrink-0 sm:min-w-[180px]">
          <p className="text-xs font-bold text-slate-500 dark:text-gray-400">
            Pontos Cidadão Legal
          </p>
          <p className="text-sm font-semibold text-slate-800 dark:text-gray-100 sm:text-base">
            {points}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onSeeActions}
        className="h-12 shrink-0 rounded-md bg-emerald-600 px-5 text-sm font-bold text-white transition hover:bg-emerald-500 sm:self-center"
      >
        Ver ações
      </button>
    </article>
  );
}
