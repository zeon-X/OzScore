export const SUPPORTED_SPORT_IDS = [4, 8, 9, 10, 12] as const;

export interface LeagueTournament {
    id: number;
    name: string;
}

export interface SportLeague {
    id: number;
    sportName: string;
    tournaments: LeagueTournament[];
}

export interface SportsAndLeaguesParams {
    search?: Record<number, string>;
    limit?: number;
    offset?: number;
}
