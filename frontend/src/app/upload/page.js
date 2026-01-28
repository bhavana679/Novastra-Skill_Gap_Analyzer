"use client";

export default function UploadPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-background">
            <div className="max-w-xl w-full bg-surface border border-border p-12 rounded-3xl text-center space-y-6 shadow-2xl">
                <h1 className="text-3xl font-bold text-textPrimary">Upload Your Resume</h1>
                <p className="text-textSecondary">Drag and drop your file here, or click to browse.</p>
                <div className="border-2 border-dashed border-border rounded-2xl p-16 hover:border-primary transition-colors cursor-pointer group">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7C6CFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                    </div>
                </div>
                <button onClick={() => window.history.back()} className="text-textMuted hover:text-textPrimary transition-colors">
                    Go Back
                </button>
            </div>
        </div>
    );
}
