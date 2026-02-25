import { useQuery } from "@tanstack/react-query";
import { fetchSportsAndLeagues } from "../api/sportsApi";

export const useTournaments = () => {
    return useQuery({
        queryKey: ["tournaments"],
        queryFn: fetchSportsAndLeagues,
    });
};