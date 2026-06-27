import type { PollStatus } from "@/services/polls";

export type { PollStatus };

export const pollStatusMap: Record<
  PollStatus,
  { label: string; dotClassName: string; badgeClassName: string }
> = {
  active: {
    label: "Ativa",
    dotClassName: "bg-success-500",
    badgeClassName:
      "border border-success-500/35 bg-success-500/10 text-success-700 dark:bg-success-400/15 dark:text-success-100",
  },
  inactive: {
    label: "Inativa",
    dotClassName: "bg-alert-500",
    badgeClassName:
      "border border-alert-500/35 bg-alert-500/10 text-alert-700 dark:bg-alert-400/15 dark:text-alert-100",
  },
  finished: {
    label: "Finalizada",
    dotClassName: "bg-secondary-500",
    badgeClassName:
      "border border-secondary-500/35 bg-secondary-500/10 text-secondary-700 dark:bg-secondary-400/15 dark:text-secondary-100",
  },
};

export const pollStatusOptions: Array<{ value: PollStatus; label: string }> = [
  { value: "active", label: "Enquetes ativas" },
  { value: "finished", label: "Enquetes finalizadas" },
];

const toDayString = (value?: string | Date | null) => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10);
};

/**
 * Derives the campaign status from its start/end period:
 * scheduled (future start) -> "inactive", running -> "active", past end ->
 * "finished".
 */
export const computePollStatus = (
  startedAt?: string | Date | null,
  finishedAt?: string | Date | null
): PollStatus => {
  const today = new Date().toISOString().slice(0, 10);
  const start = toDayString(startedAt);
  const end = toDayString(finishedAt);

  if (end && end < today) return "finished";
  if (start && start > today) return "inactive";
  return "active";
};

export const formatPollDate = (value: string | Date | null | undefined) => {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(date);
};
