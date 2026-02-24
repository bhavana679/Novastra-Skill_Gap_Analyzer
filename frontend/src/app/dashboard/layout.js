"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
    User,
    Map,
    BookOpen,
    BarChart3,
    ArrowLeftRight,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Menu,
    X,
    MessageSquare
} from "lucide-react";
import { api } from "@/lib/api";

export default function DashboardLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [user, setUser] = useState({ name: 'User' });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token || token === "undefined" || token === "null") {
            router.push(`/login?redirect=${pathname}`);
            return;
        }

        const userString = localStorage.getItem('user');
        if (userString) {
            try {
                setUser(JSON.parse(userString));
            } catch (e) {
                console.error("Failed to parse user from localStorage");
            }
        }
    }, [router, pathname]);

    const navLinks = [
        { name: "Profile", href: "/dashboard/profile", icon: User },
        { name: "Learning Path", href: "/dashboard/learning-path", icon: Map },
        { name: "Resources", href: "/dashboard/resources", icon: BookOpen },
        { name: "Progress", href: "/dashboard/progress", icon: BarChart3 },
        { name: "Comparison", href: "/dashboard/comparison", icon: ArrowLeftRight },
        { name: "AI Assistant", href: "/dashboard/chat", icon: MessageSquare },
    ];

    const handleLogout = () => {
        api.logout();
    };

    return (
        <div className="flex min-h-screen bg-background text-textPrimary">
            <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="fixed top-4 left-4 z-50 p-2 bg-surface border border-border rounded-lg lg:hidden"
            >
                {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            <aside
                className={`fixed left-0 top-0 h-screen bg-surface border-r border-border flex flex-col z-40 transition-all duration-300 ease-in-out ${isCollapsed ? "w-20" : "w-64"
                    } ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
            >
                <div className={`p-6 border-b border-border flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}>
                    {!isCollapsed && (
                        <Link href="/" className="text-2xl font-bold tracking-tighter text-textPrimary hover:text-primary transition-colors">
                            Novastra<span className="text-primary">.</span>
                        </Link>
                    )}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="hidden lg:flex p-1.5 hover:bg-border/30 rounded-lg text-textMuted transition-colors"
                    >
                        {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto p-4 space-y-2 mt-4">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        const Icon = link.icon;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${isActive
                                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                                    : "text-textSecondary hover:bg-border/30 hover:text-textPrimary"
                                    }`}
                            >
                                <Icon size={20} className={isCollapsed ? "mx-auto" : ""} />
                                {!isCollapsed && <span className="font-medium whitespace-nowrap">{link.name}</span>}

                                {isCollapsed && (
                                    <div className="absolute left-full ml-4 px-2 py-1 bg-surface border border-border text-textPrimary text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                                        {link.name}
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-border">
                    <div className={`flex items-center bg-background/50 rounded-2xl border border-border transition-all ${isCollapsed ? "p-2 justify-center" : "p-4 space-x-3"
                        }`}>
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">
                            {user.name[0]}
                        </div>
                        {!isCollapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate text-textPrimary">{user.name}</p>
                                <p className="text-xs text-textMuted truncate">Free Plan</p>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleLogout}
                        className={`w-full mt-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center justify-center ${isCollapsed ? "" : "space-x-2 px-4"
                            }`}
                    >
                        <LogOut size={18} />
                        {!isCollapsed && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            <main className={`flex-1 transition-all duration-300 min-h-screen relative ${isCollapsed ? "lg:ml-20" : "lg:ml-64"
                }`}>
                <div className="p-8 max-w-7xl mx-auto pt-16 lg:pt-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
