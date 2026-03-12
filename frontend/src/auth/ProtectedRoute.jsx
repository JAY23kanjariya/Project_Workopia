import { useContext } from 'react'
import { AuthContext } from './AuthContext'
import { Navigate } from 'react-router-dom';
import Loader from '../components/common/Loader';

function ProtectedRoute({ children }) {

    // Access user and loading state from AuthContext
    const { user, loading } = useContext(AuthContext);

    // If loading, show loading spinner
    if (loading) {
        return <Loader />;
    }

    // If user is not logged in, redirect to login page
    if (!user) {
        return <Navigate to="/login" />;
    }
    
    // If user is logged in, render the protected component
    return children;
}

export default ProtectedRoute

