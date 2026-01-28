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
    Library
} from "lucide-react";

export default function LearningPathPage() {
    const [loading, setLoading] = useState(true);
    const [refining, setRefining] = useState(false);
    const [pathData, setPathData] = useState(null);
    const [error, setError] = useState("");

    const platforms = [
        { name: "Coursera", icon: Globe, url: "https://www.coursera.org", color: "text-blue-500", bg: "bg-blue-500/10" },
        { name: "Udemy", icon: PlayCircle, url: "https://www.udemy.com", color: "text-purple-500", bg: "bg-purple-500/10" },
        { name: "YouTube", icon: Youtube, url: "https://www.youtube.com", color: "text-red-500", bg: "bg-red-500/10" },
        { name: "MDN Docs", icon: BookOpen, url: "https://developer.mozilla.org", color: "text-yellow-500", bg: "bg-yellow-500/10" },
        { name: "LinkedIn", icon: Library, url: "https://www.linkedin.com/learning", color: "text-blue-600", bg: "bg-blue-600/10" },
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
            console.error("Refinment failed");
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
        level: s.level === 'Advanced' ? 3 : s.level === 'Intermediate' ? 2 : 1
    }));

    return (
        <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-primary text-sm font-bold uppercase tracking-[0.2em]">
                        <BrainCircuit size={16} />
                        <span>AI Powered Curriculum</span>
                    </div>
                    <h1 className="text-5xl font-black text-textPrimary tracking-tight">Learning Roadmap</h1>
                    <p className="text-textSecondary text-xl max-w-2xl leading-relaxed">
                        Your personalized guide to mastering <span className="text-primary font-bold">{pathData?.targetRole}</span>.
                        Track your progress and access premium resources.
                    </p>
                </div>
                <button
                    onClick={refinePath}
                    disabled={refining}
                    className="group relative flex items-center space-x-3 px-10 py-5 bg-primary text-white rounded-[2rem] font-black shadow-[0_20px_40px_rgba(124,108,255,0.3)] hover:shadow-[0_25px_50px_rgba(124,108,255,0.4)] transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    {refining ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Sparkles size={20} />}
                    <span>Re-Generate Path</span>
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                <div className="lg:col-span-3 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-surface border border-border p-10 rounded-[3rem] shadow-2xl space-y-6 group hover:border-primary/50 transition-all">
                            <div className="flex justify-between items-start">
                                <div className="p-5 bg-primary/10 rounded-2xl text-primary group-hover:scale-110 transition-transform">
                                    <Award size={32} />
                                </div>
                                <div className="text-right">
                                    <span className="text-5xl font-black text-textPrimary leading-none">{progressPercent}%</span>
                                    <p className="text-textMuted text-xs font-bold uppercase tracking-widest mt-2">{completedCount}/{steps.length} Steps</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <p className="text-textPrimary font-bold text-xl tracking-tight">Overall Progress</p>
                                <div className="h-2.5 bg-background rounded-full overflow-hidden border border-border">
                                    <div
                                        className="h-full bg-primary shadow-[0_0_15px_rgba(124,108,255,0.6)] transition-all duration-1000 ease-out"
                                        style={{ width: `${progressPercent}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-2 bg-surface border border-border p-10 rounded-[3rem] shadow-2xl flex flex-col">
                            <div className="flex items-center justify-between mb-8 text-textPrimary">
                                <p className="font-extrabold text-xl tracking-tight">Performance Analytics</p>
                                <div className="flex items-center space-x-6 text-[10px] font-black uppercase tracking-widest text-textMuted">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2.5 h-2.5 rounded-sm bg-primary" />
                                        <span>Skill Progress</span>
                                    </div>
                                </div>
                            </div>
                            <div className="h-[140px] w-full mt-auto">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData}>
                                        <Tooltip
                                            cursor={{ fill: 'rgba(124, 108, 255, 0.05)' }}
                                            contentStyle={{ backgroundColor: '#11172A', border: '1px solid #2A2F55', borderRadius: '16px', fontWeight: 'bold' }}
                                        />
                                        <Bar dataKey="progress" fill="#7C6CFF" radius={[6, 6, 0, 0]} barSize={32}>
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fillOpacity={entry.progress / 100 + 0.2} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    <div className="bg-surface border border-border p-10 rounded-[3rem] shadow-2xl">
                        <h2 className="text-2xl font-black text-textPrimary mb-8 flex items-center space-x-4">
                            <Library className="text-primary" />
                            <span>Recommended Platforms</span>
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
                                        className="flex flex-col items-center justify-center p-6 rounded-3xl bg-background border border-border hover:border-primary/40 hover:-translate-y-2 transition-all group"
                                    >
                                        <div className={`p-4 rounded-2xl ${platform.bg} ${platform.color} group-hover:scale-110 transition-transform`}>
                                            <Icon size={24} />
                                        </div>
                                        <span className="mt-4 text-xs font-black text-textSecondary group-hover:text-textPrimary transition-colors uppercase tracking-widest">{platform.name}</span>
                                        <ExternalLink size={12} className="mt-2 text-textMuted group-hover:text-primary transition-colors" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-8">
                        <h2 className="text-3xl font-black text-textPrimary flex items-center space-x-4">
                            <LayoutDashboard className="text-primary" />
                            <span>Mastery Checklist</span>
                        </h2>
                        <div className="grid gap-6">
                            {steps.map((step, i) => (
                                <div
                                    key={i}
                                    className={`group relative bg-surface border-2 transition-all duration-500 rounded-[2.5rem] p-10 hover:shadow-[0_30px_60px_rgba(0,0,0,0.3)] ${step.status === 'COMPLETED' ? 'border-primary/40' : 'border-border'
                                        }`}
                                >
                                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                                        <div className="flex items-start space-x-8">
                                            <div className={`mt-1 shrink-0 w-16 h-16 rounded-3xl flex items-center justify-center transition-all ${step.status === 'COMPLETED' ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/30' : 'bg-background border-2 border-border text-textMuted group-hover:border-primary group-hover:text-primary'
                                                }`}>
                                                {step.status === 'COMPLETED' ? <CheckCircle2 size={32} /> : <Circle size={32} />}
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex flex-wrap items-center gap-4">
                                                    <h3 className="text-3xl font-black text-textPrimary tracking-tight">{step.skill}</h3>
                                                    <span className={`px-5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${step.level === 'Advanced' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                                                            step.level === 'Intermediate' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'
                                                        }`}>
                                                        {step.level} Level
                                                    </span>
                                                </div>
                                                <p className="text-textSecondary text-lg leading-relaxed max-w-2xl">
                                                    Comprehensive training on {step.skill}. Aim for high proficiency to match {pathData?.targetRole} industry standards.
                                                </p>
                                                <div className="flex items-center gap-8 pt-4">
                                                    <div className="flex items-center space-x-2 text-textMuted text-xs font-bold uppercase tracking-widest">
                                                        <Clock size={16} className="text-primary" />
                                                        <span>8-12 Modules</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2 text-textMuted text-xs font-bold uppercase tracking-widest">
                                                        <ArrowRight size={16} className="text-primary" />
                                                        <span>Step No. {step.order}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => updateProgress(step.skill, step.status === 'COMPLETED' ? 'NOT_STARTED' : 'COMPLETED')}
                                            className={`px-10 py-5 rounded-2xl font-black text-sm transition-all shadow-xl active:scale-95 ${step.status === 'COMPLETED'
                                                    ? 'bg-primary/10 text-primary border-2 border-primary/20 hover:bg-primary hover:text-white'
                                                    : 'bg-primary text-white hover:bg-primarySoft hover:shadow-primary/30'
                                                }`}
                                        >
                                            {step.status === 'COMPLETED' ? 'Start Over' : 'Mark as Mastered'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <aside className="space-y-10">
                    <div className="bg-primary/5 border border-primary/20 rounded-[3rem] p-10 space-y-8 relative overflow-hidden group">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all" />
                        <h3 className="text-2xl font-black text-textPrimary tracking-tight flex items-center gap-3">
                            <Sparkles size={24} className="text-primary" />
                            <span>AI Strategist</span>
                        </h3>
                        <p className="text-textSecondary leading-relaxed text-lg font-medium">
                            "You are already ahead of 65% of applicants. Master <span className="text-primary">{steps[0]?.skill}</span> this week to qualify for high-tier technical assessments."
                        </p>
                        <div className="space-y-4 pt-6 mt-6 border-t border-border">
                            <p className="text-xs font-black text-textMuted uppercase tracking-widest">Growth Forecast</p>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-textPrimary">Next Week</span>
                                <span className="text-green-400 font-black">+18%</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-surface border border-border p-10 rounded-[3rem] shadow-2xl space-y-8">
                        <h3 className="text-xl font-black text-textPrimary flex items-center gap-3">
                            <Library size={20} className="text-primary" />
                            <span>Quick Resources</span>
                        </h3>
                        <div className="space-y-6">
                            {[
                                { title: "Node.js Best Practices", time: "15m read", platform: "Medium" },
                                { title: "React Performance", time: "2h course", platform: "YouTube" },
                                { title: "Database Schema Design", time: "E-Book", platform: "O'Reilly" },
                            ].map((res, i) => (
                                <div key={i} className="flex items-center justify-between group cursor-pointer border-b border-border/50 pb-4 last:border-0 last:pb-0">
                                    <div className="space-y-1">
                                        <p className="font-extrabold text-textPrimary group-hover:text-primary transition-all truncate max-w-[150px]">{res.title}</p>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-[10px] font-black text-textMuted uppercase tracking-widest">{res.platform}</span>
                                            <span className="text-[8px] text-border">•</span>
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

const PlayCircle = ({ size, className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" />
    </svg>
);
