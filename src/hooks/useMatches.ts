import { MatchListResponse } from "@/types/match";
import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { fetchMatches } from "../api/matchApi";
import { getDeviceTimezone } from "../utils/time";

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