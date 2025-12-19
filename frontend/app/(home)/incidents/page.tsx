"use client"
import {useEffect, useState} from "react";

import {RefreshCcw, SquarePen, Trash2, Loader2} from "lucide-react"
import {getIncidents} from "@/app/(api)/incidents";
interface Incident {
    id: string;
    title: string;
    description: string;
    status: string;
    assigned_to_user: {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
    };
    updated_at: string;
}
export default function Incidents() {
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchIncidents = async (): Promise<void> => {
        try {
            setIsLoading(true);
            const response = await getIncidents();
            console.log(response.data);
            setIncidents(response?.data || []);
        } catch (error) {
            console.error("Failed to fetch incidents:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    const getStatusBadge = (status: string) => {
        const statusColors = {
            'open': 'bg-red-100 text-red-800 border-red-200',
            'investigation': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'resolved': 'bg-green-100 text-green-800 border-green-200',
            'closed': 'bg-gray-100 text-gray-800 border-gray-200'
        };
        
        const colorClass = statusColors[status.toLowerCase() as keyof typeof statusColors] || 'bg-gray-100 text-gray-800 border-gray-200';
        
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${colorClass}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    }
    useEffect(() => {
        fetchIncidents()
    },[])
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
                    <button 
                        className="h-full p-2 border border-[#E5E7EB] rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={fetchIncidents}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Loader2 size={20} className="animate-spin" />
                        ) : (
                            <RefreshCcw size={20} />
                        )}
                    </button>
                </div>
            </div>

            <div className="mt-4 h-[calc(100vh-20rem)] overflow-auto">
                <div className="bg-white rounded-lg border border-[#E5E7EB] shadow-sm">
                    <table className="w-full">
                        <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Title
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Assigned To
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Last Updated
                                </th>
                                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500">
                                        <div className="flex flex-col items-center">
                                            <Loader2 size={32} className="animate-spin mb-3 text-blue-600" />
                                            <p className="text-gray-900 font-medium">Loading incidents...</p>
                                            <p className="text-gray-500 text-xs mt-1">Please wait while we fetch the data</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : incidents.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500">
                                        <div className="flex flex-col items-center">
                                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                                <RefreshCcw size={24} className="text-gray-400" />
                                            </div>
                                            <p className="text-gray-900 font-medium">No incidents found</p>
                                            <p className="text-gray-500 text-xs mt-1">Get started by creating your first incident</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                incidents.map((incident, index) => (
                                    <tr key={incident.id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900 truncate max-w-xs" title={incident.title}>
                                                {incident.title}
                                            </div>
                                            <div className="text-sm text-gray-500 truncate max-w-xs" title={incident.description}>
                                                {incident.description}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(incident.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {incident.assigned_to_user ? 
                                                    `${incident.assigned_to_user.first_name} ${incident.assigned_to_user.last_name}` : 
                                                    'Unassigned'
                                                }
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {incident.assigned_to_user?.email || ''}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(incident.updated_at)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="flex gap-2 items-center justify-center">
                                                <button 
                                                    className="bg-blue-600 hover:bg-blue-700 p-2 rounded-md transition-colors duration-200 shadow-sm"
                                                    title="Edit incident"
                                                >
                                                    <SquarePen size={16} color="#FFFFFF"/>
                                                </button>
                                                <button 
                                                    className="bg-red-500 hover:bg-red-600 p-2 rounded-md transition-colors duration-200 shadow-sm"
                                                    title="Delete incident"
                                                >
                                                    <Trash2 size={16} color="#FFFFFF"/>
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
        </div>
    )
}