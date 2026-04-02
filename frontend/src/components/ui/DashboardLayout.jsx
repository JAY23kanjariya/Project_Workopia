import WelcomeHeader from "../../components/ui/WelcomeHeader";
import StatCard from "../../components/ui/StatCard";
import QuickActions from "../../components/ui/QuickActions";

function DashboardLayout({ user, stats = {}, cards = [], actions = [] }) {
    return (
        <div className="bg-gray-50 p-6">

            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-6">
                    <WelcomeHeader name={user?.name} role={user?.role_id} />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    {cards.map((card, index) => (
                        <StatCard
                            key={index}
                            title={card.title}
                            value={stats[card.key]}
                            link={card.link}
                            color={card.color}
                        />
                    ))}
                </div>

                {/* Quick Actions */}
                {actions.length > 0 && (
                    <QuickActions title="Quick Actions" actions={actions} />
                )}

            </div>
        </div>
    );
}

export default DashboardLayout;