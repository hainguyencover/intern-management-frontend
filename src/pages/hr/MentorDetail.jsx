import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { adminUserApi } from "../../api/adminApi";
import { internApi } from "../../api/internApi";
import { toast } from "sonner";
import {
    ChevronLeft,
    ShieldCheck,
    Mail,
    Phone,
    Briefcase,
    Users,
    Activity,
    Target,
    Zap,
    UserPlus,
    Search,
    Clock,
    Award,
    MoreHorizontal
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Skeleton } from "../../components/ui/skeleton";
import { Separator } from "../../components/ui/separator";

export default function MentorDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [mentor, setMentor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [interns, setInterns] = useState([]);
    const [selectedInternId, setSelectedInternId] = useState("");
    const [internSearch, setInternSearch] = useState("");

    useEffect(() => {
        fetchMentor();
        fetchUnassignedInterns();
    }, [id]);

    const fetchMentor = async () => {
        try {
            setLoading(true);
            const res = await adminUserApi.getUserById(id);
            setMentor(res.data);
        } catch (err) {
            toast.error("Resource acquisition failed");
        } finally {
            setLoading(false);
        }
    };

    const fetchUnassignedInterns = async () => {
        try {
            const res = await internApi.search({ size: 100 });
            if (res.data && res.data.content) {
                setInterns(res.data.content);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleAssign = async (internId) => {
        const targetId = internId || selectedInternId;
        if (!targetId) return;
        try {
            await internApi.assignMentor(targetId, id);
            toast.success("Strategic deployment successful");
            fetchUnassignedInterns();
            setSelectedInternId("");
        } catch (err) {
            toast.error("Deployment failure");
        }
    };

    if (loading) {
        return (
            <div className="p-20 flex flex-col items-center justify-center space-y-4">
                <div className="h-16 w-16 rounded-full border-4 border-slate-100 border-t-slate-900 animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Synchronizing Strategic Asset...</p>
            </div>
        );
    }

    if (!mentor) {
        return (
            <div className="p-20 text-center">
                <Award className="h-16 w-16 mx-auto text-slate-200 mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-tight">Designated Mentor not found in registry.</p>
            </div>
        );
    }

    return (
        <div className="p-8 pb-24 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Navigation & Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-6">
                    <Button
                        variant="ghost"
                        onClick={() => navigate("/hr/mentors")}
                        className="h-9 px-3 rounded-xl text-slate-400 hover:text-slate-900 font-black text-[10px] uppercase tracking-widest group"
                    >
                        <ChevronLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to Strategic Command
                    </Button>
                    <div className="flex items-start gap-6">
                        <div className="h-24 w-24 rounded-[2.5rem] bg-slate-900 flex items-center justify-center text-white shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                            <Award className="h-10 w-10" />
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-3">
                                <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic">
                                    {mentor.fullName}
                                </h1>
                                <Badge className="bg-emerald-500 text-white border-none font-black text-[9px] uppercase tracking-[0.2em] h-5">
                                    ELITE STATUS
                                </Badge>
                            </div>
                            <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.3em] flex items-center gap-2">
                                <ShieldCheck className="h-3 w-3 text-emerald-500" /> Authorized Strategic Mentor
                            </p>
                            <div className="flex gap-4 mt-4">
                                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                                    <span className="text-xs font-bold text-slate-600 font-mono underline decoration-slate-200 underline-offset-4">{mentor.email}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                                    <Activity className="h-3.5 w-3.5 text-emerald-500" />
                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Active Status</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <Button variant="outline" className="h-14 px-8 rounded-2xl border-slate-200 font-black text-[11px] uppercase tracking-widest text-slate-400 hover:text-slate-900 hover:bg-white shadow-xl shadow-slate-100 transition-all">
                        Synchronize Data
                    </Button>
                    <Button className="h-14 px-10 rounded-2xl bg-slate-900 border-none hover:bg-black font-black text-[11px] uppercase tracking-widest text-white shadow-2xl shadow-slate-200 transition-all active:scale-95">
                        Initialize Training Group
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Stats & Profile */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-black italic tracking-tighter">
                        <Card className="border-none shadow-xl bg-indigo-600 text-white rounded-[2rem] overflow-hidden relative group">
                            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-150 transition-transform duration-700">
                                <Users className="h-20 w-20" />
                            </div>
                            <CardContent className="p-8">
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase tracking-widest opacity-60">TACTICAL_STRENGTH</span>
                                    <span className="text-5xl mt-2">12</span>
                                    <span className="text-xs mt-4 opacity-80">ACTIVE DEPLOYMENTS</span>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-none shadow-xl bg-slate-900 text-white rounded-[2rem] overflow-hidden relative group">
                            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-150 transition-transform duration-700">
                                <Target className="h-20 w-20" />
                            </div>
                            <CardContent className="p-8">
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase tracking-widest opacity-60">SUCCESS_RATE</span>
                                    <span className="text-5xl mt-2">98%</span>
                                    <span className="text-xs mt-4 opacity-80">GRADUATION METRIC</span>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-none shadow-xl bg-emerald-500 text-white rounded-[2rem] overflow-hidden relative group">
                            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-150 transition-transform duration-700">
                                <Zap className="h-20 w-20" />
                            </div>
                            <CardContent className="p-8">
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase tracking-widest opacity-60">WORKLOAD_INDEX</span>
                                    <span className="text-5xl mt-2">OPT</span>
                                    <span className="text-xs mt-4 opacity-80">OPTIMAL CAPACITY</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Deployment Interface */}
                    <Card className="border-none shadow-2xl shadow-slate-100 rounded-[2.5rem] overflow-hidden bg-white/50 backdrop-blur-xl">
                        <CardHeader className="p-10 pb-4 border-b border-slate-50">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-2xl font-black text-slate-900 tracking-tighter italic">Unit Reinforcement</CardTitle>
                                    <CardDescription className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">Assign additional personnel to this strategic asset</CardDescription>
                                </div>
                                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                    <UserPlus className="h-6 w-6 text-primary" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="p-10 pb-6">
                                <div className="relative group">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                                    <Input
                                        placeholder="Scan personnel database for matching candidates..."
                                        className="h-14 pl-12 rounded-2xl border-none bg-slate-100/50 shadow-inner font-bold focus-visible:ring-primary/20"
                                        value={internSearch}
                                        onChange={(e) => setInternSearch(e.target.value)}
                                    />
                                </div>
                            </div>
                            <ScrollArea className="h-[400px]">
                                <div className="px-10 pb-10 space-y-4">
                                    {interns.length === 0 ? (
                                        <div className="py-20 text-center space-y-4">
                                            <div className="h-16 w-16 mx-auto rounded-full bg-slate-50 flex items-center justify-center">
                                                <Search className="h-8 w-8 text-slate-200" />
                                            </div>
                                            <p className="text-xs text-slate-300 font-black uppercase tracking-[0.2em] italic">No available personnel discovered in registry</p>
                                        </div>
                                    ) : interns.filter(i => i.fullName?.toLowerCase().includes(internSearch.toLowerCase())).map(int => (
                                        <div key={int.id} className="group flex items-center justify-between p-5 rounded-3xl border-2 border-dashed border-slate-50 hover:border-primary hover:bg-primary/5 transition-all duration-300">
                                            <div className="flex items-center gap-5">
                                                <div className="h-14 w-14 rounded-2xl bg-white shadow-sm flex items-center justify-center font-black text-slate-300 group-hover:text-primary transition-colors text-lg italic">
                                                    {int.fullName?.[0]}
                                                </div>
                                                <div className="flex flex-col text-left">
                                                    <span className="text-lg font-black text-slate-900 tracking-tighter">{int.fullName}</span>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <Badge variant="outline" className="border-slate-100 text-slate-400 font-black text-[9px] uppercase tracking-widest">{int.studentCode}</Badge>
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">{int.university}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button onClick={() => handleAssign(int.id)} className="h-11 px-8 rounded-xl bg-slate-900 hover:bg-black font-black text-[10px] uppercase tracking-[0.2em] text-white shadow-xl shadow-slate-200 transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0">
                                                DEPLOY
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Information & Secondary Stats */}
                <div className="lg:col-span-4 space-y-8">
                    <Card className="border-none shadow-2xl shadow-slate-100 rounded-[2.5rem] overflow-hidden bg-white">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] italic flex items-center gap-2">
                                <Clock className="h-4 w-4 text-primary" /> CORE REGISTRY
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 pt-2 space-y-6">
                            <div className="space-y-4">
                                <div className="p-5 rounded-2xl bg-slate-50/50 border border-slate-100">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-1">
                                        PRIMARY_ACCESS_KEY
                                    </span>
                                    <p className="text-sm font-bold text-slate-900 font-mono italic">{mentor.email}</p>
                                </div>
                                <div className="p-5 rounded-2xl bg-slate-50/50 border border-slate-100">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-1">
                                        OPERATIONAL_STATUS
                                    </span>
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <p className="text-xs font-black text-emerald-600 uppercase tracking-widest">ACTIVE / ENGAGED</p>
                                    </div>
                                </div>
                                <div className="p-5 rounded-2xl bg-slate-50/50 border border-slate-100">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-1">
                                        UNIT_ASSIGNMENT
                                    </span>
                                    <p className="text-xs font-black text-slate-900 uppercase tracking-widest italic mt-1">CORE INFRASTRUCTURE SERVICE</p>
                                </div>
                            </div>

                            <Separator className="bg-slate-50" />

                            <div className="space-y-4">
                                <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">SPECIALIZATIONS</h4>
                                <div className="flex flex-wrap gap-2">
                                    {['System Architecture', 'Backend Engineering', 'Security Governance', 'Cloud Infrastructure'].map(tag => (
                                        <Badge key={tag} className="bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-100 rounded-lg py-1 px-3 font-bold text-[9px] uppercase tracking-widest">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-2xl shadow-slate-100 rounded-[2.5rem] overflow-hidden bg-slate-900 text-white p-10 relative">
                        <div className="absolute top-0 right-0 p-6 opacity-10">
                            <Award className="h-24 w-24" />
                        </div>
                        <div className="relative z-10 space-y-6">
                            <h3 className="text-xl font-black italic tracking-tighter">Strategic Impact</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-60">
                                    <span>Leadership</span>
                                    <span>95%</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full w-[95%] bg-amber-400 rounded-full" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-60">
                                    <span>Technical Mentorship</span>
                                    <span>88%</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full w-[88%] bg-indigo-500 rounded-full" />
                                </div>
                            </div>
                            <div className="pt-4 flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                    <Briefcase className="h-5 w-5 text-amber-400" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">EXECUTIVE_RANK</span>
                                    <span className="text-sm font-black italic tracking-tighter">Senior Technical Consultant</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
