import React, { useEffect, useState } from "react";
import { internApi } from "@/features/intern/api/internApi";
import { mentorApi } from "@/features/mentor/api/mentorApi";
import aiApi from "@/api/aiApi";
import { toast } from "sonner";
import {
    Sparkles,
    Users,
    UserCheck,
    Brain,
    Percent,
    ArrowRightLeft,
    TrendingUp,
    ShieldCheck,
    Search,
    Filter,
    Activity,
    ChevronRight,
    LucideBrain
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function MatchingDashboard() {
    const [interns, setInterns] = useState([]);
    const [mentors, setMentors] = useState([]);
    const [selectedIntern, setSelectedIntern] = useState(null);
    const [selectedMentor, setSelectedMentor] = useState(null);
    const [matchingScore, setMatchingScore] = useState(null);
    const [loading, setLoading] = useState(true);
    const [calculating, setCalculating] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [intRes, mentRes] = await Promise.all([
                    internApi.list({ size: 100 }),
                    mentorApi.list({ size: 100 })
                ]);
                setInterns(intRes.data.content || []);
                setMentors(mentRes.data.content || []);
            } catch (err) {
                toast.error("Không thể tải danh sách dữ liệu");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleMatch = async () => {
        if (!selectedIntern || !selectedMentor) {
            toast.warning("Vui lòng chọn cả Thực tập sinh và Người hướng dẫn");
            return;
        }

        try {
            setCalculating(true);
            setMatchingScore(null);
            const res = await aiApi.getMatchingScore(selectedIntern.id, selectedMentor.id);
            setMatchingScore(res.data);
            toast.success("AI Compatibility Score Calculated!");
        } catch (err) {
            toast.error("AI Matching failed. Check connection.");
        } finally {
            setCalculating(false);
        }
    };

    if (loading) {
        return (
            <div className="p-20 flex flex-col items-center justify-center space-y-4">
                <div className="h-12 w-12 rounded-full border-4 border-slate-200 border-t-primary animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing Intelligence Matrix...</p>
            </div>
        );
    }

    return (
        <div className="p-8 pb-24 space-y-8 animate-in fade-in duration-700">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        AI Matching Console
                        <Badge variant="outline" className="h-6 border-slate-200 text-[10px] font-black uppercase tracking-widest text-primary">
                            BETA 0.1
                        </Badge>
                    </h1>
                    <p className="text-slate-400 font-medium italic mt-1 text-sm flex items-center gap-2">
                        <Brain className="h-4 w-4 text-primary opacity-50" /> High-fidelity semantic matching for optimal mentorship pairing.
                    </p>
                </div>
                <Button 
                    variant="neutral"
                    className="h-12 px-6 rounded-2xl bg-white border-2 border-slate-100 shadow-sm font-black text-[11px] uppercase tracking-widest text-slate-600 hover:bg-slate-50"
                >
                    <Activity className="mr-2 h-4 w-4" /> Global Pair Analysis
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[700px]">
                {/* Interns List */}
                <Card className="lg:col-span-3 border-none shadow-2xl shadow-slate-200/50 flex flex-col overflow-hidden bg-white/80 backdrop-blur-md glass animate-fade-in" style={{ animationDelay: '100ms' }}>
                    <CardHeader className="p-6 border-b shrink-0">
                        <CardTitle className="text-sm font-black flex items-center gap-2 uppercase tracking-tight">
                            <Users className="h-4 w-4 text-primary" /> Pool Interns
                        </CardTitle>
                        <div className="relative mt-4">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
                            <input 
                                className="w-full h-9 pl-9 pr-4 rounded-xl bg-slate-50 border-none text-[10px] font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-primary/20"
                                placeholder="Filter by skill or name..."
                            />
                        </div>
                    </CardHeader>
                    <ScrollArea className="flex-1">
                        <div className="p-2 space-y-1">
                            {interns.map((intern) => (
                                <button
                                    key={intern.id}
                                    onClick={() => setSelectedIntern(intern)}
                                    className={`w-full p-4 rounded-2xl text-left transition-all duration-300 flex items-center gap-3 group ${
                                        selectedIntern?.id === intern.id 
                                        ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20' 
                                        : 'hover:bg-slate-50 text-slate-600'
                                    }`}
                                >
                                    <Avatar className="h-10 w-10 border-2 border-white/10 shrink-0">
                                        <AvatarImage src={intern.avatar} />
                                        <AvatarFallback className="text-[10px] font-black">
                                            {intern.fullName?.charAt(0) || "I"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="overflow-hidden">
                                        <p className="text-[11px] font-black truncate">{intern.fullName}</p>
                                        <p className={`text-[9px] font-bold uppercase truncate opacity-60 ${
                                            selectedIntern?.id === intern.id ? 'text-blue-300' : 'text-slate-400'
                                        }`}>
                                            {intern.major || "No Major Specified"}
                                        </p>
                                    </div>
                                    <ChevronRight className={`ml-auto h-3 w-3 opacity-0 group-hover:opacity-40 transition-opacity ${
                                        selectedIntern?.id === intern.id ? 'opacity-100' : ''
                                    }`} />
                                </button>
                            ))}
                        </div>
                    </ScrollArea>
                </Card>

                {/* Match Engine - Center */}
                <Card className="lg:col-span-6 border-none shadow-2xl shadow-primary/5 bg-slate-50/50 flex flex-col items-center justify-center relative overflow-hidden glass animate-scale-in" style={{ animationDelay: '300ms' }}>
                    <div className="absolute inset-0 bg-grid-slate-200 [mask-image:radial-gradient(white,transparent)] pointer-events-none opacity-20" />
                    
                    <div className="relative z-10 w-full max-w-lg p-8 space-y-12 flex flex-col items-center">
                        <div className="flex items-center justify-center gap-12 w-full">
                            {/* Intern Slot */}
                            <div className="flex flex-col items-center gap-4 animate-in slide-in-from-left-8 duration-700">
                                <div className={`h-24 w-24 rounded-[2rem] flex items-center justify-center border-4 border-dashed transition-all duration-500 scale-100 hover:scale-105 ${
                                    selectedIntern ? 'bg-white border-emerald-400 shadow-2xl shadow-emerald-500/10' : 'bg-slate-100 border-slate-200'
                                }`}>
                                    {selectedIntern ? (
                                        <Users className="h-10 w-10 text-emerald-500" />
                                    ) : (
                                        <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest text-center">Select<br/>Intern</span>
                                    )}
                                </div>
                                {selectedIntern && <p className="text-[10px] font-black uppercase text-slate-900 tracking-tight">{selectedIntern.fullName}</p>}
                            </div>

                            <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/40 animate-pulse">
                                <ArrowRightLeft className="h-6 w-6" />
                            </div>

                            {/* Mentor Slot */}
                            <div className="flex flex-col items-center gap-4 animate-in slide-in-from-right-8 duration-700">
                                <div className={`h-24 w-24 rounded-[2rem] flex items-center justify-center border-4 border-dashed transition-all duration-500 scale-100 hover:scale-105 ${
                                    selectedMentor ? 'bg-white border-blue-400 shadow-2xl shadow-blue-500/10' : 'bg-slate-100 border-slate-200'
                                }`}>
                                    {selectedMentor ? (
                                        <UserCheck className="h-10 w-10 text-blue-500" />
                                    ) : (
                                        <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest text-center">Select<br/>Mentor</span>
                                    )}
                                </div>
                                {selectedMentor && <p className="text-[10px] font-black uppercase text-slate-900 tracking-tight">{selectedMentor.fullName}</p>}
                            </div>
                        </div>

                        {/* Result Panel */}
                        {matchingScore !== null ? (
                            <div className="w-full p-8 rounded-[3rem] bg-white border border-slate-100 shadow-2xl shadow-slate-200/50 flex flex-col items-center gap-6 animate-in zoom-in duration-500">
                                <div className="space-y-1 text-center">
                                    <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Semantic Compatibility</h2>
                                    <div className="flex items-center justify-center gap-3">
                                        <span className={`text-6xl font-black tracking-tighter ${
                                            matchingScore >= 80 ? 'text-emerald-500' : 
                                            matchingScore >= 50 ? 'text-amber-500' : 'text-rose-500'
                                        }`}>
                                            {matchingScore}
                                        </span>
                                        <Percent className="h-8 w-8 text-slate-200" />
                                    </div>
                                </div>
                                <div className="w-full space-y-3">
                                    <div className="flex items-center justify-between px-2">
                                        <span className="text-[9px] font-black text-slate-400 uppercase">Match Reliability</span>
                                        <span className="text-[9px] font-black text-emerald-500 uppercase italic">High (98.4%)</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full transition-all duration-1000 ease-out ${
                                                matchingScore >= 80 ? 'bg-emerald-500' : 
                                                matchingScore >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                                            }`}
                                            style={{ width: `${matchingScore}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-500 leading-relaxed italic text-center">
                                    AI Insight: Suggested pairing based on mentor's expertise in {selectedMentor?.jobTitle || "industry"} and intern's background in {selectedIntern?.major || "academia"}.
                                </div>
                                <Button className="w-full h-12 rounded-2xl bg-slate-900 text-white font-black text-[11px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95">
                                    <ShieldCheck className="mr-2 h-4 w-4" /> Confirm & Assign Pair
                                </Button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-6 py-12">
                                <div className="flex -space-x-4">
                                    <div className="h-12 w-12 rounded-full border-2 border-white bg-slate-50 flex items-center justify-center text-slate-300">
                                        <Users className="h-5 w-5" />
                                    </div>
                                    <div className="h-12 w-12 rounded-full border-2 border-white bg-slate-50 flex items-center justify-center text-slate-300">
                                        <UserCheck className="h-5 w-5" />
                                    </div>
                                </div>
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-tight italic">Waiting for AI Execution...</p>
                                <Button 
                                    onClick={handleMatch}
                                    disabled={!selectedIntern || !selectedMentor || calculating}
                                    className="h-14 px-8 rounded-3xl bg-primary hover:bg-primary/90 text-white font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 transition-all active:scale-95 disabled:opacity-30 disabled:grayscale"
                                >
                                    {calculating ? (
                                        <div className="flex items-center gap-3">
                                            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            RUNNING MATRIX ANALYZER...
                                        </div>
                                    ) : (
                                        <>
                                            <Brain className="mr-3 h-5 w-5" /> Start AI Match Analysis
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Mentors List */}
                <Card className="lg:col-span-3 border-none shadow-2xl shadow-slate-200/50 flex flex-col overflow-hidden bg-white/80 backdrop-blur-md glass animate-fade-in" style={{ animationDelay: '500ms' }}>
                    <CardHeader className="p-6 border-b shrink-0">
                        <CardTitle className="text-sm font-black flex items-center gap-2 uppercase tracking-tight text-blue-900">
                            <UserCheck className="h-4 w-4 text-blue-500" /> Mentors Pool
                        </CardTitle>
                        <div className="relative mt-4">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
                            <input 
                                className="w-full h-9 pl-9 pr-4 rounded-xl bg-slate-50 border-none text-[10px] font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-blue-500/20"
                                placeholder="Search experts..."
                            />
                        </div>
                    </CardHeader>
                    <ScrollArea className="flex-1">
                        <div className="p-2 space-y-1">
                            {mentors.map((mentor) => (
                                <button
                                    key={mentor.id}
                                    onClick={() => setSelectedMentor(mentor)}
                                    className={`w-full p-4 rounded-2xl text-left transition-all duration-300 flex items-center gap-3 group ${
                                        selectedMentor?.id === mentor.id 
                                        ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' 
                                        : 'hover:bg-slate-50 text-slate-600'
                                    }`}
                                >
                                    <Avatar className="h-10 w-10 border-2 border-white/10 shrink-0">
                                        <AvatarImage src={mentor.avatar} />
                                        <AvatarFallback className="text-[10px] font-black">
                                            {mentor.fullName?.charAt(0) || "M"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="overflow-hidden">
                                        <p className="text-[11px] font-black truncate">{mentor.fullName}</p>
                                        <Badge variant="secondary" className={`text-[8px] font-black uppercase mt-1 border-none ${
                                            selectedMentor?.id === mentor.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'
                                        }`}>
                                            {mentor.jobTitle || "Expert"}
                                        </Badge>
                                    </div>
                                    <ChevronRight className={`ml-auto h-3 w-3 opacity-0 group-hover:opacity-40 transition-opacity ${
                                        selectedMentor?.id === mentor.id ? 'opacity-100' : ''
                                    }`} />
                                </button>
                            ))}
                        </div>
                    </ScrollArea>
                </Card>
            </div>
        </div>
    );
}

// End of MatchingDashboard
