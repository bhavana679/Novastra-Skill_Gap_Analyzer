"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
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
import MarkdownRenderer from '@/components/MarkdownRenderer';

export default function LearningPathPage() {
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [refining, setRefining] = useState(false);
    const [pathData, setPathData] = useState(null);
    const [error, setError] = useState("");
    const [streak, setStreak] = useState(7);
    const [recommendedResources, setRecommendedResources] = useState([]);

    const [chatOpen, setChatOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState("");
    const [sending, setSending] = useState(false);
    const [activeChatSkill, setActiveChatSkill] = useState(null);

    const platforms = [
        { name: "Coursera", icon: Globe, url: "https://www.coursera.org", color: "text-blue-500", bg: "bg-blue-500/10" },
        { name: "Udemy", icon: Youtube, url: "https://www.udemy.com", color: "text-purple-500", bg: "bg-purple-500/10" },
        { name: "YouTube", icon: Youtube, url: "https://www.youtube.com", color: "text-red-500", bg: "bg-red-500/10" },
        { name: "MDN Docs", icon: BookOpen, url: "https://developer.mozilla.org", color: "text-yellow-500", bg: "bg-yellow-500/10" },
        { name: "LinkedIn", icon: Library, url: "https://www.linkedin.com/learning", color: "text-blue-600", bg: "bg-blue-600/10" },
    ];

    const [activityData, setActivityData] = useState([]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        const userMsg = inputMessage;
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setInputMessage("");
        setSending(true);

        const resumeId = localStorage.getItem("resumeId");

        try {
            const data = await api.post('/ai/chat', {
                message: userMsg,
                resumeId: resumeId,
                currentSkill: activeChatSkill || (pathData?.steps && pathData.steps[0]?.skill) || "General",
                targetRole: pathData?.targetRole
            });

            if (data.success) {
                setMessages(prev => [...prev, { role: 'ai', content: data.reply }]);
            } else {
                setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I encountered an error." }]);
            }
        } catch (error) {
            console.error("Chat Error", error);
            setMessages(prev => [...prev, { role: 'ai', content: "I couldn't reach the server. Please try again." }]);
        } finally {
            setSending(false);
        }
    };

    const openChat = (skill) => {
        setActiveChatSkill(skill);
        setChatOpen(true);
    };

    // Auto-fetch history when chat opens
    useEffect(() => {
        if (chatOpen) {
            const fetchHistory = async () => {
                setMessages([]); // Clear previous to show transition
                try {
                    const skillParam = activeChatSkill ? `&skill=${encodeURIComponent(activeChatSkill)}` : "";
                    const data = await api.get(`/ai/history?limit=20${skillParam}`);
                    let initMsgs = [];
                    if (data.success && data.history.length > 0) {
                        initMsgs = data.history.map(h => ({ role: h.role, content: h.content }));
                    }

                    if (initMsgs.length === 0) {
                        initMsgs.push({ role: 'ai', content: `Hi! I'm your AI Novastra Coach. How can I help you master ${activeChatSkill || "your path"}?` });
                    }

                    setMessages(initMsgs);
                } catch (err) {
                    console.error("Failed to fetch history", err);
                    setMessages([{ role: 'ai', content: `Hi! I'm your AI Novastra Coach. How can I help you master ${activeChatSkill || "your path"}?` }]);
                }
            };
            fetchHistory();
        }
    }, [chatOpen, activeChatSkill]);

    const calculateActivity = (steps) => {
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const today = new Date();
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(today.getDate() - (6 - i));
            return { day: days[d.getDay()], date: d.toDateString(), effort: 0 };
        });

        steps.forEach(step => {
            if (step.status === 'COMPLETED' && step.updatedAt) {
                const updatedDate = new Date(step.updatedAt).toDateString();
                const dayIndex = last7Days.findIndex(d => d.date === updatedDate);
                if (dayIndex !== -1) {
                    last7Days[dayIndex].effort += 20;
                }
            } else if (step.status === 'IN_PROGRESS') {
                last7Days[6].effort += 10;
            }
        });

        setActivityData(last7Days.map(({ day, effort }) => ({ day, effort })));
    };

    const fetchData = async () => {
        const token = localStorage.getItem("token");
        if (!token || token === "undefined" || token === "null") {
            router.replace("/login?redirect=/dashboard/learning-path");
            return;
        }

        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        let resumeId = null;

        if (userData.id) {
            try {
                const resumesResponse = await api.get(`/resume/all?profileId=${userData.id}`);
                if (resumesResponse.success && resumesResponse.resumes?.length > 0) {
                    resumeId = resumesResponse.resumes[0]._id;
                    localStorage.setItem("resumeId", resumeId);
                } else {
                    localStorage.removeItem("resumeId");
                }
            } catch (err) {
                console.error("Failed to validate resume ownership", err);
            }
        }

        // Fallback to localStorage ONLY if we couldn't fetch (though unlikely if logged in)
        if (!resumeId) {
            resumeId = localStorage.getItem("resumeId");
        }

        if (resumeId) {
            try {
                const json = await api.get(`/learning-path/${resumeId}`);
                if (json.success) {
                    setPathData(json.data);
                    calculateActivity(json.data.steps || []);
                }

                const resJson = await api.post("/resources/recommend", { resumeId });
                if (resJson.success) {
                    const allRecs = resJson.data.flatMap(item =>
                        item.recommendations.map(rec => ({
                            ...rec,
                            skill: item.skill
                        }))
                    );
                    setRecommendedResources(allRecs);
                }
            } catch (err) {
                console.log("Data fetch error:", err.message);
                setPathData(null);
            } finally {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router]);

    const updateProgress = async (skill, newStatus) => {
        const resumeId = localStorage.getItem("resumeId");
        try {
            await api.patch("/learning-path/progress", { resumeId, skill, status: newStatus });
            fetchData();
        } catch (err) {
            console.error("Failed to update progress");
        }
    };

    const refinePath = async () => {
        const resumeId = localStorage.getItem("resumeId");
        setRefining(true);
        try {
            await api.post("/learning-path/refine", { resumeId });
            fetchData();
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

    if (!pathData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-in fade-in zoom-in duration-700">
                <div className="w-32 h-32 bg-primary/10 rounded-[3rem] flex items-center justify-center text-primary">
                    <BrainCircuit size={64} className="animate-pulse" />
                </div>
                <div className="text-center space-y-4 max-w-md">
                    <h2 className="text-4xl font-black text-textPrimary">No Roadmap Found</h2>
                    <p className="text-textSecondary text-lg font-medium">We need to know your target career role to build your personalized AI roadmap.</p>
                </div>
                <button
                    onClick={() => router.push("/select-role")}
                    className="px-12 py-5 bg-primary text-white rounded-[2rem] font-black shadow-2xl shadow-primary/30 hover:bg-primarySoft transition-all transform hover:scale-105 flex items-center gap-3"
                >
                    <Target size={24} />
                    <span>Select Target Role</span>
                </button>
            </div>
        );
    }



    return (
        <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-6 duration-1000 relative">
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
                        Tracking <span className="text-primary font-bold">{steps.length} key skills</span> for your evolution.
                    </p>
                </div>
                <button
                    onClick={() => router.push('/select-role')}
                    className="group relative flex items-center space-x-3 px-10 py-5 bg-primary text-white rounded-[2rem] font-black shadow-[0_20px_40px_rgba(37,99,235,0.2)] hover:shadow-[0_25px_50px_rgba(37,99,235,0.3)] transition-all hover:-translate-y-1 active:scale-95 overflow-hidden"
                >
                    <Sparkles size={20} className="group-hover:animate-spin" />
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
                                <p className="font-bold text-xl uppercase tracking-widest text-primary/80 text-xs">Job Readiness Score</p>
                                <div className="h-2.5 bg-background rounded-full overflow-hidden border border-border">
                                    <div className="h-full bg-primary shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all duration-1000" style={{ width: `${progressPercent}%` }} />
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
                                            cursor={{ fill: 'rgba(37, 99, 235, 0.05)' }}
                                            contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '16px' }}
                                        />
                                        <Bar dataKey="effort" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={24}>
                                            {activityData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={index === 5 ? "#3b82f6" : "#2563eb"} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-12">
                        <h2 className="text-4xl font-black flex items-center gap-4">
                            <LayoutDashboard className="text-primary" /> Your Learning Journey
                        </h2>
                        <div className="relative pl-8 space-y-12 before:absolute before:left-[11px] before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-primary before:via-border/30 before:to-transparent">
                            {steps.map((step, i) => (
                                <div
                                    key={`path-step-${step.skill}-${i}`}
                                    className={`relative group bg-surface border-2 transition-all duration-500 rounded-[2.5rem] p-8 hover:shadow-2xl ${step.status === 'COMPLETED' ? 'border-primary/30' : 'border-border'
                                        }`}
                                >
                                    <div className={`absolute -left-[45px] top-6 w-6 h-6 rounded-full border-4 border-background z-10 ${step.status === 'COMPLETED' ? 'bg-primary' :
                                        step.status === 'IN_PROGRESS' ? 'bg-primary animate-pulse' : 'bg-border'
                                        }`} />

                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                                        <div className="flex items-start gap-6 w-full">
                                            <div className="shrink-0 w-24 h-24 relative flex items-center justify-center">
                                                <svg className="w-full h-full transform -rotate-90">
                                                    <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-border/20" />
                                                    <circle
                                                        cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent"
                                                        strokeDasharray={2 * Math.PI * 40}
                                                        strokeDashoffset={2 * Math.PI * 40 * (1 - (step.status === 'COMPLETED' ? 1 : step.status === 'IN_PROGRESS' ? 0.5 : 0.05))}
                                                        className="text-primary transition-all duration-1000"
                                                    />
                                                </svg>
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    {step.status === 'COMPLETED' ? <CheckCircle2 size={32} className="text-primary" /> :
                                                        <span className="text-xs font-black text-textPrimary">{step.status === 'IN_PROGRESS' ? '50%' : '0%'}</span>}
                                                </div>
                                            </div>

                                            <div className="space-y-3 w-full">
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <h3 className="text-3xl font-black tracking-tight">{step.skill}</h3>
                                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${step.level === 'Advanced' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                                                        step.level === 'Intermediate' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'
                                                        }`}>
                                                        {step.level}
                                                    </span>
                                                </div>
                                                <p className="text-textSecondary text-lg font-medium leading-relaxed max-w-2xl">
                                                    {step.reason || `Strategic mastery of ${step.skill} specifically optimized for your role.`}
                                                </p>
                                                {step.microTopics && step.microTopics.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 pt-2">
                                                        {step.microTopics.map((topic, tIdx) => (
                                                            <span key={`topic-${i}-${tIdx}`} className="px-3 py-1 bg-background/50 border border-border rounded-lg text-[10px] font-bold text-textSecondary hover:border-primary/40 transition-colors">
                                                                {topic}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-6 pt-4 border-t border-border/30 w-full justify-between">
                                                    <div className="flex items-center space-x-2 text-textMuted text-xs font-bold uppercase tracking-widest">
                                                        <Clock size={16} className="text-primary" />
                                                        <span>{step.estimatedTime || "1 week"}</span>
                                                    </div>
                                                    {step.resources && step.resources.length > 0 && (
                                                        <div className="flex gap-4">
                                                            {step.resources.map((res, rIdx) => (
                                                                <a key={`res-${i}-${rIdx}`} href={res.url} target="_blank" className="flex items-center gap-2 text-[10px] font-black text-primary hover:underline group/link">
                                                                    <ExternalLink size={12} className="group-hover/link:translate-x-0.5 transition-transform" />
                                                                    {res.title ? (res.title.length > 15 ? res.title.substring(0, 15) + '...' : res.title) : "Resource"}
                                                                </a>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-3 min-w-[200px]">
                                            <button
                                                onClick={() => updateProgress(step.skill, step.status === 'COMPLETED' ? 'NOT_STARTED' : 'COMPLETED')}
                                                className={`w-full py-4 rounded-2xl font-black text-sm transition-all active:scale-95 ${step.status === 'COMPLETED'
                                                    ? 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white'
                                                    : 'bg-primary text-white shadow-xl shadow-primary/25 hover:bg-primarySoft'
                                                    }`}
                                            >
                                                {step.status === 'COMPLETED' ? 'Review Skill' : 'Master Skill'}
                                            </button>
                                            <button
                                                onClick={() => openChat(step.skill)}
                                                className="w-full py-4 border border-primary/30 text-primary rounded-2xl font-black text-xs hover:bg-primary/10 transition-all flex items-center justify-center gap-2"
                                            >
                                                <Sparkles size={14} />
                                                Explain Topic
                                            </button>
                                        </div>
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
                            {pathData?.insight ? `&quot;${pathData.insight}&quot;` : steps.length > 0 ? (
                                `&quot;Mastering ${steps[0].skill} will increase your interview success rate for ${pathData?.targetRole || "this role"} by ${Math.floor(Math.random() * 15) + 20}%.&quot;`
                            ) : (
                                `&quot;Ready to start your journey towards ${pathData?.targetRole || "your dream career"}? Follow the path below.&quot;`
                            )}
                        </p>
                        <div className="pt-6 border-t border-white/20">
                            <span className="text-[10px] font-black uppercase tracking-widest">Growth Factor: {pathData?.growthFactor || "High"}</span>
                        </div>
                    </div>

                    <div className="bg-surface border border-border p-10 rounded-[3rem] shadow-2xl space-y-8">
                        <h3 className="text-2xl font-black flex items-center gap-3">
                            <Zap size={24} className="text-primary" /> Quick Resources
                        </h3>
                        <div className="space-y-6">
                            {recommendedResources.length > 0 ? (
                                recommendedResources.slice(0, 4).map((res, i) => (
                                    <a key={`resource-${res.title}-${i}`} href={res.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between group cursor-pointer border-b border-border/50 pb-4 last:border-0 last:pb-0">
                                        <div className="space-y-1">
                                            <p className="font-extrabold text-base group-hover:text-primary transition-all truncate max-w-[150px]">{res.title}</p>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-[10px] font-black text-textMuted uppercase tracking-widest">{res.skill}</span>
                                                <span className="text-[10px] font-bold text-primary">{res.level}</span>
                                            </div>
                                        </div>
                                        <ChevronRight size={18} className="text-textMuted group-hover:text-primary transition-all group-hover:translate-x-1" />
                                    </a>
                                ))
                            ) : (
                                <p className="text-textSecondary text-sm p-4 bg-background rounded-2xl border border-border border-dashed text-center">
                                    Continue your path to unlock resources.
                                </p>
                            )}
                        </div>
                    </div>
                </aside>
            </div>

            {chatOpen && (
                <div className="fixed bottom-8 right-8 w-96 max-w-[90vw] bg-surface border-2 border-primary/20 rounded-[2.5rem] shadow-2xl shadow-primary/40 flex flex-col z-[100] animate-in slide-in-from-bottom-12 duration-500 overflow-hidden">
                    <div className="flex items-center justify-between p-7 bg-primary border-b border-primary/20 text-white">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                                <Sparkles size={24} className="text-white" />
                            </div>
                            <div>
                                <h4 className="font-black text-xl leading-tight text-white">AI Career Mentor</h4>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-80">{activeChatSkill || "Synchronizing..."}</p>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setChatOpen(false)} className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
                            <Settings2 size={24} />
                        </button>
                    </div>

                    <div className="h-[450px] overflow-y-auto p-8 space-y-6 bg-gradient-to-b from-background to-surface">
                        {messages.length === 0 && (
                            <div className="text-center space-y-4 py-10 opacity-60">
                                <div className="w-16 h-16 bg-primary/10 rounded-[1.5rem] flex items-center justify-center mx-auto text-primary">
                                    <BrainCircuit size={32} />
                                </div>
                                <p className="text-sm font-bold text-textSecondary uppercase tracking-tighter">Ask me about {activeChatSkill || "your roadmap"}</p>
                            </div>
                        )}
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                                <div className={`max-w-[85%] p-5 rounded-3xl text-sm font-semibold leading-relaxed shadow-sm overflow-hidden break-words ${msg.role === 'user'
                                    ? 'bg-primary text-white rounded-tr-none'
                                    : 'bg-background border border-border text-textPrimary rounded-tl-none'
                                    }`}>
                                    {msg.role === 'user' ? (
                                        <p className="whitespace-pre-wrap">{msg.content}</p>
                                    ) : (
                                        <div className="prose prose-sm max-w-none dark:prose-invert">
                                            <MarkdownRenderer content={msg.content} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {sending && (
                            <div className="flex justify-start">
                                <div className="bg-background border border-border p-5 rounded-3xl rounded-tl-none flex items-center gap-3">
                                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-75" />
                                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-150" />
                                </div>
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSendMessage} className="p-6 border-t border-border bg-background">
                        <div className="flex items-center gap-3 bg-surface p-2 pl-5 rounded-2xl border border-border focus-within:border-primary transition-colors">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                placeholder="Tell me more..."
                                className="flex-1 bg-transparent border-none py-3 text-sm font-bold focus:outline-none text-textPrimary"
                            />
                            <button
                                type="submit"
                                disabled={sending || !inputMessage.trim()}
                                className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primarySoft shadow-lg shadow-primary/20 active:scale-90"
                            >
                                <ArrowRight size={24} />
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
