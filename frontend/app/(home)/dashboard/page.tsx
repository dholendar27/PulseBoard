import {Activity,CircleAlert, CircleCheckBig, Clock } from "lucide-react";

export default function DashBoard() {
    return (
        <div className="h-full">
            <p className="text-3xl font-bold">DashBoard</p>
            <p className="font-medium mt-3 text-[#4B5563]">System overview and recent activity</p>

            <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="h-[10rem] border rounded-lg border-[#E5E7EB] bg-[#FFFFFF] hover:shadow-xl/20 p-4">
                    <div className="h-[3rem] rounded-md w-[3rem] bg-[#EFF6FF] flex items-center justify-center">
                        <Activity color="#2563EB"/>
                    </div>
                    <p className="mt-3 font-bold text-sm text-[#57606E]">Total Incidents</p>
                    <p className="text-3xl font-bold mt-2">0</p>
                </div>
                <div className="h-[10rem] border rounded-lg border-[#E5E7EB] bg-[#FFFFFF] hover:shadow-xl/20 p-4">
                    <div className="h-[3rem] rounded-md w-[3rem] bg-[#FEF2F2] flex items-center justify-center">
                        <CircleAlert color="#DC2526"/>
                    </div>
                    <p className="mt-3 font-bold text-sm text-[#57606E]">Open</p>
                    <p className="text-3xl font-bold mt-2">0</p>
                </div>
                <div className="h-[10rem] border rounded-lg border-[#E5E7EB] bg-[#FFFFFF] hover:shadow-xl/20 p-4">
                    <div className="h-[3rem] rounded-md w-[3rem] bg-[#FEFCE8] flex items-center justify-center">
                        <Clock color="#DAAF5D"/>
                    </div>
                    <p className="mt-3 font-bold text-sm text-[#57606E]">Investigating</p>
                    <p className="text-3xl font-bold mt-2">0</p>
                </div>
                <div className="h-[10rem] border rounded-lg border-[#E5E7EB] bg-[#FFFFFF] hover:shadow-xl/20 p-4">
                    <div className="h-[3rem] rounded-md w-[3rem] bg-[#F0FDF4] flex items-center justify-center">
                        <CircleCheckBig color="#52BB79" />
                    </div>
                    <p className="mt-3 font-bold text-sm text-[#57606E]">Resolved</p>
                    <p className="text-3xl font-bold mt-2">0</p>
                </div>
            </div>

            <div className="mt-6 h-[calc(100vh-32rem)]">
                <div className="border h-[4rem] border-[#E5E7EB] bg-[#FFFFFF] rounded-t-2xl flex items-center p-4">
                    <p className="text-xl font-bold">Recent Incident</p>
                </div>
                <div className="border border-t-0 h-full border-[#E5E7EB] bg-[#FFFFFF]  flex items-center p-4">

                </div>
            </div>
        </div>
    )
}