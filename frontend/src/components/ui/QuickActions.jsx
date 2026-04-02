import { Link } from "react-router-dom";

function QuickActions({ title = "Quick Actions", actions = [] }) {
    return (
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 shadow-sm">

            {/* Header */}
            <h2 className="text-sm font-semibold text-gray-900 mb-4">
                {title}
            </h2>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
                {actions.map((action, index) => (
                    <Link
                        key={index}
                        to={action.link}
                        className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                    >
                        {action.label}
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default QuickActions;