import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';

const IconMapPin = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
);

const IconBriefcase = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
);

export default function JobCard({ job, onApply, isApplied }) {
    const { user } = useAuth();
    
    // Role based visibility
    // Role 1 = Admin, Role 2 = Employer, Role 3 = Candidate
    const canApply = !user || user.role_id === 3;

    return (
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-100/50 border border-gray-50 hover:border-primary/20 hover:-translate-y-2 transition-all duration-500 group flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-primary/10 transition-colors"></div>
            
            <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="w-16 h-16 bg-white shadow-lg shadow-gray-100 rounded-[1.25rem] flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 transform group-hover:rotate-6">
                    <IconBriefcase />
                </div>
                {new Date(job.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
                    <span className="px-3 py-1 bg-accent text-primary-dark rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                        New
                    </span>
                )}
            </div>

            <div className="flex-1 relative z-10">
                <Link to={`/jobs/${job.id}`}>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tighter leading-tight mb-2 group-hover:text-primary transition-colors">
                        {job.title}
                    </h3>
                </Link>
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    <p className="text-gray-400 font-black text-[10px] uppercase tracking-[0.2em]">
                        {job.employer?.name || "Corporate Partner"}
                    </p>
                </div>
                
                <div className="flex flex-wrap gap-3 text-sm text-gray-500 font-bold mb-8">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-xl text-[10px] text-gray-400 uppercase tracking-widest border border-gray-100">
                        <IconMapPin />
                        <span>{job.location}</span>
                    </div>
                    <div className="px-3 py-1.5 bg-primary/5 rounded-xl text-[10px] font-black text-primary uppercase tracking-widest border border-primary/10">
                        {job.category?.name || "General"}
                    </div>
                </div>
            </div>
            
            {canApply && (
                <div className="pt-2 relative z-10">
                    <button
                        onClick={() => !isApplied && onApply(job.id)}
                        disabled={isApplied}
                        className={`w-full py-5 font-black rounded-2xl transition-all active:scale-95 text-[10px] uppercase tracking-[0.2em] shadow-xl ${
                            isApplied 
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none" 
                            : "bg-gray-900 text-white hover:bg-primary hover:shadow-primary/30"
                        }`}
                    >
                        {isApplied ? "Already Applied" : "Launch Application"}
                    </button>
                </div>
            )}
        </div>
    );
}

