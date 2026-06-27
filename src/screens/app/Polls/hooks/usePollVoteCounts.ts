import { listVoteOptions } from "@/services/vote-options";
import { listVotes } from "@/services/votes";
import { useEffect, useState } from "react";

export interface PollVoteCount {
  optionText: string;
  count: number;
}

/**
 * Aggregates the vote count per option for a poll. Counts how many vote options
 * exist for each distinct option text across all of the poll's votes.
 */
export function usePollVoteCounts(pollId: string) {
  const [counts, setCounts] = useState<PollVoteCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchCounts() {
      setIsLoading(true);
      try {
        const votesResult = await listVotes({ pollId, perPage: 100 });
        if (cancelled) return;

        const optionLists = await Promise.all(
          votesResult.data.map((vote) =>
            listVoteOptions({ voteId: vote.id, perPage: 100 })
          )
        );
        if (cancelled) return;

        const totals = new Map<string, number>();
        optionLists.forEach((result) => {
          result.data.forEach((option) => {
            totals.set(
              option.optionText,
              (totals.get(option.optionText) ?? 0) + 1
            );
          });
        });

        setCounts(
          Array.from(totals.entries())
            .map(([optionText, count]) => ({ optionText, count }))
            .sort((a, b) => b.count - a.count)
        );
      } catch {
        if (!cancelled) setCounts([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchCounts();
    return () => {
      cancelled = true;
    };
  }, [pollId]);

  return { counts, isLoading };
}
