import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import Loader from '../components/common/Loader';

const RoleRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <Loader />;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(user.role_id)) {
        // Redirect based on role if unauthorized
        if (user.role_id === 1) return <Navigate to="/admin/dashboard" />;
        if (user.role_id === 2) return <Navigate to="/employer/dashboard" />;
        if (user.role_id === 3) return <Navigate to="/candidate/dashboard" />;
        return <Navigate to="/" />;
    }

    return children;
};

export default RoleRoute;

