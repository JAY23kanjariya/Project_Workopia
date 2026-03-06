import { useState } from "react";

export default function AdminDashboard() {
    return (
        <div className="admin-dashboard">
            <h2>Admin Dashboard</h2>
            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Platform Categories</h3>
                    <p className="stat-number">0</p>
                </div>
                <div className="stat-card">
                    <h3>Total Users</h3>
                    <p className="stat-number">-</p>
                </div>
            </div>

            <section className="management-section">
                <h3>System Management</h3>
                <div className="management-grid">
                    <div className="manage-card">
                        <h4>Categories</h4>
                        <p>Create and organize job categories.</p>
                        <button className="btn-secondary">Manage</button>
                    </div>
                </div>
            </section>
        </div>
    );
}
