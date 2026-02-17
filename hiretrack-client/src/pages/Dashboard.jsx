import axios from 'axios';
import {
    ArrowUpRight, Briefcase, CheckCircle,
    DollarSign, FileText,
    Moon, Plus, Search, Sun,
    Target, Trash2, TrendingUp
} from 'lucide-react';
import { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import UrgencyBadge from '../components/UrgencyBadge';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/jobs';

export default function Dashboard() {
    const [jobs, setJobs] = useState([]);
    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [expandedId, setExpandedId] = useState(null);
    const [form, setForm] = useState({ company: '', role: '', salary: '', notes: '' });

    useEffect(() => { 
        fetchJobs(); 
    }, []);

    const getRelativeTime = (date) => {
        if (!date) return 'No date';
        const now = new Date();
        const applied = new Date(date);
        const diffInSeconds = Math.floor((now - applied) / 1000);
        
        if (isNaN(applied)) return 'Recently';
        if (diffInSeconds < 60) return 'just now';
        
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h ago`;
        
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays === 1) return 'yesterday';
        if (diffInDays < 7) return `${diffInDays} days ago`;
        
        return applied.toLocaleDateString();
    };

    const fetchJobs = async () => {
        try {
            const res = await axios.get(API_URL);
            setJobs(Array.isArray(res.data) ? res.data : []);
        } catch (err) { 
            console.error("Error fetching jobs", err); 
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        const payload = { ...form, salary: Number(form.salary) };
        try {
            await axios.post(API_URL, payload);
            setForm({ company: '', role: '', salary: '', notes: '' });
            fetchJobs();
        } catch (err) { 
            console.error("Failed to add job:", err); 
        }
    };

    const handleUpdate = async (id, status) => {
        try {
            await axios.patch(`${API_URL}/${id}`, { status });
            fetchJobs();
        } catch (err) {
            console.error("Update failed", err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this application?")) {
            try {
                await axios.delete(`${API_URL}/${id}`);
                fetchJobs();
            } catch (err) {
                console.error("Delete failed", err);
            }
        }
    };

    // Stats logic with safe fallback
    const stats = {
        total: jobs.length,
        interviews: jobs.filter(j => ['Interview', 'Offer'].includes(j.status)).length,
        rate: jobs.length > 0 ? ((jobs.filter(j => ['Interview', 'Offer'].includes(j.status)).length / jobs.length) * 100).toFixed(1) : 0,
        pipelineValue: jobs.filter(j => ['Applied', 'Interview'].includes(j.status)).reduce((sum, j) => sum + (Number(j.salary) || 0), 0)
    };

    // FIXED: Corrected variable name from 'search' to 'searchTerm' and added safety checks
    const filteredJobs = jobs.filter(job => {
        const matchesSearch = 
            (job.company?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (job.role?.toLowerCase() || "").includes(searchTerm.toLowerCase());
        
        const matchesFilter = filter === 'All' || job.status === filter;
        
        return matchesSearch && matchesFilter;
    });

    return (
        <div className={`min-h-screen transition-all duration-700 font-sans ${isDarkMode ? 'bg-[#0f172a] text-white' : 'bg-[#F8FAFC] text-slate-900'}`}>
            <div className="max-w-7xl mx-auto py-12 px-6 lg:px-12">

                {/* HEADER */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6 border-b border-slate-200 dark:border-slate-800 pb-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-[0.3em]">
                            <Target size={14} />
                            <span>Sylox</span>
                        </div>
                        <h1 className="text-5xl font-black tracking-tighter">HireTrack<span className="text-emerald-600">_</span></h1>
                    </div>
                    
                    <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className={`p-3 rounded-2xl transition-all shadow-sm ${isDarkMode ? 'bg-slate-800 text-emerald-400 border border-slate-700' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
                    >
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </header>

                {/* HORIZONTAL STATS BAR */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
                    <StatCard title="Applications" value={stats.total} color="blue" icon={<Briefcase size={20} />} />
                    <StatCard title="Interview Rate" value={`${stats.rate}%`} color="green" icon={<TrendingUp size={20} />} />
                    <StatCard title="Interviews" value={stats.interviews} color="purple" icon={<CheckCircle size={20} />} />
                    <StatCard title="Pipeline Value" value={`₹${stats.pipelineValue.toLocaleString()}`} color="blue" icon={<DollarSign size={20} />} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    
                    {/* ASIDE: THE NEW ENTRY CARD */}
                    <aside className="lg:col-span-4">
                        <div className={`p-10 rounded-[3.5rem] border transition-all duration-500 shadow-2xl bg-gradient-to-br from-slate-800 to-[#5459AC] text-white ${isDarkMode ? 'border-slate-700' : 'border-transparent'}`}>
                            <div className="flex items-center justify-between mb-10">
                                <h2 className="text-4xl font-black tracking-tighter">New Entry</h2>
                                <div className="p-1 bg-emerald-500/20 text-emerald-500 rounded-md">
                                    <Plus size={16} />
                                </div>
                            </div>
                            
                            <form onSubmit={handleAdd} className="space-y-8 text-slate-100">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">Company</label>
                                    <input type="text" value={form.company} required 
                                        className={`w-full p-5 rounded-[1.8rem] outline-none transition-all font-medium placeholder:text-slate-500 bg-white/10 border border-white/10 focus:ring-2 focus:ring-emerald-500`}
                                        onChange={e => setForm({ ...form, company: e.target.value })} placeholder="Company Name" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">Role</label>
                                    <input type="text" value={form.role} required 
                                        className={`w-full p-5 rounded-[1.8rem] outline-none transition-all font-medium placeholder:text-slate-500 bg-white/10 border border-white/10 focus:ring-2 focus:ring-emerald-500`}
                                        onChange={e => setForm({ ...form, role: e.target.value })} placeholder="Role" />
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">Salary (₹)</label>
                                    <input type="number" value={form.salary}
                                        className={`w-full p-5 rounded-[1.8rem] outline-none transition-all font-medium placeholder:text-slate-500 bg-white/10 border border-white/10 focus:ring-2 focus:ring-emerald-500`}
                                        onChange={e => setForm({ ...form, salary: e.target.value })} placeholder="Expected Amount" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">Notes</label>
                                    <textarea value={form.notes} 
                                        className={`w-full p-5 rounded-[1.8rem] outline-none transition-all font-medium h-32 resize-none placeholder:text-slate-500 bg-white/10 border border-white/10 focus:ring-2 focus:ring-emerald-500`}
                                        onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Key details..." />
                                </div>

                                <button type="submit" className="w-full py-5 bg-white text-slate-900 rounded-[1.8rem] font-black tracking-widest text-xs hover:bg-emerald-400 transition-all flex items-center justify-center gap-2">
                                    SUBMIT RECORD <ArrowUpRight size={16} />
                                </button>
                            </form>
                        </div>
                    </aside>

                    {/* MAIN CONTENT: JOB LIST */}
                    <main className="lg:col-span-8 space-y-8">
                        <div className="relative group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#5459AC] transition-colors" size={20} />
                            <input
                                type="text"
                                value={searchTerm}
                                placeholder="Search the pipeline..."
                                className={`w-full pl-16 pr-6 py-6 rounded-[2.5rem] border-none shadow-sm outline-none focus:ring-2 focus:ring-[#5459AC] transition-all text-lg ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white'}`}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="space-y-6">
                            {filteredJobs.length === 0 ? (
                                <div className="text-center py-20 opacity-30 font-black uppercase tracking-widest">Pipeline Empty</div>
                            ) : (
                                filteredJobs.map(job => (
                                    <div key={job._id} className={`group p-8 rounded-[3rem] transition-all duration-500 backdrop-blur-md border transform hover:-translate-y-2 ${
                                        isDarkMode 
                                        ? 'bg-slate-900/40 border-slate-800 shadow-2xl' 
                                        : 'bg-white/80 border-white shadow-xl shadow-slate-200/50'
                                    }`}>
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-slate-800 to-[#5459AC] flex items-center justify-center text-white font-black text-3xl shadow-xl">
                                                    {job.company?.[0]?.toUpperCase() || '?'}
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-3">
                                                        <h3 className={`font-black text-2xl tracking-tighter leading-none ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{job.company}</h3>
                                                        <UrgencyBadge date={job.dateApplied} status={job.status} />
                                                    </div>
                                                    <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest opacity-40">
                                                        <span className="text-emerald-600">{job.role}</span>
                                                        <span>•</span>
                                                        <span>{getRelativeTime(job.dateApplied)}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 self-end sm:self-auto">
                                                <select 
                                                    value={job.status} 
                                                    onChange={(e) => handleUpdate(job._id, e.target.value)}
                                                    className={`appearance-none text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-full outline-none cursor-pointer border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                                                >
                                                    {['Applied', 'Interview', 'Offer', 'Rejected'].map(s => <option key={s} value={s} className="bg-white text-slate-900">{s}</option>)}
                                                </select>
                                                
                                                <button onClick={() => setExpandedId(expandedId === job._id ? null : job._id)} 
                                                    className={`p-4 rounded-full transition-all ${expandedId === job._id ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/30' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}>
                                                    <FileText size={20} />
                                                </button>

                                                <button onClick={() => handleDelete(job._id)} className="p-4 text-slate-300 hover:text-red-500 transition-all">
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </div>
                                        
                                        {/* EXPANDED SECTION */}
                                        {expandedId === job._id && (
                                            <div className="mt-8 pt-8 border-t border-slate-200/50 dark:border-slate-800/50">
                                                <div className={`p-8 rounded-[2rem] text-[15px] font-medium leading-relaxed italic ${isDarkMode ? 'bg-slate-950/40 text-slate-300' : 'bg-emerald-50/30 text-slate-600 border border-emerald-100/50'}`}>
                                                    <span className="block text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-3">System Intelligence:</span>
                                                    {job.notes || "No context provided for this application record."}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}