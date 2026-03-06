import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import './ProtectedRoutes.css'

/**
 * PROTECTED ROUTES WRAPPER
 * This component is a security gatekeeper.
 * It checks if a user is logged in before allowing them to see a page.
 */
export default function ProtectedRoutes({ children }) {
    // get user and loading state from auth context
    const { user, loading } = useContext(AuthContext);

    // Wait for auth check to complete
    if (loading) {
        return (
            <div className="check-auth">
                <p className="check-auth-text">Checking authentication...Please wait.</p>
            </div>
        );
    }

    // if user(null) is not logged in, redirect to login page
    if (!user) {
        return <Navigate to="/login" />;
    }

    // return children if user is logged in
    return children;
};