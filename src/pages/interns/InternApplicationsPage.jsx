import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    User,
    FileText,
    Clock,
    Rocket,
    CheckCircle2,
    XCircle,
    AlertCircle,
    ArrowRight,
    LayoutDashboard,
    Files
} from "lucide-react";
import { toast } from "sonner";
import { applicationApi } from "../../api/applicationApi.js";
import { useAuth } from "../../auth/AuthContext";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";

export default function InternApplicationsPage() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = async () => {
        setLoading(true);
        try {
            const res = await applicationApi.getMyApplications();
            setApplications(res.data);
        } catch (error) {
            toast.error("Không thể tải thông tin hồ sơ");
        } finally {
            setLoading(false);
        }
    };

    const getStepInfo = () => {
        const approvedApp = applications.find(app => ['APPROVED', 'CONTRACT_SENT', 'CONTRACT_SIGNED'].includes(app.status));
        const pendingApp = applications.find(app => ['SUBMITTED', 'PENDING'].includes(app.status));
        const rejectedApp = applications.find(app => app.status === 'REJECTED');

        if (approvedApp) return { currentStep: 3, status: 'finish', app: approvedApp };
        if (pendingApp) return { currentStep: 2, status: 'process', app: pendingApp };
        if (rejectedApp) return { currentStep: 1, status: 'error', app: rejectedApp };

        return { currentStep: 1, status: 'wait' };
    };

    const { currentStep, status, app } = getStepInfo();

    const steps = [
        { title: 'Tạo tài khoản', icon: User, description: 'Đã hoàn thành' },
        { title: 'Nộp hồ sơ', icon: FileText, description: 'Điền thông tin ứng tuyển' },
        { title: 'Chờ xét duyệt', icon: Clock, description: 'HR xem xét hồ sơ' },
        { title: 'Bắt đầu', icon: Rocket, description: 'Chính thức thực tập' },
    ];

    return (
        <div className="mx-auto max-w-5xl px-4 py-16 space-y-12 animate-in fade-in duration-700">
            {/* Hero Section */}
            <div className="text-center space-y-3">
                <Badge variant="outline" className="px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border-primary/20 bg-primary/5 text-primary">
                    Intern Onboarding
                </Badge>
                <h1 className="text-5xl font-black tracking-tight text-slate-900">
                    Chào mừng, <span className="text-primary italic">{user?.fullName}!</span>
                </h1>
                <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">
                    Hãy hoàn tất lộ trình bên dưới để chính thức trở thành một phần của đội ngũ chúng tôi.
                </p>
            </div>

            {/* Stepper Section */}
            <div className="relative flex justify-between">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
                {steps.map((step, idx) => {
                    const StepIcon = step.icon;
                    const isCompleted = idx < currentStep;
                    const isCurrent = idx === currentStep;
                    const isError = idx === currentStep && status === 'error';

                    return (
                        <div key={idx} className="relative z-10 flex flex-col items-center gap-4 bg-white px-4 md:px-8">
                            <div className={`
h - 14 w - 14 rounded - 2xl flex items - center justify - center transition - all duration - 500 shadow - xl
                                ${isCompleted ? "bg-emerald-500 text-white rotate-[360deg]" :
                                    isError ? "bg-rose-500 text-white shadow-rose-200" :
                                        isCurrent ? "bg-primary text-white scale-110 shadow-primary/30" :
                                            "bg-white text-slate-300 border border-slate-100"
                                }
`}>
                                {isCompleted ? <CheckCircle2 className="h-6 w-6" /> : <StepIcon className="h-6 w-6" />}
                            </div>
                            <div className="text-center hidden md:block">
                                <h3 className={`text - sm font - black ${isCurrent ? "text-slate-900" : "text-slate-400"} `}>
                                    {step.title}
                                </h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">
                                    {isError ? "Cần chỉnh sửa" : step.description}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Content Area */}
            <div className="pt-8">
                {loading ? (
                    <Card className="border-none shadow-2xl">
                        <CardContent className="p-20 flex flex-col items-center justify-center gap-6">
                            <div className="relative h-16 w-16">
                                <Skeleton className="h-16 w-16 rounded-full" />
                                <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                            </div>
                            <p className="font-bold text-slate-500 animate-pulse">Đang định danh hồ sơ của bạn...</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="animate-in slide-in-from-bottom-8 fade-in-0 duration-500">
                        {/* Case 1: Chưa nộp hồ sơ */}
                        {currentStep === 1 && status !== 'error' && (
                            <Card className="border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden">
                                <div className="h-2 bg-indigo-500 w-full" />
                                <CardContent className="p-12 text-center space-y-6">
                                    <div className="mx-auto h-20 w-20 rounded-3xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                                        <FileText className="h-10 w-10" />
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="text-3xl font-black text-slate-900">Sẵn sàng bắt đầu?</h2>
                                        <p className="text-slate-500 font-medium max-w-sm mx-auto italic">
                                            Bạn chưa có hồ sơ ứng tuyển nào. Hãy gửi thông tin của bạn để chúng tôi có cơ hội hợp tác.
                                        </p>
                                    </div>
                                    <Button size="lg" onClick={() => navigate("/intern/apply")} className="rounded-full px-12 h-14 text-lg font-black shadow-xl shadow-indigo-200">
                                        Nộp hồ sơ ngay <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        {/* Case 2: Đang chờ duyệt */}
                        {currentStep === 2 && (
                            <Card className="border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden">
                                <div className="h-2 bg-amber-500 w-full" />
                                <CardContent className="p-12 text-center space-y-6">
                                    <div className="mx-auto h-20 w-20 rounded-3xl bg-amber-50 flex items-center justify-center text-amber-500 animate-pulse">
                                        <Clock className="h-10 w-10" />
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="text-3xl font-black text-slate-900">Hồ sơ đang chờ xử lý</h2>
                                        <p className="text-slate-500 font-medium max-w-md mx-auto">
                                            Vị trí <span className="text-slate-900 font-black italic underline decoration-amber-500/30">"{app?.position}"</span> đã được tiếp nhận.
                                            Chúng tôi sẽ phản hồi sớm nhất qua email.
                                        </p>
                                    </div>
                                    <div className="flex justify-center gap-4">
                                        <Button variant="outline" onClick={() => navigate("/intern/documents")} className="rounded-full px-8">
                                            <Files className="mr-2 h-4 w-4" /> Quản lý tài liệu
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Case 3: Đã được duyệt */}
                        {currentStep === 3 && (
                            <Card className="border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden">
                                <div className="h-2 bg-emerald-500 w-full" />
                                <CardContent className="p-12 text-center space-y-6">
                                    <div className="mx-auto h-24 w-24 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 shadow-xl shadow-emerald-100">
                                        <CheckCircle2 className="h-12 w-12" />
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="text-4xl font-black text-emerald-600">Tuyệt vời! Tuyển dụng đã hoàn tất</h2>
                                        <p className="text-slate-500 font-bold text-lg">
                                            Bạn đã chính thức trở thành thực tập sinh.
                                        </p>
                                    </div>
                                    <Button size="lg" onClick={() => window.location.href = "/dashboard/intern"} className="bg-emerald-600 hover:bg-emerald-700 rounded-full px-12 h-14 text-lg font-black shadow-xl shadow-emerald-200">
                                        <LayoutDashboard className="mr-2 h-5 w-5" /> Vào Dashboard ngay
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        {/* Case 4: Bị từ chối */}
                        {status === 'error' && (
                            <Card className="border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden">
                                <div className="h-2 bg-rose-500 w-full" />
                                <CardContent className="p-12 text-center space-y-6">
                                    <div className="mx-auto h-20 w-20 rounded-3xl bg-rose-50 flex items-center justify-center text-rose-500">
                                        <AlertCircle className="h-10 w-10" />
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="text-3xl font-black text-rose-600">Cần bổ sung thông tin</h2>
                                        <p className="text-slate-500 font-medium max-w-md mx-auto">
                                            Rất tiếc, hồ sơ của bạn chưa đạt yêu cầu. Vui lòng kiểm tra lại tài liệu hoặc nộp lại hồ sơ mới.
                                        </p>
                                    </div>
                                    <div className="flex justify-center gap-4">
                                        <Button onClick={() => navigate("/intern/apply")} className="bg-rose-600 hover:bg-rose-700 rounded-full px-8 shadow-lg shadow-rose-200">
                                            Nộp lại hồ sơ
                                        </Button>
                                        <Button variant="outline" onClick={() => navigate("/intern/documents")} className="rounded-full px-8 underline">
                                            Kiểm tra tài liệu
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                )}
            </div>

            <div className="pt-12 text-center flex items-center justify-center gap-2">
                <span className="h-px w-8 bg-slate-200" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    CodeGym &copy; 2026 IMS Core Platform
                </span>
                <span className="h-px w-8 bg-slate-200" />
            </div>
        </div>
    );
}
