import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
    ChevronLeft,
    Edit3,
    User,
    Mail,
    Phone,
    Calendar,
    School,
    GraduationCap,
    MapPin,
    FileCheck,
    Eye,
    ShieldCheck,
    AlertCircle,
    CheckCircle2,
    XCircle,
    Download,
    Target,
    Activity,
    BookOpen,
    Building,
    FileText,
    Settings,
    Award
} from "lucide-react";
import { internApi } from "@/features/intern/api/internApi";
import { internDocumentApi } from "@/api/internDocumentApi";
import StatusBadge from "@/components/StatusBadge";
import DocumentPreview from "@/components/DocumentPreview";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function InternDetail() {
    const { internId } = useParams();
    const navigate = useNavigate();
    const [intern, setIntern] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    // Verify Modal State
    const [verifyModal, setVerifyModal] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [decision, setDecision] = useState("");
    const [note, setNote] = useState("");

    // Preview State
    const [previewUrl, setPreviewUrl] = useState(null);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewTitle, setPreviewTitle] = useState("");
    const [previewFileType, setPreviewFileType] = useState("");

    const fetchData = async () => {
        try {
            setLoading(true);
            const [internRes, docsRes] = await Promise.all([
                internApi.getById(internId),
                internDocumentApi.getInternDocuments({ internId }),
            ]);
            setIntern(internRes.data);
            setDocuments(docsRes.data || docsRes || []);
        } catch (err) {
            toast.error("Không thể tải hồ sơ thực tập sinh");
            navigate("/hr/interns");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [internId, navigate]);

    const handleVerify = async () => {
        if (!selectedDoc || !decision) return;
        if (decision === "REJECT" && (!note || !note.trim())) {
            toast.error("Vui lòng nhập lý do từ chối tài liệu!");
            return;
        }

        try {
            if (decision === "APPROVE") {
                await internDocumentApi.approveDocument({ id: selectedDoc.id });
                toast.success("Phê duyệt tài liệu thành công");
            } else {
                await internDocumentApi.rejectDocument({ id: selectedDoc.id, reason: note.trim() });
                toast.success("Từ chối tài liệu thành công");
            }
            setVerifyModal(false);
            setSelectedDoc(null);
            setDecision("");
            setNote("");
            await fetchData();
        } catch (err) {
            toast.error(err.backendMessage || err.message || "Xử lý thất bại");
        }
    };

    const handleView = async (doc) => {
        try {
            const res = await internDocumentApi.downloadDocument({ id: doc.id, isHr: true });
            const contentType = res.headers["content-type"] || "application/pdf";
            const blob = new Blob([res.data], { type: contentType });
            const url = window.URL.createObjectURL(blob);
            setPreviewUrl(url);
            setPreviewTitle(doc.type);
            setPreviewFileType(contentType);
            setPreviewVisible(true);
        } catch (err) {
            toast.error("Không thể xem trước tài liệu.");
        }
    };

    const handleClosePreview = () => {
        setPreviewVisible(false);
        if (previewUrl) {
            window.URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
        setPreviewTitle("");
    };

    if (loading) {
        return (
            <div className="p-20 flex flex-col items-center justify-center space-y-4">
                <div className="h-16 w-16 rounded-full border-4 border-slate-100 border-t-slate-900 animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Đang tải hồ sơ thực tập sinh...</p>
            </div>
        );
    }

    if (!intern) {
        return (
            <div className="p-20 flex flex-col items-center justify-center space-y-4 text-center">
                <AlertCircle className="h-20 w-20 text-slate-200" />
                <p className="text-slate-400 font-black uppercase tracking-widest text-sm italic">Không tìm thấy thông tin thực tập sinh.</p>
            </div>
        );
    }

    return (
        <div className="p-8 pb-24 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-6">
                    <Button
                        variant="ghost"
                        onClick={() => navigate(-1)}
                        className="h-9 px-3 rounded-xl text-slate-400 hover:text-slate-900 font-black text-[10px] uppercase tracking-widest group"
                    >
                        <ChevronLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" /> Trở về danh sách
                    </Button>
                    <div className="flex items-start gap-6">
                        <div className="h-24 w-24 rounded-[2.5rem] bg-slate-900 flex items-center justify-center text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                            <User className="h-10 w-10 relative z-10" />
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-3">
                                <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">
                                    {intern.fullName}
                                </h1>
                                <Badge className="bg-primary/10 text-primary border-none font-black text-[9px] uppercase tracking-[0.2em] h-5">
                                    THỰC TẬP SINH
                                </Badge>
                            </div>
                            <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.3em] flex items-center gap-2">
                                <Activity className="h-3 w-3 text-emerald-500" /> Hồ sơ hoạt động
                            </p>
                            <div className="flex items-center gap-4 mt-4">
                                <Badge variant="outline" className="h-8 px-4 rounded-xl border-slate-100 bg-slate-50 text-slate-400 font-black text-[10px] uppercase tracking-widest">
                                    ID: {intern.id}
                                </Badge>
                                <Separator orientation="vertical" className="h-4 bg-slate-100" />
                                <span className="text-xs font-bold text-slate-600 font-mono italic underline decoration-slate-200 underline-offset-4">{intern.email}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex gap-4">
                    <Button asChild className="h-14 px-10 rounded-2xl bg-slate-900 border-none hover:bg-black font-black text-[11px] uppercase tracking-widest text-white shadow-2xl shadow-slate-200 transition-all active:scale-95">
                        <Link to={`/hr/interns/${internId}/edit`}>
                            <Edit3 className="mr-2 h-5 w-5" /> CẬP NHẬT HỒ SƠ
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left: Core Demographics */}
                <div className="lg:col-span-8 space-y-10">
                    <Card className="border-none shadow-2xl shadow-slate-100 rounded-[2.5rem] overflow-hidden bg-white/50 backdrop-blur-xl">
                        <CardHeader className="p-10 pb-4 border-b border-slate-50">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-2xl font-black text-slate-900 tracking-tighter italic">Thông tin cá nhân</CardTitle>
                                    <CardDescription className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">Thông tin định danh và liên hệ chính thức</CardDescription>
                                </div>
                                <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                                    <ShieldCheck className="h-6 w-6" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                            <Mail className="h-4 w-4" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">EMAIL</span>
                                            <span className="text-sm font-bold text-slate-900">{intern.email}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                            <Phone className="h-4 w-4" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">SỐ ĐIỆN THOẠI</span>
                                            <span className="text-sm font-bold text-slate-900">{intern.phone || "N/A"}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                            <Calendar className="h-4 w-4" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">NGÀY SINH</span>
                                            <span className="text-sm font-bold text-slate-900">{intern.dob || "N/A"}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4 p-6 rounded-[2rem] bg-slate-900 text-white shadow-xl">
                                        <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-primary mt-1">
                                            <MapPin className="h-5 w-5" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40">ĐỊA CHỈ THƯỜNG TRÚ</span>
                                            <p className="text-sm font-bold mt-1 leading-relaxed italic">{intern.address || "N/A"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-2xl shadow-slate-100 rounded-[2.5rem] overflow-hidden bg-white">
                        <CardHeader className="p-10 pb-4 border-b border-slate-50">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-2xl font-black text-slate-900 tracking-tighter italic">Học vấn & Trình độ</CardTitle>
                                    <CardDescription className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">Thông tin trường đại học và chuyên ngành</CardDescription>
                                </div>
                                <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500">
                                    <GraduationCap className="h-6 w-6" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 space-y-3 group hover:bg-white hover:shadow-xl transition-all duration-500">
                                    <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-300 group-hover:text-primary transition-colors">
                                        <School className="h-5 w-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">TRƯỜNG ĐẠI HỌC</span>
                                        <span className="text-sm font-black text-slate-900 mt-1">{intern.university || "N/A"}</span>
                                    </div>
                                </div>
                                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 space-y-3 group hover:bg-white hover:shadow-xl transition-all duration-500">
                                    <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-300 group-hover:text-primary transition-colors">
                                        <BookOpen className="h-5 w-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">CHUYÊN NGÀNH</span>
                                        <span className="text-sm font-black text-slate-900 mt-1 line-clamp-1">{intern.major || "N/A"}</span>
                                    </div>
                                </div>
                                <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-2xl space-y-3 group transform hover:-translate-y-2 transition-all duration-500">
                                    <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-emerald-400">
                                        <Target className="h-5 w-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">ĐIỂM GPA</span>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-3xl font-black italic">{intern.gpa || "N/A"}</span>
                                            <Badge className="bg-emerald-500/20 text-emerald-400 border-none font-black text-[10px]">ĐẠT</Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right: Documents & Actions */}
                <div className="lg:col-span-4 space-y-10 font-black italic tracking-tighter">
                    <Card className="border-none shadow-2xl shadow-slate-100 rounded-[2.5rem] overflow-hidden bg-slate-900 text-white">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-sm uppercase tracking-[0.2em] opacity-40 italic flex items-center gap-2">
                                <FileCheck className="h-4 w-4 text-emerald-500" /> TÀI LIỆU HỒ SƠ
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 space-y-4">
                            {documents.length === 0 ? (
                                <div className="py-12 text-center opacity-20 flex flex-col items-center gap-4">
                                    <FileText className="h-12 w-12" />
                                    <p className="text-[10px] uppercase font-black">Chưa nộp tài liệu nào</p>
                                </div>
                            ) : documents.map((doc) => (
                                <div key={doc.id} className="group p-5 rounded-[1.5rem] bg-white/5 border border-white/5 hover:bg-white/10 transition-all duration-300">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                                                <FileText className="h-4 w-4" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black tracking-tight">{doc.type}</span>
                                                <span className="text-[9px] uppercase tracking-widest text-slate-400">
                                                    {doc.originalFileName || doc.fileName || 'file.pdf'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                            {doc.status === "PENDING" && (
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => {
                                                        setSelectedDoc(doc);
                                                        setVerifyModal(true);
                                                    }}
                                                    className="h-8 w-8 rounded-lg text-emerald-400 hover:bg-emerald-400/10"
                                                >
                                                    <ShieldCheck className="h-4 w-4" />
                                                </Button>
                                            )}
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => handleView(doc)}
                                                className="h-8 w-8 rounded-lg text-white hover:bg-white/10"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center justify-between">
                                        <StatusBadge status={doc.status} />
                                        <span className="text-[10px] text-slate-400 font-normal">
                                            {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : ''}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Verification Dialog */}
            <Dialog open={verifyModal} onOpenChange={(val) => !val && setVerifyModal(false)}>
                <DialogContent className="max-w-md rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden bg-white/95 backdrop-blur-xl">
                    <DialogHeader className="p-10 bg-slate-900 text-white space-y-2">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="h-12 w-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                                <ShieldCheck className="h-6 w-6" />
                            </div>
                            <div className="flex flex-col text-left">
                                <DialogTitle className="text-2xl font-black tracking-tighter italic">Xét duyệt tài liệu</DialogTitle>
                                <DialogDescription className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">
                                    Xác thực tài liệu: {selectedDoc?.type}
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="p-10 space-y-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 italic">Quyết định *</label>
                            <Select onValueChange={(val) => setDecision(val)} value={decision}>
                                <SelectTrigger className="h-14 rounded-2xl border-none bg-slate-100/50 shadow-inner font-black text-slate-900 focus:ring-primary/20 text-xs">
                                    <SelectValue placeholder="Chọn kết quả xét duyệt..." />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-none shadow-2xl p-2 bg-white">
                                    <SelectItem value="APPROVE" className="font-black text-[10px] uppercase tracking-widest text-emerald-600 focus:bg-emerald-50 focus:text-emerald-700 py-4 rounded-xl">
                                        <div className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4" /> Phê duyệt tài liệu</div>
                                    </SelectItem>
                                    <SelectItem value="REJECT" className="font-black text-[10px] uppercase tracking-widest text-rose-600 focus:bg-rose-50 focus:text-rose-700 py-4 rounded-xl">
                                        <div className="flex items-center gap-3"><XCircle className="h-4 w-4" /> Từ chối tài liệu</div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 italic">Lý do / Ghi chú {decision === 'REJECT' ? '*' : ''}</label>
                            <Textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder={decision === 'REJECT' ? "Nhập chi tiết lý do từ chối (bắt buộc)..." : "Nhập ghi chú phê duyệt (tùy chọn)..."}
                                className="min-h-[140px] rounded-[2rem] border-none bg-slate-100/50 shadow-inner font-bold text-sm italic focus:ring-primary/20 p-6"
                            />
                        </div>
                    </div>

                    <DialogFooter className="p-10 pt-0 bg-white flex flex-row gap-4">
                        <Button
                            variant="ghost"
                            onClick={() => setVerifyModal(false)}
                            className="flex-1 h-14 rounded-2xl font-black text-[11px] uppercase tracking-widest text-slate-400 hover:bg-slate-50"
                        >
                            Hủy bỏ
                        </Button>
                        <Button
                            onClick={handleVerify}
                            disabled={!decision || (decision === 'REJECT' && !note.trim())}
                            className="flex-[2] h-14 rounded-2xl bg-slate-900 hover:bg-black font-black text-[11px] uppercase tracking-widest text-white shadow-2xl shadow-slate-200 transition-all active:scale-95 disabled:opacity-50"
                        >
                            Xác nhận
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <DocumentPreview
                open={previewVisible}
                url={previewUrl}
                onClose={handleClosePreview}
                title={previewTitle}
                fileType={previewFileType}
            />
        </div>
    );
}
