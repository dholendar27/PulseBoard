"use client"
import { AlertTriangle, X, Loader2 } from "lucide-react";

interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
}

interface UserDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    user: User | null;
    isDeleting?: boolean;
}

export default function UserDeleteModal({
    isOpen,
    onClose,
    onConfirm,
    user,
    isDeleting = false
}: UserDeleteModalProps) {
    if (!isOpen || !user) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 transition-opacity"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-in fade-in zoom-in duration-200">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={isDeleting}
                >
                    <X size={20} />
                </button>

                {/* Content */}
                <div className="p-6">
                    {/* Icon */}
                    <div className="flex items-center justify-center mb-4">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                            <AlertTriangle size={32} className="text-red-600" />
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-semibold text-gray-900 text-center mb-3">
                        Delete User Account
                    </h3>

                    {/* Message */}
                    <p className="text-sm text-gray-600 text-center mb-4">
                        Are you sure you want to delete this user account? This action will permanently remove all user data and cannot be undone.
                    </p>

                    {/* User Info Card */}
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center space-x-3">
                            {/* User Avatar */}
                            <div className="h-12 w-12 bg-red-200 rounded-full flex items-center justify-center">
                                <span className="text-lg font-semibold text-red-800">
                                    {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
                                </span>
                            </div>
                            
                            {/* User Details */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">
                                    {user.first_name} {user.last_name}
                                </p>
                                <p className="text-sm text-gray-600 truncate">
                                    {user.email}
                                </p>
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mt-1">
                                    {user.role}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Warning text */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-6">
                        <div className="flex">
                            <AlertTriangle size={16} className="text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                            <div>
                                <p className="text-xs font-medium text-yellow-800">
                                    Warning: This action is irreversible
                                </p>
                                <p className="text-xs text-yellow-700 mt-1">
                                    All user data, permissions, and associated records will be permanently deleted.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            disabled={isDeleting}
                            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isDeleting}
                            className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <AlertTriangle size={16} />
                                    Delete User
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}