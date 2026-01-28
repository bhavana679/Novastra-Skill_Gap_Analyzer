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
    Cell,
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis
} from "recharts";
import { Zap, Trophy, TrendingUp, Target, ChevronRight, BarChart3 } from "lucide-react";

export default function ProfileDashboard() {
    const [resumeId, setResumeId] = useState("");
    const [skills, setSkills] = useState([
        { name: "React", level: 80 },
        { name: "Node.js", level: 65 },
        { name: "CSS/Tailwind", level: 90 },
        { name: "Database", level: 50 },
        { name: "Deployment", level: 40 },
    ]);

    const [distribution, setDistribution] = useState([
        { name: "Technical", value: 400 },
        { name: "Soft Skills", value: 300 },
        { name: "Theory", value: 200 },
        { name: "Practice", value: 500 },
    ]);

    useEffect(() => {
        const id = localStorage.getItem("resumeId");
        if (id) setResumeId(id);
    }, []);

    const handleUpskill = () => {
        setSkills(prev => prev.map(skill => ({
            ...skill,
            level: Math.min(100, skill.level + Math.floor(Math.random() * 5) + 2)
        })));

        setDistribution(prev => prev.map(item => ({
            ...item,
            value: item.value + Math.floor(Math.random() * 20)
        })));
    };

    const COLORS = ["#7C6CFF", "#9B8CFF", "#B4B8E6", "#8A90C2"];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-textPrimary">Aesthetic Dashboard</h1>
                    <p className="text-textSecondary mt-1 text-lg">Your AI-driven career insights and real-time skill tracking.</p>
                </div>
                <button
                    onClick={handleUpskill}
                    className="flex items-center justify-center space-x-2 px-8 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/30 hover:bg-primarySoft transform transition-all active:scale-95 group"
                >
                    <Zap size={20} className="fill-white group-hover:animate-pulse" />
                    <span>Upskill Now</span>
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Overall Score", value: "84", icon: Trophy, color: "text-yellow-400", bg: "bg-yellow-400/10" },
                    { label: "Skills Gained", value: "12", icon: Zap, color: "text-primary", bg: "bg-primary/10" },
                    { label: "Job Compatibility", value: "92%", icon: Target, color: "text-green-400", bg: "bg-green-400/10" },
                    { label: "Learning Hours", value: "156", icon: TrendingUp, color: "text-blue-400", bg: "bg-blue-400/10" },
                ].map((card, i) => (
                    <div key={i} className="bg-surface border border-border p-6 rounded-3xl shadow-xl hover:border-primary/50 transition-colors group">
                        <div className="flex justify-between items-start">
                            <div className={`${card.bg} ${card.color} p-3 rounded-2xl`}>
                                <card.icon size={24} />
                            </div>
                            <span className="text-xs font-bold text-green-400">+4.2%</span>
                        </div>
                        <div className="mt-4">
                            <p className="text-3xl font-black text-textPrimary group-hover:scale-105 transition-transform origin-left">{card.value}</p>
                            <p className="text-textSecondary text-sm font-medium mt-1">{card.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-surface border border-border rounded-3xl p-8 shadow-xl">
                    <h2 className="text-xl font-bold mb-8 flex items-center space-x-2 text-textPrimary">
                        <BarChart3 size={20} className="text-primary" />
                        <span>Technical Skills Proficiency</span>
                    </h2>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={skills}>
                                <XAxis
                                    dataKey="name"
                                    stroke="#8A90C2"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis hide />
                                <Tooltip
                                    cursor={{ fill: 'rgba(124, 108, 255, 0.05)' }}
                                    contentStyle={{
                                        backgroundColor: "#11172A",
                                        borderColor: "#2A2F55",
                                        color: "#EAEAFF",
                                        borderRadius: "12px"
                                    }}
                                />
                                <Bar
                                    dataKey="level"
                                    fill="#7C6CFF"
                                    radius={[8, 8, 8, 8]}
                                    barSize={40}
                                    animationDuration={1500}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-surface border border-border rounded-3xl p-8 shadow-xl">
                    <h2 className="text-xl font-bold mb-8 text-textPrimary">Skill Distribution</h2>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={distribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={8}
                                    dataKey="value"
                                    stroke="none"
                                    animationBegin={200}
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
                    <div className="space-y-3 mt-6">
                        {distribution.map((item, i) => (
                            <div key={i} className="flex items-center justify-between text-sm">
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                                    <span className="text-textSecondary">{item.name}</span>
                                </div>
                                <span className="text-textPrimary font-bold">{Math.round((item.value / distribution.reduce((a, b) => a + b.value, 0)) * 100)}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <section className="bg-surface border border-border rounded-3xl p-8 shadow-xl">
                    <h2 className="text-xl font-bold mb-6 flex items-center space-x-2">
                        <span>🚀</span>
                        <span>Recommended Next Steps</span>
                    </h2>
                    <div className="space-y-4">
                        {[
                            { title: "Master Kubernetes Basics", time: "4 hours", tag: "DevOps" },
                            { title: "Advanced React Patterns", time: "2 hours", tag: "Frontend" },
                            { title: "System Design Essentials", time: "5 hours", tag: "Architecture" },
                        ].map((step, i) => (
                            <div key={i} className="flex items-center justify-between p-5 bg-background border border-border rounded-2xl hover:border-primary/30 transition-all cursor-pointer group">
                                <div>
                                    <h4 className="font-bold text-textPrimary group-hover:text-primary transition-colors">{step.title}</h4>
                                    <div className="flex items-center space-x-3 mt-1">
                                        <span className="text-xs text-textMuted">{step.time}</span>
                                        <span className="text-[10px] px-2 py-0.5 bg-primary/20 text-primary rounded-full font-bold uppercase tracking-wider">{step.tag}</span>
                                    </div>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-border flex items-center justify-center group-hover:bg-primary transition-colors text-textMuted group-hover:text-white">
                                    <ChevronRight size={16} />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="bg-gradient-to-br from-primary/20 to-surface border border-primary/20 rounded-3xl p-10 shadow-xl flex flex-col items-center justify-center text-center space-y-6">
                    <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center text-4xl shadow-inner animate-bounce">
                        💡
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-textPrimary">Novastra AI Tip</h3>
                        <p className="text-textSecondary mt-2 max-w-sm">
                            Your "Node.js" score is slightly below the target for a Senior Backend role. Focus on database optimization to close the gap!
                        </p>
                    </div>
                    <button className="px-8 py-3 bg-white text-background rounded-xl font-black hover:bg-textPrimary transition-all uppercase tracking-widest text-xs">
                        Show Analysis
                    </button>
                </section>
            </div>
        </div>
    );
}

