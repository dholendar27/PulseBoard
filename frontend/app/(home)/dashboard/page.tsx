"use client"
import {Activity, CircleAlert, CircleCheckBig, Clock, Loader2, AlertTriangle, Eye} from "lucide-react";
import {useEffect, useState} from "react";
import {getIncidentStats, getIncidents} from "@/app/(api)/incidents";
import Link from "next/link";

interface Stats {
    open: number;
    investigating: number;
    resolved: number;
}

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
    created_at: string;
}
export default function DashBoard() {
    const [stats, setStats] = useState<Stats>({
        open: 0,
        investigating: 0,
        resolved: 0
    });
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [isLoadingStats, setIsLoadingStats] = useState(true);
    const [isLoadingIncidents, setIsLoadingIncidents] = useState(true);
    const getStatsDetails = (data) => {
        data.forEach((item) => {
            if (item.status === "OPEN") {
                setStats((prevData) => ({
                    ...prevData,
                    open: item._count.id
                }));
            } else if (item.status === "INVESTIGATING") {
                setStats((prevData) => ({
                    ...prevData,
                    investigating: item._count.id
                }));
            } else if (item.status === "RESOLVED") {
                setStats((prevData) => ({
                    ...prevData,
                    resolved: item._count.id
                }));
            }
        });
    }
    const getStats = async () => {
        try {
            setIsLoadingStats(true);
            const response = await getIncidentStats();
            console.log(response.data);
            getStatsDetails(response.data);
        } catch (error) {
            console.error("Failed to fetch stats:", error);
        } finally {
            setIsLoadingStats(false);
        }
    }

    const fetchIncidents = async () => {
        try {
            setIsLoadingIncidents(true);
            const response = await getIncidents();
            setIncidents(response?.data?.slice(0, 5) || []); // Show only recent 5 incidents
        } catch (error) {
            console.error("Failed to fetch incidents:", error);
        } finally {
            setIsLoadingIncidents(false);
        }
    }

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    const getStatusBadge = (status: string) => {
        const statusColors = {
            'open': 'bg-red-100 text-red-800 border-red-200',
            'investigating': 'bg-yellow-100 text-yellow-800 border-yellow-200',
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
        getStats();
        fetchIncidents();
    }, [])
    return (
        <div className="h-full">
            <p className="text-3xl font-bold">DashBoard</p>
            <p className="font-medium mt-3 text-[#4B5563]">System overview and recent activity</p>

            <div className="grid grid-cols-1 gap-4 mt-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className="h-[10rem] border rounded-lg border-[#E5E7EB] bg-[#FFFFFF] hover:shadow-lg transition-shadow duration-200 p-4">
                    <div className="h-[3rem] rounded-md w-[3rem] bg-[#EFF6FF] flex items-center justify-center">
                        <Activity color="#2563EB"/>
                    </div>
                    <p className="mt-3 font-bold text-sm text-[#57606E]">Total Incidents</p>
                    <p className="text-3xl font-bold mt-2">
                        {isLoadingStats ? (
                            <Loader2 className="animate-spin" size={24} />
                        ) : (
                            stats.open + stats.resolved + stats.investigating
                        )}
                    </p>
                </div>
                <div className="h-[10rem] border rounded-lg border-[#E5E7EB] bg-[#FFFFFF] hover:shadow-lg transition-shadow duration-200 p-4">
                    <div className="h-[3rem] rounded-md w-[3rem] bg-[#FEF2F2] flex items-center justify-center">
                        <CircleAlert color="#DC2526"/>
                    </div>
                    <p className="mt-3 font-bold text-sm text-[#57606E]">Open</p>
                    <p className="text-3xl font-bold mt-2">
                        {isLoadingStats ? (
                            <Loader2 className="animate-spin" size={24} />
                        ) : (
                            stats.open
                        )}
                    </p>
                </div>
                <div className="h-[10rem] border rounded-lg border-[#E5E7EB] bg-[#FFFFFF] hover:shadow-lg transition-shadow duration-200 p-4">
                    <div className="h-[3rem] rounded-md w-[3rem] bg-[#FEFCE8] flex items-center justify-center">
                        <Clock color="#DAAF5D"/>
                    </div>
                    <p className="mt-3 font-bold text-sm text-[#57606E]">Investigating</p>
                    <p className="text-3xl font-bold mt-2">
                        {isLoadingStats ? (
                            <Loader2 className="animate-spin" size={24} />
                        ) : (
                            stats.investigating
                        )}
                    </p>
                </div>
                <div className="h-[10rem] border rounded-lg border-[#E5E7EB] bg-[#FFFFFF] hover:shadow-lg transition-shadow duration-200 p-4">
                    <div className="h-[3rem] rounded-md w-[3rem] bg-[#F0FDF4] flex items-center justify-center">
                        <CircleCheckBig color="#52BB79" />
                    </div>
                    <p className="mt-3 font-bold text-sm text-[#57606E]">Resolved</p>
                    <p className="text-3xl font-bold mt-2">
                        {isLoadingStats ? (
                            <Loader2 className="animate-spin" size={24} />
                        ) : (
                            stats.resolved
                        )}
                    </p>
                </div>
            </div>

            <div className="mt-6 h-[calc(100vh-32rem)]">
                <div className="bg-white rounded-lg border border-[#E5E7EB] shadow-sm h-full flex flex-col">
                    <div className="border-b border-[#E5E7EB] p-4 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900">Recent Incidents</h2>
                        <Link 
                            href="/incidents" 
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                        >
                            <Eye size={16} />
                            View All
                        </Link>
                    </div>
                    <div className="flex-1 overflow-auto">
                        {isLoadingIncidents ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="flex flex-col items-center">
                                    <Loader2 className="animate-spin mb-3" size={32} />
                                    <p className="text-gray-500">Loading incidents...</p>
                                </div>
                            </div>
                        ) : incidents.length === 0 ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="flex flex-col items-center">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                        <AlertTriangle size={24} className="text-gray-400" />
                                    </div>
                                    <p className="text-gray-900 font-medium">No incidents found</p>
                                    <p className="text-gray-500 text-sm mt-1">All systems are running smoothly</p>
                                </div>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200">
                                {incidents.map((incident, index) => (
                                    <div key={incident.id} className="p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h3 className="text-sm font-medium text-gray-900 truncate">
                                                        {incident.title}
                                                    </h3>
                                                    {getStatusBadge(incident.status)}
                                                </div>
                                                <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                                                    {incident.description}
                                                </p>
                                                <div className="flex items-center justify-between text-xs text-gray-400">
                                                    <span>
                                                        Assigned to: {incident.assigned_to_user ? 
                                                            `${incident.assigned_to_user.first_name} ${incident.assigned_to_user.last_name}` : 
                                                            'Unassigned'
                                                        }
                                                    </span>
                                                    <span>{formatDate(incident.updated_at)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}