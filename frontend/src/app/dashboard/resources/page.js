"use client";

import { useState, useEffect } from "react";
import {
    BookOpen,
    Youtube,
    Globe,
    Library,
    Search,
    Filter,
    ExternalLink,
    ChevronRight,
    Bookmark,
    Clock,
    Zap,
    Star,
    Loader2
} from "lucide-react";
import { api } from "@/lib/api";

export default function ResourcesPage() {
    const [loading, setLoading] = useState(true);
    const [recommendedResources, setRecommendedResources] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        fetchRecommendations();
    }, []);

    const fetchRecommendations = async () => {
        setLoading(true);
        setError("");
        const resumeId = localStorage.getItem("resumeId");

        if (!resumeId) {
            setLoading(false);
            return;
        }

        try {
            const data = await api.post("/resources/recommend", { resumeId });
            if (data.success) {
                // Flatten the nested structure from { skill: '...', recommendations: [...] }
                const allRecs = data.data.flatMap(item =>
                    item.recommendations.map(rec => ({
                        ...rec,
                        skill: item.skill
                    }))
                );
                setRecommendedResources(allRecs);
            }
        } catch (err) {
            console.error("Resource error:", err);
            setError("Could not load recommendations. Make sure you have a learning path generated.");
        } finally {
            setLoading(false);
        }
    };

    const categoryStats = [
        { name: "Documentation", count: recommendedResources.filter(r => r.type === 'docs').length, icon: Globe },
        { name: "Video Courses", count: recommendedResources.filter(r => r.type === 'video').length, icon: Youtube },
        { name: "Articles", count: recommendedResources.filter(r => r.type === 'article').length, icon: BookOpen },
        { name: "E-Books", count: recommendedResources.filter(r => r.type === 'course').length, icon: Library },
    ];

    const filteredResources = recommendedResources.filter(res =>
        res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.skill.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <header className="space-y-4">
                <h1 className="text-5xl font-black text-textPrimary tracking-tight italic">Knowledge <span className="text-primary tracking-normal">Vault</span></h1>
                <p className="text-textSecondary text-xl max-w-2xl leading-relaxed">
                    Personalized library of curated resources to bridge your technical gaps. Master any skill with precision.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {categoryStats.map((cat, i) => {
                    const Icon = cat.icon;
                    return (
                        <div key={i} className="bg-surface border border-border p-8 rounded-[2.5rem] shadow-xl hover:border-primary/50 transition-all group flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-textSecondary text-xs font-black uppercase tracking-widest">{cat.name}</p>
                                <h4 className="text-3xl font-black text-textPrimary">{cat.count}</h4>
                            </div>
                            <div className="p-4 bg-primary/10 rounded-2xl text-primary group-hover:scale-110 transition-transform">
                                <Icon size={24} />
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="bg-surface border border-border rounded-[3rem] p-10 space-y-8 shadow-2xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="relative flex-1 max-w-xl">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted" size={20} />
                        <input
                            type="text"
                            placeholder="Search recommended topics..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-background border border-border rounded-2xl py-4 pl-12 pr-4 text-textPrimary outline-none focus:border-primary transition-all"
                        />
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={fetchRecommendations}
                            className="flex items-center space-x-2 px-6 py-4 bg-primary text-white rounded-2xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primarySoft transition-all"
                        >
                            <Star size={18} />
                            <span>Refresh Recommendations</span>
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center py-20 space-y-4 text-textSecondary">
                        <Loader2 size={40} className="animate-spin text-primary" />
                        <p className="font-bold">Analyzing your roadmap for resources...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
                        {filteredResources.length > 0 ? (
                            filteredResources.map((res, i) => (
                                <div key={i} className="group bg-background border border-border p-8 rounded-[2.5rem] hover:shadow-2xl hover:border-primary/40 transition-all flex flex-col justify-between">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-start">
                                            <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-primary/20 text-primary`}>
                                                {res.type}
                                            </span>
                                            <span className="text-[10px] font-black text-textMuted uppercase tracking-widest bg-surface px-3 py-1 rounded-full">
                                                {res.skill}
                                            </span>
                                        </div>
                                        <h3 className="text-2xl font-black text-textPrimary group-hover:text-primary transition-colors leading-tight min-h-[4rem]">
                                            {res.title}
                                        </h3>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
                                        <div className="flex items-center space-x-1 text-[10px] font-black text-textMuted uppercase tracking-widest">
                                            <Zap size={12} className="text-orange-500" />
                                            <span>{res.level}</span>
                                        </div>
                                        <a
                                            href={res.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-textMuted group-hover:bg-primary group-hover:text-white transition-all shadow-lg group-hover:shadow-primary/30"
                                        >
                                            <ExternalLink size={18} />
                                        </a>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center text-textSecondary space-y-4">
                                <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center mx-auto">
                                    <Search size={32} className="text-textMuted" />
                                </div>
                                <p className="text-xl font-bold">No matching resources found.</p>
                                <p>Try a different keyword or update your learning path.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
