import React, { useEffect, useState, useMemo } from "react";
import { departmentApi } from "../../api/departmentApi";
import {
    ShieldCheck,
    Mail,
    Phone,
    Briefcase,
    Building,
    User,
    Lock,
    Save,
    X,
    Activity
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";

const empty = {
    fullName: "",
    email: "",
    phone: "",
    departmentId: "",
    username: "",
    password: "", // Only for create
};

export default function MentorForm({
    mode = "create",
    initialValues,
    onSubmit,
    onCancel,
    submitting,
    serverErrors = {},
}) {
    const [form, setForm] = useState(empty);
    const [touched, setTouched] = useState({});
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        if (initialValues) {
            setForm({ ...empty, ...initialValues });
        }
    }, [initialValues]);

    useEffect(() => {
        departmentApi.getAll().then((res) => setDepartments(res.data || []));
    }, []);

    const validate = useMemo(() => {
        const e = {};
        if (!form.fullName.trim()) e.fullName = "Full name is required";
        if (!form.email.trim()) e.email = "Email is required";
        if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Invalid email";
        if (!form.departmentId) e.departmentId = "Department is required";
        if (mode === "create") {
            if (!form.username.trim()) e.username = "Username is required";
            if (!form.password) e.password = "Password is required";
        }
        return e;
    }, [form, mode]);

    const set = (k) => (ev) => {
        setForm((p) => ({ ...p, [k]: ev.target.value }));
        setTouched((p) => ({ ...p, [k]: true }));
    };

    const submit = (e) => {
        e.preventDefault();
        setTouched({
            fullName: true,
            email: true,
            phone: true,
            departmentId: true,
            username: true,
            password: true,
        });

        if (Object.keys(validate).length === 0) {
            onSubmit(form);
        }
    };

    const getError = (k) => {
        return (touched[k] && validate[k]) || serverErrors[k] || "";
    };

    return (
        <form onSubmit={submit} className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Core Identity */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 italic flex items-center gap-2">
                            <User className="h-3 w-3" /> Mentor Designation *
                        </label>
                        <Input
                            value={form.fullName}
                            onChange={set("fullName")}
                            placeholder="Full Name (e.g. Nguyen Van Mentor)"
                            className={`h-14 rounded-2xl border-none bg-slate-100/50 shadow-inner font-bold focus-visible:ring-primary/20 ${getError("fullName") ? "ring-2 ring-rose-500/20" : ""}`}
                        />
                        {getError("fullName") && (
                            <div className="text-[10px] font-black uppercase text-rose-500 ml-1 italic tracking-widest">{getError("fullName")}</div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 italic flex items-center gap-2">
                            <Mail className="h-3 w-3" /> Secure Access Key (Email) *
                        </label>
                        <Input
                            value={form.email}
                            onChange={set("email")}
                            placeholder="mentor@example.com"
                            className={`h-14 rounded-2xl border-none bg-slate-100/50 shadow-inner font-bold focus-visible:ring-primary/20 ${getError("email") ? "ring-2 ring-rose-500/20" : ""}`}
                        />
                        {getError("email") && (
                            <div className="text-[10px] font-black uppercase text-rose-500 ml-1 italic tracking-widest">{getError("email")}</div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 italic flex items-center gap-2">
                            <Phone className="h-3 w-3" /> Emergency Secure Line
                        </label>
                        <Input
                            value={form.phone}
                            onChange={set("phone")}
                            placeholder="e.g. 0912..."
                            className="h-14 rounded-2xl border-none bg-slate-100/50 shadow-inner font-bold focus-visible:ring-primary/20"
                        />
                    </div>
                </div>

                {/* Organizational Context */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 italic flex items-center gap-2">
                            <Building className="h-3 w-3" /> Unit Assignment *
                        </label>
                        <select
                            value={form.departmentId}
                            onChange={set("departmentId")}
                            className={`w-full h-14 rounded-2xl border-none bg-slate-100/50 shadow-inner font-bold px-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none appearance-none ${getError("departmentId") ? "ring-2 ring-rose-500/20" : ""}`}
                        >
                            <option value="">-- Select Deployment Unit --</option>
                            {departments.map((d) => (
                                <option key={d.id} value={d.id}>
                                    {d.name} ({d.code})
                                </option>
                            ))}
                        </select>
                        {getError("departmentId") && (
                            <div className="text-[10px] font-black uppercase text-rose-500 ml-1 italic tracking-widest">{getError("departmentId")}</div>
                        )}
                    </div>

                    {mode === "create" && (
                        <>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 italic flex items-center gap-2">
                                    <Lock className="h-3 w-3" /> Registry Username *
                                </label>
                                <Input
                                    value={form.username}
                                    onChange={set("username")}
                                    placeholder="Enter username..."
                                    className={`h-14 rounded-2xl border-none bg-slate-100/50 shadow-inner font-bold focus-visible:ring-primary/20 ${getError("username") ? "ring-2 ring-rose-500/20" : ""}`}
                                />
                                {getError("username") && (
                                    <div className="text-[10px] font-black uppercase text-rose-500 ml-1 italic tracking-widest">{getError("username")}</div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 italic flex items-center gap-2">
                                    <ShieldCheck className="h-3 w-3" /> Access Credentials (Password) *
                                </label>
                                <Input
                                    type="password"
                                    value={form.password}
                                    onChange={set("password")}
                                    placeholder="••••••"
                                    className={`h-14 rounded-2xl border-none bg-slate-100/50 shadow-inner font-bold focus-visible:ring-primary/20 ${getError("password") ? "ring-2 ring-rose-500/20" : ""}`}
                                />
                                {getError("password") && (
                                    <div className="text-[10px] font-black uppercase text-rose-500 ml-1 italic tracking-widest">{getError("password")}</div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>

            <Separator className="bg-slate-100" />

            <div className="flex flex-col md:flex-row justify-end gap-4 pt-4">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={onCancel}
                    disabled={submitting}
                    className="h-14 px-8 rounded-2xl font-black text-[11px] uppercase tracking-widest text-slate-400 hover:bg-slate-50 disabled:opacity-50"
                >
                    <X className="h-4 w-4 mr-2" /> Abort Process
                </Button>
                <Button
                    type="submit"
                    disabled={submitting}
                    className="h-14 px-12 rounded-2xl bg-slate-900 border-none hover:bg-black font-black text-[11px] uppercase tracking-widest text-white shadow-2xl shadow-slate-200 transition-all active:scale-95 disabled:opacity-50 min-w-[200px]"
                >
                    {submitting ? (
                        <span className="flex items-center gap-3">
                            <div className="h-4 w-4 border-2 border-white/20 border-t-white animate-spin rounded-full" />
                            Synchronizing...
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            <Save className="h-4 w-4" /> {mode === "create" ? "INITIALIZE MENTOR" : "COMMIT RECONFIG"}
                        </span>
                    )}
                </Button>
            </div>
        </form>
    );
}
