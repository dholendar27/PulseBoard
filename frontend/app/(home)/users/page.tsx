"use client"

import {Plus, SquarePen, Trash2, Loader2} from "lucide-react";
import {useEffect, useState} from "react";
import {deleteUser, getUsers} from "@/app/(api)/auth";
import ProtectedRoute from "@/app/(components)/ProtectedRoute";
import UserCreateModal from "@/app/(home)/users/userCreateModal";
import UserDeleteModal from "./userDeleteModal";

interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    created_at: string;
    updated_at: string;
    invitedBy: {
        first_name: string;
        last_name: string;
        email: string;
    }
}
export default function User() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        user: User | null;
        isDeleting: boolean;
    }>({
        isOpen: false,
        user: null,
        isDeleting: false
    });

    const getUsersList = async () => {
        try {
            setIsLoading(true);
            const response = await getUsers();
            setUsers(response.data || []);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const onClose = () => {
        setOpenModal(false);
    }

    const onOpen = () => {
        setOpenModal(true);
    }

    const handleDeleteClick = (user: User) => {
        setDeleteModal({
            isOpen: true,
            user: user,
            isDeleting: false
        });
    };

    const handleDeleteConfirm = async () => {
        if (!deleteModal.user) return;

        setDeleteModal((prev: typeof deleteModal) => ({ ...prev, isDeleting: true }));

        try {
            const response = await deleteUser(deleteModal.user.id);
            if (response.success) {
                // Remove user from local state
                setUsers(prev => prev.filter(u => u.id !== deleteModal.user?.id));
                
                // Close modal
                setDeleteModal({
                    isOpen: false,
                    user: null,
                    isDeleting: false
                });

                console.log(`User ${deleteModal.user.first_name} ${deleteModal.user.last_name} deleted successfully`);
            }
        } catch (error) {
            console.error("Failed to delete user:", error);
            setDeleteModal((prev: typeof deleteModal) => ({ ...prev, isDeleting: false }));
        }
    };

    const handleDeleteCancel = () => {
        setDeleteModal({
            isOpen: false,
            user: null,
            isDeleting: false
        });
    };
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

    const getRoleBadge = (role: string) => {
        const roleColors = {
            'admin': 'bg-purple-100 text-purple-800 border-purple-200',
            'manager': 'bg-blue-100 text-blue-800 border-blue-200',
            'user': 'bg-green-100 text-green-800 border-green-200',
            'viewer': 'bg-gray-100 text-gray-800 border-gray-200'
        };

        const colorClass = roleColors[role.toLowerCase() as keyof typeof roleColors] || 'bg-gray-100 text-gray-800 border-gray-200';

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${colorClass}`}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
            </span>
        );
    }

    useEffect(()=> {
        getUsersList();
    },[])

    return (
        <ProtectedRoute requiredRole={["ADMIN", "MANAGER"]}>
        <div>
            {openModal && (<UserCreateModal onClose={onClose}/>)}
            
            <UserDeleteModal
                isOpen={deleteModal.isOpen}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                user={deleteModal.user}
                isDeleting={deleteModal.isDeleting}
            />
            <div className="flex items-center justify-between gap-2">
                <div>
                    <p className="text-3xl font-bold">Users</p>
                    <p className="font-medium mt-3 text-[#4B5563]">Manage user accounts and permissions</p>
                </div>
                <div>
                    <button
                        className="flex gap-2 bg-[#2663EB] hover:bg-blue-700 p-2 rounded-md text-[#FFFFFF] font-medium items-center cursor-pointer transition-colors duration-200"
                        disabled={isLoading}
                        onClick={onOpen}
                    >
                        <Plus size={20}/>
                        <span>Add User</span>
                    </button>
                </div>
            </div>
            <div className="mt-6 h-[calc(100vh-15rem)] overflow-auto">
                <div className="bg-white rounded-lg border border-[#E5E7EB] shadow-sm">
                    <table className="w-full">
                        <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Created By
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
                                            <p className="text-gray-900 font-medium">Loading users...</p>
                                            <p className="text-gray-500 text-xs mt-1">Please wait while we fetch the data</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500">
                                        <div className="flex flex-col items-center">
                                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                                <Plus size={24} className="text-gray-400" />
                                            </div>
                                            <p className="text-gray-900 font-medium">No users found</p>
                                            <p className="text-gray-500 text-xs mt-1">Get started by adding your first user</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                users.map((user, index) => (
                                    <tr key={user.id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <span className="text-sm font-medium text-blue-800">
                                                        {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
                                                    </span>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {user.first_name} {user.last_name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        ID: {user.id}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{user.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getRoleBadge(user.role)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {user.invitedBy ?
                                                    `${user.invitedBy.first_name} ${user.invitedBy.last_name}` :
                                                    'System'
                                                }
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {user.invitedBy?.email || 'Auto-created'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="flex gap-2 items-center justify-center">
                                                <button
                                                    className="bg-blue-600 hover:bg-blue-700 p-2 rounded-md transition-colors duration-200 shadow-sm"
                                                    title="Edit user"
                                                >
                                                    <SquarePen size={16} color="#FFFFFF"/>
                                                </button>
                                                <button
                                                    className="bg-red-500 hover:bg-red-600 p-2 rounded-md transition-colors duration-200 shadow-sm"
                                                    title="Delete user"
                                                    onClick={() => handleDeleteClick(user)}
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
        </ProtectedRoute>
    )
}