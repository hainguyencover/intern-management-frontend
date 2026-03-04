import React, { useEffect, useMemo, useState } from "react";
import { internApi } from "../../api/internApi";
import { mentorApi } from "../../api/mentorApi";
import {
    Users,
    UserCheck,
    Briefcase,
    ShieldCheck,
    Activity,
    Search,
    RefreshCw,
    MoreHorizontal,
    PlusCircle,
    ChevronRight,
    SearchCheck,
    Info,
    X,
    UserPlus,
    Hash,
    Mail,
    GraduationCap,
    Clock,
    UserCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "../../components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Separator } from "../../components/ui/separator";
import { toast } from "sonner";

export default function HrInterns() {
    const [interns, setInterns] = useState([]);
    const [loading, setLoading] = useState(false);
    const [mentors, setMentors] = useState([]);
    const [loadingMentors, setLoadingMentors] = useState(false);

    // modal state
    const [openAssign, setOpenAssign] = useState(false);
    const [selectedIntern, setSelectedIntern] = useState(null);
    const [mentorId, setMentorId] = useState("");
    const [savingAssign, setSavingAssign] = useState(false);

    const fetchInterns = async () => {
        setLoading(true);
        try {
            const res = await internApi.list({ page: 0, size: 50 });
            const data = res.data;
            const items = Array.isArray(data) ? data : data?.content || [];
            setInterns(items);
        } catch (err) {
            toast.error("Failed to acquire personnel registry");
        } finally {
            setLoading(false);
        }
    };

    const fetchMentors = async () => {
        setLoadingMentors(true);
        try {
            const res = await mentorApi.list?.({ page: 0, size: 100 });
            const data = res?.data;
            const items = Array.isArray(data) ? data : data?.content || [];
            setMentors(items);
        } catch {
            setMentors([]);
        } finally {
            setLoadingMentors(false);
        }
    };

    useEffect(() => {
        fetchInterns();
        fetchMentors();
    }, []);

    const openAssignModal = (intern) => {
        setSelectedIntern(intern);
        setMentorId(intern.mentorId ? intern.mentorId.toString() : "");
        setOpenAssign(true);
    };

    const closeAssignModal = () => {
        setOpenAssign(false);
        setSelectedIntern(null);
        setMentorId("");
    };

    const onAssign = async () => {
        if (!selectedIntern || !mentorId) return;
        setSavingAssign(true);
        try {
            await internApi.assignMentor(selectedIntern.id, Number(mentorId));
            toast.success(`Strategic asset assigned to Mentor #${mentorId}`);
            closeAssignModal();
            fetchInterns();
        } catch (err) {
            toast.error(err?.response?.data?.message || "Assignment protocol failed");
        } finally {
            setSavingAssign(false);
        }
    };

    const onRemoveMentor = async (intern) => {
        if (!confirm(`Confirm detachment of Mentor from Intern #${intern.id}?`)) return;
        try {
            await internApi.removeMentor(intern.id);
            toast.success("Mentor detachment successful");
            fetchInterns();
        } catch (err) {
            toast.error(err?.response?.data?.message || "Detachment protocol failed");
        }
    };

    return (
        <div className="p-8 pb-20 space-y-8 animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic flex items-center gap-3 uppercase">
                        Strategic Asset Hub
                        <Badge variant="outline" className="h-6 border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            GOVERNANCE
                        </Badge>
                    </h1>
                    <p className="text-slate-400 font-medium italic mt-1 text-sm flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 opacity-50" /> Orchestrate personnel deployment and mentor assignments.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        onClick={() => { fetchMentors(); fetchInterns(); }}
                        className="h-12 px-4 rounded-2xl text-slate-400 hover:text-slate-900 font-black text-[10px] uppercase tracking-widest group"
                    >
                        <RefreshCw className="mr-2 h-4 w-4 transition-transform group-active:rotate-180 duration-500" /> Refresh Intelligence
                    </Button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-2xl shadow-slate-100 rounded-3xl bg-white/50 backdrop-blur-xl p-6">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <Users className="h-6 w-6" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Assets</span>
                            <span className="text-2xl font-black text-slate-900 tracking-tighter">{interns.length}</span>
                        </div>
                    </div>
                </Card>
                <Card className="border-none shadow-2xl shadow-slate-100 rounded-3xl bg-white/50 backdrop-blur-xl p-6">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                            <UserCheck className="h-6 w-6" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Deployed Assets</span>
                            <span className="text-2xl font-black text-slate-900 tracking-tighter">
                                {interns.filter(i => i.mentorId).length}
                            </span>
                        </div>
                    </div>
                </Card>
                <Card className="border-none shadow-2xl shadow-slate-100 rounded-3xl bg-white/50 backdrop-blur-xl p-6 border-l-4 border-l-amber-500">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500">
                            <Clock className="h-6 w-6" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Standby Assets</span>
                            <span className="text-2xl font-black text-slate-900 tracking-tighter">
                                {interns.filter(i => !i.mentorId).length}
                            </span>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Assets Table */}
            <Card className="border-none shadow-2xl shadow-slate-200/60 overflow-hidden rounded-3xl bg-white">
                <Table>
                    <TableHeader className="bg-slate-900">
                        <TableRow className="hover:bg-slate-900 border-none">
                            <TableHead className="w-[80px] text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 py-6 pl-8">ID</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 py-6 italic">Strategic Asset Profile</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 py-6 italic">Deployment Status</TableHead>
                            <TableHead className="text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 py-6 pr-8">Operational Controls</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i} className="border-slate-50">
                                    <TableCell className="pl-8"><div className="h-6 w-8 bg-slate-50 animate-pulse rounded-lg" /></TableCell>
                                    <TableCell><div className="h-12 w-64 bg-slate-50 animate-pulse rounded-xl" /></TableCell>
                                    <TableCell><div className="h-8 w-32 bg-slate-50 animate-pulse rounded-full" /></TableCell>
                                    <TableCell className="pr-8 text-right"><div className="h-10 w-24 ml-auto bg-slate-50 animate-pulse rounded-xl" /></TableCell>
                                </TableRow>
                            ))
                        ) : interns.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-60 text-center bg-slate-50/20">
                                    <div className="flex flex-col items-center justify-center space-y-4">
                                        <div className="h-20 w-20 rounded-full bg-white shadow-xl flex items-center justify-center">
                                            <Users className="h-10 w-10 text-slate-100" />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-300">No Assets Discovered</h3>
                                            <p className="text-slate-400 font-medium italic text-sm">Registry is currently void of personnel data.</p>
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            interns.map((i) => (
                                <tr key={i.id} className="group hover:bg-slate-50/80 border-b border-slate-50 transition-colors">
                                    <TableCell className="py-6 pl-8 font-black text-slate-300 text-xs">#{i.id}</TableCell>
                                    <TableCell className="py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary/10 group-hover:text-primary transition-all relative">
                                                <UserCircle className="h-6 w-6" />
                                                <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/20 rounded-2xl transition-all" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-base font-black text-slate-900 tracking-tight italic group-hover:text-primary transition-colors">
                                                    {i.fullName || i.name || "UNIDENTIFIED PERSONNEL"}
                                                </span>
                                                <span className="text-[11px] font-bold text-slate-400 italic flex items-center gap-2">
                                                    <Mail className="h-3 w-3" /> {i.email || "N/A"}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-6">
                                        {i.mentorId ? (
                                            <div className="flex items-center gap-2">
                                                <Badge className="bg-emerald-50 text-emerald-600 border-none shadow-none font-black text-[9px] uppercase tracking-widest h-7 px-3">
                                                    <UserCheck className="h-3 w-3 mr-1.5" /> DEPLOYED
                                                </Badge>
                                                <span className="text-[10px] font-black text-slate-400 italic">
                                                    to Mentor #{i.mentorId}
                                                </span>
                                            </div>
                                        ) : (
                                            <Badge className="bg-amber-50 text-amber-600 border-none shadow-none font-black text-[9px] uppercase tracking-widest h-7 px-3">
                                                <Clock className="h-3 w-3 mr-1.5" /> STANDBY
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="py-6 pr-8 text-right">
                                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">
                                            <Button
                                                size="sm"
                                                onClick={() => openAssignModal(i)}
                                                className="h-10 px-4 rounded-xl bg-slate-900 hover:bg-black font-black text-[10px] uppercase tracking-widest text-white shadow-xl shadow-slate-200 transition-all active:scale-95"
                                            >
                                                {i.mentorId ? "Reassign Unit" : "Assign Unit"}
                                            </Button>
                                            {i.mentorId && (
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => onRemoveMentor(i)}
                                                    className="h-10 w-10 rounded-xl text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-all"
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </tr>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Card>

            {/* Assignment Dialog */}
            <Dialog open={openAssign} onOpenChange={setOpenAssign}>
                <DialogContent className="max-w-md rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden bg-white">
                    <DialogHeader className="p-10 bg-slate-900 text-white space-y-2 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12">
                            <Activity className="h-32 w-32" />
                        </div>
                        <DialogTitle className="text-2xl font-black leading-tight flex items-center gap-3 uppercase tracking-tighter italic relative z-10">
                            <Activity className="h-6 w-6 text-primary" />
                            Command Assignment
                        </DialogTitle>
                        <DialogDescription className="text-slate-400 italic font-medium relative z-10">
                            Allocate strategic asset <span className="text-white font-black">#{selectedIntern?.id}</span> to a designated mentor.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="p-10 space-y-8">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 italic">Designated Mentor Unit</label>
                                {loadingMentors && <div className="h-4 w-4 border-2 border-primary/20 border-t-primary animate-spin rounded-full" />}
                            </div>

                            <Select
                                value={mentorId}
                                onValueChange={setMentorId}
                            >
                                <SelectTrigger className="h-14 rounded-2xl border-none bg-slate-100/50 shadow-inner font-bold italic text-slate-600 px-6 focus:ring-primary/20">
                                    <SelectValue placeholder="-- Select Commanding Officer --" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-none shadow-2xl p-2 max-h-[300px]">
                                    {mentors.map(m => (
                                        <SelectItem key={m.id} value={m.id.toString()} className="rounded-xl py-3 font-bold transition-all data-[highlighted]:bg-slate-50">
                                            <div className="flex flex-col gap-0.5">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[9px] font-black text-primary bg-primary/5 px-1.5 rounded">#{m.id}</span>
                                                    <span className="text-slate-700">{m.fullName || m.email}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] text-slate-400 italic">
                                                    <Briefcase className="h-3 w-3" /> {m.title || "Field Officer"}
                                                </div>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 space-y-3">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Info className="h-4 w-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest italic tracking-tighter">Strategic Impact Notice</span>
                                </div>
                                <p className="text-[11px] font-bold text-slate-400 leading-relaxed italic">
                                    Deployment will grant the mentor administrative visibility and command over this intern's tactical progress and evaluation protocols.
                                </p>
                            </div>
                        </div>

                        <DialogFooter className="pt-4 flex flex-col gap-3">
                            <Button
                                type="button"
                                disabled={!mentorId || savingAssign}
                                onClick={onAssign}
                                className="h-16 rounded-[1.5rem] bg-slate-900 hover:bg-black text-white font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-slate-200 transition-all active:scale-95 disabled:opacity-40 w-full"
                            >
                                {savingAssign ? (
                                    <span className="flex items-center gap-3">
                                        <div className="h-4 w-4 border-2 border-white/20 border-t-white animate-spin rounded-full" />
                                        EXECUTING ASSIGNMENT...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2 font-black italic">
                                        <ChevronRight className="h-4 w-4" /> COMMIT ASSIGNMENT
                                    </span>
                                )}
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={closeAssignModal}
                                className="h-14 rounded-[1.5rem] text-slate-400 font-black text-[11px] uppercase tracking-widest hover:bg-slate-50 w-full"
                            >
                                <X className="h-4 w-4 mr-2" /> ABORT PROCESS
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
