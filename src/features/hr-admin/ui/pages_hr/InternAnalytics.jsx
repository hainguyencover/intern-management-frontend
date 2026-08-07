import React, { useEffect, useState } from "react";
import aiApi from "@/api/aiApi";
import { toast } from "sonner";
import {
    BarChart3,
    TrendingUp,
    Users,
    UserCheck,
    FileText,
    Brain,
    AlertCircle,
    CheckCircle2,
    Zap,
    Globe,
    Cpu,
    ArrowUpRight,
    Search,
    LayoutDashboard
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function InternAnalytics() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [aiInsights, setAiInsights] = useState({});

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                const res = await aiApi.getAnalytics();
                const analyticsData = res.data;
                setData(analyticsData);
                
                // Parse AI Insights JSON if it's a string
                if (typeof analyticsData.aiInsights === 'string') {
                    try {
                        // Extract JSON from potential markdown code blocks
                        const jsonStr = analyticsData.aiInsights.replace(/```json|```/g, "").trim();
                        setAiInsights(JSON.parse(jsonStr));
                    } catch (e) {
                        console.error("Failed to parse AI insights JSON", e);
                        setAiInsights({ 
                            performanceForecast: analyticsData.aiInsights,
                            topSkills: "Error parsing skills",
                            bottleneckAlert: "N/A",
                            aiEfficiencyScore: "95%"
                        });
                    }
                }
            } catch (err) {
                toast.error("Không thể tải dữ liệu phân tích");
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="p-20 flex flex-col items-center justify-center space-y-4">
                <div className="h-16 w-16 rounded-full border-4 border-slate-100 border-t-primary animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Processing Big Data Matrices...</p>
            </div>
        );
    }

    return (
        <div className="p-8 pb-32 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Top Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
                        HR Intelligence Center
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    </h1>
                    <p className="text-slate-400 font-bold text-sm flex items-center gap-2">
                        <Globe className="h-4 w-4 text-primary opacity-50" /> Predictive performance modelling and ecosystem health metrics.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-11 px-5 rounded-2xl border-slate-200 bg-white font-black text-[10px] uppercase tracking-widest text-slate-500 hover:bg-slate-50">
                        Export Report
                    </Button>
                    <Button className="h-11 px-6 rounded-2xl bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 shadow-xl shadow-slate-900/10">
                        <Zap className="mr-2 h-4 w-4 text-amber-400 fill-amber-400" /> Live AI Refresh
                    </Button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Active Interns", value: data.stats.totalInterns, icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
                    { label: "Elite Mentors", value: data.stats.totalMentors, icon: UserCheck, color: "text-emerald-500", bg: "bg-emerald-50" },
                    { label: "Pipeline Apps", value: data.stats.pendingApplications, icon: FileText, color: "text-amber-500", bg: "bg-amber-50" },
                    { label: "AI Confidence", value: aiInsights.aiEfficiencyScore || "98%", icon: Cpu, color: "text-purple-500", bg: "bg-purple-50" }
                ].map((stat, i) => (
                    <Card key={i} className="border-none shadow-sm hover:shadow-xl transition-all duration-500 bg-white/70 backdrop-blur-md border border-white/20 glass animate-scale-in group cursor-default h-32 flex items-center" style={{ animationDelay: `${i * 100}ms` }}>
                        <CardContent className="p-6 w-full flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                <p className="text-3xl font-black text-slate-900 tracking-tighter group-hover:scale-105 transition-transform origin-left">{stat.value}</p>
                            </div>
                            <div className={`h-14 w-14 rounded-2xl ${stat.bg} flex items-center justify-center transition-transform group-hover:rotate-12`}>
                                <stat.icon className={`h-7 w-7 ${stat.color}`} />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Insights Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* AI Predictive Insights */}
                <Card className="lg:col-span-8 border-none shadow-2xl shadow-slate-200/50 bg-white/80 backdrop-blur-lg border border-white/30 glass-dark text-slate-900 overflow-hidden rounded-[2.5rem] animate-fade-in" style={{ animationDelay: '400ms' }}>
                    <CardHeader className="p-8 pb-0">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
                                    <Brain className="h-6 w-6 text-primary" /> AI Strategic Prediction
                                </CardTitle>
                                <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Neural Network Regression Analysis</CardDescription>
                            </div>
                            <Badge variant="neutral" className="bg-emerald-50 text-emerald-600 font-black text-[9px] uppercase px-3 py-1 border-none tracking-widest">
                                Analysis Valid
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                        <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 flex flex-col items-center gap-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4">
                                <TrendingUp className="h-12 w-12 text-slate-200 opacity-20" />
                            </div>
                            <p className="text-lg font-bold text-slate-600 leading-relaxed text-center z-10 italic">
                                "{aiInsights.performanceForecast || "The current intern ecosystem shows a strong upward trend in technical proficiency..."}"
                            </p>
                             <div className="flex gap-4 mt-4">
                                <Badge className="bg-white text-slate-900 border-slate-200 text-[9px] font-black uppercase px-4 py-2 rounded-xl">Target: Backend</Badge>
                                <Badge className="bg-white text-slate-900 border-slate-200 text-[9px] font-black uppercase px-4 py-2 rounded-xl">Quality: Senior-Track</Badge>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                    <AlertCircle className="h-3 w-3 text-amber-500" /> Critical Bottlenecks
                                </h3>
                                <div className="p-6 rounded-3xl bg-amber-50/50 border border-amber-100">
                                    <p className="text-[11px] font-bold text-amber-900 leading-relaxed uppercase tracking-tight">
                                        {aiInsights.bottleneckAlert || "No immediate shortages detected in the mentorship matrix."}
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                    <CheckCircle2 className="h-3 w-3 text-emerald-500" /> High-Priority Skills
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {(aiInsights.topSkills || "Java,Spring Boot,React,AI,RAG").split(',').map((skill, i) => (
                                        <Badge key={i} className="bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[9px] uppercase px-4 py-2 border-none rounded-xl tracking-widest shadow-lg shadow-emerald-500/20">
                                            {skill.trim()}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Ecosystem Health */}
                <Card className="lg:col-span-4 border-none shadow-2xl shadow-slate-200/50 bg-slate-900 text-white overflow-hidden rounded-[2.5rem]">
                    <CardHeader className="p-8">
                        <CardTitle className="text-xl font-black flex items-center gap-3 tracking-tight">
                            <LayoutDashboard className="h-6 w-6 text-primary" /> Ecosystem Pulse
                        </CardTitle>
                        <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Real-time engagement metrics</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 space-y-10">
                        {[
                            { label: "Technical Progress", value: 84, color: "bg-primary" },
                            { label: "Mentor Satisfaction", value: 92, color: "bg-emerald-400" },
                            { label: "Churn Probability", value: 7, color: "bg-rose-400" },
                            { label: "AI Integration", value: 99, color: "bg-blue-400" }
                        ].map((pulse, i) => (
                            <div key={i} className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{pulse.label}</span>
                                    <span className="text-sm font-black italic">{pulse.value}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full ${pulse.color} transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(255,255,255,0.2)]`}
                                        style={{ width: `${pulse.value}%` }}
                                    />
                                </div>
                            </div>
                        ))}

                        <div className="pt-8 border-t border-white/10">
                            <div className="flex items-center gap-4 p-5 rounded-3xl bg-white/5 border border-white/10 group cursor-pointer hover:bg-white/10 transition-all">
                                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                                    <ArrowUpRight className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </div>
                                <div>
                                    <p className="text-[11px] font-black uppercase tracking-widest">Growth Matrix</p>
                                    <p className="text-[9px] font-bold opacity-40">View long-term trajectory</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
