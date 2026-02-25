import { api } from "./axios";

export const fetchSportsAndLeagues = async () => {
    const { data } = await api.get("/sports/AllSportsAndLeagues", {
        params: {
            limit: 20,
            offset: 0,
        },
    });

    return data;
};