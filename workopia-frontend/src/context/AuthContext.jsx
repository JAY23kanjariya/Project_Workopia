import { useState, createContext, useEffect, useContext } from "react";
import * as authService from "../api/auth";
import api from "../api/axios";

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = async (email, password) => {
        const data = await authService.login(email, password);
        localStorage.setItem("token", data.data.token);
        setUser(data.data.user);
    };

    const register = async (userData) => {
        const data = await authService.register(userData);
        localStorage.setItem("token", data.data.token);
        setUser(data.data.user);
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error("Logout error", error);
        } finally {
            localStorage.removeItem('token');
            setUser(null);
        }
    };

    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const data = await authService.getUser();
                    setUser(data.data);
                } catch (error) {
                    console.error("Auth check failed", error);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };
        checkUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};