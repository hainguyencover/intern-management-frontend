import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { applicationApi } from "../../api/applicationApi.js";
import {
    Send,
    Info,
    LayoutTemplate,
    ArrowRight,
    FileText,
    MessageSquare,
    Sparkles
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { Label } from "../../components/ui/label";

export default function ApplicationSubmitPage() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        position: "",
        note: ""
    });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.position) {
            toast.error("Vui lòng nhập vị trí ứng tuyển");
            return;
        }

        setLoading(true);
        try {
            await applicationApi.submit(formData);
            toast.success("Nộp hồ sơ thành công!");
            navigate("/intern/applications");
        } catch (error) {
            toast.error(error.response?.data?.message || "Nộp hồ sơ thất bại");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-2xl space-y-8 pb-20 animate-in fade-in duration-500">
            <div className="space-y-1">
                <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
                    <Send className="h-10 w-10 text-primary" />
                    Bắt đầu sự nghiệp
                </h1>
                <p className="text-slate-500 font-medium italic">Gửi hồ sơ ứng tuyển của bạn để gia nhập đội ngũ chuyên gia tại CodeGym.</p>
            </div>

            <Alert className="rounded-2xl border-blue-100 bg-blue-50 text-blue-800 p-6 shadow-sm">
                <Info className="h-5 w-5 text-blue-500" />
                <div className="ml-2">
                    <AlertTitle className="font-black uppercase tracking-widest text-xs mb-1">Kiểm tra tài liệu</AlertTitle>
                    <AlertDescription className="font-medium">
                        Hãy đảm bảo bạn đã upload đầy đủ CV, các chứng chỉ và tài liệu cần thiết trong mục
                        <Button
                            variant="link"
                            className="h-auto p-0 px-1 font-black text-blue-700 underline"
                            onClick={() => navigate("/intern/documents")}
                        >
                            Quản lý tài liệu
                        </Button>
                        trước khi gửi hồ sơ.
                    </AlertDescription>
                </div>
            </Alert>

            <Card className="border-none shadow-2xl shadow-slate-200/60 overflow-hidden">
                <CardHeader className="bg-slate-900 text-white pb-8">
                    <CardTitle className="text-xl flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        Form ứng tuyển
                    </CardTitle>
                    <CardDescription className="text-slate-400">Thông tin cơ bản để nhà tuyển dụng nhận diện hồ sơ của bạn.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="p-8 space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="position" className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Vị trí ứng tuyển <span className="text-rose-500">*</span></Label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    id="position"
                                    placeholder="Ví dụ: Frontend Developer Intern"
                                    className="pl-10 h-14 rounded-xl border-slate-200 focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                                    value={formData.position}
                                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="note" className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Ghi chú thêm</Label>
                            <div className="relative">
                                <MessageSquare className="absolute left-3 top-4 h-4 w-4 text-slate-400" />
                                <Textarea
                                    id="note"
                                    placeholder="Điểm mạnh của bạn, mục tiêu thực tập, hoặc bất kỳ lời nhắn nào tới Mentor..."
                                    className="pl-10 min-h-[120px] rounded-xl border-slate-200 focus:ring-2 focus:ring-primary/20 transition-all py-3 font-medium"
                                    value={formData.note}
                                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="p-8 pt-0 flex flex-col sm:flex-row gap-4">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full sm:flex-1 h-14 rounded-xl font-black text-lg bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all active:scale-[0.98]"
                        >
                            {loading ? (
                                "Đang xử lý..."
                            ) : (
                                <>Nộp hồ sơ ngay <ArrowRight className="ml-2 h-5 w-5" /></>
                            )}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate("/intern/documents")}
                            className="w-full sm:w-auto h-14 px-8 rounded-xl font-bold border-slate-200 hover:bg-slate-50"
                        >
                            Kiểm tra lại tài liệu
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
