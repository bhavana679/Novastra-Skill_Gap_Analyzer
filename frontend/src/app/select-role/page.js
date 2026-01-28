"use client";

import { useEffect, useState } from "react";

export default function SelectRolePage() {
    const [resumeId, setResumeId] = useState("");

    useEffect(() => {
        const id = localStorage.getItem("resumeId");
        if (id) setResumeId(id);
    }, []);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
            <div className="w-full max-w-2xl space-y-8 rounded-3xl border border-border bg-surface p-8 shadow-2xl md:p-12 text-center">
                <h1 className="text-3xl font-bold text-textPrimary">Success! Resume Uploaded</h1>
                <p className="text-textSecondary">
                    Resume ID: <span className="font-mono text-primary">{resumeId || "Loading..."}</span>
                </p>
                <div className="mt-8">
                    <p className="text-textMuted italic">
                        This is a placeholder for the Role Selection page. Now that your resume is processed,
                        you can select your target job role.
                    </p>
                </div>
            </div>
        </div>
    );
}
