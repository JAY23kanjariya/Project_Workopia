import { Link } from "react-router-dom";

function StatCard({ title, value, link, icon, color = "blue" }) {

    const colorStyles = {
        blue: "bg-blue-50 text-blue-600",
        green: "bg-green-50 text-green-600",
        red: "bg-red-50 text-red-600",
        yellow: "bg-yellow-50 text-yellow-600",
    };

    const content = (
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition duration-200 flex items-center justify-between">

            {/* Left */}
            <div>
                <p className="text-sm text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                    {value ?? 0}
                </p>
            </div>

            {/* Right (Icon) */}
            {icon && (
                <div className={`p-3 rounded-xl ${colorStyles[color]}`}>
                    {icon}
                </div>
            )}
        </div>
    );

    return link ? <Link to={link}>{content}</Link> : content;
}

export default StatCard;