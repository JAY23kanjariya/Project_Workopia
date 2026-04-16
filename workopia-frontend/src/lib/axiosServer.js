import axios from "axios";
import { cookies } from "next/headers";

export async function axiosServer() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const api = axios.create({
        baseURL: "http://localhost:8000/api",
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }), 
        },
    });
    
    return api;
}