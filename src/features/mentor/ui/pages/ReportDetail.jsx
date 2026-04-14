import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { weeklyReportApi } from "@/api/weeklyReportApi";
import { toast } from "sonner";
import StatusBadge from "@/components/StatusBadge";
import {
    ChevronLeft,
    FileText,
    Calendar,
    Clock,
    User,
    Star,
    MessageCircle,
    Send,
    AlertCircle,
    Layout
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ReportDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [fb, setFb] = useState({ feedback: "", rating: "" });

    useEffect(() => {
        fetchReport();
    }, [id]);

    const fetchReport = async () => {
        try {
            setLoading(true);
            const res = await weeklyReportApi.getById(id);
            setReport(res.data);
            setFb({
                feedback: res.data.mentorFeedback || "",
                rating: res.data.rating != null ? String(res.data.rating) : "",
            });
        } catch (error) {
            toast.error("Không thể tải chi tiết báo cáo");
        } finally {
            setLoading(false);
        }
    };

    const submitFeedback = async (e) => {
        e.preventDefault();
        if (!fb.feedback.trim()) {
            toast.warning("Vui lòng nhập nội dung phản hồi");
            return;
        }

        if (fb.rating !== "" && (Number(fb.rating) < 0 || Number(fb.rating) > 10)) {
            toast.warning("Điểm đánh giá phải từ 0 đến 10");
            return;
        }

        try {
            setSaving(true);
            const payload = {
                feedback: fb.feedback,
                ...(fb.rating !== "" ? { rating: Number(fb.rating) } : {}),
            };
            await weeklyReportApi.feedback(id, payload);
            toast.success("Đã gửi phản hồi thành công");
            fetchReport();
        } catch (error) {
            toast.error("Gửi phản hồi thất bại");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="p-20 flex flex-col items-center justify-center space-y-4 animate-pulse">
                <div className="h-12 w-12 rounded-full border-4 border-slate-200 border-t-primary animate-spin" />
                <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Đang tải dữ liệu hồ sơ...</p>
            </div>
        );
    }

    if (!report) {
        return (
            <div className="p-20 flex flex-col items-center justify-center space-y-4">
                <AlertCircle className="h-12 w-12 text-rose-500" />
                <p className="text-slate-500 font-bold">Không tìm thấy báo cáo tương ứng.</p>
                <Button variant="outline" onClick={() => navigate(-1)}>Quay lại</Button>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-5xl space-y-8 pb-20 animate-in fade-in duration-500">
            <div className="flex items-center gap-6">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(-1)}
                    className="h-12 w-12 rounded-2xl border-2 border-slate-100 bg-white shadow-sm hover:shadow-md transition-all active:scale-95 shrink-0"
                >
                    <ChevronLeft className="h-6 w-6 text-slate-600" />
                </Button>
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                        Weekly Performance Insight
                    </h1>
                    <p className="flex items-center gap-2 text-sm font-medium text-slate-500 italic">
                        <User className="h-4 w-4" /> {report.internName} <span className="text-slate-300">|</span> ID: {report.internId}
                    </p>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-12">
                <div className="lg:col-span-8 space-y-8">
                    {/* General Info Card */}
                    <Card className="border-none shadow-2xl shadow-slate-200/60 overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b p-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Layout className="h-5 w-5 text-indigo-500" />
                                        Thông tin kỳ báo cáo
                                    </CardTitle>
                                    <CardDescription>Chi tiết thời gian và trạng thái duyệt.</CardDescription>
                                </div>
                                <StatusBadge status={report.status} />
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <Label>Giai đoạn thực hiện</Label>
                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                        <Calendar className="h-4 w-4 text-slate-400" />
                                        {report.weekStart ? String(report.weekStart).split('T')[0] : "?"}
                                        <ArrowRight className="h-3 w-3 text-slate-300 mx-1" />
                                        {report.weekEnd ? String(report.weekEnd).split('T')[0] : "?"}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Label>Thời gian gửi</Label>
                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                        <Clock className="h-4 w-4 text-slate-400" />
                                        {report.reportDate ? new Date(report.reportDate).toLocaleString("vi-VN") : "Chưa gửi"}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Report Content */}
                    <Card className="border-none shadow-2xl shadow-slate-200/60 overflow-hidden">
                        <CardHeader className="bg-white border-b p-6">
                            <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
                                <FileText className="h-5 w-5 text-primary" />
                                Nội dung báo cáo
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-10">
                            <section className="space-y-3">
                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-indigo-500" /> Tóm tắt tiến độ
                                </h3>
                                <p className="text-slate-700 font-medium leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    {report.summary || "Intern không cung cấp tóm tắt."}
                                </p>
                            </section>

                            <section className="space-y-3">
                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-emerald-500" /> Công việc hoàn thành
                                </h3>
                                <div className="text-slate-700 font-medium leading-relaxed whitespace-pre-wrap pl-4 border-l-2 border-emerald-100">
                                    {report.completedWork || "Chưa có dữ liệu."}
                                </div>
                            </section>

                            <section className="space-y-3">
                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-blue-500" /> Kế hoạch tiếp theo
                                </h3>
                                <div className="text-slate-700 font-medium leading-relaxed whitespace-pre-wrap pl-4 border-l-2 border-blue-100">
                                    {report.plannedWork || "Chưa có dữ liệu."}
                                </div>
                            </section>

                            <section className="space-y-3">
                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-rose-500" /> Khó khăn & Thách thức
                                </h3>
                                <div className="text-slate-700 font-medium leading-relaxed italic bg-rose-50/30 p-4 rounded-xl border border-rose-100/50">
                                    {report.challenges || "Mọi thứ diễn ra thuận lợi."}
                                </div>
                            </section>
                        </CardContent>
                    </Card>
                </div>

                {/* Feedback Column */}
                <div className="lg:col-span-4 space-y-8">
                    <Card className="border-none shadow-2xl shadow-slate-200/60 overflow-hidden sticky top-8">
                        <CardHeader className="bg-slate-900 text-white p-6">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <MessageCircle className="h-5 w-5 text-primary" />
                                Mentor Feedback
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <form onSubmit={submitFeedback} className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-slate-400">Chỉ số đánh giá (0-10)</Label>
                                    <div className="relative">
                                        <Star className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-400 fill-amber-400" />
                                        <Input
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            max="10"
                                            value={fb.rating}
                                            onChange={(e) => setFb({ ...fb, rating: e.target.value })}
                                            className="h-12 pl-10 rounded-xl font-black text-lg border-slate-200"
                                            placeholder="Ví dụ: 8.5"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-slate-400">Nhận xét chuyên môn</Label>
                                    <Textarea
                                        className="min-h-[200px] rounded-xl border-slate-200 focus:ring-primary/20 font-medium py-3"
                                        placeholder="Gửi lời nhận xét, góp ý hoặc định hướng cho intern..."
                                        value={fb.feedback}
                                        onChange={(e) => setFb({ ...fb, feedback: e.target.value })}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full h-14 rounded-xl bg-slate-900 hover:bg-black font-black shadow-xl shadow-slate-200"
                                >
                                    {saving ? (
                                        <Clock className="mr-2 h-5 w-5 animate-spin" />
                                    ) : (
                                        <Send className="mr-2 h-5 w-5" />
                                    )}
                                    {saving ? "ĐANG XỬ LÝ..." : "GỬI PHẢN HỒI"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

const Label = ({ children, className }) => (
    <span className={`block text-[10px] font-black uppercase tracking-widest leading-relaxed mb-1 ${className}`}>
        {children}
    </span>
);

const ArrowRight = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
);
