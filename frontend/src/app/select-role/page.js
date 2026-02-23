"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

const roles = [
    { id: "frontend", title: "Frontend Developer", description: "Build stunning user interfaces with React, Next.js, and Tailwind.", icon: "🎨" },
    { id: "backend", title: "Backend Developer", description: "Design robust APIs, databases, and scalable server architectures.", icon: "⚙️" },
    { id: "fullstack", title: "Full Stack Developer", description: "Master both ends by integrating frontend and backend seamlessly.", icon: "💻" },
    { id: "devops", title: "DevOps Engineer", description: "Optimize deployment pipelines and manage cloud infrastructure.", icon: "🚀" },
    { id: "data-scientist", title: "Data Scientist", description: "Unlock insights from data using ML and statistical analysis.", icon: "📊" },
    { id: "ui-ux", title: "UI/UX Designer", description: "Create intuitive user experiences and high-fidelity designs.", icon: "✨" },
];

export default function SelectRolePage() {
    const router = useRouter();
    const [selectedRole, setSelectedRole] = useState(null);
    const [experienceLevel, setExperienceLevel] = useState("Beginner");
    const [timeAvailability, setTimeAvailability] = useState("10"); // Hours per week
    const [resumeId, setResumeId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token || token === "undefined" || token === "null") {
            router.replace("/login?redirect=/select-role");
            return;
        }

        const storedId = localStorage.getItem("resumeId");
        if (!storedId) {
            router.replace("/upload");
        } else {
            setResumeId(storedId);
        }
    }, [router]);

    const handleGeneratePath = async () => {
        if (!selectedRole || !resumeId) return;

        setLoading(true);
        setError("");

        try {
            const data = await api.post("/learning-path/generate", {
                resumeId: resumeId,
                targetRole: selectedRole,
                experienceLevel: experienceLevel,
                timeAvailability: timeAvailability
            });

            if (data.success || data.data) {
                const pathId = data.data?._id || data.pathId;
                if (pathId) localStorage.setItem("pathId", pathId);
                router.push("/dashboard/profile");
            } else {
                setError(data.message || "Failed to generate learning path.");
            }
        } catch (err) {
            setError(err.message || "Server connection error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-textPrimary py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                        Choose Your <span className="text-primary">Target Role</span>
                    </h1>
                    <p className="text-textSecondary text-lg max-w-2xl mx-auto">
                        Select the role you&apos;re aiming for. We&apos;ll analyze your resume against this role to find skill gaps and build your roadmap.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {roles.map((role) => (
                        <button
                            key={role.id}
                            onClick={() => setSelectedRole(role.title)}
                            className={`group relative flex flex-col text-left p-6 rounded-2xl border-2 transition-all duration-300 ${selectedRole === role.title
                                ? "border-primary bg-surface shadow-[0_0_20px_rgba(124,108,255,0.2)]"
                                : "border-border bg-surface hover:border-border/80 hover:scale-[1.02]"
                                }`}
                        >
                            <span className="text-4xl mb-4 block" role="img" aria-label={role.title}>
                                {role.icon}
                            </span>
                            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                                {role.title}
                            </h3>
                            <p className="text-textSecondary text-sm leading-relaxed">
                                {role.description}
                            </p>
                            {selectedRole === role.title && (
                                <div className="absolute top-4 right-4 h-6 w-6 bg-primary rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-surface p-8 rounded-3xl border border-border shadow-xl">
                    <div className="space-y-4">
                        <label className="text-lg font-bold text-textPrimary flex items-center gap-2">
                            <span>Experience Level</span>
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {["Beginner", "Intermediate", "Advanced"].map((level) => (
                                <button
                                    key={level}
                                    onClick={() => setExperienceLevel(level)}
                                    className={`py-3 rounded-xl font-bold text-sm transition-all border ${experienceLevel === level
                                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                                        : "bg-background text-textSecondary border-border hover:border-primary/50"
                                        }`}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-lg font-bold text-textPrimary flex items-center gap-2">
                            <span>Weekly Commitment</span>
                        </label>
                        <select
                            value={timeAvailability}
                            onChange={(e) => setTimeAvailability(e.target.value)}
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-textPrimary font-bold focus:outline-none focus:border-primary transition-colors"
                        >
                            <option value="5">5 hours / week</option>
                            <option value="10">10 hours / week</option>
                            <option value="20">20 hours / week</option>
                            <option value="40">40 hours / week (Full-time)</option>
                        </select>
                    </div>
                </div>

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center">
                        {error}
                    </div>
                )}

                <div className="flex justify-center pt-8">
                    <button
                        onClick={handleGeneratePath}
                        disabled={!selectedRole || loading}
                        className={`px-12 py-4 rounded-xl text-lg font-bold transition-all transform active:scale-95 ${!selectedRole || loading
                            ? "bg-border text-textMuted cursor-not-allowed"
                            : "bg-primary text-white hover:bg-primarySoft shadow-lg shadow-primary/25"
                            }`}
                    >
                        {loading ? (
                            <div className="flex items-center space-x-3">
                                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Generating Roadmap...</span>
                            </div>
                        ) : (
                            "Generate My Roadmap"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
