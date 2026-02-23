"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";

export default function UploadPage() {
    const router = useRouter();
    const [file, setFile] = useState(null);
    const [uploadStage, setUploadStage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token || token === "undefined" || token === "null") {
            router.push("/login?redirect=/upload");
        }
    }, [router]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (
                selectedFile.type === "application/pdf" ||
                selectedFile.type.startsWith("image/")
            ) {
                setFile(selectedFile);
                setError("");
            } else {
                setError("Please upload a PDF or an image file.");
            }
        }
    };

    const handleUpload = async () => {
        const token = localStorage.getItem("token");
        if (!token || token === "undefined" || token === "null") {
            router.push("/login?redirect=/upload");
            return;
        }

        if (!file) {
            setError("Please select a file first.");
            return;
        }

        setLoading(true);
        setError("");
        setUploadStage(1);

        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        const formData = new FormData();
        formData.append("resume", file);
        if (userData.id) {
            formData.append("profileId", userData.id);
        }

        try {
            // Stage 2: Parsing
            setTimeout(() => setUploadStage(2), 2000);

            const data = await api.post("/resume/upload", formData);

            // Stage 3: Extracting Skills
            setUploadStage(3);
            setTimeout(async () => {
                if (data.resumeId) {
                    localStorage.setItem("resumeId", data.resumeId);
                    router.push("/select-role");
                } else {
                    setError(data.message || "Something went wrong during upload.");
                    setLoading(false);
                }
            }, 1500);

        } catch (err) {
            setError(err.message || "Failed to connect to the server. Is the backend running?");
            setLoading(false);
        }
    };

    const stages = [
        { id: 1, label: "Uploading Resume", icon: "📤" },
        { id: 2, label: "AI Parsing Text", icon: "🧠" },
        { id: 3, label: "Extracting Skills & Experience", icon: "✨" }
    ];

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
            <div className="w-full max-w-xl space-y-8 rounded-[3rem] border border-border bg-surface p-8 shadow-2xl transition-all md:p-12 relative overflow-hidden">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-textSecondary hover:text-primary transition-colors font-bold text-sm mb-4 group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Back
                </button>
                {loading && (
                    <div className="absolute inset-0 bg-surface/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-12 text-center animate-in fade-in duration-300">
                        <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin mb-8"></div>
                        <div className="space-y-6 w-full">
                            {stages.map((stage) => (
                                <div key={stage.id} className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-500 ${uploadStage === stage.id ? 'bg-primary/10 border-primary scale-105 shadow-xl' : uploadStage > stage.id ? 'bg-green-500/10 border-green-500/30 opacity-60' : 'bg-background/20 border-border/20 opacity-30'}`}>
                                    <span className="text-2xl">{stage.id <= uploadStage - 1 ? "✅" : stage.icon}</span>
                                    <span className={`font-bold ${uploadStage === stage.id ? 'text-primary' : 'text-textSecondary'}`}>{stage.label}</span>
                                    {uploadStage === stage.id && <div className="ml-auto w-2 h-2 bg-primary rounded-full animate-ping"></div>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="text-center">
                    <h1 className="text-4xl font-black tracking-tight text-textPrimary">
                        Analyze <span className="text-primary">Resume</span>
                    </h1>
                    <p className="mt-4 text-textSecondary text-lg font-medium">
                        Upload your resume to identify skill gaps and get a personalized roadmap
                    </p>
                </div>

                <div
                    className={`relative mt-8 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 transition-all ${isDragging
                        ? "border-primary bg-primary/5 scale-[1.02]"
                        : "border-border hover:border-primary/50"
                        }`}
                    onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        const droppedFile = e.dataTransfer.files[0];
                        if (droppedFile) handleFileChange({ target: { files: [droppedFile] } });
                    }}
                >
                    <input
                        type="file"
                        className="absolute inset-0 z-10 cursor-pointer opacity-0"
                        accept=".pdf,image/*"
                        onChange={handleFileChange}
                    />
                    <div className="flex flex-col items-center space-y-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                            </svg>
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-medium text-textPrimary">
                                {file ? file.name : "Click or drag your resume here"}
                            </p>
                            <p className="text-xs text-textMuted mt-1">
                                Supports PDF, JPG, PNG (Max 5MB)
                            </p>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="rounded-lg bg-red-500/10 p-4 text-center text-sm text-red-400 border border-red-500/20">
                        {error}
                    </div>
                )}

                <button
                    onClick={handleUpload}
                    disabled={loading || !file}
                    className={`flex w-full items-center justify-center rounded-xl bg-primary py-4 text-lg font-bold text-white shadow-lg transition-all active:scale-95 ${loading || !file
                        ? "cursor-not-allowed opacity-50"
                        : "hover:bg-primarySoft hover:shadow-primary/25"
                        }`}
                >
                    {loading ? (
                        <div className="flex items-center space-x-2">
                            <svg
                                className="h-5 w-5 animate-spin text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            <span>Processing OCR...</span>
                        </div>
                    ) : (
                        "Analyze Resume"
                    )}
                </button>

                <p className="text-center text-xs text-textMuted">
                    By uploading, you agree to our Terms of Service.
                </p>
            </div>
        </div>
    );
}
