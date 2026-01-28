"use client";

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
    Star
} from "lucide-react";

export default function ResourcesPage() {
    const resourceCategories = [
        { name: "Documentation", count: 12, icon: Globe },
        { name: "Video Courses", count: 8, icon: Youtube },
        { name: "Articles", count: 24, icon: BookOpen },
        { name: "E-Books", count: 5, icon: Library },
    ];

    const resources = [
        { title: "Pro React Patterns", platform: "Frontend Masters", duration: "12h", level: "Advanced", type: "Video", rating: 4.9 },
        { title: "System Design Essentials", platform: "Arpit Bhayani", duration: "15h", level: "Intermediate", type: "Article", rating: 4.8 },
        { title: "Mastering Node.js Streams", platform: "Medium", duration: "20m", level: "Hard", type: "Article", rating: 4.7 },
        { title: "AWS Cloud Design", platform: "A Cloud Guru", duration: "8h", level: "Expert", type: "Video", rating: 4.9 },
        { title: "Modern CSS Techniques", platform: "CSS-Tricks", duration: "10m", level: "Easy", type: "Article", rating: 4.6 },
        { title: "Database Optimization", platform: "O'Reilly", duration: "E-Book", level: "Advanced", type: "E-Book", rating: 4.8 },
    ];

    return (
        <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <header className="space-y-4">
                <h1 className="text-5xl font-black text-textPrimary tracking-tight italic">Knowledge <span className="text-primary tracking-normal">Vault</span></h1>
                <p className="text-textSecondary text-xl max-w-2xl leading-relaxed">
                    The ultimate library of curated resources to bridge your technical gaps. Master any skill with precision.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {resourceCategories.map((cat, i) => {
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
                            placeholder="Search resource library..."
                            className="w-full bg-background border border-border rounded-2xl py-4 pl-12 pr-4 text-textPrimary outline-none focus:border-primary transition-all"
                        />
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="flex items-center space-x-2 px-6 py-4 bg-background border border-border rounded-2xl text-sm font-bold hover:border-primary transition-all">
                            <Filter size={18} />
                            <span>Filter</span>
                        </button>
                        <button className="flex items-center space-x-2 px-6 py-4 bg-primary text-white rounded-2xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primarySoft transition-all">
                            <Star size={18} />
                            <span>Recommended</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
                    {resources.map((res, i) => (
                        <div key={i} className="group bg-background border border-border p-8 rounded-[2.5rem] hover:shadow-2xl hover:border-primary/40 transition-all flex flex-col justify-between">
                            <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-primary/20 text-primary`}>
                                        {res.type}
                                    </span>
                                    <button className="text-textMuted hover:text-primary transition-colors">
                                        <Bookmark size={20} />
                                    </button>
                                </div>
                                <h3 className="text-2xl font-black text-textPrimary group-hover:text-primary transition-colors leading-tight">
                                    {res.title}
                                </h3>
                                <div className="flex items-center space-x-2 text-textSecondary text-xs">
                                    <span>{res.platform}</span>
                                    <span className="text-border">•</span>
                                    <span className="text-primary font-bold">{res.rating} ★</span>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-1 text-[10px] font-black text-textMuted uppercase tracking-widest">
                                        <Clock size={12} className="text-primary" />
                                        <span>{res.duration}</span>
                                    </div>
                                    <div className="flex items-center space-x-1 text-[10px] font-black text-textMuted uppercase tracking-widest">
                                        <Zap size={12} className="text-orange-500" />
                                        <span>{res.level}</span>
                                    </div>
                                </div>
                                <button className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-textMuted group-hover:bg-primary group-hover:text-white transition-all shadow-lg group-hover:shadow-primary/30">
                                    <ExternalLink size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center pt-8">
                    <button className="px-10 py-4 bg-background border border-border rounded-2xl text-sm font-bold hover:text-primary hover:border-primary transition-all">
                        Load More Resources
                    </button>
                </div>
            </div>
        </div>
    );
}
