import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { adminUserApi } from "../../api/adminApi";
import { departmentApi } from "../../api/departmentApi";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../components/ui/select";
import {
    UserPlus,
    Mail,
    Shield,
    Building,
    Briefcase,
    PlusCircle,
    Activity,
    Info,
    X,
    ChevronRight,
    Sparkles
} from "lucide-react";

export default function CreateMentor({ onClose, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [departments, setDepartments] = useState([]);

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        password: "",
        departmentId: "",
        title: ""
    });

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const res = await departmentApi.getAll();
            setDepartments(res.data);
        } catch (error) {
            toast.error("Failed to acquire jurisdictional directory");
        }
    };

    const handleCreateMentor = async () => {
        if (!form.fullName || !form.email || !form.password) {
            toast.error("Required personnel parameters are missing");
            return;
        }

        try {
            setLoading(true);
            await adminUserApi.createUser({
                fullName: form.fullName,
                email: form.email,
                password: form.password,
                roleCodes: ["MENTOR"],
                departmentId: form.departmentId ? parseInt(form.departmentId) : null,
                title: form.title || null
            });

            toast.success("Strategic command unit initialized");
            onSuccess();
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || "Initialization protocol failure");
        } finally {
            setLoading(false);
        }
    };

    const renderLabel = (label, icon) => (
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 italic flex items-center gap-2 mb-2">
            {icon} {label}
        </label>
    );

    return (
        <Dialog open={true} onOpenChange={(val) => !val && onClose()}>
            <DialogContent className="max-w-xl rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden bg-white">
                <DialogHeader className="p-10 bg-slate-900 text-white space-y-2 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12">
                        <Sparkles className="h-32 w-32" />
                    </div>
                    <DialogTitle className="text-2xl font-black leading-tight flex items-center gap-3 uppercase tracking-tighter italic relative z-10">
                        <PlusCircle className="h-6 w-6 text-primary" />
                        Command Initialization
                    </DialogTitle>
                    <DialogDescription className="text-slate-400 italic font-medium relative z-10">
                        Configure institutional credentials and professional profile for a new mentor.
                    </DialogDescription>
                </DialogHeader>

                <div className="p-10 space-y-8">
                    <div className="grid grid-cols-2 gap-8">
                        <div className="col-span-2 space-y-1">
                            {renderLabel("Legal Designation *", <UserPlus className="h-3 w-3" />)}
                            <Input
                                value={form.fullName}
                                onChange={e => setForm({ ...form, fullName: e.target.value })}
                                placeholder="Enter full personnel name..."
                                className="h-14 rounded-2xl border-none bg-slate-100/50 shadow-inner font-bold focus-visible:ring-primary/20"
                            />
                        </div>

                        <div className="space-y-1">
                            {renderLabel("Access Key (Email) *", <Mail className="h-3 w-3" />)}
                            <Input
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                placeholder="alias@registry.gov"
                                className="h-14 rounded-2xl border-none bg-slate-100/50 shadow-inner font-bold focus-visible:ring-primary/20"
                            />
                        </div>

                        <div className="space-y-1">
                            {renderLabel("Security Credential *", <Shield className="h-3 w-3" />)}
                            <Input
                                type="password"
                                value={form.password}
                                onChange={e => setForm({ ...form, password: e.target.value })}
                                placeholder="••••••••"
                                className="h-14 rounded-2xl border-none bg-slate-100/50 shadow-inner font-bold focus-visible:ring-primary/20"
                            />
                        </div>

                        <div className="space-y-1">
                            {renderLabel("Deployment Sector", <Building className="h-3 w-3" />)}
                            <Select
                                value={form.departmentId}
                                onValueChange={(val) => setForm({ ...form, departmentId: val })}
                            >
                                <SelectTrigger className="h-14 rounded-2xl border-none bg-slate-100/50 shadow-inner font-bold italic text-slate-600 px-6 focus:ring-primary/20">
                                    <SelectValue placeholder="Select Department..." />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-none shadow-2xl p-2">
                                    {departments.map(d => (
                                        <SelectItem key={d.id} value={d.id.toString()} className="rounded-xl py-3 font-bold transition-all">
                                            {d.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1">
                            {renderLabel("Tactical Rank (Title)", <Briefcase className="h-3 w-3" />)}
                            <Input
                                value={form.title}
                                onChange={e => setForm({ ...form, title: e.target.value })}
                                placeholder="Senior Officer, Lead..."
                                className="h-14 rounded-2xl border-none bg-slate-100/50 shadow-inner font-bold focus-visible:ring-primary/20"
                            />
                        </div>
                    </div>

                    <div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 space-y-3">
                        <div className="flex items-center gap-2 text-slate-400">
                            <Info className="h-4 w-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest italic">Operational Guidance</span>
                        </div>
                        <p className="text-[11px] font-bold text-slate-500 leading-relaxed italic">
                            Personnel initialization will grant administrative and pedagogical oversight over allocated strategic assets.
                        </p>
                    </div>
                </div>

                <DialogFooter className="p-8 bg-slate-50 border-t flex flex-row gap-4">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 h-14 rounded-2xl font-black text-[11px] uppercase tracking-widest text-slate-400 hover:bg-white hover:shadow-lg transition-all"
                    >
                        <X className="h-4 w-4 mr-2" /> Abort
                    </Button>
                    <Button
                        onClick={handleCreateMentor}
                        disabled={loading}
                        className="flex-[2] h-14 rounded-2xl bg-slate-900 hover:bg-black font-black text-[11px] uppercase tracking-[0.2em] text-white shadow-2xl shadow-slate-200 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {loading ? (
                            <span className="flex items-center gap-3">
                                <div className="h-4 w-4 border-2 border-white/20 border-t-white animate-spin rounded-full" />
                                INITIALIZING...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2 italic">
                                <ChevronRight className="h-4 w-4" /> Execute Initialization
                            </span>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
