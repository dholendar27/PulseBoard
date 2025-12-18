"use client"

import {Plus, SquarePen, Trash2} from "lucide-react";
import {useState} from "react";

interface user {
    id: string,
    name: string,
    email: string,
    role: string,
    createdBy: string,
}
export default function User() {
    const [users,setUsers] = useState<user[]>([]);
    return (
        <div>
            <div className="flex items-center justify-between gap-2">
                <div>
                    <p className="text-3xl font-bold">Users</p>
                    <p className="font-medium mt-3 text-[#4B5563]">Manage user accounts and permissions</p>
                </div>
                <div>
                    <button
                        className="flex gap-2 bg-[#2663EB] p-2 rounded-md text-[#FFFFFF] font-medium items-center cursor-pointer"
                    >
                        <Plus size={20}/>
                        <span>Add User</span>
                    </button>
                </div>
            </div>
            <div className="mt-4 h-[calc(100vh-15rem)] overflow-auto">
                <table className={`w-full table-fixed border border-[#E5E7EB] rounded-t-xl border-separate ${users.length === 0 ? "h-full" : ""}`}>
                    <thead>
                    <tr className="h-12 bg-[#F9FAFB]">
                        <th className="w-1/4 text-center px-4">Name</th>
                        <th className="w-1/4 text-center px-4">Email</th>
                        <th className="w-1/4 text-center px-4">Role</th>
                        <th className="w-1/4 text-center px-4">Created By</th>
                        <th className="w-1/4 text-center px-4">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white">
                    {users.length === 0 ? (
                        <tr>
                            <td
                                colSpan={5}
                                className="h-16 text-center text-sm text-gray-500 border-t border-[#E5E7EB]"
                            >
                                No users found
                            </td>
                        </tr>
                    ) : (
                        users.map((user, index) => (
                            <tr key={`${user.id}-${index}`} className="h-12 border-t border-[#E5E7EB] hover:bg-gray-50">
                                <td className="px-4 text-center py-2">{user.name}</td>
                                <td className="px-4 text-center py-2">{user.email}</td>
                                <td className="px-4 text-center py-2">
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-4 text-center py-2">{user.createdBy || 'System'}</td>
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