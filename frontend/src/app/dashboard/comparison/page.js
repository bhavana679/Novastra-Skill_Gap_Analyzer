"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import {
    ArrowRight,
    TrendingUp,
    CheckCircle2,
    Plus,
    Minus,
    AlertCircle,
    FileText,
    Calendar,
    Sparkles,
    Upload,
    X,
    ArrowUpRight,
    Loader2,
    Zap
} from 'lucide-react';
import { api } from '@/lib/api';

export default function ComparisonPage() {
    const router = useRouter();
    const [resumes, setResumes] = useState([]);
    const [oldResumeId, setOldResumeId] = useState('');
    const [newResumeId, setNewResumeId] = useState('');
    const [comparisonData, setComparisonData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [showUpload, setShowUpload] = useState(false);
    const [uploadFile, setUploadFile] = useState(null);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [uploadError, setUploadError] = useState("");

    const fetchResumes = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.replace("/login?redirect=/dashboard/comparison");
            return;
        }

        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const profileId = user._id || user.id;

        try {
            const data = await api.get(`/resume/all${profileId ? `?profileId=${profileId}` : ''}`);
            if (data.success && data.resumes) {
                setResumes(data.resumes);
                // Smart auto-selection: newest and second-newest
                if (data.resumes.length >= 2) {
                    const latest = data.resumes[0]._id;
                    const secondLatest = data.resumes[1]._id;
                    if (latest && secondLatest) {
                        setNewResumeId(latest);
                        setOldResumeId(secondLatest);
                    }
                } else if (data.resumes.length === 1) {
                    const latest = data.resumes[0]._id;
                    if (latest) setNewResumeId(latest);
                    setError('You need at least two resume versions to perform a comparison. Upload another version above!');
                }
            }
        } catch (err) {
            setError('Failed to load resumes. Please upload at least two resumes to compare.');
        }
    };

    useEffect(() => {
        fetchResumes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router]);

    const handleCompare = async () => {
        if (!oldResumeId || !newResumeId) {
            setError("Please select two different resume versions to compare.");
            return;
        }

        if (oldResumeId === newResumeId) {
            setError("You cannot compare a resume with itself. Please select a different version.");
            return;
        }

        setLoading(true);
        setError('');
        try {
            const data = await api.get(`/resume/compare?oldResumeId=${oldResumeId}&newResumeId=${newResumeId}`);
            if (data.success) {
                setComparisonData(data.comparison);
            } else {
                setError(data.message || 'Comparison failed');
            }
        } catch (err) {
            setError(err.message || 'Connection error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.type === "application/pdf" || selectedFile.type.startsWith("image/")) {
                setUploadFile(selectedFile);
                setUploadError("");
            } else {
                setUploadError("Please upload a PDF or an image file.");
            }
        }
    };

    const handleUpload = async () => {
        if (!uploadFile) {
            setUploadError("Please select a file first.");
            return;
        }

        setUploadLoading(true);
        setUploadError("");

        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const formData = new FormData();
        formData.append("resume", uploadFile);
        if (user?._id || user?.id) {
            formData.append("profileId", user._id || user.id);
        }

        try {
            const data = await api.post("/resume/upload", formData);

            if (data.resumeId) {
                localStorage.setItem("resumeId", data.resumeId);
                // After upload, we might want to refresh the list or select it
                setUploadFile(null);
                await fetchResumes();
                setNewResumeId(data.resumeId);
            } else {
                setUploadError(data.message || "Something went wrong during upload.");
            }
        } catch (err) {
            setUploadError(err.message || "Failed to connect to the server.");
        } finally {
            setUploadLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-textPrimary">Resume Comparison</h1>
                    <p className="text-textSecondary">Track your professional growth by comparing different resume versions.</p>
                </div>
                <button
                    onClick={() => setShowUpload(true)}
                    className="flex items-center justify-center gap-2 bg-primary hover:bg-primarySoft text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-primary/20 active:scale-95 whitespace-nowrap"
                >
                    <Upload size={20} />
                    Upload New Version
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
                            <h2 className="text-2xl font-bold text-textPrimary">Upload New Resume</h2>
                            <p className="text-textSecondary mt-2">Add a new version to compare against your previous ones.</p>
                        </div>

                        <div className="relative group">
                            <input
                                type="file"
                                className="absolute inset-0 z-10 cursor-pointer opacity-0"
                                accept=".pdf,image/*"
                                onChange={handleFileChange}
                            />
                            <div className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center gap-4 transition-all ${uploadFile ? 'border-primary bg-primary/5' : 'border-border group-hover:border-primary/50'}`}>
                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <FileText size={32} />
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-medium text-textPrimary">
                                        {uploadFile ? uploadFile.name : "Click or drag to select file"}
                                    </p>
                                    <p className="text-xs text-textMuted mt-1">Supports PDF, JPG, PNG (Max 5MB)</p>
                                </div>
                            </div>
                        </div>

                        {uploadError && (
                            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center text-sm text-red-500">
                                {uploadError}
                            </div>
                        )}

                        <button
                            onClick={handleUpload}
                            disabled={uploadLoading || !uploadFile}
                            className="w-full mt-8 flex items-center justify-center gap-2 bg-primary hover:bg-primarySoft disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-2xl text-lg font-bold shadow-lg transition-all"
                        >
                            {uploadLoading ? (
                                <>
                                    <Loader2 size={24} className="animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                "Upload & Analyze"
                            )}
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-surface p-8 rounded-3xl border border-border shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-textSecondary ml-1">Previous Version</label>
                        <select
                            value={oldResumeId}
                            onChange={(e) => setOldResumeId(e.target.value)}
                            className="w-full bg-background border border-border rounded-2xl px-5 py-4 text-textPrimary appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer"
                        >
                            <option value="">Select an older resume</option>
                            {resumes.map(r => (
                                <option key={r._id} value={r._id}>{r.fileName} (v{r.version})</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-medium text-textSecondary ml-1">Latest Version</label>
                        <div className="flex gap-4">
                            <select
                                value={newResumeId}
                                onChange={(e) => setNewResumeId(e.target.value)}
                                className="w-full bg-background border border-border rounded-2xl px-5 py-4 text-textPrimary appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer"
                            >
                                <option value="">Select a newer resume</option>
                                {resumes.map(r => (
                                    <option key={r._id} value={r._id}>{r.fileName} (v{r.version})</option>
                                ))}
                            </select>
                            <button
                                onClick={handleCompare}
                                disabled={loading || !oldResumeId || !newResumeId}
                                className="bg-primary hover:bg-primarySoft disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-4 rounded-2xl font-semibold transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
                            >
                                {loading ? 'Analyzing...' : 'Compare'}
                                {!loading && <Sparkles size={18} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl flex items-center gap-4 text-red-500">
                    <AlertCircle size={24} />
                    <p>{error}</p>
                </div>
            )}

            {comparisonData ? (
                <div className="space-y-8">
                    <div className="bg-primary/10 border border-primary/20 p-6 rounded-3xl flex items-center justify-between gap-4 animate-in slide-in-from-top-4 duration-500">
                        <div className="flex items-center gap-4 text-textPrimary">
                            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 text-white">
                                <TrendingUp size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg">Growth Analyzed Successfully!</h4>
                                <p className="text-sm text-textSecondary">Your progress metrics have been updated in your dashboard.</p>
                            </div>
                        </div>
                        <Link
                            href="/dashboard/progress"
                            className="flex items-center gap-2 bg-background hover:bg-surface text-textPrimary px-6 py-3 rounded-xl text-sm font-semibold border border-border transition-all"
                        >
                            View Full Progress
                            <ArrowUpRight size={18} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-surface p-8 rounded-3xl border border-border hover:border-primary/30 transition-all group">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-3 bg-green-500/10 rounded-xl group-hover:scale-110 transition-transform">
                                            <Plus className="text-green-500" size={24} />
                                        </div>
                                        <h3 className="text-xl font-semibold text-textPrimary">New Skills Added</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {comparisonData.newSkills.length > 0 ? (
                                            comparisonData.newSkills.map((skill, i) => (
                                                <span key={`new-skill-${skill}-${i}`} className="px-4 py-2 bg-green-500/5 text-green-600 border border-green-500/20 rounded-xl text-sm font-medium">
                                                    {skill}
                                                </span>
                                            ))
                                        ) : (
                                            <p className="text-textMuted italic">No new skills detected</p>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-surface p-8 rounded-3xl border border-border hover:border-red-500/30 transition-all group">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-3 bg-red-500/10 rounded-xl group-hover:scale-110 transition-transform">
                                            <Minus className="text-red-500" size={24} />
                                        </div>
                                        <h3 className="text-xl font-semibold text-textPrimary">Skills Removed</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {comparisonData.removedSkills.length > 0 ? (
                                            comparisonData.removedSkills.map((skill, i) => (
                                                <span key={`removed-skill-${skill}-${i}`} className="px-4 py-2 bg-red-500/5 text-red-500 border border-red-500/20 rounded-xl text-sm font-medium">
                                                    {skill}
                                                </span>
                                            ))
                                        ) : (
                                            <p className="text-textMuted italic">No skills removed</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-surface p-8 rounded-3xl border border-border">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="p-3 bg-primary/10 rounded-xl">
                                        <TrendingUp className="text-primary" size={24} />
                                    </div>
                                    <h3 className="text-xl font-semibold text-textPrimary">Improvement Highlights</h3>
                                </div>
                                <div className="space-y-4">
                                    {comparisonData.improvedAreas.length > 0 ? (
                                        comparisonData.improvedAreas.map((area, i) => (
                                            <div key={`improved-${i}`} className="flex items-start gap-4 p-5 bg-background rounded-2xl border border-border hover:border-primary/50 transition-all">
                                                <div className="mt-1">
                                                    <CheckCircle2 size={20} className="text-primary" />
                                                </div>
                                                <p className="text-textPrimary font-medium leading-relaxed">{area}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-12">
                                            <div className="inline-block p-4 bg-background rounded-full mb-4">
                                                <TrendingUp size={32} className="text-border" />
                                            </div>
                                            <p className="text-textMuted">No significant growth patterns detected between these versions yet.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-1 space-y-8">
                            <div className="bg-gradient-to-br from-surface to-background p-8 rounded-3xl border border-border relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors"></div>
                                <h3 className="text-xl font-semibold text-textPrimary mb-6 relative z-10">Growth Score</h3>
                                <div className="flex items-baseline gap-2 mb-2 relative z-10">
                                    <span className="text-6xl font-bold text-textPrimary">
                                        {comparisonData.growthScore || (comparisonData.newSkills.length * 10 + comparisonData.improvedAreas.length * 20)}%
                                    </span>
                                    <span className="text-primary font-medium">Increase</span>
                                </div>
                                <p className="text-textSecondary text-sm relative z-10">Calculated based on skill acquisition and experience milestones.</p>

                                <div className="mt-8 space-y-4 relative z-10">
                                    <div className="h-2 w-full bg-border rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary transition-all duration-1000"
                                            style={{ width: `${Math.min(100, comparisonData.growthScore || (comparisonData.newSkills.length * 10 + comparisonData.improvedAreas.length * 20))}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-xs font-semibold text-textMuted">
                                        <span>V{resumes.find(r => r._id === oldResumeId)?.version || 1.0}</span>
                                        <span className="text-primary">V{resumes.find(r => r._id === newResumeId)?.version || 2.0}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-surface p-8 rounded-3xl border border-border">
                                <h3 className="text-lg font-semibold text-textPrimary mb-6">Resume Details</h3>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <FileText className="text-textMuted" size={20} />
                                        <div>
                                            <p className="text-xs text-textMuted uppercase tracking-wider font-bold mb-1">Target Role</p>
                                            <p className="text-textPrimary font-medium">
                                                {resumes.find(r => r._id === newResumeId)?.targetRole || 'Not specified'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <Calendar className="text-textMuted" size={20} />
                                        <div>
                                            <p className="text-xs text-textMuted uppercase tracking-wider font-bold mb-1">Analysis Date</p>
                                            <p className="text-textPrimary font-medium">
                                                {resumes.find(r => r._id === newResumeId) ? new Date(resumes.find(r => r._id === newResumeId).createdAt).toLocaleDateString() : 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 pt-4 border-t border-border">
                                        <Zap className="text-primary/70" size={20} />
                                        <div>
                                            <p className="text-xs text-textMuted uppercase tracking-wider font-bold mb-1">Job Readiness Score</p>
                                            <div className="flex items-baseline gap-2">
                                                <p className="text-2xl font-black text-textPrimary">
                                                    {resumes.find(r => r._id === newResumeId)?.atsScore || 0}%
                                                </p>
                                                <span className="text-xs font-bold text-primary">
                                                    {((resumes.find(r => r._id === newResumeId)?.atsScore || 0) - (resumes.find(r => r._id === oldResumeId)?.atsScore || 0)) >= 0 ? '+' : ''}
                                                    {((resumes.find(r => r._id === newResumeId)?.atsScore || 0) - (resumes.find(r => r._id === oldResumeId)?.atsScore || 0))}%
                                                </span>
                                            </div>
                                            <p className="text-[10px] text-textMuted font-bold">VS PREVIOUS VERSION</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-surface border-2 border-dashed border-border rounded-[2.5rem] py-32 text-center shadow-sm">
                    <div className="max-w-md mx-auto space-y-6 px-6">
                        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mx-auto mb-8 animate-pulse">
                            <FileText size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-textPrimary">Ready for Comparison</h3>
                        <p className="text-textSecondary leading-relaxed">
                            Select two versions of your resume above to track your evolution and skill acquisition over time.
                        </p>
                        <div className="pt-4 flex items-center justify-center gap-4 text-sm text-textMuted">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-primary"></div>
                                New Skills
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                Milestones
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
