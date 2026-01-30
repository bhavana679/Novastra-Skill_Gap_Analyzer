"use client";

import React, { useState, useEffect } from 'react';
import { api } from "@/lib/api";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';
import {
    Target,
    CheckCircle2,
    Clock,
    BookOpen,
    TrendingUp,
    Upload,
    X,
    FileText,
    Loader2
} from 'lucide-react';

export default function ProgressPage() {
    const [showUpload, setShowUpload] = useState(false);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [stats, setStats] = useState({
        completed: 0,
        inProgress: 0,
        remaining: 0,
        skillProficiency: [],
        overallStatus: [],
        categoryDistribution: []
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const data = await api.get("/resume/all");

            if (data.success && data.resumes.length > 0) {
                const latest = data.resumes[0];
                const skills = latest.skills || [];

                const proficiency = [
                    { name: 'Technical', completed: 75 },
                    { name: 'Tools', completed: 60 },
                    { name: 'Soft Skills', completed: 85 }
                ];

                setStats({
                    completed: skills.length,
                    inProgress: Math.ceil(skills.length / 3),
                    remaining: 5,
                    skillProficiency: proficiency,
                    overallStatus: [
                        { name: 'Completed', value: skills.length, color: '#7C6CFF' },
                        { name: 'In-progress', value: Math.ceil(skills.length / 3), color: '#9B8CFF' },
                        { name: 'Remaining', value: 5, color: '#2A2F55' },
                    ],
                    categoryDistribution: [
                        { name: 'Technical', value: 45, color: '#7C6CFF' },
                        { name: 'Soft Skills', value: 25, color: '#9B8CFF' },
                        { name: 'Tools', value: 30, color: '#4F46E5' },
                    ]
                });
            }
        } catch (err) {
            console.error("Failed to fetch progress data", err);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.type === "application/pdf" || selectedFile.type.startsWith("image/")) {
                setFile(selectedFile);
                setError("");
            } else {
                setError("Please upload a PDF or an image file.");
            }
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Please select a file first.");
            return;
        }

        setLoading(true);
        setError("");

        const formData = new FormData();
        formData.append("resume", file);

        try {
            const data = await api.post("/resume/upload", formData);

            if (data.resumeId) {
                setShowUpload(false);
                setFile(null);
                await fetchData();
            } else {
                setError(data.message || "Something went wrong during upload.");
            }
        } catch (err) {
            setError(err.message || "Failed to connect to the server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700 relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-[#EAEAFF]">Progress Tracking</h1>
                    <p className="text-[#B4B8E6]">Monitor your learning journey and skill development analytics.</p>
                </div>
                <button
                    onClick={() => setShowUpload(true)}
                    className="flex items-center justify-center gap-2 bg-[#7C6CFF] hover:bg-[#9B8CFF] text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-[#7C6CFF]/20 active:scale-95 whitespace-nowrap"
                >
                    <Upload size={20} />
                    Upload Resume
                </button>
            </div>

            {showUpload && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="w-full max-w-xl bg-[#11172A] border border-[#2A2F55] rounded-3xl p-8 shadow-2xl relative">
                        <button
                            onClick={() => setShowUpload(false)}
                            className="absolute top-6 right-6 text-[#8A90C2] hover:text-[#EAEAFF] transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-[#EAEAFF]">Update Your Progress</h2>
                            <p className="text-[#B4B8E6] mt-2">Upload a newer version of your resume to refresh your stats.</p>
                        </div>

                        <div className="relative group">
                            <input
                                type="file"
                                className="absolute inset-0 z-10 cursor-pointer opacity-0"
                                accept=".pdf,image/*"
                                onChange={handleFileChange}
                            />
                            <div className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center gap-4 transition-all ${file ? 'border-[#7C6CFF] bg-[#7C6CFF]/5' : 'border-[#2A2F55] group-hover:border-[#7C6CFF]/50'}`}>
                                <div className="w-16 h-16 rounded-full bg-[#7C6CFF]/10 flex items-center justify-center text-[#7C6CFF]">
                                    <FileText size={32} />
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-medium text-[#EAEAFF]">
                                        {file ? file.name : "Click or drag to select file"}
                                    </p>
                                    <p className="text-xs text-[#8A90C2] mt-1">Supports PDF, JPG, PNG (Max 5MB)</p>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center text-sm text-red-400">
                                {error}
                            </div>
                        )}

                        <button
                            onClick={handleUpload}
                            disabled={loading || !file}
                            className="w-full mt-8 flex items-center justify-center gap-2 bg-[#7C6CFF] hover:bg-[#9B8CFF] disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-2xl text-lg font-bold shadow-lg transition-all"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={24} className="animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                "Update Analytics"
                            )}
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#11172A] p-6 rounded-2xl border border-[#2A2F55] flex items-center space-x-4">
                    <div className="p-3 bg-green-500/10 rounded-xl">
                        <CheckCircle2 className="text-green-500" size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-[#B4B8E6]">Completed Skills</p>
                        <h3 className="text-2xl font-bold text-[#EAEAFF]">{stats.completed}</h3>
                    </div>
                </div>

                <div className="bg-[#11172A] p-6 rounded-2xl border border-[#2A2F55] flex items-center space-x-4">
                    <div className="p-3 bg-[#7C6CFF]/10 rounded-xl">
                        <Clock className="text-[#7C6CFF]" size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-[#B4B8E6]">In Progress</p>
                        <h3 className="text-2xl font-bold text-[#EAEAFF]">{stats.inProgress}</h3>
                    </div>
                </div>

                <div className="bg-[#11172A] p-6 rounded-2xl border border-[#2A2F55] flex items-center space-x-4">
                    <div className="p-3 bg-[#2A2F55] rounded-xl">
                        <BookOpen className="text-[#B4B8E6]" size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-[#B4B8E6]">Remaining</p>
                        <h3 className="text-2xl font-bold text-[#EAEAFF]">{stats.remaining}</h3>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-[#11172A] p-8 rounded-3xl border border-[#2A2F55] shadow-xl">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-semibold text-[#EAEAFF] flex items-center gap-2">
                            <TrendingUp size={20} className="text-[#7C6CFF]" />
                            Skill Proficiency
                        </h3>
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.skillProficiency.length > 0 ? stats.skillProficiency : [
                                { name: 'Technical', completed: 0 },
                                { name: 'Tools', completed: 0 },
                                { name: 'Soft Skills', completed: 0 }
                            ]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2A2F55" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    stroke="#8A90C2"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#8A90C2"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `${value}%`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#11172A',
                                        border: '1px solid #2A2F55',
                                        borderRadius: '12px',
                                        color: '#EAEAFF'
                                    }}
                                    itemStyle={{ color: '#EAEAFF' }}
                                />
                                <Bar
                                    dataKey="completed"
                                    name="Proficiency"
                                    fill="#7C6CFF"
                                    radius={[6, 6, 0, 0]}
                                    barSize={40}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-[#11172A] p-8 rounded-3xl border border-[#2A2F55] shadow-xl">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-semibold text-[#EAEAFF] flex items-center gap-2">
                            <Target size={20} className="text-[#7C6CFF]" />
                            Overall Status
                        </h3>
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.overallStatus.length > 0 ? stats.overallStatus : [
                                        { name: 'No Data', value: 1, color: '#2A2F55' }
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={120}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {stats.overallStatus.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#11172A',
                                        border: '1px solid #2A2F55',
                                        borderRadius: '12px'
                                    }}
                                />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    formatter={(value) => <span className="text-[#B4B8E6] text-sm">{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-8">
                <div className="lg:col-span-1 bg-[#11172A] p-8 rounded-3xl border border-[#2A2F55] shadow-xl">
                    <h3 className="text-xl font-semibold text-[#EAEAFF] mb-8">Skill Distribution</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.categoryDistribution.length > 0 ? stats.categoryDistribution : [
                                        { name: 'No Data', value: 1, color: '#2A2F55' }
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    dataKey="value"
                                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                                >
                                    {stats.categoryDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#11172A',
                                        border: '1px solid #2A2F55',
                                        borderRadius: '12px'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="lg:col-span-2 bg-[#11172A] p-8 rounded-3xl border border-[#2A2F55] shadow-xl">
                    <h3 className="text-xl font-semibold text-[#EAEAFF] mb-6">Recent Achievements</h3>
                    <div className="space-y-4">
                        {[
                            { title: "Skill Analysis Complete", date: "Just now", score: "Active" },
                            { title: "React Hooks Mastery", date: "2 days ago", score: "95%" },
                            { title: "Database Optimization", date: "1 week ago", score: "88%" }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-[#0B1020] rounded-2xl border border-[#2A2F55] hover:border-[#7C6CFF]/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#7C6CFF]/10 flex items-center justify-center text-[#7C6CFF]">
                                        <CheckCircle2 size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-[#EAEAFF] font-medium">{item.title}</h4>
                                        <p className="text-xs text-[#8A90C2]">{item.date}</p>
                                    </div>
                                </div>
                                <div className="text-[#7C6CFF] font-bold text-lg">{item.score}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
