import api from '../api/axios';
import { createContext, useContext, useState, useEffect } from 'react';

// Create AuthContext to manage authentication state across the app
export const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);

// Provider component to wrap the app and provide authentication context
export const AuthProvider = ({ children }) => {
    // State to hold user information and loading status
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // function to handle user registration
    const createUser = async (data) => {
        try {
            const response = await api.post('/register', data);

            localStorage.setItem('token', response.data.data.token); // Store token in localStorage
            setUser(response.data.data.user); // Set user information in state
        } catch (error) {
            console.error('Registration failed:', error);
            throw error; // Rethrow error to be handled by the calling component
        } finally {
            setLoading(false); // Set loading to false after registration attempt
        }
    };

    const login = async (email, password) => {
        try {
            const response = await api.post('/login', { email, password });
            localStorage.setItem('token', response.data.data.token);
            setUser(response.data.data.user);
            return response;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Function to handle user logout
    const logout = async () => {
        try {
            await api.post('/logout'); // Make API call to logout endpoint
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            localStorage.removeItem('token'); // Remove token from localStorage
            setUser(null); // Clear user information from state
        }
    };

    // Effect to check if user is already logged in on component mount
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await api.get('/me'); // Make API call to get current user information
                    setUser(response.data.data); // Set user information in state
                } catch (error) {
                    console.error('Failed to fetch user:', error);
                    localStorage.removeItem('token'); // Remove invalid token from localStorage
                }
            }
            setLoading(false); // Set loading to false after checking authentication
        };
        checkAuth();
    }, []); // Empty dependency array to run effect only once on mount

    return (
        <AuthContext.Provider value={{ user, loading, login, createUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};