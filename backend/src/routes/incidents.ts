import express, {type Request, type Response} from "express";
import {validateUser, validateUserAndRole} from "../middleware/user.middleware.js";
import {
    incidentCreateValidator,
    incidentStatusValidator,
    incidentUpdateValidator
} from "../validators/incident.validators.js"
import prisma from "../db/db.js";
import {broadcastMessage} from "../utils/websocketBroadcast.js";
import z from "zod";

export const incidentRouter = express.Router()

incidentRouter.post("/", validateUserAndRole, async (req: Request, res: Response) => {
    const user = req.user;
    const parsedIncidentData = incidentCreateValidator.safeParse(req.body);

    if (!parsedIncidentData.success)  {
        return res.status(400).json({status: false, message: z.treeifyError(parsedIncidentData.error)})
    }
    if (parsedIncidentData.data.assignee) {
        const assignee_user = await prisma.user.findFirst({
            where: {
                id: parsedIncidentData.data?.assignee
            }
        })

        if (!assignee_user) {
            return res.json(400).json({status: false, message: "Assignee not found"})
        }
    }

    const new_incident = await prisma.incident.create( {
        data: {
            title: parsedIncidentData.data.title,
            description: parsedIncidentData.data.description ?? "",
            created_by_user_id: user.id,
            assigned_to_id: parsedIncidentData.data.assignee ? parsedIncidentData.data.assignee : user.id
        }
    })

    broadcastMessage("incident.created", new_incident)
    return res.status(200).json({status: true, message: "Incident has been created successfully", data: {
        id: new_incident.id, title: new_incident.title, assigned_to: new_incident.assigned_to_id, created_by: new_incident.created_by_user_id
        }})
})

incidentRouter.get("/", validateUser, async (req: Request, res: Response) => {
    const user = req.user;
    let incidents: string | any[] = [];

    if (user && user.role === "ADMIN") {
        incidents = await prisma.incident.findMany({
            where: {
                OR: [
                    {
                        created_by_user_id: user.id
                    },{
                        assigned_to_id: user.id
                    }
                ]
            }
        })
    }
    else {
        incidents = await prisma.incident.findMany({
            where:
                {
                    assigned_to_id: user.id
                }
        })
    }

    if (incidents.length === 0) {
        return res.status(200).json({
            status: true,
            message: "No incidents found",
            data: incidents
        });
    }

    return res.status(200).json({
        status: true,
        message: "Incidents retrieved successfully",
        data: incidents
    });
})

incidentRouter.get("/:incidentId", async (req: Request, res: Response) => {
    const params = req.params;

    if (!params.incidentId) {
        return res.status(400).json({status: false, message: "incidentId is required"})
    }

    const incident = await prisma.incident.findFirst( {
        where: {
            id: params.incidentId
        }
    })

    if (!incident) {
        return res.status(404).json({
            status: false,
            message: "Incident not found",
            data: []
        });
    }

// If incident exists
    return res.status(200).json({
        status: true,
        message: "Incident retrieved successfully",
        data: incident
    });
})


incidentRouter.put("/:incidentId", validateUserAndRole, async (req: Request, res: Response) => {
    try {
        const user = req.user;
        const params = req.params;
        const parsedUpdatedIncidentData = incidentUpdateValidator.safeParse(req.body)

        if (!params.incidentId) {
            return res.status(400).json({status: false, message: "incidentId is required"})
        }
        if (!parsedUpdatedIncidentData.success) {
            return res.status(400).json({status: false, message: z.treeifyError(parsedUpdatedIncidentData.error)})
        }


        const incident = await prisma.incident.findFirst({
            where: {
                id: params.incidentId
            }
        })

        if (!incident) {
            return res.status(404).json({status: false, message: "Incident not found"})
        }

        if (incident.status === "RESOLVED" && incident.assigned_to_id !== parsedUpdatedIncidentData.data?.assignee) {
            return res.status(200).json({status: true, message: "Assignee can't be changed once the incident is resolved"})
        }

        const updated_incident = await prisma.incident.update({
            where: {
                id: incident.id
            },
            data: {
                title: parsedUpdatedIncidentData.data.title,
                description: parsedUpdatedIncidentData.data.description ?? "",
                assigned_to_id: parsedUpdatedIncidentData.data.assignee ?? user.id,
                status: parsedUpdatedIncidentData.data.status
            }
        })

        broadcastMessage("incident.updated", updated_incident)

        return res.status(200).json({status: true, message: "Updated successfully",data: updated_incident})
    } catch (error) {
        return res.status(400).json({status: false, message: error})
    }
})

incidentRouter.patch("/status/:incidentId", validateUserAndRole, async (req: Request, res: Response) => {
    const params = req.params;
    const parsedStatusData = incidentStatusValidator.safeParse(req.body);

    if (!params.incidentId) {
        return res.status(400).json({status: false, message: "incidentId is required"})
    }
     if (!parsedStatusData.success) {
         return res.status(400).json({status: false, message: "Status is required"})
     }

    const incident = await prisma.incident.update({
        where: {
            id: params.incidentId
        },
        data: {
            status: parsedStatusData.data.status
        }
    })

    if (!incident) {
        return res.status(404).json({status: false, message: "Incident not found"})
    }

    broadcastMessage("incident.status.changed", incident)

    return res.status(200).json({status: true, message: "Status is changed", data: incident})

})
incidentRouter.get("/all", async (req: Request, res: Response) => {
    const incidents = await prisma.incident.findMany({
        orderBy: {
            created_at: "desc"
        }
    })

    if (incidents.length === 0) {
        return res.status(404).json({status: false, message: "No incidents found"})
    }
    return res.status(200).json({status: true, message: "Incidents retrieved successfully",data: incidents})
})