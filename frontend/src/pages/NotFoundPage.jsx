import React from 'react'
import { useNavigate } from 'react-router-dom'

function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-gray-600 mb-2">Page Not Found</h2>
                <p className="text-gray-500">The page you are looking for does not exist.</p>

                {/* goto home */}
                <div className="mt-6">
                    <button onClick={() => navigate('/')} className="text-indigo-600 font-medium hover:underline">
                        Go back to Home
                    </button>
                </div>
            </div>
        </div>
    )
}

export default NotFoundPage
