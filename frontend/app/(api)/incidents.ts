import { axiosClient } from "./axiosClient";


export const getIncidents = async () => {
    const response = await axiosClient.get("/incident/all")
    return response.data;
}

export const getIncidentStats = async () => {
    const response = await axiosClient.get("/incident/stats")
    return response.data;
}