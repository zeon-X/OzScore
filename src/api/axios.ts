import axios from "axios";

export const api = axios.create({
    baseURL: "https://au.testing.smartb.com.au/soc-api",
    timeout: 10000,
});