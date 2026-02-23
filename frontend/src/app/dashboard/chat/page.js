"use client";

import { useState, useEffect, useRef } from "react";
import { Sparkles, Send, User, Bot, BrainCircuit, Target, ChevronRight } from "lucide-react";
import { api } from "@/lib/api";
import MarkdownRenderer from "@/components/MarkdownRenderer";

export default function ChatPage() {
    const [messages, setMessages] = useState([
        { role: 'ai', content: "Hi! I&apos;m Novastra, your AI Career Coach. How can I help you accelerate your career journey today?" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({ name: 'User' });
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const userString = localStorage.getItem('user');
        if (userString) setUser(JSON.parse(userString));

        // Fetch Chat History
        const fetchHistory = async () => {
            try {
                const data = await api.get('/ai/history?limit=50');
                if (data.success && data.history.length > 0) {
                    const formattedHistory = data.history.map(h => ({
                        role: h.role,
                        content: h.content
                    }));
                    setMessages(prev => [...formattedHistory, ...prev]); // Prepend history
                }
            } catch (err) {
                console.error("Failed to load chat history", err);
            }
        };
        fetchHistory();

        scrollToBottom();
    }, []); // Run once on mount

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setLoading(true);

        const resumeId = localStorage.getItem("resumeId");

        try {
            // Use api wrapper to ensure Auth headers are sent
            const data = await api.post('/ai/chat', {
                message: userMsg,
                resumeId: resumeId,
                targetRole: "Professional"
            });

            if (data.success) {
                setMessages(prev => [...prev, { role: 'ai', content: data.reply }]);
            } else {
                setMessages(prev => [...prev, { role: 'ai', content: "I'm having trouble connecting right now. Please try again later." }]);
            }
        } catch (error) {
            console.error("Chat Error", error);
            setMessages(prev => [...prev, { role: 'ai', content: "Connection error. Is the backend running?" }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-120px)] space-y-6 animate-in fade-in duration-700">
            <header className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-textPrimary tracking-tight">AI Career <span className="text-primary">Assistant</span></h1>
                    <p className="text-textSecondary text-sm font-medium">Expert guidance on your career path, interview prep, and skill development.</p>
                </div>
                <div className="flex items-center gap-4 bg-surface border border-border px-4 py-2 rounded-2xl">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-textSecondary">AI Engine Online</span>
                </div>
            </header>

            <div className="flex-1 overflow-hidden flex gap-6">
                {/* Chat Area */}
                <div className="flex-1 bg-surface border border-border rounded-[2.5rem] shadow-2xl flex flex-col relative overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                                <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${msg.role === 'user' ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-surface border-border text-primary shadow-sm'
                                        }`}>
                                        {msg.role === 'user' ? <User size={20} /> : <Sparkles size={20} />}
                                    </div>
                                    <div className={`p-5 rounded-[2rem] text-sm font-medium leading-relaxed shadow-sm overflow-hidden ${msg.role === 'user'
                                        ? 'bg-primary text-white rounded-tr-none'
                                        : 'bg-background border border-border text-textSecondary rounded-tl-none'
                                        }`}>
                                        {msg.role === 'user' ? (
                                            <p>{msg.content}</p>
                                        ) : (
                                            <MarkdownRenderer content={msg.content} />
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start animate-pulse">
                                <div className="flex gap-4 max-w-[80%]">
                                    <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-primary">
                                        <Sparkles size={20} />
                                    </div>
                                    <div className="bg-background border border-border p-5 rounded-[2rem] rounded-tl-none flex items-center gap-2">
                                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100" />
                                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200" />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSend} className="p-6 bg-background border-t border-border">
                        <div className="relative flex items-center">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about resumes, skill gaps, or interview tips..."
                                className="w-full bg-surface border border-border rounded-2xl px-6 py-4 pr-16 text-sm font-medium focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 text-textPrimary placeholder:text-textMuted transition-all"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || loading}
                                className="absolute right-2 p-3 bg-primary text-white rounded-xl hover:bg-primarySoft shadow-lg shadow-primary/20 disabled:opacity-50 transition-all active:scale-95"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </form>
                </div>

                {/* Sidebar Suggestions */}
                <div className="hidden lg:flex w-72 flex-col space-y-6">
                    <div className="bg-primary/5 border border-primary/20 p-6 rounded-[2rem] space-y-4">
                        <h3 className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                            <BrainCircuit size={16} /> Suggestions
                        </h3>
                        <div className="space-y-2">
                            {[
                                "How to improve my React skills?",
                                "Review my certification gap.",
                                "Give me Java interview questions.",
                                "Market trends for Full Stack."
                            ].map((sug, i) => (
                                <button
                                    key={i}
                                    onClick={() => setInput(sug)}
                                    className="w-full text-left p-3 text-xs font-bold text-textSecondary hover:bg-primary/10 hover:text-primary rounded-xl transition-all flex items-center justify-between group"
                                >
                                    {sug}
                                    <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-surface border border-border p-6 rounded-[2rem] space-y-4">
                        <h3 className="text-sm font-black uppercase tracking-widest text-textSecondary flex items-center gap-2">
                            <Target size={16} /> Quick Tip
                        </h3>
                        <p className="text-xs font-medium text-textMuted leading-relaxed">
                            Be specific! Instead of &quot;Help me with coding&quot;, try &quot;What are the core concepts of Node.js Event Loop?&quot;
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
