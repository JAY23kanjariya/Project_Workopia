import { useNavigate } from 'react-router-dom'

export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-6">
            <div className="max-w-md w-full text-center relative">
                {/* Decorative background element */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl opacity-50 -z-10"></div>
                
                <h1 className="text-[120px] font-black text-primary leading-none tracking-tighter mb-4 select-none opacity-20">
                    404
                </h1>
                
                <div className="relative z-10">
                    <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-4">
                        Lost in Space?
                    </h2>
                    <p className="text-gray-500 font-medium mb-12 leading-relaxed">
                        The professional horizon you're looking for seems to have moved. Let's get you back on track to your next career milestone.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button 
                            onClick={() => navigate('/')} 
                            className="px-8 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-primary/10 hover:bg-primary-dark hover:shadow-primary/20 transition-all active:scale-95"
                        >
                            Return Home
                        </button>
                        <button 
                            onClick={() => navigate(-1)} 
                            className="px-8 py-4 bg-gray-100 text-gray-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95"
                        >
                            Go Back
                        </button>
                    </div>
                </div>

                <div className="mt-20 flex justify-center gap-12">
                   <div className="text-center">
                       <p className="text-2xl font-black text-gray-900">10k+</p>
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Jobs</p>
                   </div>
                   <div className="text-center">
                       <p className="text-2xl font-black text-gray-900">500+</p>
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Top Companies</p>
                   </div>
                </div>
            </div>
        </div>
    );
}

