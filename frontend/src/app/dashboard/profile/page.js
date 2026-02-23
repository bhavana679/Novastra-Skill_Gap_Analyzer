"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
    AreaChart,
    Area
} from "recharts";
import { Zap, Trophy, TrendingUp, Target, ChevronRight, BarChart3, Clock, FileText, Briefcase, Award, Sparkles, Github, ExternalLink } from "lucide-react";
import { api } from "@/lib/api";

export default function ProfileDashboard() {
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [resumeData, setResumeData] = useState(null);
    const [learningPath, setLearningPath] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");

            if (!token || token === "undefined" || token === "null") {
                router.replace("/login?redirect=/dashboard/profile");
                return;
            }

            const userData = JSON.parse(localStorage.getItem("user") || "{}");
            let currentResumeId = null;

            try {
                if (userData.id) {
                    const resumesResponse = await api.get(`/resume/all?profileId=${userData.id}`);
                    if (resumesResponse.success && resumesResponse.resumes?.length > 0) {
                        currentResumeId = resumesResponse.resumes[0]._id;
                        localStorage.setItem("resumeId", currentResumeId);
                    } else {
                        localStorage.removeItem("resumeId");
                    }
                }

                if (currentResumeId) {
                    const [resumeJson, pathJson] = await Promise.all([
                        api.get(`/resume/${currentResumeId}`),
                        api.get(`/learning-path/${currentResumeId}`).catch(() => ({ success: false }))
                    ]);

                    if (resumeJson.success) {
                        setResumeData(resumeJson.resume);
                    }
                    if (pathJson.success) {
                        setLearningPath(pathJson.data);
                    } else {
                        setLearningPath(null);
                    }
                }

            } catch (err) {
                setError(err.message || "Failed to fetch profile data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router]);

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

    const COLORS = ["#2563eb", "#60a5fa", "#e5e7eb"];

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

            {!resumeData && (
                <div className="bg-primary/5 border border-primary/20 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 animate-in slide-in-from-top-4 duration-500">
                    <div className="space-y-2 text-center md:text-left">
                        <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-xs">
                            <Sparkles size={16} />
                            <span>Action Required</span>
                        </div>
                        <h2 className="text-2xl font-black text-textPrimary leading-tight">Evolution Starts with a Resume</h2>
                        <p className="text-textSecondary font-medium max-w-xl">Upload your professional profile to unlock AI-powered career insights, skill gap analysis, and your personalized learning roadmap.</p>
                    </div>
                    <button
                        onClick={() => router.push("/upload")}
                        className="px-10 py-4 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/20 hover:bg-primarySoft hover:scale-105 transition-all whitespace-nowrap flex items-center gap-3"
                    >
                        <FileText size={20} />
                        <span>Upload Resume</span>
                    </button>
                </div>
            )}

            {/* Meta Cards & Gauge */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Readiness Gauge */}
                <div className="bg-surface border border-border p-8 rounded-[3rem] shadow-xl flex flex-col items-center justify-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:rotate-12 transition-transform">
                        <Zap size={80} />
                    </div>
                    <h3 className="text-lg font-bold text-textSecondary self-start mb-2">Job Readiness Score</h3>
                    <div className="h-[180px] w-full relative flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        { value: completionRate },
                                        { value: 100 - completionRate }
                                    ]}
                                    startAngle={180}
                                    endAngle={0}
                                    innerRadius={65}
                                    outerRadius={85}
                                    paddingAngle={0}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    <Cell fill="#2563eb" stroke="none" />
                                    <Cell fill="#f1f5f9" stroke="none" />
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
                            <span className="text-4xl font-black text-textPrimary">{completionRate}%</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Job Readiness</span>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-surface border border-border p-6 rounded-3xl shadow-xl hover:border-primary/50 transition-colors">
                        <div className="bg-primary/10 text-primary p-3 rounded-2xl w-fit">
                            <Target size={24} />
                        </div>
                        <div className="mt-4">
                            <p className="text-2xl font-black text-textPrimary truncate">{resumeData?.targetRole || "Not Set"}</p>
                            <p className="text-textSecondary text-sm font-bold uppercase tracking-widest">Target Role</p>
                        </div>
                    </div>

                    <div className="bg-surface border border-border p-6 rounded-3xl shadow-xl hover:border-blue-400/50 transition-colors">
                        <div className="bg-blue-400/10 text-blue-400 p-3 rounded-2xl w-fit">
                            <Briefcase size={24} />
                        </div>
                        <div className="mt-4">
                            <p className="text-2xl font-black text-textPrimary">{resumeData?.experienceLevel || "Beginner"}</p>
                            <p className="text-textSecondary text-sm font-bold uppercase tracking-widest">Experience</p>
                        </div>
                    </div>

                    <div className="bg-surface border border-border p-6 rounded-3xl shadow-xl hover:border-purple-400/50 transition-colors">
                        <div className="bg-purple-400/10 text-purple-400 p-3 rounded-2xl w-fit">
                            <TrendingUp size={24} />
                        </div>
                        <div className="mt-4">
                            <p className="text-2xl font-black text-textPrimary">{completedSteps}/{totalSteps}</p>
                            <p className="text-textSecondary text-sm font-bold uppercase tracking-widest">Skills Mastered</p>
                        </div>
                    </div>

                    <div className="bg-surface border border-border p-6 rounded-3xl shadow-xl hover:border-green-500/50 transition-colors">
                        <div className="bg-green-500/10 text-green-500 p-3 rounded-2xl w-fit">
                            <Zap size={24} />
                        </div>
                        <div className="mt-4">
                            <p className="text-2xl font-black text-textPrimary">{resumeData?.atsScore || 0}%</p>
                            <p className="text-textSecondary text-sm font-bold uppercase tracking-widest">Job Readiness Score</p>
                        </div>
                    </div>
                </div>
            </div>

            {steps.length > 0 && completionRate < 100 && (
                <div className="bg-gradient-to-r from-red-500/10 via-surface to-surface border border-red-500/20 p-8 rounded-[2.5rem] shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-red-500/20 text-red-500 rounded-lg">
                            <Zap size={20} fill="currentColor" />
                        </div>
                        <h2 className="text-xl font-bold text-textPrimary">High Impact Missing Skills</h2>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        {steps.filter(s => s.status !== 'COMPLETED').slice(0, 4).map((step, i) => (
                            <div key={`missing-${step.skill}-${i}`} className="flex items-center gap-3 bg-background border border-border px-5 py-3 rounded-2xl hover:border-red-500/40 transition-all cursor-pointer group" onClick={() => router.push('/dashboard/learning-path')}>
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse group-hover:scale-150 transition-transform"></div>
                                <span className="font-bold text-textPrimary">{step.skill}</span>
                                <ChevronRight size={14} className="text-textMuted" />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-surface border border-border rounded-3xl p-8 shadow-xl">
                    <h2 className="text-xl font-bold mb-6 flex items-center space-x-2 text-textPrimary">
                        <Zap size={20} className="text-yellow-500" />
                        <span>Extracted Skills</span>
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        {resumeData?.skills?.length > 0 ? (
                            resumeData.skills.map((skill, i) => (
                                <span key={`skill-${skill}-${i}`} className="px-4 py-2 bg-primary/10 border border-primary/20 text-primary rounded-xl text-sm font-bold capitalize transition-all hover:scale-105">
                                    {skill}
                                </span>
                            ))
                        ) : (
                            <p className="text-textMuted italic">No skills identified yet.</p>
                        )}
                    </div>
                </div>
                <div className="bg-surface border border-border rounded-3xl p-8 shadow-xl">
                    <h2 className="text-xl font-bold mb-6 flex items-center space-x-2 text-textPrimary">
                        <Award size={20} className="text-blue-400" />
                        <span>Certifications</span>
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        {resumeData?.certifications?.length > 0 ? (
                            resumeData.certifications.map((cert, i) => {
                                const certName = typeof cert === 'string' ? cert : cert.name;
                                const certLink = typeof cert === 'string' ? '' : cert.link;

                                if (certLink) {
                                    return (
                                        <a
                                            key={i}
                                            href={certLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            title={`Click to view: ${certLink}`}
                                            className="relative z-[50] px-4 py-2 bg-blue-400/10 border border-blue-400/20 text-blue-400 rounded-xl text-sm font-bold capitalize transition-all hover:scale-105 hover:bg-blue-400 hover:text-white flex items-center gap-2 cursor-pointer pointer-events-auto"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Award size={14} />
                                            {certName}
                                            <ExternalLink size={12} />
                                        </a>
                                    );
                                }
                                return (
                                    <span key={i} className="px-4 py-2 bg-blue-400/10 border border-blue-400/20 text-blue-400 rounded-xl text-sm font-bold capitalize transition-all hover:scale-105">
                                        {certName}
                                    </span>
                                );
                            })
                        ) : (
                            <p className="text-textMuted italic">No certifications found yet.</p>
                        )}
                    </div>
                </div>
            </div>


            <div className="bg-surface border border-border rounded-[2.5rem] p-10 shadow-xl overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-black text-textPrimary flex items-center gap-3">
                                <FileText className="text-primary" /> ATS Optimization Insights
                            </h2>
                            <p className="text-textSecondary font-medium mt-1">Professional feedback to help you bypass recruitment filters.</p>
                        </div>
                        <div className="hidden md:block">
                            <div className="px-6 py-4 bg-primary/10 border border-primary/20 rounded-2xl text-center">
                                <p className="text-3xl font-black text-primary">{resumeData?.atsScore || 0}%</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary/70">Job Readiness Score</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h3 className="text-sm font-black uppercase tracking-widest text-textSecondary mb-4">Critical Improvements</h3>
                            {resumeData?.atsFeedback?.length > 0 ? (
                                resumeData.atsFeedback.map((tip, i) => (
                                    <div key={`tip-${i}`} className="flex items-start gap-4 p-5 bg-background/80 backdrop-blur-md border border-border rounded-2xl hover:border-primary/50 transition-all shadow-sm">
                                        <div className="mt-1 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                            <ChevronRight size={14} strokeWidth={3} />
                                        </div>
                                        <p className="text-textPrimary font-bold leading-relaxed">{tip}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 border-2 border-dashed border-border rounded-3xl">
                                    <p className="text-textMuted italic">Upload a resume to see professional ATS feedback.</p>
                                </div>
                            )}
                        </div>

                        <div className="bg-primary/[0.03] border border-primary/10 rounded-3xl p-8 flex flex-col justify-center text-center">
                            <Sparkles className="text-primary mx-auto mb-4" size={32} />
                            <h3 className="text-xl font-black text-textPrimary mb-2">Job Readiness Analysis</h3>
                            <p className="text-textSecondary text-sm leading-relaxed mb-6">
                                Your resume score is calculated based on industry-standard parsing techniques.
                                A score above 85% significantly increases your chances of reaching the interview stage.
                            </p>
                            <button
                                onClick={() => router.push('/dashboard/comparison')}
                                className="w-full py-4 bg-primary text-white rounded-2xl font-black shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
                            >
                                Compare Versions
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Projects Section */}
            <div className="bg-surface border border-border rounded-3xl p-8 shadow-xl">
                <h2 className="text-xl font-bold mb-6 flex items-center space-x-2 text-textPrimary">
                    <Trophy size={20} className="text-purple-400" />
                    <span>Identified Projects</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {resumeData?.projects?.length > 0 ? (
                        resumeData.projects.map((project, i) => (
                            <div key={`project-${project.title}-${i}`} className="group p-6 bg-background/50 border border-border/50 rounded-2xl hover:border-primary/50 hover:bg-background transition-all flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                                            <h3 className="text-textPrimary font-bold group-hover:text-primary transition-colors text-lg uppercase tracking-tight">
                                                {project.title}
                                            </h3>
                                        </div>
                                    </div>
                                    <p className="text-textSecondary text-sm leading-relaxed mb-4 whitespace-pre-wrap">
                                        {project.description || "Project details extracted from resume."}
                                    </p>
                                </div>

                                {(project.githubLink || project.demoLink) && (
                                    <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-border/30 relative z-[50]">
                                        {project.githubLink && (
                                            <a
                                                href={project.githubLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                title={`View Github: ${project.githubLink}`}
                                                className="relative z-[60] flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-widest text-primary rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm cursor-pointer pointer-events-auto"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <Github size={12} />
                                                View Code
                                            </a>
                                        )}
                                        {project.demoLink && (
                                            <a
                                                href={project.demoLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                title={`Open Demo: ${project.demoLink}`}
                                                className="relative z-[60] flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 text-[10px] font-black uppercase tracking-widest text-purple-500 rounded-xl hover:bg-purple-500 hover:text-white transition-all shadow-sm cursor-pointer pointer-events-auto"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <ExternalLink size={12} />
                                                Live Demo
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-textMuted italic">No projects extracted from the resume.</p>
                    )}
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
                                <div key={`step-${step.skill}-${i}`} className="group">
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

                {/* Readiness History Chart */}
                <div className="lg:col-span-3 bg-surface border border-border rounded-[3rem] p-10 shadow-xl">
                    <div className="flex items-center justify-between mb-10">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-black text-textPrimary flex items-center gap-3">
                                <TrendingUp className="text-primary" /> Readiness Velocity
                            </h2>
                            <p className="text-sm text-textSecondary font-medium">Tracking your AI match score improvement over time.</p>
                        </div>
                        <div className="flex gap-2">
                            <span className="px-4 py-1 bg-primary/10 text-primary border border-primary/20 rounded-lg text-[10px] font-black uppercase tracking-widest">Live Updates</span>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={learningPath?.scoreHistory?.length > 0 ? learningPath.scoreHistory : [{ score: 0, date: new Date() }, { score: completionRate, date: new Date() }]}>
                                <defs>
                                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="date"
                                    hide
                                />
                                <YAxis
                                    domain={[0, 100]}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748B', fontSize: 12, fontWeight: 'bold' }}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '16px', fontWeight: 'bold' }}
                                    itemStyle={{ color: '#2563eb' }}
                                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="score"
                                    stroke="#2563eb"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorScore)"
                                    animationDuration={2000}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
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
                <button
                    onClick={() => router.push("/upload")}
                    className="px-8 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/25 hover:bg-primarySoft transition-all active:scale-95"
                >
                    Replace Resume
                </button>
            </section>
        </div>
    );
}
