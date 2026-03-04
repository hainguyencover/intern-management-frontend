import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { programGroupService } from "../../services/programGroupService";
import { programService } from "../../services/programService";
import { departmentApi } from "../../api/departmentApi";
import { mentorApi } from "../../api/mentorApi";
import { internApi } from "../../api/internApi";
import { toast } from "sonner";
import {
    Pencil,
    Users,
    Trash2,
    FileText,
    Clock,
    Calendar,
    MoreHorizontal,
    Plus,
    Search,
    CheckCircle2,
    XCircle,
    UserPlus,
    ChevronRight,
    LayoutGrid,
    AlertCircle,
    History,
    Zap,
    ArrowUpRight,
    ShieldCheck,
    Target,
    Activity,
    UserCheck,
    Briefcase
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "../../components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Skeleton } from "../../components/ui/skeleton";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Separator } from "../../components/ui/separator";

const cn = (...inputs) => inputs.filter(Boolean).join(" ");

const DAYS_OF_WEEK = [
    { value: "MONDAY", label: "Thứ 2" },
    { value: "TUESDAY", label: "Thứ 3" },
    { value: "WEDNESDAY", label: "Thứ 4" },
    { value: "THURSDAY", label: "Thứ 5" },
    { value: "FRIDAY", label: "Thứ 6" },
    { value: "SATURDAY", label: "Thứ 7" },
    { value: "SUNDAY", label: "Chủ nhật" },
];

export default function Groups() {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [programs, setPrograms] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [mentors, setMentors] = useState([]);
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingGroup, setEditingGroup] = useState(null);

    // Member Management State
    const [memberModalOpen, setMemberModalOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [members, setMembers] = useState([]);
    const [availableInterns, setAvailableInterns] = useState([]);
    const [internSearch, setInternSearch] = useState("");

    const [form, setForm] = useState({
        programId: "",
        name: "",
        departmentId: "",
        mentorId: "",
        workStartTime: "",
        workEndTime: "",
        workDays: [],
    });

    const fetchGroups = async () => {
        try {
            setLoading(true);
            const res = await programGroupService.list({ size: 100 });
            setGroups(res.data.content || []);
        } catch (err) {
            console.error("Failed to load groups", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [progRes, deptRes, mentorRes] = await Promise.all([
                    programService.list({ size: 100 }),
                    departmentApi.getAll(),
                    mentorApi.list({ size: 100 })
                ]);
                setPrograms(progRes.data.content || []);
                setDepartments(deptRes.data || []);
                setMentors(mentorRes.data.content || []);
                await fetchGroups();
            } catch (err) {
                console.error("Failed to load options", err);
            }
        };
        fetchAll();
    }, []);

    const handleCreateOrUpdate = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...form, workDays: form.workDays.join(",") };
            if (editingGroup) {
                await programGroupService.update(editingGroup.id, payload);
                toast.success("Cập nhật nhóm thành công");
            } else {
                await programGroupService.create(payload);
                toast.success("Tạo nhóm thành công");
            }
            setShowModal(false);
            resetForm();
            fetchGroups();
        } catch (err) {
            toast.error(err.response?.data?.message || "Thao tác thất bại");
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await programGroupService.update(id, { status: newStatus });
            toast.success(`Đã cập nhật trạng thái: ${newStatus === 'ACTIVE' ? 'Kích hoạt' : 'Đóng'}`);
            fetchGroups();
        } catch (err) {
            toast.error("Không thể cập nhật trạng thái");
        }
    };

    const openCreate = () => {
        resetForm();
        setShowModal(true);
    };

    const openEdit = (g) => {
        setEditingGroup(g);
        setForm({
            programId: g.programId || "",
            name: g.name,
            departmentId: g.departmentId || "",
            mentorId: g.mentorId || "",
            workStartTime: g.workStartTime || "",
            workEndTime: g.workEndTime || "",
            workDays: g.workDays ? g.workDays.split(",") : [],
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setEditingGroup(null);
        setForm({
            programId: "",
            name: "",
            departmentId: "",
            mentorId: "",
            workStartTime: "",
            workEndTime: "",
            workDays: []
        });
    };

    const fetchMembers = async (groupId) => {
        try {
            const res = await programGroupService.getMembers(groupId);
            setMembers(res.data || []);
        } catch (err) {
            console.error("Failed to load members", err);
        }
    };

    const searchInterns = async (keyword = "") => {
        try {
            const res = await internApi.search({ keyword, page: 0, size: 20, excludeBusy: true });
            setAvailableInterns(res.data.content || []);
        } catch (err) {
            console.error("Failed to search interns", err);
        }
    };

    const openMemberMgmt = (g) => {
        setSelectedGroup(g);
        setMembers([]);
        setInternSearch("");
        setMemberModalOpen(true);
        fetchMembers(g.id);
        searchInterns("");
    };

    const handleAssignIntern = async (internId) => {
        if (!selectedGroup) return;
        try {
            await programGroupService.assignIntern(selectedGroup.id, internId);
            toast.success("Đã thêm thực tập sinh vào nhóm");
            fetchMembers(selectedGroup.id);
        } catch (err) {
            toast.error(err.response?.data?.message || "Thêm thất bại");
        }
    };

    const handleRemoveMember = async (internId) => {
        if (!selectedGroup) return;
        try {
            await programGroupService.removeMember(selectedGroup.id, internId);
            toast.success("Đã xóa thực tập sinh khỏi nhóm");
            fetchMembers(selectedGroup.id);
        } catch (err) {
            toast.error("Xóa thất bại");
        }
    };

    useEffect(() => {
        if (!memberModalOpen) return;
        const timer = setTimeout(() => {
            searchInterns(internSearch);
        }, 500);
        return () => clearTimeout(timer);
    }, [internSearch, memberModalOpen]);

    return (
        <div className="p-8 pb-20 space-y-8 animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        Unit Deployment
                        <Badge variant="outline" className="h-6 border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            OPERATIONS
                        </Badge>
                    </h1>
                    <p className="text-slate-400 font-medium italic mt-1 text-sm flex items-center gap-2">
                        <LayoutGrid className="h-4 w-4 opacity-50" /> Quản lý và phân bổ thực tập sinh theo các nhóm dự án chiến lược.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button onClick={openCreate} className="h-12 px-6 rounded-2xl bg-slate-900 hover:bg-black font-black text-[11px] uppercase tracking-[0.1em] text-white shadow-2xl shadow-slate-200 transition-all active:scale-95">
                        <Plus className="mr-2 h-4 w-4" /> Assemble New Unit
                    </Button>
                </div>
            </div>

            {/* Main Content Table */}
            <Card className="border-none shadow-2xl shadow-slate-200/60 overflow-hidden rounded-3xl bg-white">
                <Table>
                    <TableHeader className="bg-slate-900">
                        <TableRow className="hover:bg-slate-900 border-none">
                            <TableHead className="w-[280px] text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 py-6 pl-8 italic">Unit Specification</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 py-6 italic">Department / Field</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 py-6 italic">Strategic Mentor</TableHead>
                            <TableHead className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 py-6 italic">Status</TableHead>
                            <TableHead className="text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 py-6 pr-8 italic">Governance</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i} className="border-slate-50">
                                    <TableCell className="pl-8"><div className="h-12 w-48 bg-slate-50 animate-pulse rounded-xl" /></TableCell>
                                    <TableCell><div className="h-10 w-32 bg-slate-50 animate-pulse rounded-xl" /></TableCell>
                                    <TableCell><div className="h-12 w-48 bg-slate-50 animate-pulse rounded-xl" /></TableCell>
                                    <TableCell><div className="h-8 w-20 mx-auto bg-slate-50 animate-pulse rounded-full" /></TableCell>
                                    <TableCell className="pr-8 text-right"><div className="h-10 w-24 ml-auto bg-slate-50 animate-pulse rounded-xl" /></TableCell>
                                </TableRow>
                            ))
                        ) : groups.length > 0 ? (
                            groups.map((g) => {
                                const prog = programs.find(p => p.id === g.programId);
                                const dept = departments.find(d => d.id === g.departmentId);
                                const men = mentors.find(m => m.id === g.mentorId);
                                return (
                                    <TableRow key={g.id} className="group hover:bg-slate-50/80 border-slate-50 transition-colors">
                                        <TableCell className="py-6 pl-8">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                                    <Zap className="h-6 w-6" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-base font-black text-slate-900 tracking-tight italic group-hover:text-primary transition-colors">{g.name}</span>
                                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{prog?.name || "UNASSIGNED PROGRAM"}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-6">
                                            <Badge variant="secondary" className="bg-slate-50 text-slate-500 border-none shadow-none font-black text-[10px] uppercase tracking-widest px-3 py-1">
                                                <Briefcase className="h-3 w-3 mr-1.5 opacity-40" /> {dept?.name || "Global Field"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="py-6">
                                            {men ? (
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                                                        <UserCheck className="h-5 w-5" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-black text-slate-700 tracking-tight">{men.fullName}</span>
                                                        <span className="text-[10px] font-medium text-slate-400 italic">{men.email}</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-slate-200">
                                                    <AlertCircle className="h-4 w-4" />
                                                    <span className="text-[11px] font-black uppercase tracking-widest">VACANT POSITION</span>
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center py-6">
                                            <Badge className={cn(
                                                "h-7 px-4 rounded-full font-black text-[10px] uppercase tracking-widest border-none shadow-none",
                                                g.status === 'ACTIVE' ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
                                            )}>
                                                {g.status === 'ACTIVE' ? <Activity className="h-3 w-3 mr-1.5 animate-pulse" /> : <Clock className="h-3 w-3 mr-1.5" />}
                                                {g.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right py-6 pr-8">
                                            <div className="flex justify-end items-center gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => openMemberMgmt(g)} className="h-10 w-10 rounded-2xl text-slate-300 hover:text-blue-600 hover:bg-blue-50 transition-all">
                                                    <UserPlus className="h-5 w-5" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => openEdit(g)} className="h-10 w-10 rounded-2xl text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                                                    <Pencil className="h-5 w-5" />
                                                </Button>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-2xl text-slate-300 hover:text-slate-900 hover:bg-slate-50 transition-all">
                                                            <MoreHorizontal className="h-5 w-5" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-[200px] rounded-2xl border-slate-100 shadow-2xl p-2">
                                                        <DropdownMenuLabel className="text-[10px] font-black uppercase text-slate-400 px-3 py-2 italic tracking-widest">Unit State Control</DropdownMenuLabel>
                                                        <DropdownMenuSeparator className="bg-slate-50" />
                                                        <DropdownMenuItem
                                                            onClick={() => handleStatusChange(g.id, 'ACTIVE')}
                                                            disabled={g.status === 'ACTIVE'}
                                                            className="rounded-xl h-10 cursor-pointer font-bold italic text-emerald-600 focus:bg-emerald-50 focus:text-emerald-700"
                                                        >
                                                            <CheckCircle2 className="mr-3 h-4 w-4" /> Activate Unit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => handleStatusChange(g.id, 'CLOSED')}
                                                            disabled={g.status === 'CLOSED'}
                                                            className="rounded-xl h-10 cursor-pointer font-bold italic text-rose-600 focus:bg-rose-50 focus:text-rose-700"
                                                        >
                                                            <XCircle className="mr-3 h-4 w-4" /> Decommission Unit
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-80 text-center bg-slate-50/20">
                                    <div className="flex flex-col items-center justify-center space-y-4">
                                        <div className="h-24 w-24 rounded-full bg-white shadow-xl flex items-center justify-center transition-transform hover:scale-110">
                                            <LayoutGrid className="h-10 w-10 text-slate-100" />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-300">Unit Registry Empty</h3>
                                            <p className="text-slate-400 font-medium italic text-sm">Chưa có nhóm nào được khởi tạo trong hệ thống.</p>
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>

            {/* Create/Edit dialog */}
            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent className="max-w-xl border-none shadow-2xl rounded-[2rem] p-0 overflow-hidden bg-white/95 backdrop-blur-xl">
                    <DialogHeader className="p-8 pb-4">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="h-12 w-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-xl">
                                {editingGroup ? <Pencil className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
                            </div>
                            <div className="flex flex-col text-left">
                                <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight italic">
                                    {editingGroup ? "Modify Tactical Unit" : "Initialize New Unit"}
                                </DialogTitle>
                                <DialogDescription className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">
                                    {editingGroup ? "Configuration update for existing resource group" : "Drafting new operational unit parameters"}
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    <Separator className="bg-slate-50" />
                    <ScrollArea className="max-h-[65vh]">
                        <form onSubmit={handleCreateOrUpdate} className="p-8 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 italic">Tactical Name *</label>
                                    <Input
                                        required
                                        placeholder="Enter unit designation..."
                                        className="h-12 rounded-2xl border-slate-100 bg-slate-50/50 focus-visible:ring-primary/20 font-bold"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 italic">Strategic Program *</label>
                                    <select
                                        required
                                        className="w-full h-12 rounded-2xl border border-slate-100 bg-slate-50/50 px-4 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.75rem_center] bg-no-repeat"
                                        value={form.programId}
                                        onChange={(e) => setForm({ ...form, programId: e.target.value })}
                                    >
                                        <option value="">-- SELECT PROGRAM --</option>
                                        {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 italic">Department / Faculty</label>
                                    <select
                                        className="w-full h-12 rounded-2xl border border-slate-100 bg-slate-50/50 px-4 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.75rem_center] bg-no-repeat"
                                        value={form.departmentId}
                                        onChange={(e) => setForm({ ...form, departmentId: e.target.value })}
                                    >
                                        <option value="">-- DEPARTMENT --</option>
                                        {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 italic">Assigned Mentor</label>
                                    <select
                                        className="w-full h-12 rounded-2xl border border-slate-100 bg-slate-50/50 px-4 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.75rem_center] bg-no-repeat"
                                        value={form.mentorId}
                                        onChange={(e) => setForm({ ...form, mentorId: e.target.value })}
                                    >
                                        <option value="">-- MENTOR --</option>
                                        {mentors.map(m => <option key={m.id} value={m.id}>{m.fullName}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="p-6 rounded-[2rem] bg-slate-900 space-y-6 shadow-2xl">
                                <h4 className="flex items-center gap-3 text-xs font-black text-white uppercase tracking-[0.2em] italic">
                                    <Clock className="w-4 h-4 text-emerald-400" /> Operational Schedule
                                </h4>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">START_TIME</label>
                                        <Input type="time" className="h-11 rounded-xl bg-white/5 border-none text-white font-mono focus-visible:ring-emerald-500/30" value={form.workStartTime} onChange={(e) => setForm({ ...form, workStartTime: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">END_TIME</label>
                                        <Input type="time" className="h-11 rounded-xl bg-white/5 border-none text-white font-mono focus-visible:ring-rose-500/30" value={form.workEndTime} onChange={(e) => setForm({ ...form, workEndTime: e.target.value })} />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">ACTIVE_DAYS</label>
                                    <div className="flex flex-wrap gap-2">
                                        {DAYS_OF_WEEK.map((day) => {
                                            const isSelected = form.workDays.includes(day.value);
                                            return (
                                                <Badge
                                                    key={day.value}
                                                    onClick={() => {
                                                        const newDays = isSelected
                                                            ? form.workDays.filter(d => d !== day.value)
                                                            : [...form.workDays, day.value];
                                                        setForm({ ...form, workDays: newDays });
                                                    }}
                                                    variant={isSelected ? "default" : "outline"}
                                                    className={cn(
                                                        "cursor-pointer px-4 py-2 rounded-xl transition-all font-black text-[10px] uppercase border-none",
                                                        isSelected ? "bg-white text-slate-900 shadow-xl scale-105" : "bg-white/5 text-slate-400 hover:bg-white/10"
                                                    )}
                                                >
                                                    {day.label}
                                                </Badge>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </form>
                    </ScrollArea>
                    <Separator className="bg-slate-50" />
                    <DialogFooter className="p-8 bg-slate-50/50">
                        <Button variant="ghost" onClick={() => setShowModal(false)} className="h-12 px-8 rounded-2xl font-black text-[11px] uppercase tracking-widest text-slate-400 hover:text-slate-900">
                            Dismiss
                        </Button>
                        <Button onClick={handleCreateOrUpdate} className="h-12 px-10 rounded-2xl bg-slate-900 hover:bg-black font-black text-[11px] uppercase tracking-widest text-white shadow-xl shadow-slate-200">
                            {editingGroup ? "Synchronize Changes" : "Confirm Deployment"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Member management dialog */}
            <Dialog open={memberModalOpen} onOpenChange={setMemberModalOpen}>
                <DialogContent className="max-w-5xl border-none shadow-2xl h-[85vh] flex flex-col p-0 overflow-hidden rounded-[2.5rem] bg-white/95 backdrop-blur-xl">
                    <DialogHeader className="p-8 pb-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                    <Users className="h-6 w-6 text-primary" />
                                </div>
                                <div className="flex flex-col text-left">
                                    <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight italic">Resource Allocation</DialogTitle>
                                    <DialogDescription className="text-primary font-black text-[10px] uppercase tracking-[0.2em] mt-1">
                                        UNIT: {selectedGroup?.name}
                                    </DialogDescription>
                                </div>
                            </div>
                            <Badge variant="outline" className="h-8 px-4 rounded-xl border-slate-100 bg-slate-50 text-slate-400 font-black text-[10px] uppercase tracking-widest">
                                TOTAL STRENGTH: {members.length}
                            </Badge>
                        </div>
                    </DialogHeader>

                    <div className="flex-1 flex overflow-hidden border-t border-slate-50">
                        {/* Current List */}
                        <div className="w-[45%] flex flex-col border-r border-slate-50 bg-slate-50/30">
                            <div className="p-6 bg-white/50 backdrop-blur-sm border-b border-slate-50">
                                <h4 className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">
                                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> ACTIVE DEPLOYMENT
                                </h4>
                            </div>
                            <ScrollArea className="flex-1">
                                <div className="p-6 space-y-4">
                                    {members.length === 0 ? (
                                        <div className="py-24 text-center space-y-4">
                                            <div className="h-16 w-16 mx-auto rounded-full bg-white shadow-lg flex items-center justify-center">
                                                <Users className="h-8 w-8 text-slate-100" />
                                            </div>
                                            <p className="text-xs text-slate-300 font-black uppercase tracking-widest italic">No personnel assigned</p>
                                        </div>
                                    ) : members.map(m => (
                                        <Card key={m.internId} className="border-none shadow-sm hover:shadow-xl transition-all group rounded-2xl bg-white">
                                            <CardContent className="p-4 flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center font-black text-xs text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                        {m.internName?.[0]}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-black text-slate-900 tracking-tight">{m.internName}</span>
                                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{m.studentCode}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                                    <Button variant="ghost" size="icon" onClick={() => navigate(`/hr/reports/final/${m.internId}`)} className="h-9 w-9 rounded-xl text-blue-400 hover:text-blue-600 hover:bg-blue-50">
                                                        <FileText className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => handleRemoveMember(m.internId)} className="h-9 w-9 rounded-xl text-rose-400 hover:text-rose-600 hover:bg-rose-50">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>

                        {/* Search & Assign */}
                        <div className="w-[55%] flex flex-col bg-white">
                            <div className="p-6 border-b border-slate-50 space-y-6">
                                <h4 className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">
                                    <Target className="h-3.5 w-3.5 text-blue-500" /> TALENT ACQUISITION
                                </h4>
                                <div className="relative group">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                                    <Input
                                        placeholder="Scan personnel by name or student ID..."
                                        className="h-14 pl-12 rounded-2xl bg-slate-50/50 border-none shadow-inner font-bold focus-visible:ring-primary/20"
                                        value={internSearch}
                                        onChange={(e) => setInternSearch(e.target.value)}
                                    />
                                </div>
                            </div>
                            <ScrollArea className="flex-1">
                                <div className="p-6 space-y-4">
                                    {availableInterns.filter(intern => !members.some(m => m.internId === intern.id)).length === 0 ? (
                                        <div className="py-24 text-center space-y-2">
                                            <Search className="h-10 w-10 mx-auto text-slate-100" />
                                            <p className="text-xs text-slate-300 font-black uppercase tracking-widest italic">
                                                {internSearch ? "No matching personnel found" : "Ready for talent scan"}
                                            </p>
                                        </div>
                                    ) : availableInterns.filter(intern => !members.some(m => m.internId === intern.id)).map(intern => (
                                        <div key={intern.id} className="flex items-center justify-between p-4 rounded-2xl border-2 border-dashed border-slate-50 hover:border-primary hover:bg-primary/5 transition-all group">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center font-black text-xs text-slate-300">
                                                    {intern.fullName?.[0]}
                                                </div>
                                                <div className="flex flex-col text-left">
                                                    <span className="text-sm font-black text-slate-900 tracking-tight">{intern.fullName}</span>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                        {intern.studentCode} <span className="mx-2 opacity-20">|</span> {intern.university}
                                                    </span>
                                                </div>
                                            </div>
                                            <Button onClick={() => handleAssignIntern(intern.id)} className="h-10 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest bg-slate-900 hover:bg-black transition-all">
                                                Deploy to Unit
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>
                    </div>
                    <div className="p-8 border-t border-slate-50 bg-slate-50/50 flex justify-end">
                        <Button variant="ghost" onClick={() => setMemberModalOpen(false)} className="h-12 px-10 rounded-2xl font-black text-[11px] uppercase tracking-widest text-slate-900 hover:bg-white shadow-sm">
                            Synchronize & Dismiss
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
