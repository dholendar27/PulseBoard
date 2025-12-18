"use client"
import {X} from "lucide-react";
import {useState} from "react";

interface UserCreateModalProps {
    onClose: () => void;
    onUserCreated: (user: any) => void;
}

export default function UserCreateModal({ onClose, onUserCreated }: UserCreateModalProps) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'User'
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newUser = {
            id: Date.now(),
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            role: formData.role,
            createdBy: 'Current User',
            createdAt: new Date().toISOString()
        };
        onUserCreated(newUser);
    };
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
            <div className="relative z-10 w-full max-w-[40rem] bg-white border border-[#E5E7EB] rounded-lg shadow-2xl p-6 m-4 max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between gap-2">
                        <p className="text-xl font-bold">Add New User</p>
                        <button 
                            onClick={onClose}
                            className="border border-[#E5E7EB] p-2 rounded-md cursor-pointer hover:bg-[#F9FAFB]"
                        >
                            <X />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
                        <div className="flex gap-4">
                            <div className="flex flex-col gap-1 w-full">
                                <label className="text-sm font-medium" htmlFor="firstName">First Name</label>
                                <input 
                                    className="border rounded-md h-10 p-2 text-sm font-medium text-gray-600 border-[#B1B7C0]" 
                                    type="text" 
                                    name="firstName" 
                                    id="firstName" 
                                    placeholder="John" 
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    required  
                                />
                            </div>
                            <div className="flex flex-col gap-1 w-full">
                                <label className="text-sm font-medium" htmlFor="lastName">Last Name</label>
                                <input 
                                    className="border rounded-md h-10 p-2 text-sm font-medium text-gray-600 border-[#B1B7C0]" 
                                    type="text" 
                                    name="lastName" 
                                    id="lastName" 
                                    placeholder="Doe"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1 w-full">
                            <label className="text-sm font-medium" htmlFor="email">Email</label>
                            <input 
                                className="border rounded-md h-10 p-2 text-sm font-medium text-gray-600 border-[#B1B7C0]" 
                                type="email" 
                                name="email" 
                                id="email" 
                                placeholder="johndoe@gmail.com"
                                value={formData.email}
                                onChange={handleInputChange}
                                required  
                            />
                        </div>
                        <div className="flex flex-col gap-1 w-full">
                            <label className="text-sm font-medium" htmlFor="password">Password</label>
                            <input 
                                className="border rounded-md h-10 p-2 text-sm font-medium text-gray-600 border-[#B1B7C0]" 
                                type="password" 
                                name="password" 
                                id="password" 
                                placeholder="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required  
                            />
                        </div>
                        <div className="flex flex-col gap-1 w-full">
                            <label className="text-sm font-medium" htmlFor="role">Role</label>
                            <select 
                                className="border border-[#B1B7C0] py-2 px-2 rounded-md h-10 w-full"
                                name="role"
                                id="role"
                                value={formData.role}
                                onChange={handleInputChange}
                            >
                                <option value="User">User</option>
                                <option value="Admin">Admin</option>
                                <option value="Manager">Manager</option>
                                <option value="Viewer">Viewer</option>
                            </select>
                        </div>
                    </form>

                    <div className="w-full flex justify-end mt-6 gap-2">
                        <button 
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-[#B1B7C0] rounded-md font-medium cursor-pointer hover:bg-[#F9FAFB]"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            onClick={handleSubmit}
                            className="px-4 py-2 bg-[#2663EB] rounded-md font-medium text-[#FFFFFF] cursor-pointer hover:bg-[#1E4ED8]"
                        >
                            Create User
                        </button>
                    </div>
            </div>
        </div>
    )
}