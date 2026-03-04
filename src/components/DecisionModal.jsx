import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { CheckCircle2, XCircle } from "lucide-react";

export default function DecisionModal({ open, onClose, onSubmit, mode = "APPROVE" }) {
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);

    const title = mode === "APPROVE" ? "Duyệt hồ sơ ứng tuyển" : "Từ chối hồ sơ ứng tuyển";
    const hint = mode === "APPROVE"
        ? "Xác nhận rằng ứng viên này đáp ứng đủ tiêu chuẩn và cho phép tiến tới giai đoạn tiếp theo."
        : "Vui lòng cung cấp lý do chi tiết để ứng viên có thể cải thiện trong tương lai.";

    const handleSubmit = async () => {
        try {
            setLoading(true);
            await onSubmit({ decision: mode, comment });
            onClose();
            setComment("");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(val) => !val && !loading && onClose()}>
            <DialogContent className="max-w-md rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
                <DialogHeader className={`p-8 ${mode === "APPROVE" ? "bg-emerald-600" : "bg-rose-600"} text-white space-y-2`}>
                    <DialogTitle className="text-2xl font-black leading-tight flex items-center gap-2">
                        {mode === "APPROVE" ? <CheckCircle2 className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
                        {title}
                    </DialogTitle>
                    <DialogDescription className="text-white/80 italic font-medium">
                        {hint}
                    </DialogDescription>
                </DialogHeader>

                <div className="p-8 space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                            {mode === "APPROVE" ? "GHI CHÚ HỆ THỐNG (TÙY CHỌN)" : "LÝ DO CHI TIẾT *"}
                        </label>
                        <Textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder={mode === "APPROVE" ? "Ghi chú thêm về hồ sơ này..." : "Nhập lý do từ chối hồ sơ..."}
                            className="min-h-[120px] rounded-2xl border-slate-200 resize-none font-medium italic focus:ring-primary/20"
                        />
                    </div>
                </div>

                <DialogFooter className="p-6 bg-slate-50/50 border-t flex flex-row gap-3">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 h-12 rounded-2xl font-black text-[11px] uppercase tracking-widest text-slate-500 hover:bg-slate-100"
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading || (mode === "REJECT" && !comment.trim())}
                        className={`flex-[2] h-12 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl transition-all active:scale-95 text-white ${mode === "APPROVE"
                                ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200"
                                : "bg-rose-600 hover:bg-rose-700 shadow-rose-200"
                            }`}
                    >
                        {loading ? "ĐANG XỬ LÝ..." : mode === "APPROVE" ? "XÁC NHẬN DUYỆT" : "XÁC NHẬN TỪ CHỐI"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
