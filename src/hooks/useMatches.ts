import { fetchMatches } from "@/api/matchApi";
import { MatchListResponse } from "@/types/match";
import { getDeviceTimezone } from "@/utils/time";
import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";

const PAGE_SIZE = 20;

export const useMatches = (tournamentIds?: string) => {
    return useInfiniteQuery<
        MatchListResponse,
        Error,
        InfiniteData<MatchListResponse>,
        [string, string | undefined],
        number
    >({
        queryKey: ["matches", tournamentIds],

        queryFn: async ({ pageParam }) =>
            fetchMatches({
                timezone: getDeviceTimezone(),
                status: "all",
                tournament_ids: tournamentIds,
                limit: PAGE_SIZE,
                offset: pageParam,
            }),

        initialPageParam: 0,

        getNextPageParam: (lastPage, allPages) => {
            const loaded = allPages
                .map((p) => p.matches.length)
                .reduce((a, b) => a + b, 0);

            if (loaded >= lastPage.total) return undefined;

            return loaded;
        },
    });
};