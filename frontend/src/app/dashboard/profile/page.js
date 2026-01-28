"use client";

import { useEffect, useState } from "react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    PieChart,
    Pie,
    Cell
} from "recharts";
import { Zap, Trophy, TrendingUp, Target, ChevronRight, BarChart3, Clock, FileText, Briefcase } from "lucide-react";

export default function ProfileDashboard() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [resumeData, setResumeData] = useState(null);
    const [learningPath, setLearningPath] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const resumeId = localStorage.getItem("resumeId");
            if (!resumeId) {
                setLoading(false);
                return;
            }

            try {
                const [resumeRes, pathRes] = await Promise.all([
                    fetch(`http://localhost:5001/api/resume/${resumeId}`),
                    fetch(`http://localhost:5001/api/learning-path/${resumeId}`)
                ]);

                const resumeJson = await resumeRes.json();
                const pathJson = await pathRes.json();

                if (resumeJson.success) setResumeData(resumeJson.resume);
                if (pathJson.success) setLearningPath(pathJson.data);

            } catch (err) {
                setError("Failed to fetch profile data. Please check your connection.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-textSecondary animate-pulse">Fetching your AI career profile...</p>
            </div>
        );
    }

    const steps = learningPath?.steps || [];
    const totalSteps = steps.length;
    const completedSteps = steps.filter(s => s.status === 'COMPLETED').length;
    const inProgressSteps = steps.filter(s => s.status === 'IN_PROGRESS').length;
    const completionRate = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

    const distribution = [
        { name: "Completed", value: completedSteps || 1 },
        { name: "In Progress", value: inProgressSteps || 0 },
        { name: "Pending", value: (totalSteps - completedSteps - inProgressSteps) || 0 }
    ];

    const COLORS = ["#7C6CFF", "#9B8CFF", "#2A2F55"];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-textPrimary">Your Profile</h1>
                    <p className="text-textSecondary mt-1 text-lg">Real-time career analysis and learning progress.</p>
                </div>
                <div className="bg-primary/10 border border-primary/20 px-6 py-3 rounded-2xl flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-bold text-textPrimary uppercase tracking-widest">Analysis System Active</span>
                </div>
            </header>

            {/* Meta Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-surface border border-border p-6 rounded-3xl shadow-xl">
                    <div className="bg-primary/10 text-primary p-3 rounded-2xl w-fit">
                        <Target size={24} />
                    </div>
                    <div className="mt-4">
                        <p className="text-2xl font-black text-textPrimary truncate">{resumeData?.targetRole || "Not Set"}</p>
                        <p className="text-textSecondary text-sm font-medium">Target Role</p>
                    </div>
                </div>

                <div className="bg-surface border border-border p-6 rounded-3xl shadow-xl">
                    <div className="bg-blue-400/10 text-blue-400 p-3 rounded-2xl w-fit">
                        <Briefcase size={24} />
                    </div>
                    <div className="mt-4">
                        <p className="text-2xl font-black text-textPrimary">{resumeData?.experienceLevel || "Unknown"}</p>
                        <p className="text-textSecondary text-sm font-medium">Experience Level</p>
                    </div>
                </div>

                <div className="bg-surface border border-border p-6 rounded-3xl shadow-xl">
                    <div className="bg-purple-400/10 text-purple-400 p-3 rounded-2xl w-fit">
                        <FileText size={24} />
                    </div>
                    <div className="mt-4">
                        <p className="text-2xl font-black text-textPrimary">v{resumeData?.version || "1.0"}</p>
                        <p className="text-textSecondary text-sm font-medium">Resume Version</p>
                    </div>
                </div>

                <div className="bg-surface border border-border p-6 rounded-3xl shadow-xl">
                    <div className="bg-yellow-400/10 text-yellow-400 p-3 rounded-2xl w-fit">
                        <TrendingUp size={24} />
                    </div>
                    <div className="mt-4">
                        <p className="text-2xl font-black text-textPrimary">{completionRate}%</p>
                        <p className="text-textSecondary text-sm font-medium">Completion Rate</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Progress Chart */}
                <div className="lg:col-span-2 bg-surface border border-border rounded-3xl p-8 shadow-xl">
                    <h2 className="text-xl font-bold mb-8 flex items-center space-x-2 text-textPrimary">
                        <BarChart3 size={20} className="text-primary" />
                        <span>Learning Path Progress</span>
                    </h2>
                    <div className="space-y-6">
                        {steps.length > 0 ? (
                            steps.map((step, i) => (
                                <div key={i} className="group">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-textPrimary font-semibold">{step.skill}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase ${step.status === 'COMPLETED' ? 'bg-green-400/10 text-green-400' :
                                                step.status === 'IN_PROGRESS' ? 'bg-primary/10 text-primary' : 'bg-border text-textMuted'
                                            }`}>
                                            {step.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <div className="h-2 w-full bg-background rounded-full overflow-hidden border border-border/50">
                                        <div
                                            className={`h-full transition-all duration-1000 ${step.status === 'COMPLETED' ? 'bg-green-400' :
                                                    step.status === 'IN_PROGRESS' ? 'bg-primary animate-pulse' : 'bg-border'
                                                }`}
                                            style={{ width: step.status === 'COMPLETED' ? '100%' : step.status === 'IN_PROGRESS' ? '50%' : '5%' }}
                                        ></div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-20 border-2 border-dashed border-border rounded-2xl">
                                <p className="text-textMuted">No learning path generated yet.</p>
                                <button className="mt-4 text-primary font-bold hover:underline">Generate Roadmap</button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Distribution Chart */}
                <div className="bg-surface border border-border rounded-3xl p-8 shadow-xl flex flex-col items-center">
                    <h2 className="text-xl font-bold mb-8 text-textPrimary self-start">Progress Summary</h2>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={distribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {distribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#11172A",
                                        borderColor: "#2A2F55",
                                        color: "#EAEAFF",
                                        borderRadius: "12px"
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="w-full space-y-4 mt-6">
                        {distribution.map((item, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                                    <span className="text-textSecondary text-sm">{item.name}</span>
                                </div>
                                <span className="text-textPrimary font-bold text-sm">
                                    {item.name === "Completed" ? completedSteps :
                                        item.name === "In Progress" ? inProgressSteps :
                                            (totalSteps - completedSteps - inProgressSteps)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* File Info */}
            <section className="bg-gradient-to-br from-surface to-background border border-border rounded-3xl p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center space-x-6">
                    <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center text-primary">
                        <FileText size={32} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-textPrimary">{resumeData?.fileName || "Resume.pdf"}</h3>
                        <p className="text-textMuted text-sm">Last updated {resumeData ? new Date(resumeData.createdAt).toLocaleDateString() : "N/A"}</p>
                    </div>
                </div>
                <button className="px-8 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/25 hover:bg-primarySoft transition-all active:scale-95">
                    Replace Resume
                </button>
            </section>
        </div>
    );
}
