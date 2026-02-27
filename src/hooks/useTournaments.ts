import { SportsAndLeaguesParams } from "@/types/sport";
import { useQuery } from "@tanstack/react-query";
import { fetchSportsAndLeagues } from "../api/sportsApi";

export const useTournaments = (params: SportsAndLeaguesParams = {}) => {
    const { search, limit = 20, offset = 0 } = params;

    return useQuery({
        queryKey: ["tournaments", search, limit, offset],
        queryFn: () =>
            fetchSportsAndLeagues({
                search,
                limit,
                offset,
            }),
    });
};