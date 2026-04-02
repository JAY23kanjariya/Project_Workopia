import Badge from "./Badge";

const roleMap = {
    1: { label: "Admin", variant: "purple" },
    2: { label: "Employer", variant: "info" },
    3: { label: "Candidate", variant: "success" },
};

function WelcomeHeader({ name, role }) {
    return (
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between">

            {/* Left Section */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    Hello, {name || "User"} 👋
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Welcome to Workopia Dashboard
                </p>
            </div>

            {/* Right Section */}
            <div className="mt-4 sm:mt-0">
                <Badge
                    label={roleMap[role]?.label}
                    variant={roleMap[role]?.variant}
                />
            </div>
        </div>
    );
}

export default WelcomeHeader;