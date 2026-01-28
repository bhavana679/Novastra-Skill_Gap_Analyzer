"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UploadPage() {
    const router = useRouter();
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isDragging, setIsDragging] = useState(false);

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
        if (!file) {
            setError("Please select a file first.");
            return;
        }

        setLoading(true);
        setError("");

        const formData = new FormData();
        formData.append("resume", file);

        try {
            const response = await fetch("http://localhost:5001/api/resume/upload", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("resumeId", data.resumeId);
                router.push("/select-role");
            } else {
                setError(data.message || "Something went wrong during upload.");
            }
        } catch (err) {
            setError("Failed to connect to the server. Is the backend running?");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
            <div className="w-full max-w-xl space-y-8 rounded-3xl border border-border bg-surface p-8 shadow-2xl transition-all md:p-12">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-textPrimary">
                        AI Resume Analyzer
                    </h1>
                    <p className="mt-2 text-textSecondary">
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
