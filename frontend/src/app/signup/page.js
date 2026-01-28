"use client";

import Link from "next/link";
import { useState } from "react";

export default function SignupPage() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
            <div className="w-full max-w-md space-y-8 rounded-2xl border border-border bg-surface p-8 shadow-2xl">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-textPrimary">
                        Novastra
                    </h1>
                    <p className="mt-2 text-textSecondary">
                        Create your account to start analyzing
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-textSecondary">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    type="email"
                                    required
                                    className="block w-full rounded-lg border border-border bg-background px-4 py-3 text-textPrimary outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({ ...formData, email: e.target.value })
                                    }
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-textSecondary">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    type="password"
                                    required
                                    className="block w-full rounded-lg border border-border bg-background px-4 py-3 text-textPrimary outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData({ ...formData, password: e.target.value })
                                    }
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-textSecondary">
                                Confirm Password
                            </label>
                            <div className="mt-1">
                                <input
                                    type="password"
                                    required
                                    className="block w-full rounded-lg border border-border bg-background px-4 py-3 text-textPrimary outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={(e) =>
                                        setFormData({ ...formData, confirmPassword: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative flex w-full justify-center rounded-lg bg-primary py-3 text-sm font-semibold text-white transition-all hover:bg-primarySoft focus:outline-none focus:ring-2 focus:ring-primarySoft/50"
                        >
                            Sign Up
                        </button>
                    </div>

                    <div className="text-center text-sm">
                        <span className="text-textMuted">Already have an account? </span>
                        <Link
                            href="/login"
                            className="font-medium text-primary hover:text-primarySoft transition-colors"
                        >
                            Log in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
