import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MentorForm from "./MentorForm";
import { mentorApi, getMentorById } from "../../api/mentorApi";
import { toast } from "sonner";
import {
    ChevronLeft,
    ShieldCheck,
    Settings2,
    Activity,
    UserCircle,
    UserCog
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";

export default function EditMentor() {
    const { id } = useParams();
    const nav = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [initialValues, setInitialValues] = useState(null);
    const [serverErrors, setServerErrors] = useState({});

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const data = await getMentorById(id);
                setInitialValues({
                    fullName: data.fullName,
                    email: data.email,
                    phone: data.phone || "",
                    departmentId: data.departmentId,
                });
            } catch (e) {
                console.error(e);
                toast.error("Failed to acquire mentor registry data");
                nav("/hr/mentors");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id, nav]);

    const handleSubmit = async (values) => {
        setSubmitting(true);
        setServerErrors({});
        try {
            await mentorApi.update(id, values);
            toast.success("Mentor reconfiguration successful");
            nav("/hr/mentors");
        } catch (e) {
            console.error(e);
            const data = e?.response?.data;
            if (data?.errors) setServerErrors(data.errors);
            toast.error(data?.message || "Governance override failed");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="p-20 flex flex-col items-center justify-center space-y-4">
                <div className="h-16 w-16 rounded-full border-4 border-slate-100 border-t-slate-900 animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Locking Strategic Asset Registry for Reconfig...</p>
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
                        onClick={() => nav("/hr/mentors")}
                        className="h-9 px-3 rounded-xl text-slate-400 hover:text-slate-900 font-black text-[10px] uppercase tracking-widest group"
                    >
                        <ChevronLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" /> Terminate Reconfig
                    </Button>
                    <div className="flex items-start gap-6">
                        <div className="h-20 w-20 rounded-[2rem] bg-indigo-600 flex items-center justify-center text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                            <UserCog className="h-8 w-8 relative z-10" />
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">
                                    Strategic Reconfiguration
                                </h1>
                                <Badge variant="outline" className="border-indigo-100 text-indigo-400 font-black text-[9px] uppercase tracking-[0.2em] h-5">
                                    ADMIN_OVERRIDE
                                </Badge>
                            </div>
                            <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.3em] flex items-center gap-2">
                                <Activity className="h-3.5 w-3.5 text-emerald-500" /> Authorized Strategic Mentor Access
                            </p>
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-2 bg-slate-50 w-fit px-3 py-1 rounded-lg border border-slate-100">
                                Asset-ID: {id}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Card className="border-none shadow-2xl shadow-slate-100 rounded-[2.5rem] overflow-hidden bg-white/50 backdrop-blur-xl p-2">
                <CardHeader className="p-10 pb-4">
                    <CardTitle className="text-2xl font-black text-slate-900 tracking-tighter italic flex items-center gap-2 uppercase">
                        <Settings2 className="h-6 w-6 text-primary" /> Configuration Parameters
                    </CardTitle>
                    <CardDescription className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">
                        Override strategic asset properties in the global registry
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-10 pt-6">
                    <MentorForm
                        mode="edit"
                        initialValues={initialValues}
                        onSubmit={handleSubmit}
                        onCancel={() => nav("/hr/mentors")}
                        submitting={submitting}
                        serverErrors={serverErrors}
                    />
                </CardContent>
            </Card>

            <div className="p-10 rounded-[3rem] bg-indigo-50 border border-indigo-100 flex items-start gap-6">
                <div className="h-12 w-12 rounded-2xl bg-white shadow-xl flex items-center justify-center text-indigo-500 shrink-0">
                    <ShieldCheck className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 italic">Governance Protocol</h4>
                    <p className="text-xs font-bold text-slate-500 leading-relaxed italic">
                        All configuration overrides are subjected to multi-layer cryptographic logging. Unauthorized resource modification attempt will be flagged for immediate review.
                    </p>
                </div>
            </div>
        </div>
    );
}
