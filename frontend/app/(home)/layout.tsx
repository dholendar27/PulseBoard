"use client"
import {Activity, LayoutDashboard, AlertCircle, Users, Globe, ChevronDown, ChevronUp, LogOut, UserRoundPen, User} from "lucide-react";
import {useEffect, useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {usePathname} from "next/navigation";
import {logout} from "@/app/(api)/auth";
import {useAuth} from "@/app/(hooks)/useAuth";

interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    created_at: string;
}

export default function HomeLayout({children}: {children: React.ReactNode}) {
    const [profileDropdown, setProfileDropdown] = useState<boolean>(false);
    const router = useRouter();
    const { user, isLoading } = useAuth();
    const pathname = usePathname();
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: "/dashboard" },
        { id: 'incidents', label: 'Incidents', icon: AlertCircle, href: "/incidents" },
        ...(user?.role === "ADMIN" || user?.role === "MANAGER" ? [{ id: 'users', label: 'Users', icon: Users, href: "/users" }] : []),
        { id: 'status', label: 'Status Page', icon: Globe, href: "/status" },
    ];


    const handleProfileDropdown = () => {
        setProfileDropdown((prevState) => !prevState);
    }

    const handleNaviagation = () => {
        router.push("/dashboard");
    }

    const handleLogout = async () => {
        await logout();
    }

    return (
        <div>
            <header className="h-[5rem] border-b flex justify-between items-center px-6 border-[#E5E7EB]">
                <div className="flex items-center justify-center gap-2 cursor-pointer" onClick={handleNaviagation}>
                    <Activity size="32" color="#2563EB"/>
                    <span className="text-2xl font-bold">PulseBoard</span>
                </div>
                <div className=" h-[2rem] m-w-[12rem]  w-[12rem] p-3 flex items-center justify-between cursor-pointer relative" onClick={handleProfileDropdown}>
                    <div className="flex items-center justify-center gap-2">
                        <div className="h-[2rem] w-[2rem] border border-[#E5E7EB] rounded-[50%] flex items-center justify-center">
                            <User size={18}/>
                        </div>
                        <div>{user?.first_name || 'Loading...'}</div>
                    </div>
                    <div className="ml-2 "> {/* Fixed to bottom-right of the screen */}
                        {profileDropdown ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                    {profileDropdown && (
                        <div className="absolute w-[12rem] bg-[#FFFFFF] top-10 right-[-3] shadow-2xl rounded-md p-4 flex flex-col gap-2 border border-[#E5E7EB]">
                            {/* First Menu Item */}
                            <div className="flex items-center hover:bg-[#F9FAFB] p-2 gap-2 rounded-md">
                                <UserRoundPen size={18} />
                                <p>Profile</p>
                            </div>

                            {/* Add any additional items here */}
                            <div className="flex items-center hover:bg-red-600/10 p-2 gap-2 rounded-md cursor-pointer" onClick={handleLogout}>
                                <LogOut size={18} />
                                <p>Logout</p>
                            </div>
                        </div>
                    )}

                </div>

            </header>
            <main className="h-[calc(100vh-6em)] flex">
               <div className="w-[16rem] border-r h-full border-[#E5E7EB] p-6 flex flex-col gap-1">
                   {navItems.map((item) => {
                       const Icon = item.icon
                       const isActive = pathname.startsWith(item.href);
                       return (
                           <Link href={item.href} key={item.id} className={`flex items-center gap-2 p-2  rounded-lg cursor-pointer font-medium ${isActive ? "bg-[#F0F6FF] text-[#1E4ED8]": ""}`} >
                               <Icon size={18}/>
                               <p className="text-md">{item.label}</p>
                           </Link>
                       )
                   })}
               </div>
                <div className="bg-[#F9FAFB] p-8 w-full">
                    {children}
                </div>
            </main>
        </div>
    )
}