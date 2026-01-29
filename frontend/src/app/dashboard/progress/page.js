"use client";

import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';
import { Target, CheckCircle2, Clock, BookOpen, TrendingUp } from 'lucide-react';

const skillData = [
    { name: 'Frontend', completed: 85, inProgress: 10, remaining: 5 },
    { name: 'Backend', completed: 60, inProgress: 25, remaining: 15 },
    { name: 'UI/UX', completed: 40, inProgress: 40, remaining: 20 },
    { name: 'DevOps', completed: 20, inProgress: 30, remaining: 50 },
    { name: 'Testing', completed: 70, inProgress: 15, remaining: 15 },
];

const overallStatus = [
    { name: 'Completed', value: 12, color: '#7C6CFF' },
    { name: 'In-progress', value: 5, color: '#9B8CFF' },
    { name: 'Remaining', value: 8, color: '#2A2F55' },
];

const categoryDistribution = [
    { name: 'Technical', value: 45, color: '#7C6CFF' },
    { name: 'Soft Skills', value: 25, color: '#9B8CFF' },
    { name: 'Tools', value: 30, color: '#4F46E5' },
];

export default function ProgressPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-[#EAEAFF]">Progress Tracking</h1>
                <p className="text-[#B4B8E6]">Monitor your learning journey and skill development analytics.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#11172A] p-6 rounded-2xl border border-[#2A2F55] flex items-center space-x-4">
                    <div className="p-3 bg-green-500/10 rounded-xl">
                        <CheckCircle2 className="text-green-500" size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-[#B4B8E6]">Completed Skills</p>
                        <h3 className="text-2xl font-bold text-[#EAEAFF]">12</h3>
                    </div>
                </div>

                <div className="bg-[#11172A] p-6 rounded-2xl border border-[#2A2F55] flex items-center space-x-4">
                    <div className="p-3 bg-[#7C6CFF]/10 rounded-xl">
                        <Clock className="text-[#7C6CFF]" size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-[#B4B8E6]">In Progress</p>
                        <h3 className="text-2xl font-bold text-[#EAEAFF]">5</h3>
                    </div>
                </div>

                <div className="bg-[#11172A] p-6 rounded-2xl border border-[#2A2F55] flex items-center space-x-4">
                    <div className="p-3 bg-[#2A2F55] rounded-xl">
                        <BookOpen className="text-[#B4B8E6]" size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-[#B4B8E6]">Remaining</p>
                        <h3 className="text-2xl font-bold text-[#EAEAFF]">8</h3>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-[#11172A] p-8 rounded-3xl border border-[#2A2F55] shadow-xl">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-semibold text-[#EAEAFF] flex items-center gap-2">
                            <TrendingUp size={20} className="text-[#7C6CFF]" />
                            Skill Proficiency
                        </h3>
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={skillData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2A2F55" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    stroke="#8A90C2"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#8A90C2"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `${value}%`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#11172A',
                                        border: '1px solid #2A2F55',
                                        borderRadius: '12px',
                                        color: '#EAEAFF'
                                    }}
                                    itemStyle={{ color: '#EAEAFF' }}
                                />
                                <Bar
                                    dataKey="completed"
                                    name="Proficiency"
                                    fill="#7C6CFF"
                                    radius={[6, 6, 0, 0]}
                                    barSize={40}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-[#11172A] p-8 rounded-3xl border border-[#2A2F55] shadow-xl">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-semibold text-[#EAEAFF] flex items-center gap-2">
                            <Target size={20} className="text-[#7C6CFF]" />
                            Overall Status
                        </h3>
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={overallStatus}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={120}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {overallStatus.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#11172A',
                                        border: '1px solid #2A2F55',
                                        borderRadius: '12px'
                                    }}
                                />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    formatter={(value) => <span className="text-[#B4B8E6] text-sm">{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-8">
                <div className="lg:col-span-1 bg-[#11172A] p-8 rounded-3xl border border-[#2A2F55] shadow-xl">
                    <h3 className="text-xl font-semibold text-[#EAEAFF] mb-8">Skill Distribution</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryDistribution}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    dataKey="value"
                                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                                >
                                    {categoryDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#11172A',
                                        border: '1px solid #2A2F55',
                                        borderRadius: '12px'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="lg:col-span-2 bg-[#11172A] p-8 rounded-3xl border border-[#2A2F55] shadow-xl">
                    <h3 className="text-xl font-semibold text-[#EAEAFF] mb-6">Recent Achievements</h3>
                    <div className="space-y-4">
                        {[
                            { title: "React Hooks Mastery", date: "2 days ago", score: "95%" },
                            { title: "Database Optimization", date: "1 week ago", score: "88%" },
                            { title: "Tailwind UI Components", date: "2 weeks ago", score: "92%" }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-[#0B1020] rounded-2xl border border-[#2A2F55] hover:border-[#7C6CFF]/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#7C6CFF]/10 flex items-center justify-center text-[#7C6CFF]">
                                        <CheckCircle2 size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-[#EAEAFF] font-medium">{item.title}</h4>
                                        <p className="text-xs text-[#8A90C2]">{item.date}</p>
                                    </div>
                                </div>
                                <div className="text-[#7C6CFF] font-bold text-lg">{item.score}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
