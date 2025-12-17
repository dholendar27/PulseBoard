import { app } from "./app.js";
import { URL } from "url";  // Use the URL class instead of the older `url.parse` method.
import { WebSocket, WebSocketServer } from "ws";

const port: string = process.env["PORT"] || "3000";


export const server = app.listen(port, () => {
    console.log("The server is running on port:", port);
});

export const clients = new Map<string, WebSocket>();


const wss = new WebSocketServer({ server });

wss.on("connection", function connection(ws, req) {
    console.log("Connection established");


    const url = new URL(req.url!, `http://${req.headers.host}`);
    const userId = url.searchParams.get("userId");

    if (userId) {
        clients.set(userId, ws);
        console.log(`User ${userId} connected`);


        ws.on("close", () => {
            console.log(`User ${userId} disconnected`);
            clients.delete(userId); 
        });
    } else {
        console.log("No userId found in query parameters");
    }
});
