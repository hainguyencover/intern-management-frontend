import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { internApi } from "@/features/intern/api/internApi";
import { toast } from "sonner";
import InternForm from "@/features/hr-admin/ui/pages_hr/InternForm";
import {
    ChevronLeft,
    Sparkles,
    UserPlus,
    Activity,
    ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function CreateIntern() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (payload) => {
        try {
            setLoading(true);
            await internApi.create(payload);
            toast.success("Personnel initialization complete");
            navigate("/hr/interns");
        } catch (err) {
            toast.error(err.response?.data?.message || "Initialization protocol failure");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 pb-24 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-5xl mx-auto">
            {/* Tactical Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-6">
                    <Button
                        variant="ghost"
                        onClick={() => navigate(-1)}
                        className="h-9 px-3 rounded-xl text-slate-400 hover:text-slate-900 font-black text-[10px] uppercase tracking-widest group"
                    >
                        <ChevronLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" /> Return to Command
                    </Button>
                    <div className="flex items-start gap-6">
                        <div className="h-20 w-20 rounded-[2rem] bg-primary flex items-center justify-center text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                            <UserPlus className="h-8 w-8 relative z-10" />
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">
                                    Strategic Onloading
                                </h1>
                                <Badge variant="outline" className="border-primary/20 text-primary font-black text-[9px] uppercase tracking-[0.2em] h-5">
                                    NEW_ENTRY
                                </Badge>
                            </div>
                            <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.3em] flex items-center gap-2">
                                <Activity className="h-3.5 w-3.5 text-emerald-500" /> Administrative Personnel Initialization
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form Section */}
            <InternForm
                mode="create"
                submitting={loading}
                onSubmit={handleSubmit}
                onCancel={() => navigate(-1)}
                submitText="Execute Initialization"
            />

            <div className="p-10 rounded-[3rem] bg-slate-50 border border-slate-100 flex items-start gap-6">
                <div className="h-12 w-12 rounded-2xl bg-white shadow-xl flex items-center justify-center text-primary shrink-0">
                    <ShieldCheck className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Governance Notice</h4>
                    <p className="text-xs font-bold text-slate-500 leading-relaxed italic">
                        All strategic onboarding records are subjected to multi-layer cryptographic logging. Personnel credentials will be generated and distributed upon successful execution.
                    </p>
                </div>
            </div>
        </div>
    );
}
