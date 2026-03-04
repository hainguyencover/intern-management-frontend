import React, { useEffect, useMemo, useState } from "react";
import { mentorApi } from "../../api/mentorApi";
import {
    UserCheck,
    Mail,
    Phone,
    Briefcase,
    ShieldCheck,
    Activity,
    PlusCircle,
    RefreshCw,
    UserPlus,
    Lock,
    X,
    ChevronRight,
    Users,
    Search,
    BookOpen,
    Info,
    MoreHorizontal
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
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import { toast } from "sonner";
import MentorForm from "./MentorForm";

export default function HrMentors() {
    const [form, setForm] = useState({
        email: "",
        password: "",
        fullName: "",
        phone: "",
        title: "",
    });

    const [submitting, setSubmitting] = useState(false);
    const [mentors, setMentors] = useState([]);
    const [loadingList, setLoadingList] = useState(false);

    const canSubmit = useMemo(() => {
        return (
            form.email.trim() &&
            form.password.trim() &&
            form.fullName.trim()
        );
    }, [form]);

    const fetchMentors = async () => {
        setLoadingList(true);
        try {
            const res = await mentorApi.list?.({ page: 0, size: 20 });
            const data = res?.data;
            const items = Array.isArray(data) ? data : data?.content || [];
            setMentors(items);
        } catch {
            // ignore
        } finally {
            setLoadingList(false);
        }
    };

    useEffect(() => {
        fetchMentors();
    }, []);

    const onChange = (key) => (e) => {
        setForm((p) => ({ ...p, [key]: e.target.value }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = {
                email: form.email.trim(),
                password: form.password,
                fullName: form.fullName.trim(),
                phone: form.phone?.trim() || null,
                title: form.title?.trim() || null,
            };

            await mentorApi.create(payload);
            toast.success(`Mentor initialized: ${payload.email}`);

            setForm({
                email: "",
                password: "",
                fullName: "",
                phone: "",
                title: "",
            });

            await fetchMentors();
        } catch (err) {
            toast.error(err?.response?.data?.message || "Initialization failure");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="p-8 pb-20 space-y-10 animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic flex items-center gap-3 uppercase">
                        Mentor Orchestration
                        <Badge variant="outline" className="h-6 border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            RESOURCES
                        </Badge>
                    </h1>
                    <p className="text-slate-400 font-medium italic mt-1 text-sm flex items-center gap-2">
                        <Briefcase className="h-4 w-4 opacity-50" /> Manage commanding units and resource allocation.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        onClick={fetchMentors}
                        className="h-12 px-4 rounded-2xl text-slate-400 hover:text-slate-900 font-black text-[10px] uppercase tracking-widest group"
                    >
                        <RefreshCw className="mr-2 h-4 w-4 transition-transform group-active:rotate-180 duration-500" /> Sync Registry
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left: Quick Initialization */}
                <div className="lg:col-span-12 xl:col-span-4 space-y-8">
                    <Card className="border-none shadow-2xl shadow-slate-100 rounded-[2.5rem] overflow-hidden bg-slate-900 text-white p-2">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-lg font-black text-white tracking-tighter italic flex items-center gap-2 uppercase">
                                <UserPlus className="h-5 w-5 text-primary" /> Quick Initialization
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <form onSubmit={onSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1 italic flex items-center gap-2">
                                        <Mail className="h-3 w-3" /> Designated Email *
                                    </label>
                                    <Input
                                        value={form.email}
                                        onChange={onChange("email")}
                                        placeholder="mentor@registry.gov"
                                        className="h-12 rounded-xl border-none bg-white/5 shadow-inner font-bold focus:ring-primary/20"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1 italic flex items-center gap-2">
                                        <Lock className="h-3 w-3" /> Access Credentials *
                                    </label>
                                    <Input
                                        type="password"
                                        value={form.password}
                                        onChange={onChange("password")}
                                        placeholder="••••••"
                                        className="h-12 rounded-xl border-none bg-white/5 shadow-inner font-bold focus:ring-primary/20"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1 italic flex items-center gap-2">
                                        <Briefcase className="h-3 w-3" /> Personnel Name *
                                    </label>
                                    <Input
                                        value={form.fullName}
                                        onChange={onChange("fullName")}
                                        placeholder="Full Name Descriptor"
                                        className="h-12 rounded-xl border-none bg-white/5 shadow-inner font-bold focus:ring-primary/20"
                                    />
                                </div>

                                <Separator className="bg-white/5" />

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1 italic flex items-center gap-2">
                                        <Activity className="h-3 w-3" /> Technical Rank (Title)
                                    </label>
                                    <Input
                                        value={form.title}
                                        onChange={onChange("title")}
                                        placeholder="Senior Officer / Lead"
                                        className="h-12 rounded-xl border-none bg-white/5 shadow-inner font-bold focus:ring-primary/20"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={!canSubmit || submitting}
                                    className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-500 font-black text-[11px] uppercase tracking-widest text-white shadow-2xl shadow-indigo-600/20 transition-all active:scale-95 disabled:opacity-40"
                                >
                                    {submitting ? (
                                        <span className="flex items-center gap-3">
                                            <div className="h-4 w-4 border-2 border-white/20 border-t-white animate-spin rounded-full" />
                                            Initializing...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <PlusCircle className="h-4 w-4" /> Execute Initialization
                                        </span>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <div className="p-8 rounded-[2.5rem] bg-indigo-50 border border-indigo-100 space-y-4">
                        <div className="flex items-center gap-2 text-indigo-600">
                            <ShieldCheck className="h-4 w-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest italic">Governance Notice</span>
                        </div>
                        <p className="text-[11px] font-bold text-slate-500 leading-relaxed italic">
                            Adding a mentor creates a strategic command unit. Ensure all rank descriptors are accurate for optimal asset orchestration.
                        </p>
                    </div>
                </div>

                {/* Right: Mentor Registry */}
                <div className="lg:col-span-12 xl:col-span-8 space-y-8">
                    <Card className="border-none shadow-2xl shadow-slate-200/60 overflow-hidden rounded-[2.5rem] bg-white">
                        <CardHeader className="p-8 pb-4 bg-slate-50 border-b border-slate-100">
                            <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 italic flex items-center gap-2">
                                <Users className="h-4 w-4" /> Resource Registry
                            </CardTitle>
                        </CardHeader>
                        <Table>
                            <TableHeader className="bg-slate-900">
                                <TableRow className="hover:bg-slate-900 border-none">
                                    <TableHead className="w-16 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 py-5 pl-8">ID</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 py-5 italic">Command Profile</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 py-5 italic text-center">Contact</TableHead>
                                    <TableHead className="text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 py-5 pr-8 italic">Asset Allocation</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loadingList ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <TableRow key={i} className="border-slate-50">
                                            <TableCell className="pl-8"><div className="h-6 w-8 bg-slate-50 animate-pulse rounded-lg" /></TableCell>
                                            <TableCell><div className="h-10 w-48 bg-slate-50 animate-pulse rounded-xl" /></TableCell>
                                            <TableCell><div className="h-6 w-32 mx-auto bg-slate-50 animate-pulse rounded-lg" /></TableCell>
                                            <TableCell className="pr-8 text-right"><div className="h-9 w-24 ml-auto bg-slate-50 animate-pulse rounded-xl" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : mentors.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-60 text-center bg-slate-50/20">
                                            <div className="flex flex-col items-center justify-center space-y-4">
                                                <div className="h-16 w-16 rounded-full bg-white shadow-xl flex items-center justify-center">
                                                    <Briefcase className="h-8 w-8 text-slate-100" />
                                                </div>
                                                <div className="space-y-1">
                                                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 italic">No Strategic Assets Discovered</h3>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    mentors.map((m) => (
                                        <TableRow key={m.id} className="group hover:bg-slate-50/80 border-slate-50 transition-colors">
                                            <TableCell className="py-5 pl-8 font-black text-slate-300 text-xs italic">#{m.id}</TableCell>
                                            <TableCell className="py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                        <UserCheck className="h-5 w-5" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-black text-slate-900 tracking-tight text-base italic group-hover:text-primary transition-colors">
                                                            {m.fullName}
                                                        </span>
                                                        <Badge variant="outline" className="w-fit h-5 px-2 border-slate-200 text-slate-400 font-black text-[9px] uppercase tracking-tighter mt-0.5">
                                                            {m.title || "REGULAR RANK"}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-5 text-center">
                                                <div className="flex flex-col items-center gap-1">
                                                    <span className="text-[11px] font-bold text-slate-500 italic flex items-center gap-1.5">
                                                        <Mail className="h-3 w-3" /> {m.email}
                                                    </span>
                                                    {m.phone && (
                                                        <span className="text-[10px] font-medium text-slate-400 italic flex items-center gap-1.5">
                                                            <Phone className="h-2.5 w-2.5" /> {m.phone}
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-5 pr-8 text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-10 w-10 rounded-2xl text-slate-300 hover:text-slate-900 hover:bg-white hover:shadow-xl transition-all"
                                                >
                                                    <MoreHorizontal className="h-5 w-5" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                        <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-between items-center italic">
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Administrative Resource Logging Active</span>
                            <div className="flex gap-2">
                                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Registry Sync Complete</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
