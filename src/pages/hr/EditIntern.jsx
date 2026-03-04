import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { internApi } from "../../api/internApi";
import { toast } from "sonner";
import {
    ChevronLeft,
    ShieldCheck,
    Mail,
    Phone,
    School,
    BookOpen,
    Target,
    Calendar,
    MapPin,
    UserCircle,
    Save,
    X,
    Hash,
    Settings2,
    Activity
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";

export default function EditIntern() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [form, setForm] = useState({
        email: "",
        fullName: "",
        phone: "",
        university: "",
        major: "",
        gpa: "",
        dob: "",
        address: "",
        studentCode: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setFetching(true);
                const res = await internApi.getById(id);
                const data = res.data;
                setForm({
                    email: data.email || "",
                    fullName: data.fullName || "",
                    phone: data.phone || "",
                    university: data.university || "",
                    major: data.major || "",
                    gpa: data.gpa || "",
                    dob: data.dob || "",
                    address: data.address || "",
                    studentCode: data.studentCode || "",
                });
            } catch (err) {
                toast.error("Failed to acquire personnel data");
                navigate("/hr/interns");
            } finally {
                setFetching(false);
            }
        };
        fetchData();
    }, [id, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await internApi.update(id, form);
            toast.success("Profile reconfiguration successful");
            navigate(`/hr/interns/${id}`);
        } catch (err) {
            toast.error(err.response?.data?.message || "Governance override failed");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="p-20 flex flex-col items-center justify-center space-y-4">
                <div className="h-16 w-16 rounded-full border-4 border-slate-100 border-t-slate-900 animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Locking Personnel Registry for Reconfig...</p>
            </div>
        );
    }

    return (
        <div className="p-8 pb-24 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-5xl mx-auto">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-6">
                    <Button
                        variant="ghost"
                        onClick={() => navigate(-1)}
                        className="h-9 px-3 rounded-xl text-slate-400 hover:text-slate-900 font-black text-[10px] uppercase tracking-widest group"
                    >
                        <ChevronLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" /> Terminate Reconfig
                    </Button>
                    <div className="flex items-start gap-6">
                        <div className="h-20 w-20 rounded-[2rem] bg-slate-900 flex items-center justify-center text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                            <Settings2 className="h-8 w-8 relative z-10" />
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">
                                    Profile Reconfiguration
                                </h1>
                                <Badge variant="outline" className="border-slate-200 text-slate-400 font-black text-[9px] uppercase tracking-[0.2em] h-5">
                                    AUTH_OVERRIDE
                                </Badge>
                            </div>
                            <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.3em] flex items-center gap-2">
                                <Activity className="h-3.5 w-3.5 text-indigo-500" /> Administrative Access Granted
                            </p>
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-2 bg-slate-50 w-fit px-3 py-1 rounded-lg border border-slate-100">
                                Target ID: {id}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left: Tactical Parameters */}
                <div className="lg:col-span-8 space-y-10">
                    <Card className="border-none shadow-2xl shadow-slate-100 rounded-[2.5rem] overflow-hidden bg-white/50 backdrop-blur-xl p-2">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-lg font-black text-slate-900 tracking-tighter italic flex items-center gap-2">
                                <ShieldCheck className="h-5 w-5 text-primary" /> CORE IDENTITY PARAMETERS
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 italic flex items-center gap-2">
                                        <UserCircle className="h-3 w-3" /> Personnel Full Name *
                                    </label>
                                    <Input
                                        required
                                        placeholder="Enter designation..."
                                        className="h-14 rounded-2xl border-none bg-slate-100/50 shadow-inner font-bold focus-visible:ring-primary/20"
                                        value={form.fullName}
                                        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 italic flex items-center gap-2">
                                        <Mail className="h-3 w-3" /> Secure Access Key (Email) *
                                    </label>
                                    <Input
                                        required
                                        type="email"
                                        placeholder="access@registry.gov"
                                        className="h-14 rounded-2xl border-none bg-slate-100/50 shadow-inner font-bold focus-visible:ring-primary/20"
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 italic flex items-center gap-2">
                                        <Hash className="h-3 w-3" /> Student Registry Code
                                    </label>
                                    <Input
                                        placeholder="SR-000000"
                                        className="h-14 rounded-2xl border-none bg-slate-100/50 shadow-inner font-bold focus-visible:ring-primary/20"
                                        value={form.studentCode}
                                        onChange={(e) => setForm({ ...form, studentCode: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 italic flex items-center gap-2">
                                        <Phone className="h-3 w-3" /> Emergency Secure Line
                                    </label>
                                    <Input
                                        placeholder="+00 000 000 000"
                                        className="h-14 rounded-2xl border-none bg-slate-100/50 shadow-inner font-bold focus-visible:ring-primary/20"
                                        value={form.phone}
                                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-2xl shadow-slate-100 rounded-[2.5rem] overflow-hidden bg-white/50 backdrop-blur-xl p-2">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-lg font-black text-slate-900 tracking-tighter italic flex items-center gap-2">
                                <School className="h-5 w-5 text-amber-500" /> ACADEMIC BASELINE
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 italic flex items-center gap-2">
                                        <Building className="h-3 w-3" /> Academic Institution *
                                    </label>
                                    <Input
                                        required
                                        placeholder="Designated University..."
                                        className="h-14 rounded-2xl border-none bg-slate-100/50 shadow-inner font-bold focus-visible:ring-primary/20"
                                        value={form.university}
                                        onChange={(e) => setForm({ ...form, university: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 italic flex items-center gap-2">
                                        <BookOpen className="h-3 w-3" /> Discipline Specialization *
                                    </label>
                                    <Input
                                        required
                                        placeholder="Major field of study..."
                                        className="h-14 rounded-2xl border-none bg-slate-100/50 shadow-inner font-bold focus-visible:ring-primary/20"
                                        value={form.major}
                                        onChange={(e) => setForm({ ...form, major: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 italic flex items-center gap-2">
                                        <Target className="h-3 w-3" /> GPA Performance Metric
                                    </label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="4"
                                        placeholder="0.00"
                                        className="h-14 rounded-2xl border-none bg-slate-100/50 shadow-inner font-black text-lg focus-visible:ring-primary/20"
                                        value={form.gpa}
                                        onChange={(e) => setForm({ ...form, gpa: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 italic flex items-center gap-2">
                                        <Calendar className="h-3 w-3" /> Personnel Birth Epoch
                                    </label>
                                    <Input
                                        type="date"
                                        className="h-14 rounded-2xl border-none bg-slate-100/50 shadow-inner font-bold focus-visible:ring-primary/20"
                                        value={form.dob}
                                        onChange={(e) => setForm({ ...form, dob: e.target.value })}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right: Operational Settings */}
                <div className="lg:col-span-4 space-y-10">
                    <Card className="border-none shadow-2xl shadow-slate-100 rounded-[2.5rem] overflow-hidden bg-slate-900 text-white p-2">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-sm font-black uppercase tracking-[0.2em] opacity-40 italic flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-emerald-500" /> GEOSPATIAL DATA
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 space-y-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1 italic">Physical Location Descriptor</label>
                                <Textarea
                                    rows={4}
                                    placeholder="Enter verified residency address..."
                                    className="rounded-[2rem] border-none bg-white/5 shadow-inner font-bold text-sm italic focus:ring-primary/20 p-6 min-h-[160px] resize-none"
                                    value={form.address}
                                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                                />
                            </div>

                            <Separator className="bg-white/5" />

                            <div className="flex flex-col gap-4">
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="h-16 rounded-[1.5rem] bg-indigo-600 hover:bg-indigo-500 text-white font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-indigo-600/20 transition-all active:scale-95 disabled:opacity-40"
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-3">
                                            <div className="h-4 w-4 border-2 border-white/20 border-t-white animate-spin rounded-full" />
                                            Committing...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <Save className="h-4 w-4" /> Commit Changes
                                        </span>
                                    )}
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => navigate(-1)}
                                    className="h-16 rounded-[1.5rem] border border-white/5 hover:bg-white/5 text-slate-400 font-black text-[11px] uppercase tracking-[0.2em]"
                                >
                                    <X className="h-4 w-4 mr-2" /> Abort Mission
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="p-10 rounded-[3rem] bg-primary/5 border border-primary/10 space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary italic">Governance Notice</h4>
                        <p className="text-xs font-bold text-slate-500 leading-relaxed italic">
                            Profile modifications are logged in the persistent audit trail. Unauthorized reconfiguration of personnel credentials may trigger defensive security protocols.
                        </p>
                    </div>
                </div>
            </form>
        </div>
    );
}
