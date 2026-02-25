export type MatchStatus = "all" | "upcoming";

export interface MatchQueryParams {
    status?: MatchStatus;
    todate?: string;
    tournamentIds?: number[];
}