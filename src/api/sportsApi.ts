import {
    SportLeague,
    SportsAndLeaguesParams,
    SUPPORTED_SPORT_IDS,
} from "@/types/sport";
import { api } from "./axios";

const buildSearchParam = (search?: Record<number, string>) => {
    if (!search) {
        return undefined;
    }

    const value = Object.entries(search)
        .map(([sportId, searchText]) => ({
            sportId,
            searchText: searchText.trim(),
        }))
        .filter(({ searchText }) => searchText.length > 0)
        .map(({ sportId, searchText }) => `${sportId}[${searchText}]`)
        .join(",");

    return value || undefined;
};

export const fetchSportsAndLeagues = async (
    params: SportsAndLeaguesParams = {}
): Promise<SportLeague[]> => {
    const { search, limit = 20, offset = 0 } = params;

    const { data } = await api.get("/sports/AllSportsAndLeagues", {
        params: {
            limit,
            offset,
            search: buildSearchParam(search),
        },
    });

    return (data as SportLeague[]).filter((sport) =>
        SUPPORTED_SPORT_IDS.includes(sport.id as (typeof SUPPORTED_SPORT_IDS)[number])
    );
};