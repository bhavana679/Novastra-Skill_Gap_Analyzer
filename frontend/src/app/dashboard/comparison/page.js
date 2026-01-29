"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
    Loader2,
    ArrowUpRight
} from 'lucide-react';

export default function ComparisonPage() {
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

    useEffect(() => {
        fetchResumes();
    }, []);

    const fetchResumes = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/resume/all');
            const data = await response.json();
            if (data.success) {
                setResumes(data.resumes);
                if (data.resumes.length >= 2) {
                    setOldResumeId(data.resumes[1]._id);
                    setNewResumeId(data.resumes[0]._id);
                } else if (data.resumes.length === 1) {
                    setNewResumeId(data.resumes[0]._id);
                }
            }
        } catch (err) {
            setError('Failed to load resumes. Please upload at least two resumes to compare.');
        }
    };

    const handleCompare = async () => {
        if (!oldResumeId || !newResumeId) return;

        setLoading(true);
        setError('');
        try {
            const response = await fetch(`http://localhost:5001/api/resume/compare?oldResumeId=${oldResumeId}&newResumeId=${newResumeId}`);
            const data = await response.json();
            if (data.success) {
                setComparisonData(data.comparison);
            } else {
                setError(data.message || 'Comparison failed');
            }
        } catch (err) {
            setError('Connection error. Please try again.');
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

        const formData = new FormData();
        formData.append("resume", uploadFile);

        try {
            const response = await fetch("http://localhost:5001/api/resume/upload", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setShowUpload(false);
                setUploadFile(null);
                await fetchResumes();
                setNewResumeId(data.resumeId);
            } else {
                setUploadError(data.message || "Something went wrong during upload.");
            }
        } catch (err) {
            setUploadError("Failed to connect to the server.");
        } finally {
            setUploadLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-[#EAEAFF]">Resume Comparison</h1>
                    <p className="text-[#B4B8E6]">Track your professional growth by comparing different resume versions.</p>
                </div>
                <button
                    onClick={() => setShowUpload(true)}
                    className="flex items-center justify-center gap-2 bg-[#7C6CFF] hover:bg-[#9B8CFF] text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-[#7C6CFF]/20 active:scale-95 whitespace-nowrap"
                >
                    <Upload size={20} />
                    Upload New Version
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
                            <h2 className="text-2xl font-bold text-[#EAEAFF]">Upload New Resume</h2>
                            <p className="text-[#B4B8E6] mt-2">Add a new version to compare against your previous ones.</p>
                        </div>

                        <div className="relative group">
                            <input
                                type="file"
                                className="absolute inset-0 z-10 cursor-pointer opacity-0"
                                accept=".pdf,image/*"
                                onChange={handleFileChange}
                            />
                            <div className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center gap-4 transition-all ${uploadFile ? 'border-[#7C6CFF] bg-[#7C6CFF]/5' : 'border-[#2A2F55] group-hover:border-[#7C6CFF]/50'}`}>
                                <div className="w-16 h-16 rounded-full bg-[#7C6CFF]/10 flex items-center justify-center text-[#7C6CFF]">
                                    <FileText size={32} />
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-medium text-[#EAEAFF]">
                                        {uploadFile ? uploadFile.name : "Click or drag to select file"}
                                    </p>
                                    <p className="text-xs text-[#8A90C2] mt-1">Supports PDF, JPG, PNG (Max 5MB)</p>
                                </div>
                            </div>
                        </div>

                        {uploadError && (
                            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center text-sm text-red-400">
                                {uploadError}
                            </div>
                        )}

                        <button
                            onClick={handleUpload}
                            disabled={uploadLoading || !uploadFile}
                            className="w-full mt-8 flex items-center justify-center gap-2 bg-[#7C6CFF] hover:bg-[#9B8CFF] disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-2xl text-lg font-bold shadow-lg transition-all"
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

            <div className="bg-[#11172A] p-8 rounded-3xl border border-[#2A2F55] shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-[#B4B8E6] ml-1">Previous Version</label>
                        <select
                            value={oldResumeId}
                            onChange={(e) => setOldResumeId(e.target.value)}
                            className="w-full bg-[#0B1020] border border-[#2A2F55] rounded-2xl px-5 py-4 text-[#EAEAFF] appearance-none focus:outline-none focus:ring-2 focus:ring-[#7C6CFF]/50 transition-all cursor-pointer"
                        >
                            <option value="">Select an older resume</option>
                            {resumes.map(r => (
                                <option key={r._id} value={r._id}>{r.fileName} (v{r.version})</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-medium text-[#B4B8E6] ml-1">Latest Version</label>
                        <div className="flex gap-4">
                            <select
                                value={newResumeId}
                                onChange={(e) => setNewResumeId(e.target.value)}
                                className="w-full bg-[#0B1020] border border-[#2A2F55] rounded-2xl px-5 py-4 text-[#EAEAFF] appearance-none focus:outline-none focus:ring-2 focus:ring-[#7C6CFF]/50 transition-all cursor-pointer"
                            >
                                <option value="">Select a newer resume</option>
                                {resumes.map(r => (
                                    <option key={r._id} value={r._id}>{r.fileName} (v{r.version})</option>
                                ))}
                            </select>
                            <button
                                onClick={handleCompare}
                                disabled={loading || !oldResumeId || !newResumeId}
                                className="bg-[#7C6CFF] hover:bg-[#9B8CFF] disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-4 rounded-2xl font-semibold transition-all shadow-lg shadow-[#7C6CFF]/20 flex items-center gap-2"
                            >
                                {loading ? 'Analyzing...' : 'Compare'}
                                {!loading && <Sparkles size={18} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl flex items-center gap-4 text-red-400">
                    <AlertCircle size={24} />
                    <p>{error}</p>
                </div>
            )}

            {comparisonData ? (
                <div className="space-y-8">
                    <div className="bg-[#7C6CFF]/10 border border-[#7C6CFF]/20 p-6 rounded-3xl flex items-center justify-between gap-4 animate-in slide-in-from-top-4 duration-500">
                        <div className="flex items-center gap-4 text-[#EAEAFF]">
                            <div className="w-12 h-12 bg-[#7C6CFF] rounded-2xl flex items-center justify-center shadow-lg shadow-[#7C6CFF]/20">
                                <TrendingUp size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg">Growth Analyzed Successfully!</h4>
                                <p className="text-sm text-[#B4B8E6]">Your progress metrics have been updated in your dashboard.</p>
                            </div>
                        </div>
                        <Link
                            href="/dashboard/progress"
                            className="flex items-center gap-2 bg-[#0B1020] hover:bg-[#11172A] text-[#EAEAFF] px-6 py-3 rounded-xl text-sm font-semibold border border-[#2A2F55] transition-all"
                        >
                            View Full Progress
                            <ArrowUpRight size={18} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-[#11172A] p-8 rounded-3xl border border-[#2A2F55] hover:border-[#7C6CFF]/30 transition-all group">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-3 bg-green-500/10 rounded-xl group-hover:scale-110 transition-transform">
                                            <Plus className="text-green-500" size={24} />
                                        </div>
                                        <h3 className="text-xl font-semibold text-[#EAEAFF]">New Skills Added</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {comparisonData.newSkills.length > 0 ? (
                                            comparisonData.newSkills.map((skill, i) => (
                                                <span key={i} className="px-4 py-2 bg-green-500/5 text-green-400 border border-green-500/20 rounded-xl text-sm font-medium">
                                                    {skill}
                                                </span>
                                            ))
                                        ) : (
                                            <p className="text-[#8A90C2] italic">No new skills detected</p>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-[#11172A] p-8 rounded-3xl border border-[#2A2F55] hover:border-red-500/30 transition-all group">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-3 bg-red-500/10 rounded-xl group-hover:scale-110 transition-transform">
                                            <Minus className="text-red-500" size={24} />
                                        </div>
                                        <h3 className="text-xl font-semibold text-[#EAEAFF]">Skills Removed</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {comparisonData.removedSkills.length > 0 ? (
                                            comparisonData.removedSkills.map((skill, i) => (
                                                <span key={i} className="px-4 py-2 bg-red-500/5 text-red-400 border border-red-500/20 rounded-xl text-sm font-medium">
                                                    {skill}
                                                </span>
                                            ))
                                        ) : (
                                            <p className="text-[#8A90C2] italic">No skills removed</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#11172A] p-8 rounded-3xl border border-[#2A2F55]">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="p-3 bg-[#7C6CFF]/10 rounded-xl">
                                        <TrendingUp className="text-[#7C6CFF]" size={24} />
                                    </div>
                                    <h3 className="text-xl font-semibold text-[#EAEAFF]">Improvement Highlights</h3>
                                </div>
                                <div className="space-y-4">
                                    {comparisonData.improvedAreas.length > 0 ? (
                                        comparisonData.improvedAreas.map((area, i) => (
                                            <div key={i} className="flex items-start gap-4 p-5 bg-[#0B1020] rounded-2xl border border-[#2A2F55] hover:border-[#7C6CFF]/50 transition-all">
                                                <div className="mt-1">
                                                    <CheckCircle2 size={20} className="text-[#7C6CFF]" />
                                                </div>
                                                <p className="text-[#EAEAFF] font-medium leading-relaxed">{area}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-12">
                                            <div className="inline-block p-4 bg-[#0B1020] rounded-full mb-4">
                                                <TrendingUp size={32} className="text-[#2A2F55]" />
                                            </div>
                                            <p className="text-[#8A90C2]">No significant growth patterns detected between these versions yet.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-1 space-y-8">
                            <div className="bg-gradient-to-br from-[#11172A] to-[#0B1020] p-8 rounded-3xl border border-[#2A2F55] relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#7C6CFF]/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-[#7C6CFF]/10 transition-colors"></div>
                                <h3 className="text-xl font-semibold text-[#EAEAFF] mb-6 relative z-10">Growth Score</h3>
                                <div className="flex items-baseline gap-2 mb-2 relative z-10">
                                    <span className="text-6xl font-bold text-[#EAEAFF]">
                                        {comparisonData.newSkills.length * 10 + comparisonData.improvedAreas.length * 20}%
                                    </span>
                                    <span className="text-[#7C6CFF] font-medium">Increase</span>
                                </div>
                                <p className="text-[#B4B8E6] text-sm relative z-10">Calculated based on skill acquisition and experience milestones.</p>

                                <div className="mt-8 space-y-4 relative z-10">
                                    <div className="h-2 w-full bg-[#2A2F55] rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-[#7C6CFF] transition-all duration-1000"
                                            style={{ width: `${Math.min(100, comparisonData.newSkills.length * 10 + comparisonData.improvedAreas.length * 20)}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-xs font-semibold text-[#8A90C2]">
                                        <span>V{resumes.find(r => r._id === oldResumeId)?.version || 1.0}</span>
                                        <span className="text-[#7C6CFF]">V{resumes.find(r => r._id === newResumeId)?.version || 2.0}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#11172A] p-8 rounded-3xl border border-[#2A2F55]">
                                <h3 className="text-lg font-semibold text-[#EAEAFF] mb-6">Resume Details</h3>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <FileText className="text-[#8A90C2]" size={20} />
                                        <div>
                                            <p className="text-xs text-[#8A90C2] uppercase tracking-wider font-bold mb-1">Target Role</p>
                                            <p className="text-[#EAEAFF] font-medium">
                                                {resumes.find(r => r._id === newResumeId)?.targetRole || 'Not specified'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <Calendar className="text-[#8A90C2]" size={20} />
                                        <div>
                                            <p className="text-xs text-[#8A90C2] uppercase tracking-wider font-bold mb-1">Analysis Date</p>
                                            <p className="text-[#EAEAFF] font-medium">
                                                {resumes.find(r => r._id === newResumeId) ? new Date(resumes.find(r => r._id === newResumeId).createdAt).toLocaleDateString() : 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-[#11172A]/50 border-2 border-dashed border-[#2A2F55] rounded-[2.5rem] py-32 text-center">
                    <div className="max-w-md mx-auto space-y-6 px-6">
                        <div className="w-20 h-20 bg-[#7C6CFF]/10 rounded-3xl flex items-center justify-center text-[#7C6CFF] mx-auto mb-8 animate-pulse">
                            <FileText size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-[#EAEAFF]">Ready for Comparison</h3>
                        <p className="text-[#B4B8E6] leading-relaxed">
                            Select two versions of your resume above to track your evolution and skill acquisition over time.
                        </p>
                        <div className="pt-4 flex items-center justify-center gap-4 text-sm text-[#8A90C2]">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-[#7C6CFF]"></div>
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
