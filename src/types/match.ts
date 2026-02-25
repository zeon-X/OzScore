export interface Team {
    id: number;
    name: string;
    logo: string | null;
}

export interface Tournament {
    id: number;
    name: string;
}

export interface Sport {
    id: number;
    sportName: string;
}

export interface Match {
    id: number;
    sport_id: number;
    tournament_id: number;
    start_time: string;
    status: string;
    display_status: string;
    homeTeam: Team;
    awayTeam: Team;
    tournament: Tournament;
    sport: Sport;
}

export interface MatchListResponse {
    status: boolean;
    total: number;
    matches: Match[];
}