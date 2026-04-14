import React, { useMemo, useState } from "react";
import {
    User,
    Mail,
    Hash,
    Phone,
    Calendar,
    MapPin,
    School,
    BookOpen,
    Save,
    X,
    ShieldCheck,
    Info,
    ChevronRight,
    Sparkles,
    Activity,
    Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const empty = {
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    university: "",
    major: "",
    address: "",
    startDate: "",
    endDate: "",
    studentCode: "",
};

export default function InternForm({
    mode = "create",
    initialValues,
    resetKey,
    submitting = false,
    serverErrors = {},
    onSubmit,
    onCancel,
    submitText,
}) {
    const [form, setForm] = useState({ ...empty, ...initialValues });
    const [touched, setTouched] = useState({});
    const [localErrors, setLocalErrors] = useState({});

    React.useEffect(() => {
        setForm({ ...empty, ...(initialValues || {}) });
        setTouched({});
        setLocalErrors({});
    }, [resetKey, initialValues]);

    const validate = useMemo(() => {
        const e = {};
        if (!form.fullName.trim()) e.fullName = "Full name is required";
        if (!form.email.trim()) e.email = "Email is required";
        if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Invalid email format";
        if (!form.studentCode.trim()) e.studentCode = "Student code is required";
        if (!form.university.trim()) e.university = "University is required";
        if (!form.major.trim()) e.major = "Major is required";
        if (!form.startDate) e.startDate = "Start date is required";
        if (!form.endDate) e.endDate = "End date is required";
        if (form.startDate && form.endDate && form.startDate > form.endDate) {
            e.endDate = "End date must be after start date";
        }
        return e;
    }, [form]);

    const set = (k) => (ev) => {
        const v = ev.target.value;
        setForm((p) => ({ ...p, [k]: v }));
        setTouched((p) => ({ ...p, [k]: true }));
        setLocalErrors((p) => ({ ...p, [k]: "" }));
    };

    const submit = async (e) => {
        e.preventDefault();

        setTouched({
            fullName: true,
            email: true,
            phone: true,
            dob: true,
            university: true,
            major: true,
            address: true,
            startDate: true,
            endDate: true,
            studentCode: true,
        });

        if (Object.keys(validate).length > 0) {
            setLocalErrors(validate);
            return;
        }

        const payload = {
            fullName: form.fullName.trim(),
            email: form.email.trim().toLowerCase(),
            phone: form.phone?.trim() || null,
            dob: form.dob || null,
            university: form.university.trim(),
            major: form.major.trim(),
            address: form.address?.trim() || null,
            startDate: form.startDate,
            endDate: form.endDate,
            studentCode: form.studentCode.trim(),
        };

        await onSubmit(payload);
    };

    const fieldErrorText = (name) => {
        const showLocal = touched[name] && (localErrors[name] || validate[name]);
        const local = showLocal ? (localErrors[name] || validate[name]) : "";
        const server = serverErrors?.[name] || "";
        return server || local || "";
    };

    const inputClass = (name) => {
        const hasErr = Boolean(serverErrors?.[name] || (touched[name] && validate[name]));
        return hasErr ? "ring-2 ring-rose-500/20 border-rose-200" : "";
    };

    const renderLabel = (label, icon) => (
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 italic flex items-center gap-2 mb-2">
            {icon} {label}
        </label>
    );

    return (
        <form onSubmit={submit} className="space-y-10 animate-in fade-in duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Core Registry Parameters */}
                <div className="lg:col-span-8 space-y-10">
                    <Card className="border-none shadow-2xl shadow-slate-100 rounded-[2.5rem] overflow-hidden bg-white/50 backdrop-blur-xl p-2 transition-all hover:shadow-primary/5">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-lg font-black text-slate-900 tracking-tighter italic flex items-center gap-2">
                                <ShieldCheck className="h-5 w-5 text-primary" /> CORE REGISTRY PARAMETERS
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-1">
                                    {renderLabel("Full Name *", <User className="h-3 w-3" />)}
                                    <Input
                                        placeholder="Enter legal designation..."
                                        className={`h-14 rounded-2xl border-none bg-slate-100/50 shadow-inner font-bold focus-visible:ring-primary/20 ${inputClass("fullName")}`}
                                        value={form.fullName}
                                        onChange={set("fullName")}
                                    />
                                    {fieldErrorText("fullName") && (
                                        <div className="text-[10px] font-black text-rose-500 ml-1 italic tracking-widest uppercase mt-1">
                                            {fieldErrorText("fullName")}
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    {renderLabel("Access Key (Email) *", <Mail className="h-3 w-3" />)}
                                    <Input
                                        type="email"
                                        placeholder="designation@registry.gov"
                                        className={`h-14 rounded-2xl border-none bg-slate-100/50 shadow-inner font-bold focus-visible:ring-primary/20 ${inputClass("email")}`}
                                        value={form.email}
                                        onChange={set("email")}
                                    />
                                    {fieldErrorText("email") && (
                                        <div className="text-[10px] font-black text-rose-500 ml-1 italic tracking-widest uppercase mt-1">
                                            {fieldErrorText("email")}
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    {renderLabel("Registry Code *", <Hash className="h-3 w-3" />)}
                                    <Input
                                        placeholder="SR-000000"
                                        className={`h-14 rounded-2xl border-none bg-slate-100/50 shadow-inner font-bold focus-visible:ring-primary/20 ${inputClass("studentCode")}`}
                                        value={form.studentCode}
                                        onChange={set("studentCode")}
                                    />
                                    {fieldErrorText("studentCode") && (
                                        <div className="text-[10px] font-black text-rose-500 ml-1 italic tracking-widest uppercase mt-1">
                                            {fieldErrorText("studentCode")}
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    {renderLabel("Communication Line", <Phone className="h-3 w-3" />)}
                                    <Input
                                        placeholder="+00 000 000 000"
                                        className="h-14 rounded-2xl border-none bg-slate-100/50 shadow-inner font-bold focus-visible:ring-primary/20"
                                        value={form.phone}
                                        onChange={set("phone")}
                                    />
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                    {renderLabel("Geospatial Descriptor", <MapPin className="h-3 w-3" />)}
                                    <Input
                                        placeholder="Current residency address..."
                                        className="h-14 rounded-2xl border-none bg-slate-100/50 shadow-inner font-bold focus-visible:ring-primary/20 italic text-sm"
                                        value={form.address}
                                        onChange={set("address")}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-2xl shadow-slate-100 rounded-[2.5rem] overflow-hidden bg-white/50 backdrop-blur-xl p-2 transition-all hover:shadow-amber-500/5">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-lg font-black text-slate-900 tracking-tighter italic flex items-center gap-2">
                                <School className="h-5 w-5 text-amber-500" /> ACADEMIC & MISSION DEPLOYMENT
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-1">
                                    {renderLabel("Original Institution *", <School className="h-3 w-3" />)}
                                    <Input
                                        placeholder="FPT University / HCMUT..."
                                        className={`h-14 rounded-2xl border-none bg-slate-100/50 shadow-inner font-bold focus-visible:ring-primary/20 ${inputClass("university")}`}
                                        value={form.university}
                                        onChange={set("university")}
                                    />
                                    {fieldErrorText("university") && (
                                        <div className="text-[10px] font-black text-rose-500 ml-1 italic tracking-widest uppercase mt-1">
                                            {fieldErrorText("university")}
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    {renderLabel("Baseline Discipline *", <BookOpen className="h-3 w-3" />)}
                                    <Input
                                        placeholder="Software Engineering / AI..."
                                        className={`h-14 rounded-2xl border-none bg-slate-100/50 shadow-inner font-bold focus-visible:ring-primary/20 ${inputClass("major")}`}
                                        value={form.major}
                                        onChange={set("major")}
                                    />
                                    {fieldErrorText("major") && (
                                        <div className="text-[10px] font-black text-rose-500 ml-1 italic tracking-widest uppercase mt-1">
                                            {fieldErrorText("major")}
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    {renderLabel("Operational Start *", <Clock className="h-3 w-3" />)}
                                    <Input
                                        type="date"
                                        className={`h-14 rounded-2xl border-none bg-slate-100/50 shadow-inner font-bold focus-visible:ring-primary/20 ${inputClass("startDate")}`}
                                        value={form.startDate}
                                        onChange={set("startDate")}
                                    />
                                    {fieldErrorText("startDate") && (
                                        <div className="text-[10px] font-black text-rose-500 ml-1 italic tracking-widest uppercase mt-1">
                                            {fieldErrorText("startDate")}
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    {renderLabel("Operational End *", <Activity className="h-3 w-3" />)}
                                    <Input
                                        type="date"
                                        className={`h-14 rounded-2xl border-none bg-slate-100/50 shadow-inner font-bold focus-visible:ring-primary/20 ${inputClass("endDate")}`}
                                        value={form.endDate}
                                        onChange={set("endDate")}
                                    />
                                    {fieldErrorText("endDate") && (
                                        <div className="text-[10px] font-black text-rose-500 ml-1 italic tracking-widest uppercase mt-1">
                                            {fieldErrorText("endDate")}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tactical Sidebar */}
                <div className="lg:col-span-4 space-y-10">
                    <Card className="border-none shadow-2xl shadow-slate-100 rounded-[2.5rem] overflow-hidden bg-slate-900 text-white p-2">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-sm font-black uppercase tracking-[0.2em] opacity-40 italic flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-primary" /> INITIALIZATION
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 space-y-8">
                            <div className="space-y-2">
                                {renderLabel("Birth Epoch", <Calendar className="h-3.5 w-3.5 text-indigo-400" />)}
                                <Input
                                    type="date"
                                    className="h-14 rounded-[1.25rem] border-none bg-white/5 shadow-inner font-bold focus:ring-primary/20"
                                    value={form.dob}
                                    onChange={set("dob")}
                                />
                            </div>

                            <Separator className="bg-white/5" />

                            <div className="p-6 rounded-[2rem] bg-indigo-600/10 border border-indigo-500/20 space-y-3">
                                <div className="flex items-center gap-2 text-indigo-400">
                                    <Info className="h-4 w-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest italic">Protocol Verification</span>
                                </div>
                                <p className="text-[11px] font-bold text-slate-400 leading-relaxed italic">
                                    Ensure all designated parameters are verified. Personnel initialization will trigger automated onboarding workflows.
                                </p>
                            </div>

                            <div className="flex flex-col gap-4 pt-4">
                                <Button
                                    type="submit"
                                    disabled={submitting}
                                    className="h-16 rounded-[1.5rem] bg-primary hover:bg-primary/90 text-white font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 transition-all active:scale-95 disabled:opacity-40"
                                >
                                    {submitting ? (
                                        <span className="flex items-center gap-3">
                                            <div className="h-4 w-4 border-2 border-white/20 border-t-white animate-spin rounded-full" />
                                            INITIALIZING...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2 font-black italic">
                                            <ChevronRight className="h-4 w-4" /> {submitText || (mode === "create" ? "EXECUTE ONBOARDING" : "COMMIT CHANGES")}
                                        </span>
                                    )}
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={onCancel}
                                    className="h-16 rounded-[1.5rem] border border-white/5 hover:bg-white/5 text-slate-500 font-black text-[11px] uppercase tracking-[0.2em]"
                                >
                                    <X className="h-4 w-4 mr-2" /> ABORT MISSION
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="px-10 py-8 rounded-[3rem] bg-slate-50 border border-slate-100">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic mb-4">Governance Governance</h4>
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="h-8 w-8 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary shrink-0">
                                    <Activity className="h-4 w-4" />
                                </div>
                                <p className="text-[10px] font-bold text-slate-400 leading-tight italic">Audit trails are automatically generated for every personnel creation.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
