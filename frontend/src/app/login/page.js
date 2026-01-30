"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const data = await api.post("/auth/login", {
                email: formData.email,
                password: formData.password,
            });

            if (data.success) {
                localStorage.setItem("token", data.user.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                router.push("/upload");
            }
        } catch (err) {
            setError(err.message || "Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
            <div className="w-full max-w-md space-y-8 rounded-2xl border border-border bg-surface p-8 shadow-2xl">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-textPrimary">
                        Novastra
                    </h1>
                    <p className="mt-2 text-textSecondary">
                        Welcome back! Please enter your details
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-sm text-center">
                        {error}
                    </div>
                )}

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
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                type="checkbox"
                                className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-primary"
                            />
                            <label className="ml-2 block text-sm text-textSecondary">
                                Remember me
                            </label>
                        </div>
                        <div className="text-sm">
                            <a href="#" className="font-medium text-primary hover:text-primarySoft">
                                Forgot password?
                            </a>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative flex w-full justify-center rounded-lg bg-primary py-3 text-sm font-semibold text-white transition-all hover:bg-primarySoft focus:outline-none focus:ring-2 focus:ring-primarySoft/50 disabled:opacity-50"
                        >
                            {loading ? "Signing In..." : "Sign In"}
                        </button>
                    </div>

                    <div className="text-center text-sm">
                        <span className="text-textMuted">Don't have an account? </span>
                        <Link
                            href="/signup"
                            className="font-medium text-primary hover:text-primarySoft transition-colors"
                        >
                            Sign up
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
