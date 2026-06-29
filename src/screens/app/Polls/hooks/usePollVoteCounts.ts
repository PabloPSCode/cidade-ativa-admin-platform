import { useAsyncData } from "@/hooks/useAsyncData";
import { listVoteOptions } from "@/services/vote-options";
import { listVotes } from "@/services/votes";

export interface PollVoteCount {
  optionText: string;
  count: number;
}

/**
 * Aggregates the vote count per option for a poll. Counts how many vote options
 * exist for each distinct option text across all of the poll's votes.
 */
export function usePollVoteCounts(pollId: string) {
  const { data: counts, isLoading } = useAsyncData(
    async () => {
      const votesResult = await listVotes({ pollId, perPage: 100 });

      const optionLists = await Promise.all(
        votesResult.data.map((vote) =>
          listVoteOptions({ voteId: vote.id, perPage: 100 })
        )
      );

      const totals = new Map<string, number>();
      optionLists.forEach((result) => {
        result.data.forEach((option) => {
          totals.set(
            option.optionText,
            (totals.get(option.optionText) ?? 0) + 1
          );
        });
      });

      return Array.from(totals.entries())
        .map(([optionText, count]) => ({ optionText, count }))
        .sort((a, b) => b.count - a.count);
    },
    {
      initialData: [] as PollVoteCount[],
      deps: [pollId],
      // Vote counts are non-critical: fall back to an empty list silently.
      resetOnError: true,
      onError: () => {},
    }
  );

  return { counts, isLoading };
}
