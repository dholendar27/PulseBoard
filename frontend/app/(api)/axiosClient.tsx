import axios from "axios";

export const axiosClient = axios.create({
    baseURL: "http://localhost:8000",
    timeout: 5000,
    withCredentials: true,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});
