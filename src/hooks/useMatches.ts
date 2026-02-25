import { fetchMatches } from "@/api/matchApi";
import { PAGE_SIZE } from "@/constants/config";
import { MatchListResponse } from "@/types/match";
import { MatchQueryParams } from "@/types/query";
import { getDeviceTimezone } from "@/utils/time";
import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";

export const useMatches = (filters: MatchQueryParams) => {
    return useInfiniteQuery<
        MatchListResponse,
        Error,
        InfiniteData<MatchListResponse>,
        ["matches", MatchQueryParams],
        number
    >({
        queryKey: ["matches", filters],

        queryFn: async ({ pageParam }) => {
            return fetchMatches({
                timezone: getDeviceTimezone(),
                status: filters.status,
                todate: filters.todate,
                tournament_ids: filters.tournamentIds?.join(","),
                limit: PAGE_SIZE,
                offset: pageParam,
            });
        },

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