"use client";

import { useEffect, useState } from "react";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    BarChart,
    Bar,
    Cell,
    CartesianGrid
} from "recharts";
import {
    Zap,
    CheckCircle2,
    Circle,
    Clock,
    Award,
    Sparkles,
    ArrowRight,
    ChevronRight,
    LayoutDashboard,
    BrainCircuit,
    Settings2,
    ExternalLink,
    BookOpen,
    Youtube,
    Globe,
    Library,
    Flame,
    Medal,
    GraduationCap,
    TrendingUp,
    Target
} from "lucide-react";

export default function LearningPathPage() {
    const [loading, setLoading] = useState(true);
    const [refining, setRefining] = useState(false);
    const [pathData, setPathData] = useState(null);
    const [error, setError] = useState("");
    const [streak, setStreak] = useState(7);

    const platforms = [
        { name: "Coursera", icon: Globe, url: "https://www.coursera.org", color: "text-blue-500", bg: "bg-blue-500/10" },
        { name: "Udemy", icon: Youtube, url: "https://www.udemy.com", color: "text-purple-500", bg: "bg-purple-500/10" },
        { name: "YouTube", icon: Youtube, url: "https://www.youtube.com", color: "text-red-500", bg: "bg-red-500/10" },
        { name: "MDN Docs", icon: BookOpen, url: "https://developer.mozilla.org", color: "text-yellow-500", bg: "bg-yellow-500/10" },
        { name: "LinkedIn", icon: Library, url: "https://www.linkedin.com/learning", color: "text-blue-600", bg: "bg-blue-600/10" },
    ];

    const activityData = [
        { day: "Mon", effort: 45 },
        { day: "Tue", effort: 80 },
        { day: "Wed", effort: 65 },
        { day: "Thu", effort: 90 },
        { day: "Fri", effort: 40 },
        { day: "Sat", effort: 120 },
        { day: "Sun", effort: 100 },
    ];

    const certifications = [
        { title: "Meta Front-End Developer", issuer: "Coursera", date: "Jan 2026", icon: "🛡️" },
        { title: "AWS Cloud Practitioner", issuer: "Amazon", date: "Dec 2025", icon: "☁️" },
    ];

    const completedCourses = [
        { title: "React Design Patterns", platform: "Frontend Masters", duration: "12 hours" },
        { title: "Modern Next.js Architecture", platform: "Novastra", duration: "8 hours" },
    ];

    const fetchData = async () => {
        const resumeId = localStorage.getItem("resumeId");
        if (!resumeId) {
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`http://localhost:5001/api/learning-path/${resumeId}`);
            const json = await response.json();
            if (json.success) {
                setPathData(json.data);
            }
        } catch (err) {
            setError("Connect to backend to see your live roadmap.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const updateProgress = async (skill, newStatus) => {
        const resumeId = localStorage.getItem("resumeId");
        try {
            const response = await fetch("http://localhost:5001/api/learning-path/progress", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ resumeId, skill, status: newStatus }),
            });
            if (response.ok) {
                fetchData();
            }
        } catch (err) {
            console.error("Failed to update progress");
        }
    };

    const refinePath = async () => {
        const resumeId = localStorage.getItem("resumeId");
        setRefining(true);
        try {
            const response = await fetch("http://localhost:5001/api/learning-path/refine", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ resumeId }),
            });
            if (response.ok) {
                fetchData();
            }
        } catch (err) {
            console.error("Refinement failed");
        } finally {
            setRefining(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-textSecondary animate-pulse">Building your personalized path...</p>
            </div>
        );
    }

    const steps = pathData?.steps || [];
    const completedCount = steps.filter(s => s.status === 'COMPLETED').length;
    const progressPercent = steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 0;

    const chartData = steps.map((s) => ({
        name: s.skill,
        progress: s.status === 'COMPLETED' ? 100 : s.status === 'IN_PROGRESS' ? 50 : 10,
    }));

    return (
        <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2 text-primary text-sm font-bold uppercase tracking-[0.2em]">
                            <BrainCircuit size={16} />
                            <span>AI Evolution</span>
                        </div>
                        <div className="flex items-center bg-orange-500/10 text-orange-500 px-4 py-1.5 rounded-full text-sm font-black border border-orange-500/20">
                            <Flame size={18} className="mr-1 fill-orange-500" />
                            <span>{streak} DAY STREAK</span>
                        </div>
                    </div>
                    <h1 className="text-5xl font-black text-textPrimary tracking-tight italic">Roadmap <span className="text-primary hover:text-primarySoft transition-colors">Mastery</span></h1>
                    <p className="text-textSecondary text-xl max-w-2xl leading-relaxed">
                        Personalized gap analysis for <span className="text-primary font-bold">{pathData?.targetRole}</span>.
                        Keep up the heat! You're in the top 5% today.
                    </p>
                </div>
                <button
                    onClick={refinePath}
                    disabled={refining}
                    className="group relative flex items-center space-x-3 px-10 py-5 bg-primary text-white rounded-[2rem] font-black shadow-[0_20px_40px_rgba(124,108,255,0.3)] hover:shadow-[0_25px_50px_rgba(124,108,255,0.4)] transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50 overflow-hidden"
                >
                    {refining ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Sparkles size={20} />}
                    <span>Evolve Path</span>
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 text-textPrimary">
                <div className="lg:col-span-3 space-y-10">

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-surface border border-border p-8 rounded-[3rem] shadow-2xl flex flex-col justify-between group hover:border-primary/50 transition-all">
                            <div className="flex justify-between items-start">
                                <div className="p-4 bg-primary/10 rounded-2xl text-primary">
                                    <TrendingUp size={28} />
                                </div>
                                <span className="text-4xl font-black leading-none">{progressPercent}%</span>
                            </div>
                            <div className="mt-8 space-y-4">
                                <p className="font-bold text-xl">Overall Growth</p>
                                <div className="h-2.5 bg-background rounded-full overflow-hidden border border-border">
                                    <div className="h-full bg-primary shadow-[0_0_15px_rgba(124,108,255,0.6)] transition-all duration-1000" style={{ width: `${progressPercent}%` }} />
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-2 bg-surface border border-border p-8 rounded-[3rem] shadow-2xl flex flex-col">
                            <div className="flex items-center justify-between mb-8">
                                <p className="font-extrabold text-xl flex items-center gap-2">
                                    <Target size={20} className="text-primary" /> Activity Tracker
                                </p>
                                <span className="text-[10px] font-black uppercase tracking-widest text-textMuted">Weekly Effort</span>
                            </div>
                            <div className="h-[140px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={activityData}>
                                        <Tooltip
                                            cursor={{ fill: 'rgba(124, 108, 255, 0.05)' }}
                                            contentStyle={{ backgroundColor: '#11172A', border: '1px solid #2A2F55', borderRadius: '16px' }}
                                        />
                                        <Bar dataKey="effort" fill="#7C6CFF" radius={[6, 6, 0, 0]} barSize={24}>
                                            {activityData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={index === 5 ? "#9B8CFF" : "#7C6CFF"} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    <div className="bg-surface border border-border p-10 rounded-[3.5rem] shadow-2xl space-y-10">
                        <h2 className="text-3xl font-black flex items-center gap-4">
                            <Medal className="text-primary" /> Certifications & Achievements
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {certifications.map((cert, i) => (
                                <div key={i} className="bg-background border border-border p-6 rounded-[2rem] flex items-center gap-6 hover:border-primary/40 transition-all group">
                                    <div className="text-4xl group-hover:scale-110 transition-transform">{cert.icon}</div>
                                    <div>
                                        <h4 className="font-black text-lg">{cert.title}</h4>
                                        <p className="text-textSecondary text-xs font-bold uppercase tracking-widest mt-1">{cert.issuer} • {cert.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-surface border border-border p-10 rounded-[3.5rem] shadow-2xl space-y-10">
                        <h2 className="text-3xl font-black flex items-center gap-4">
                            <GraduationCap className="text-primary" /> Completed Courses
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {completedCourses.map((course, i) => (
                                <div key={i} className="bg-background border border-border p-6 rounded-[2rem] flex items-center justify-between hover:border-primary/40 transition-all group">
                                    <div className="space-y-1">
                                        <h4 className="font-black text-lg group-hover:text-primary transition-colors">{course.title}</h4>
                                        <p className="text-textSecondary text-xs">{course.platform}</p>
                                    </div>
                                    <div className="text-primary bg-primary/10 px-4 py-2 rounded-xl text-xs font-black">
                                        {course.duration}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-surface border border-border p-10 rounded-[3.5rem] shadow-2xl space-y-10">
                        <h2 className="text-3xl font-black flex items-center gap-4">
                            <Library className="text-primary" /> Learning Eco-System
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                            {platforms.map((platform, i) => {
                                const Icon = platform.icon;
                                return (
                                    <a
                                        key={i}
                                        href={platform.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex flex-col items-center justify-center p-8 rounded-[2.5rem] bg-background border border-border hover:border-primary/40 hover:-translate-y-2 transition-all group"
                                    >
                                        <div className={`p-5 rounded-2xl ${platform.bg} ${platform.color} group-hover:rotate-12 transition-all`}>
                                            <Icon size={28} />
                                        </div>
                                        <span className="mt-4 text-xs font-black text-textSecondary group-hover:text-textPrimary tracking-widest">{platform.name}</span>
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-8">
                        <h2 className="text-4xl font-black flex items-center gap-4">
                            <LayoutDashboard className="text-primary" /> Path Breakdown
                        </h2>
                        <div className="grid gap-8">
                            {steps.map((step, i) => (
                                <div
                                    key={i}
                                    className={`group bg-surface border-2 transition-all duration-500 rounded-[3rem] p-10 hover:shadow-2xl ${step.status === 'COMPLETED' ? 'border-primary/30' : 'border-border'
                                        }`}
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                                        <div className="flex items-start gap-8">
                                            <div className={`shrink-0 w-20 h-20 rounded-[2rem] flex items-center justify-center transition-all ${step.status === 'COMPLETED' ? 'bg-primary text-white shadow-lg shadow-primary/30 rotate-12' : 'bg-background border-2 border-border text-textMuted group-hover:border-primary group-hover:text-primary'
                                                }`}>
                                                {step.status === 'COMPLETED' ? <CheckCircle2 size={40} /> : <Circle size={40} />}
                                            </div>
                                            <div className="space-y-4">
                                                <div className="flex flex-wrap items-center gap-4">
                                                    <h3 className="text-4xl font-black tracking-tight">{step.skill}</h3>
                                                    <span className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest border ${step.level === 'Advanced' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                                                            step.level === 'Intermediate' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'
                                                        }`}>
                                                        {step.level}
                                                    </span>
                                                </div>
                                                <p className="text-textSecondary text-xl font-medium leading-relaxed max-w-2xl">
                                                    Strategic mastery of {step.skill} specifically optimized for high-performance {pathData?.targetRole} output.
                                                </p>
                                                <div className="flex items-center gap-10 pt-4 border-t border-border/30 w-fit">
                                                    <div className="flex items-center space-x-2 text-textMuted text-xs font-bold uppercase tracking-widest">
                                                        <Clock size={16} className="text-primary" />
                                                        <span>Level Up in 5h</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => updateProgress(step.skill, step.status === 'COMPLETED' ? 'NOT_STARTED' : 'COMPLETED')}
                                            className={`px-12 py-5 rounded-2xl font-black text-lg transition-all active:scale-95 ${step.status === 'COMPLETED'
                                                    ? 'bg-primary/10 text-primary border-2 border-primary/20 hover:bg-primary hover:text-white'
                                                    : 'bg-primary text-white shadow-2xl shadow-primary/30 hover:bg-primarySoft'
                                                }`}
                                        >
                                            {step.status === 'COMPLETED' ? 'Review Skill' : 'Master Skill'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <aside className="space-y-10">
                    <div className="bg-primary border-4 border-primarySoft rounded-[3rem] p-10 text-white space-y-6 shadow-2xl shadow-primary/40 relative group">
                        <Sparkles className="absolute top-6 right-6 opacity-40 group-hover:rotate-45 transition-transform" size={40} />
                        <h3 className="text-3xl font-black italic">AI Insight</h3>
                        <p className="text-white/80 leading-relaxed font-bold text-lg">
                            "Mastering <span className="underline decoration-white/40">{steps[0]?.skill}</span> will increase your interview success rate for Senior {pathData?.targetRole} roles by 24%."
                        </p>
                        <div className="pt-6 border-t border-white/20">
                            <span className="text-[10px] font-black uppercase tracking-widest">Growth Factor: Critical</span>
                        </div>
                    </div>

                    <div className="bg-surface border border-border p-10 rounded-[3rem] shadow-2xl space-y-8">
                        <h3 className="text-2xl font-black flex items-center gap-3">
                            <Zap size={24} className="text-primary" /> Quick Resources
                        </h3>
                        <div className="space-y-6">
                            {[
                                { title: "Mastering Node.js Clusters", type: "Article", time: "12m", platform: "Medium" },
                                { title: "React Context vs Redux", type: "Video", time: "25m", platform: "YouTube" },
                                { title: "Kubernetes for Humans", type: "E-Book", time: "Daily", platform: "Technical" },
                                { title: "System Design Cheat-Sheet", type: "PDF", time: "5m", platform: "Internal" },
                            ].map((res, i) => (
                                <div key={i} className="flex items-center justify-between group cursor-pointer border-b border-border/50 pb-4 last:border-0 last:pb-0">
                                    <div className="space-y-1">
                                        <p className="font-extrabold text-base group-hover:text-primary transition-all truncate max-w-[150px]">{res.title}</p>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-[10px] font-black text-textMuted uppercase tracking-widest">{res.platform}</span>
                                            <span className="text-[10px] font-bold text-primary">{res.time}</span>
                                        </div>
                                    </div>
                                    <ChevronRight size={18} className="text-textMuted group-hover:text-primary transition-all group-hover:translate-x-1" />
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
