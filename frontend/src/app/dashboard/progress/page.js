"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
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
    const router = useRouter();
    const [showUpload, setShowUpload] = useState(false);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [pathData, setPathData] = useState(null);
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
        setLoadingData(true);
        try {
            const resumeId = localStorage.getItem("resumeId");
            if (!resumeId) {
                // Try to find the latest resume if Id is missing
                const resumesResponse = await api.get("/resume/all");
                if (resumesResponse.success && resumesResponse.resumes.length > 0) {
                    const latest = resumesResponse.resumes[0];
                    localStorage.setItem("resumeId", latest._id);
                    await fetchPathDetails(latest._id);
                } else {
                    setLoadingData(false);
                }
                return;
            }
            await fetchPathDetails(resumeId);
        } catch (err) {
            console.error("Failed to fetch progress data", err);
            setLoadingData(false);
        }
    };

    const fetchPathDetails = async (resumeId) => {
        try {
            const pathJson = await api.get(`/learning-path/${resumeId}`);
            if (pathJson.success) {
                const path = pathJson.data;
                setPathData(path);

                const steps = path.steps || [];
                const completed = steps.filter(s => s.status === 'COMPLETED').length;
                const inProgress = steps.filter(s => s.status === 'IN_PROGRESS').length;
                const remaining = steps.length - completed - inProgress;

                // Create dynamic proficiency based on levels
                const levels = ['Beginner', 'Intermediate', 'Advanced'];
                const proficiency = levels.map(level => {
                    const levelSteps = steps.filter(s => s.level === level);
                    const levelCompleted = levelSteps.filter(s => s.status === 'COMPLETED').length;
                    const percent = levelSteps.length > 0 ? Math.round((levelCompleted / levelSteps.length) * 100) : 0;
                    return { name: level, completed: percent };
                });

                setStats({
                    completed,
                    inProgress,
                    remaining,
                    skillProficiency: proficiency,
                    overallStatus: [
                        { name: 'Completed', value: completed, color: '#10b981' }, // green-500
                        { name: 'In-progress', value: inProgress, color: '#2563eb' }, // blue-600
                        { name: 'Remaining', value: remaining, color: '#e5e7eb' }, // gray-200
                    ],
                    categoryDistribution: proficiency.map((p, i) => ({
                        name: p.name,
                        value: steps.filter(s => s.level === p.name).length,
                        color: i === 0 ? '#60a5fa' : i === 1 ? '#3b82f6' : '#2563eb'
                    }))
                });
            }
        } catch (err) {
            console.log("Learning path not found for stats calculation");
        } finally {
            setLoadingData(false);
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

        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const formData = new FormData();
        formData.append("resume", file);
        if (user?._id || user?.id) {
            formData.append("profileId", user._id || user.id);
        }

        try {
            const data = await api.post("/resume/upload", formData);

            if (data.resumeId) {
                localStorage.setItem("resumeId", data.resumeId);
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

    if (loadingData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-textSecondary animate-pulse">Calculating your real-time metrics...</p>
            </div>
        );
    }

    if (!pathData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <TrendingUp size={48} />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-textPrimary">No Evolution Data</h2>
                    <p className="text-textSecondary mt-2">Generate a learning path first to track your skill evolution.</p>
                </div>
                <button
                    onClick={() => router.push('/dashboard/learning-path')}
                    className="bg-primary text-white px-8 py-3 rounded-2xl font-bold hover:bg-primarySoft transition-all"
                >
                    Build Roadmap
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700 relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-textPrimary">Progress Tracking</h1>
                    <p className="text-textSecondary">Monitor your learning journey and skill development analytics.</p>
                </div>
                <button
                    onClick={() => setShowUpload(true)}
                    className="flex items-center justify-center gap-2 bg-primary hover:bg-primarySoft text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-primary/20 active:scale-95 whitespace-nowrap"
                >
                    <Upload size={20} />
                    Upload Resume
                </button>
            </div>

            {showUpload && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="w-full max-w-xl bg-surface border border-border rounded-3xl p-8 shadow-2xl relative">
                        <button
                            onClick={() => setShowUpload(false)}
                            className="absolute top-6 right-6 text-textMuted hover:text-textPrimary transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-textPrimary">Update Your Progress</h2>
                            <p className="text-textSecondary mt-2">Upload a newer version of your resume to refresh your stats.</p>
                        </div>

                        <div className="relative group">
                            <input
                                type="file"
                                className="absolute inset-0 z-10 cursor-pointer opacity-0"
                                accept=".pdf,image/*"
                                onChange={handleFileChange}
                            />
                            <div className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center gap-4 transition-all ${file ? 'border-primary bg-primary/5' : 'border-border group-hover:border-primary/50'}`}>
                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <FileText size={32} />
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-medium text-textPrimary">
                                        {file ? file.name : "Click or drag to select file"}
                                    </p>
                                    <p className="text-xs text-textMuted mt-1">Supports PDF, JPG, PNG (Max 5MB)</p>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center text-sm text-red-500">
                                {error}
                            </div>
                        )}

                        <button
                            onClick={handleUpload}
                            disabled={loading || !file}
                            className="w-full mt-8 flex items-center justify-center gap-2 bg-primary hover:bg-primarySoft disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-2xl text-lg font-bold shadow-lg transition-all"
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
                <div className="bg-surface p-6 rounded-2xl border border-border flex items-center space-x-4">
                    <div className="p-3 bg-green-500/10 rounded-xl">
                        <CheckCircle2 className="text-green-500" size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-textSecondary">Completed Skills</p>
                        <h3 className="text-2xl font-bold text-textPrimary">{stats.completed}</h3>
                    </div>
                </div>

                <div className="bg-surface p-6 rounded-2xl border border-border flex items-center space-x-4">
                    <div className="p-3 bg-primary/10 rounded-xl">
                        <Clock className="text-primary" size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-textSecondary">In Progress</p>
                        <h3 className="text-2xl font-bold text-textPrimary">{stats.inProgress}</h3>
                    </div>
                </div>

                <div className="bg-surface p-6 rounded-2xl border border-border flex items-center space-x-4">
                    <div className="p-3 bg-border rounded-xl">
                        <BookOpen className="text-textSecondary" size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-textSecondary">Remaining</p>
                        <h3 className="text-2xl font-bold text-textPrimary">{stats.remaining}</h3>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-surface p-8 rounded-3xl border border-border shadow-xl">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-semibold text-textPrimary flex items-center gap-2">
                            <TrendingUp size={20} className="text-primary" />
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
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    stroke="#94a3b8"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#94a3b8"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `${value}%`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#ffffff',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '12px',
                                        color: '#111827'
                                    }}
                                    itemStyle={{ color: '#111827' }}
                                />
                                <Bar
                                    dataKey="completed"
                                    name="Proficiency"
                                    fill="#2563eb"
                                    radius={[6, 6, 0, 0]}
                                    barSize={40}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-surface p-8 rounded-3xl border border-border shadow-xl">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-semibold text-textPrimary flex items-center gap-2">
                            <Target size={20} className="text-primary" />
                            Overall Status
                        </h3>
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.overallStatus.length > 0 ? stats.overallStatus : [
                                        { name: 'No Data', value: 1, color: '#e5e7eb' }
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
                                        backgroundColor: '#ffffff',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '12px'
                                    }}
                                />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    formatter={(value) => <span className="text-textSecondary text-sm">{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-8">
                <div className="lg:col-span-1 bg-surface p-8 rounded-3xl border border-border shadow-xl">
                    <h3 className="text-xl font-semibold text-textPrimary mb-8">Skill Distribution</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.categoryDistribution.length > 0 ? stats.categoryDistribution : [
                                        { name: 'No Data', value: 1, color: '#e5e7eb' }
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
                                        backgroundColor: '#ffffff',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '12px'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="lg:col-span-2 bg-surface p-8 rounded-3xl border border-border shadow-xl">
                    <h3 className="text-xl font-semibold text-textPrimary mb-6">Recent Achievements</h3>
                    <div className="space-y-4">
                        {pathData?.steps?.filter(s => s.status === 'COMPLETED').slice(-3).reverse().map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-background rounded-2xl border border-border hover:border-primary/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <CheckCircle2 size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-textPrimary font-medium">Mastered {item.skill}</h4>
                                        <p className="text-xs text-textMuted">{item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : 'Recently'}</p>
                                    </div>
                                </div>
                                <div className="text-primary font-bold text-lg">100%</div>
                            </div>
                        ))}
                        {pathData?.steps?.filter(s => s.status === 'COMPLETED').length === 0 && (
                            <div className="text-center py-10">
                                <p className="text-textMuted italic">No achievements recorded yet. Keep learning!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
