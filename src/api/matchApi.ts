
import { MatchListResponse } from "@/types/match";
import { api } from "./axios";


export interface MatchListParams {
    timezone: string;
    status?: string;
    tournament_ids?: string;
    limit?: number;
    offset?: number;
}

export const fetchMatches = async (
    params: MatchListParams
): Promise<MatchListResponse> => {
    const { data } = await api.get("/sports/matchList", {
        params,
    });

    return data;
};