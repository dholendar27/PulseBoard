"use client"
import {useState} from "react";
import {Activity} from "lucide-react"
import {login} from "@/app/(api)/auth";
import {useRouter} from "next/navigation";

interface loginResponse {status: boolean, message: string}
export default function Login ()  {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const router = useRouter();
    const [loginDetails, setLoginDetails] = useState({
        "email": "",
        "password": ""
    });

    const [error, setError] = useState({
        "email": {"status": false, "message": ""},
        "password": {"status": false, "message": ""},
    });

    const handleLogin = async () => {
        const response:loginResponse  = await login(loginDetails);
        if(response.status) {
            // Set a client-side cookie to indicate authentication
            document.cookie = "auth-token=authenticated; path=/; max-age=86400"; // 24 hours
            router.push("/dashboard");
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setLoginDetails((prevState) => {
            return {
                ...prevState,
                [name]: value
            }
        })

    }

    const handlePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    }
    return (
        <div className="w-full h-screen flex flex-col items-center justify-center bg-[#F8F9FA] gap-6">
           <div className="flex flex-col items-center justify-center bg-[#F8F9FA] gap-4">
               <div className="flex items-center justify-center bg-[#F8F9FA] gap-4">
                   <Activity size="48" color="#2563EB"/>
                   <span className="text-4xl font-bold">PulseBoard</span>
               </div>
               <p className="text-md">Real-time incident and status management</p>
           </div>
            <div className=" w-[30rem] h-[26rem] rounded-2xl px-8 py-6 flex flex-col justify-center gap-4 bg-[#FFFFFF] shadow-lg shadow-black/50">
               <div>
                   <p className="text-center text-3xl font-bold">Welcome Back</p>
                   <p className="text-center text-sm ">Sign in to continue</p>
               </div>
                <div className="flex flex-col justify-center gap-1">
                    <label className={`text-sm font-medium ${error?.email?.status ? "text-red-500" : "text-gray-600"}`} htmlFor="email">Email</label>
                    <input className={`border  rounded-md h-12 p-2 test-sm font-medium ${error?.email?.status ? "text-red-500 border-red-500" : "text-gray-600 border-[#B1B7C0]"}`} type="text" name="email" id="email" placeholder={"you@email.com"} required onChange={handleChange} value={loginDetails.email} />
                </div>
                <div className="flex flex-col justify-center gap-1">
                    <div className="flex justify-between gap-1">
                        <label  className={`text-sm  font-medium ${error.password.status ? "text-red-500" : "text-gray-600"}`} htmlFor="password">Password</label>
                        <span  className="text-sm text-gray-600 font-medium hover:cursor-pointer hover:text-black" onClick={handlePasswordVisibility}>{showPassword ? "Hide" : "Show"} password</span>
                    </div>
                    <input className={`border border-[#B1B7C0] rounded-md h-12 p-2 test-sm font-medium ${error?.password?.status ? "text-red-500 border-red-500" : "text-gray-600 border-[#B1B7C0]"}`} type={showPassword ? "text" : "password"} name="password" id="password" required onChange={handleChange} value={loginDetails.password} placeholder="password" />
                </div>
                <button className="flex items-center justify-center gap-1 bg-[#2563EB] py-2 rounded-md mt-2 text-[#FFFFFF] font-bold h-12" onClick={handleLogin}>Sign In</button>
            </div>
        </div>
    )
}