import {axiosClient} from "@/app/(api)/axiosClient";

interface loginResponse {status: boolean, message: string}
interface profileResponse {id: string, first_name: string, last_name: string, email: string, role: string, created_at: string, updated_at: string}
export const login = async (payload: {email: string, password: string}): Promise<loginResponse> => {
    const response = await axiosClient.post("login", payload);
    return response.data;
}

export const profile = async (): Promise<profileResponse> => {
    const response = await axiosClient.get("profile");
    return response.data.data;
}

export const logout = async (): Promise<void> => {
    try {
        await axiosClient.post("logout");
    } catch (error) {
        console.error("Logout error:", error);
    } finally {
        // Clear the access token cookie
        document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie = "laravel_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        
        // Redirect to login
        window.location.href = "/login";
    }
}

export const getUsers = async () => {
    const response = await axiosClient.get("users");
    return response.data;
}