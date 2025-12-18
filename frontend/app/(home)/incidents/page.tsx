"use client"
import {useState} from "react";

import {RefreshCcw, SquarePen, Trash2} from "lucide-react"
interface Incident {
    id: string;
    title: string;
    description: string;
    status: string;
    assignedTo: string;
    updatedAt: string;
}
export default function Incidents() {
    const [incidents, setIncidents] = useState<Incident[]>([
    ])
    return (
        <div className="h-full">
            <p className="text-3xl font-bold">Incidents</p>
            <p className="font-medium mt-3 text-[#4B5563]">Manage and track system incidents</p>

            <div className="h-16 border mt-6 rounded-lg border-[#E5E7EB] bg-[#FFFFFF] flex items-center w-full p-3 justify-between">
                <input type="text" placeholder="search" className="h-full p-2 border rounded-md border-[#E5E7EB] w-[60%]"/>

                <div className="flex items-center gap-2">
                    <select className="border border-[#E5E7EB] py-2 px-2 rounded-md w-[12rem]">
                        <option>All Status</option>
                        <option>Open</option>
                        <option>Investigation</option>
                        <option>Resolved</option>
                    </select>
                    <button className="h-full p-2 border border-[#E5E7EB] rounded-md cursor-pointer"><RefreshCcw size={20}/></button>
                </div>
            </div>

            <div className="mt-4 h-[calc(100vh-20rem)]">
                <table className={`w-full table-fixed border border-[#E5E7EB] rounded-t-xl border-separate ${incidents.length === 0 ? "h-full" : ""}`}>
                    <thead>
                        <tr className="h-12 bg-[#F9FAFB]">
                            <th className="w-1/4  text-center px-4">Title</th>
                            <th className="w-1/4  text-center px-4">Status</th>
                            <th className="w-1/4  text-center px-4">Assigned To</th>
                            <th className="w-1/4  text-center px-4">Last Updated</th>
                            <th className="w-1/4  text-center px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white border-t-2 border-[#E5E7EB]">
                    {incidents.length === 0 ? (
                        <tr>
                            <td
                                colSpan={5}
                                className="h-18 text-center text-sm text-gray-500"
                            >
                                No incidents found
                            </td>
                        </tr>
                    ) : (
                        incidents.map((incident) => (
                            <tr key={incident.id} className="h-10 border-t">
                                <td className="px-4 text-center">{incident.title}</td>
                                <td className="px-4 text-center">{incident.status}</td>
                                <td className="px-4 text-center">{incident.assignedTo}</td>
                                <td className="px-4 text-center">{incident.updatedAt}</td>
                                <td className="text-center">
                                    <div className="flex gap-2 items-center justify-center">
                                        <button className="bg-[#2663EB] p-2 rounded-md cursor-pointer hover:bg-[#0550f7]">
                                            <SquarePen size={18} color="#FFFFFF"/>
                                        </button>
                                        <button className="bg-red-400 p-2 rounded-md cursor-pointer hover:bg-red-600">
                                            <Trash2 size={18} color="#FFFFFF"/>
                                        </button>
                                    </div>
                                </td>

                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}