import React from 'react'
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Dashboard() {

    const { user } = useContext(AuthContext);
    
    if(user?.role_id === 1) {
        return <Navigate to="/admin/dashboard" />
    } else if(user?.role_id === 2) {
        return <Navigate to="/employer/dashboard" />
    } else if(user?.role_id === 3) {
        return <Navigate to="/candidate/dashboard" />
    } else {
        return <Navigate to="*" />
    }
}

export default Dashboard
