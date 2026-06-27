import {
  formatPollDate,
  pollStatusMap,
  type PollStatus,
} from "@/screens/app/Polls/constants/polls";
import {
  CalendarDotsIcon,
  ChartBarIcon,
  EyeIcon,
  PencilSimpleLineIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import clsx from "clsx";

export interface PollCardProps {
  title: string;
  description: string;
  status: PollStatus;
  pollCoverUrl?: string;
  startedAt: string | Date | null;
  finishedAt: string | Date | null;
  onSee?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function PollCard({
  title,
  description,
  status,
  pollCoverUrl,
  startedAt,
  finishedAt,
  onSee,
  onEdit,
  onDelete,
}: PollCardProps) {
  const statusConfig = pollStatusMap[status];

  return (
    <article className="poll-card Container flex w-full max-w-full flex-col gap-4 rounded-[2rem] border border-border-card/70 bg-bg-card p-5 shadow-[0_28px_64px_-48px_rgba(15,23,42,0.45)] transition sm:p-6">
      {pollCoverUrl && (
        <img
          src={pollCoverUrl}
          alt={`Capa da enquete ${title}`}
          className="h-44 w-full rounded-[1.5rem] object-cover"
        />
      )}

      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-sm bg-foreground/5 px-3 py-1.5 text-xs font-semibold text-foreground/60 dark:bg-white/5">
          <ChartBarIcon size={16} weight="fill" />
          Enquete
        </span>
        <span
          className={clsx(
            "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold",
            statusConfig.badgeClassName
          )}
        >
          <span
            className={clsx("h-2.5 w-2.5 rounded-full", statusConfig.dotClassName)}
          />
          {statusConfig.label}
        </span>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-black tracking-tight">{title}</h3>
        <p className="text-sm leading-6 text-foreground/70 sm:text-[0.95rem]">
          {description}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-[1.25rem] bg-background/80 p-4 dark:bg-white/[0.03]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">
            Início
          </p>
          <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-foreground sm:text-base">
            <CalendarDotsIcon
              size={18}
              weight="fill"
              className="shrink-0 text-foreground/55"
            />
            <span>{formatPollDate(startedAt)}</span>
          </div>
        </div>

        <div className="rounded-[1.25rem] bg-background/80 p-4 dark:bg-white/[0.03]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">
            Encerramento
          </p>
          <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-foreground sm:text-base">
            <CalendarDotsIcon
              size={18}
              weight="fill"
              className="shrink-0 text-foreground/55"
            />
            <span>{formatPollDate(finishedAt)}</span>
          </div>
        </div>
      </div>

      {(onSee || onEdit || onDelete) && (
        <div className="flex flex-wrap items-center justify-end gap-3">
          {onSee && (
            <button
              type="button"
              onClick={onSee}
              className="inline-flex items-center gap-2 rounded-sm border border-foreground/10 bg-background/80 px-4 py-2.5 text-sm font-medium text-foreground transition hover:border-foreground/20 hover:bg-foreground/5 dark:bg-white/[0.03]"
            >
              <EyeIcon size={18} weight="fill" />
              Ver
            </button>
          )}
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex items-center gap-2 rounded-sm border border-foreground/10 bg-background/80 px-4 py-2.5 text-sm font-medium text-foreground transition hover:border-foreground/20 hover:bg-foreground/5 dark:bg-white/[0.03]"
            >
              <PencilSimpleLineIcon size={18} weight="bold" />
              Editar
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="inline-flex items-center gap-2 rounded-sm border border-destructive-500/25 bg-destructive-500/10 px-4 py-2.5 text-sm font-medium text-destructive-600 transition hover:bg-destructive-500/15 dark:text-destructive-300"
            >
              <TrashIcon size={18} weight="fill" />
              Excluir
            </button>
          )}
        </div>
      )}
    </article>
  );
}
