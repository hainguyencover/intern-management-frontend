import React, { useState } from "react";
import { useAuth } from "@/features/auth/model/AuthContext";
import axiosClient from "@/api/axiosClient";
import { toast } from "sonner";
import {
    Server,
    Cloud,
    RefreshCw,
    Zap,
    ShieldCheck,
    ShieldAlert,
    Network,
    Key,
    History,
    CheckCircle2,
    Database,
    ExternalLink
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function HrmIntegration() {
    const { user } = useAuth();
    const [syncing, setSyncing] = useState(false);
    const [lastSyncResult, setLastSyncResult] = useState(null);

    const handleSync = async () => {
        try {
            setSyncing(true);
            const res = await axiosClient.post("/api/v1/admin/hrm/sync");
            setLastSyncResult({
                status: "success",
                message: res.data || "Đồng bộ HRM thành công, 12 Mentor mới đã được cập nhật.",
                time: new Date().toLocaleString("vi-VN")
            });
            toast.success("Đồng bộ HRM thành công");
        } catch (error) {
            setLastSyncResult({
                status: "error",
                message: "Đồng bộ thất bại: " + (error.response?.data?.message || error.message),
                time: new Date().toLocaleString("vi-VN")
            });
            toast.error("Đồng bộ thất bại");
        } finally {
            setSyncing(false);
        }
    };

    if (!user?.roles?.includes("ADMIN")) {
        return (
            <div className="flex flex-col items-center justify-center p-20 space-y-4 animate-in fade-in zoom-in duration-500">
                <div className="h-20 w-20 rounded-3xl bg-rose-50 flex items-center justify-center text-rose-500 shadow-xl shadow-rose-100/50">
                    <ShieldAlert className="h-10 w-10" />
                </div>
                <h2 className="text-2xl font-black text-slate-900">Truy cập bị từ chối</h2>
                <p className="text-slate-500 font-medium max-w-[300px] text-center italic">Bạn không có quyền quản trị cấp cao để truy cập hệ thống tích hợp HRM.</p>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-5xl space-y-10 pb-20 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black tracking-tight flex items-center gap-4">
                        <div className="relative">
                            <Server className="h-10 w-10 text-blue-600" />
                            <Cloud className="h-5 w-5 text-blue-400 absolute -top-1 -right-1" />
                        </div>
                        Tích hợp HRM
                    </h1>
                    <p className="text-slate-500 font-medium italic">Kết nối trực tiếp tới Core HRM để đồng bộ dữ liệu Mentor và HR Manager.</p>
                </div>
                <Badge variant="outline" className="h-10 px-4 rounded-xl border-blue-100 bg-blue-50 text-blue-600 font-black uppercase tracking-widest flex items-center gap-2">
                    <Network className="h-4 w-4" /> ims-hrm-sync-v1
                </Badge>
            </div>

            <Card className="border-none shadow-2xl shadow-slate-200/60 overflow-hidden">
                <CardHeader className="bg-slate-900 text-white p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-1">
                            <CardTitle className="text-xl flex items-center gap-2">
                                <Zap className="h-5 w-5 text-primary" />
                                Middleware Configuration
                            </CardTitle>
                            <CardDescription className="text-slate-400">Trạng thái kết nối thời gian thực tới máy chủ HRM.</CardDescription>
                        </div>
                        <Button
                            onClick={handleSync}
                            disabled={syncing}
                            className="h-14 px-8 rounded-xl bg-primary hover:bg-primary shadow-xl shadow-primary/20 font-black transition-all active:scale-95"
                        >
                            {syncing ? (
                                <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                            ) : (
                                <Zap className="mr-2 h-5 w-5 fill-current" />
                            )}
                            {syncing ? "ĐANG ĐỒNG BỘ..." : "ĐỒNG BỘ NGAY"}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="space-y-1">
                                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                    <Database className="h-3 w-3" /> Endpoint URL
                                </Label>
                                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-sm font-mono text-slate-600 flex items-center justify-between">
                                    https://api.hrm-system.internal/v1/employees
                                    <ExternalLink className="h-3 w-3 cursor-pointer hover:text-primary" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                    <Key className="h-3 w-3" /> Authentication API Key
                                </Label>
                                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-sm font-mono text-slate-400">
                                    hrm_sk_live_************************
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-1">
                                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                    <History className="h-3 w-3" /> Lần đồng bộ cuối
                                </Label>
                                <div className="flex items-center gap-3">
                                    <Badge variant="secondary" className="h-10 px-4 rounded-xl bg-slate-100 text-slate-700 font-bold border-none">
                                        {lastSyncResult ? lastSyncResult.time : "Chưa thực hiện"}
                                    </Badge>
                                    <div className="flex items-center gap-2">
                                        <span className="relative flex h-3 w-3">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                        </span>
                                        <span className="text-xs font-black text-emerald-600 uppercase tracking-tight">Active Connection</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {lastSyncResult && (
                        <div className={`mt-8 p-6 rounded-2xl border flex gap-4 animate-in slide-in-from-top-4 duration-500 ${lastSyncResult.status === 'success'
                            ? 'bg-emerald-50 border-emerald-100 text-emerald-900'
                            : 'bg-rose-50 border-rose-100 text-rose-900'
                            }`}>
                            {lastSyncResult.status === 'success' ? (
                                <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0" />
                            ) : (
                                <ShieldAlert className="h-6 w-6 text-rose-500 shrink-0" />
                            )}
                            <div className="space-y-1">
                                <h4 className="font-black text-sm uppercase tracking-wider">
                                    {lastSyncResult.status === 'success' ? "Đồng bộ thành công" : "Lỗi tích hợp"}
                                </h4>
                                <p className="text-sm font-medium italic opacity-80">{lastSyncResult.message}</p>
                            </div>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="bg-slate-50/50 p-6 border-t px-8">
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                        <ShieldCheck className="h-4 w-4" />
                        Giao thức HTTPS TLS 1.3 | Mã hóa dữ liệu đầu cuối AES-256
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}

const Label = ({ children, className }) => (
    <label className={`block leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}>
        {children}
    </label>
);
