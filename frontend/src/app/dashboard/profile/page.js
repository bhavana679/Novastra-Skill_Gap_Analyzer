"use client";

export default function ProfileDashboard() {
    return (
        <div className="min-h-screen bg-background text-textPrimary flex flex-col items-center justify-center p-8">
            <div className="max-w-2xl w-full bg-surface border border-border rounded-3xl p-12 text-center space-y-6 shadow-2xl">
                <h1 className="text-4xl font-bold">Profile Dashboard</h1>
                <p className="text-textSecondary text-lg">
                    Welcome to your Novastra profile. Your personalized learning roadmap is being processed.
                </p>
                <div className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 bg-background rounded-2xl border border-border">
                        <h3 className="text-primary font-bold text-xl mb-2">My Skills</h3>
                        <p className="text-textMuted italic text-sm">Skills analysis loading...</p>
                    </div>
                    <div className="p-6 bg-background rounded-2xl border border-border">
                        <h3 className="text-primary font-bold text-xl mb-2">My Roadmap</h3>
                        <p className="text-textMuted italic text-sm">Roadmap steps loading...</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
