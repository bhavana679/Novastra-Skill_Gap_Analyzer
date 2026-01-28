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
    Cell
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
    Settings2
} from "lucide-react";

export default function LearningPathPage() {
    const [loading, setLoading] = useState(true);
    const [refining, setRefining] = useState(false);
    const [pathData, setPathData] = useState(null);
    const [error, setError] = useState("");

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

    const chartData = steps.map((s, i) => ({
        name: s.skill,
        value: s.status === 'COMPLETED' ? 100 : s.status === 'IN_PROGRESS' ? 50 : 10,
    }));

    return (
        <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-primary text-sm font-bold uppercase tracking-[0.2em]">
                        <BrainCircuit size={16} />
                        <span>Interactive Roadmap</span>
                    </div>
                    <h1 className="text-5xl font-black text-textPrimary tracking-tight">Learning Path</h1>
                    <p className="text-textSecondary text-xl max-w-2xl">
                        A dynamic AI-generated curriculum tailored to bridge your skill gaps for the <span className="text-primary font-bold">{pathData?.targetRole}</span> role.
                    </p>
                </div>
                <button
                    onClick={refinePath}
                    disabled={refining}
                    className="flex items-center space-x-3 px-8 py-4 bg-primary text-white rounded-2xl font-black shadow-2xl shadow-primary/40 hover:scale-105 transition-all active:scale-95 disabled:opacity-50"
                >
                    {refining ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Sparkles size={20} />}
                    <span>Refine with AI</span>
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-surface border border-border p-8 rounded-[2rem] shadow-2xl space-y-4 group hover:border-primary/50 transition-colors">
                            <div className="flex justify-between items-start">
                                <div className="p-4 bg-primary/10 rounded-2xl text-primary">
                                    <Award size={28} />
                                </div>
                                <span className="text-4xl font-black text-textPrimary leading-none">{progressPercent}%</span>
                            </div>
                            <div>
                                <p className="text-textPrimary font-bold text-lg">Path Completion</p>
                                <div className="mt-4 h-2 bg-background rounded-full overflow-hidden border border-border">
                                    <div
                                        className="h-full bg-primary shadow-[0_0_15px_rgba(124,108,255,0.5)] transition-all duration-1000"
                                        style={{ width: `${progressPercent}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-2 bg-surface border border-border p-8 rounded-[2rem] shadow-2xl">
                            <div className="flex items-center justify-between mb-6">
                                <p className="text-textPrimary font-bold text-lg">Skill Mastery Overview</p>
                                <div className="flex items-center space-x-4 text-xs font-bold text-textMuted uppercase tracking-widest">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 rounded-full bg-primary" />
                                        <span>Current Depth</span>
                                    </div>
                                </div>
                            </div>
                            <div className="h-[120px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#7C6CFF" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#7C6CFF" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#11172A', border: '1px solid #2A2F55', borderRadius: '12px' }}
                                            itemStyle={{ color: '#EAEAFF' }}
                                        />
                                        <Area type="monotone" dataKey="value" stroke="#7C6CFF" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-2xl font-black text-textPrimary flex items-center space-x-3">
                            <LayoutDashboard className="text-primary" />
                            <span>Curriculum Steps</span>
                        </h2>
                        <div className="space-y-4">
                            {steps.map((step, i) => (
                                <div
                                    key={i}
                                    className={`group relative overflow-hidden bg-surface border transition-all duration-500 rounded-3xl p-8 hover:shadow-2xl ${step.status === 'COMPLETED' ? 'border-primary shadow-lg shadow-primary/10' : 'border-border'
                                        }`}
                                >
                                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="flex items-start space-x-6">
                                            <div className={`mt-1 flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${step.status === 'COMPLETED' ? 'bg-primary text-white' : 'bg-background border border-border text-textMuted group-hover:border-primary/50 group-hover:text-primary'
                                                }`}>
                                                {step.status === 'COMPLETED' ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center space-x-3">
                                                    <h3 className="text-2xl font-black text-textPrimary tracking-tight">{step.skill}</h3>
                                                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${step.level === 'Advanced' ? 'bg-orange-500/20 text-orange-400' :
                                                            step.level === 'Intermediate' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
                                                        }`}>
                                                        {step.level}
                                                    </span>
                                                </div>
                                                <p className="text-textSecondary leading-relaxed max-w-xl">
                                                    Focus on {step.skill} basics combined with practical {pathData?.targetRole} applications.
                                                </p>
                                                <div className="flex items-center space-x-6 pt-2">
                                                    <div className="flex items-center space-x-2 text-textMuted text-xs font-bold uppercase tracking-widest">
                                                        <Clock size={14} className="text-primary" />
                                                        <span>Approx. 4-6 Hours</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2 text-textMuted text-xs font-bold uppercase tracking-widest">
                                                        <Settings2 size={14} className="text-primary" />
                                                        <span>Step #{step.order}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <button
                                                onClick={() => updateProgress(step.skill, step.status === 'COMPLETED' ? 'IN_PROGRESS' : 'COMPLETED')}
                                                className={`px-6 py-3 rounded-xl font-black text-sm transition-all whitespace-nowrap ${step.status === 'COMPLETED'
                                                        ? 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white'
                                                        : 'bg-primary text-white shadow-xl shadow-primary/20 hover:scale-105 active:scale-95'
                                                    }`}
                                            >
                                                {step.status === 'COMPLETED' ? 'Mark Incomplete' : 'Complete Step'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <aside className="space-y-8">
                    <div className="bg-gradient-to-br from-primary to-primarySoft p-1 rounded-[2.5rem] shadow-2xl shadow-primary/30 group">
                        <div className="bg-surface rounded-[2.3rem] p-8 space-y-6">
                            <h3 className="text-2xl font-black text-textPrimary tracking-tight">AI Insights</h3>
                            <p className="text-textSecondary leading-relaxed italic text-sm">
                                "Based on the current market trends for {pathData?.targetRole} roles, mastering {steps[0]?.skill || 'the first step'} is your highest priority to unlock 80% of technical interviews."
                            </p>
                            <div className="pt-4 border-t border-border flex items-center justify-between">
                                <span className="text-xs font-bold text-textMuted uppercase tracking-widest">Powered by Novastra AI</span>
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-8 h-8 rounded-full bg-background border border-surface flex items-center justify-center text-[10px] font-bold text-primary">AI</div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-surface border border-border p-8 rounded-[2rem] shadow-2xl space-y-6">
                        <h3 className="text-xl font-black text-textPrimary">Suggested Resources</h3>
                        <div className="space-y-4">
                            {[
                                { title: "Advanced React Guide", meta: "Full Course", color: "text-blue-400" },
                                { title: "System Design for High Scale", meta: "E-Book", color: "text-orange-400" },
                            ].map((res, i) => (
                                <div key={i} className="flex items-center justify-between group cursor-pointer">
                                    <div className="space-y-1">
                                        <p className="font-bold text-textPrimary group-hover:text-primary transition-colors">{res.title}</p>
                                        <p className="text-[10px] font-black text-textMuted uppercase tracking-[0.2em]">{res.meta}</p>
                                    </div>
                                    <ArrowRight size={16} className="text-textMuted group-hover:text-primary transition-all translate-x-0 group-hover:translate-x-2" />
                                </div>
                            ))}
                        </div>
                        <button className="w-full py-4 text-xs font-black uppercase tracking-[0.2em] text-primary border border-primary/20 rounded-2xl hover:bg-primary/5 transition-all">
                            Browse All Library
                        </button>
                    </div>
                </aside>
            </div>
        </div>
    );
}
