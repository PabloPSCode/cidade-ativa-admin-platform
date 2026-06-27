import {
  formatPollDate,
  pollStatusMap,
} from "@/screens/app/Polls/constants/polls";
import { usePollVoteCounts } from "@/screens/app/Polls/hooks/usePollVoteCounts";
import { type PollResponseDTO } from "@/services/polls";
import { ListChecksIcon } from "@phosphor-icons/react";
import clsx from "clsx";

interface PollDetailsModalProps {
  poll: PollResponseDTO;
  onClose: () => void;
}

export default function PollDetailsModal({
  poll,
  onClose,
}: PollDetailsModalProps) {
  const statusConfig = pollStatusMap[poll.status];
  const { counts, isLoading } = usePollVoteCounts(poll.id);
  const totalVotes = counts.reduce((sum, option) => sum + option.count, 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[1.75rem] border border-border-card/70 bg-bg-card p-6 shadow-[0_32px_80px_-40px_rgba(15,23,42,0.6)]"
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-xl font-black tracking-tight">{poll.title}</h2>
          <span
            className={clsx(
              "inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold",
              statusConfig.badgeClassName
            )}
          >
            <span
              className={clsx(
                "h-2.5 w-2.5 rounded-full",
                statusConfig.dotClassName
              )}
            />
            {statusConfig.label}
          </span>
        </div>

        {poll.pollCoverUrl && (
          <img
            src={poll.pollCoverUrl}
            alt={`Capa da enquete ${poll.title}`}
            className="mt-4 h-40 w-full rounded-[1.25rem] object-cover"
          />
        )}

        <p className="mt-4 text-sm leading-6 text-foreground/75">
          {poll.description}
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-[1.25rem] p-4 dark:bg-white/[0.03]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">
              Criada em
            </p>
            <p className="mt-2 text-sm font-semibold text-foreground">
              {formatPollDate(poll.createdAt)}
            </p>
          </div>
          <div className="rounded-[1.25rem] p-4 dark:bg-white/[0.03]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">
              Encerramento
            </p>
            <p className="mt-2 text-sm font-semibold text-foreground">
              {formatPollDate(poll.finishedAt)}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between gap-3">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">
              <ListChecksIcon size={16} weight="fill" />
              Votos por opção
            </p>
            {!isLoading && (
              <span className="text-xs font-semibold text-foreground/55">
                {totalVotes} {totalVotes === 1 ? "voto" : "votos"}
              </span>
            )}
          </div>

          {isLoading ? (
            <p className="mt-3 text-sm text-foreground/65">
              Carregando votos...
            </p>
          ) : counts.length > 0 ? (
            <div className="mt-3 flex flex-col gap-3">
              {counts.map((option) => {
                const percentage =
                  totalVotes > 0
                    ? Math.round((option.count / totalVotes) * 100)
                    : 0;
                return (
                  <div key={option.optionText} className="space-y-1.5">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="min-w-0 truncate font-medium text-foreground">
                        {option.optionText}
                      </span>
                      <span className="shrink-0 text-foreground/65">
                        {option.count}{" "}
                        {option.count === 1 ? "voto" : "votos"} ({percentage}%)
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-foreground/10">
                      <div
                        className="h-full rounded-full bg-primary-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="mt-3 text-sm text-foreground/65">
              Esta enquete ainda não possui opções de voto cadastradas.
            </p>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-sm border border-foreground/15 bg-background px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-foreground/5"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
