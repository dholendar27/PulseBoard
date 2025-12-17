import {clients} from "../server.js";

interface IncidentData {
    id: string;
    title: string;
    description: string | null;
    status: string;
    created_by_user_id: string;  // User who created the incident
    assigned_to_id: string;      // User who the incident is assigned to
    created_at: Date;            // Date when the incident was created
    updated_at: Date;            // Date when the incident was last updated
}


export const broadcastMessage = (event: string, incidentData: IncidentData ) => {
    clients.forEach(ws => {
        const message = {
            event: event,
            incidentData: incidentData,
        }
        ws.send(JSON.stringify({ message }));
    });
};
