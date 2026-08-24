import React, { useState, useRef } from "react";
import { UploadCloud, AlertCircle, FileCheck, CheckCircle2 } from "lucide-react";
import { internDocumentApi } from "@/api/internDocumentApi";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function DocumentUploader({ type: defaultType = "CV", internId, onUploadSuccess }) {
    const [selectedType, setSelectedType] = useState(defaultType);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef(null);

    const handleUpload = async (file) => {
        if (!file) return;

        // 1. File Size Validation (<= 10MB)
        const isLt10M = file.size <= 10 * 1024 * 1024;
        if (!isLt10M) {
            toast.error("Dung lượng file quá lớn! Vui lòng chọn file ≤ 10MB.");
            return;
        }

        // 2. Extension Validation (.pdf or .docx)
        const name = file.name.toLowerCase();
        if (!name.endsWith(".pdf") && !name.endsWith(".docx")) {
            toast.error("Định dạng file không được hỗ trợ! Chỉ chấp nhận file PDF hoặc DOCX.");
            return;
        }

        setUploading(true);
        setProgress(0);

        try {
            await internDocumentApi.uploadDocument({
                type: selectedType,
                file,
                internId,
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setProgress(percent);
                    }
                }
            });
            toast.success("Tải lên tài liệu thành công!");
            onUploadSuccess?.();
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (error) {
            const msg = error.backendMessage || error.message || "Tải lên tài liệu thất bại";
            toast.error(msg);
        } finally {
            setUploading(false);
            setProgress(0);
        }
    };

    const onDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer.files[0];
        handleUpload(file);
    };

    const onDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const onDragLeave = () => {
        setIsDragOver(false);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-slate-700">Loại tài liệu:</span>
                <div className="flex gap-2">
                    <Button
                        type="button"
                        size="sm"
                        variant={selectedType === "CV" ? "default" : "outline"}
                        onClick={() => setSelectedType("CV")}
                        className="rounded-full px-4 text-xs font-semibold"
                    >
                        CV
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        variant={selectedType === "INTERNSHIP_APPLICATION" ? "default" : "outline"}
                        onClick={() => setSelectedType("INTERNSHIP_APPLICATION")}
                        className="rounded-full px-4 text-xs font-semibold"
                    >
                        Đơn xin thực tập
                    </Button>
                </div>
            </div>

            <div
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`
                    group relative cursor-pointer rounded-2xl border-2 border-dashed p-10 transition-all duration-300
                    ${isDragOver
                        ? "border-primary bg-primary/5 scale-[0.99] shadow-inner"
                        : "border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50"
                    }
                    ${uploading ? "pointer-events-none opacity-60" : ""}
                `}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={(e) => handleUpload(e.target.files[0])}
                    accept=".pdf,.docx"
                />

                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className={`
                        rounded-full p-4 transition-transform group-hover:scale-110
                        ${isDragOver ? "bg-primary text-white" : "bg-white text-slate-400 shadow-md"}
                    `}>
                        <UploadCloud className="h-8 w-8" />
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-slate-900">
                            {uploading ? `Đang tải lên... ${progress}%` : "Kéo thả tệp tin hoặc nhấp để chọn"}
                        </h3>
                        <p className="mt-1 text-sm font-medium text-slate-500">
                            Định dạng được hỗ trợ: <span className="font-semibold text-slate-900">PDF, DOCX</span>
                        </p>
                    </div>

                    <div className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                        <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                        Dung lượng tối đa: 10MB
                    </div>
                </div>

                {uploading && (
                    <div className="absolute inset-x-8 bottom-6 space-y-1">
                        <div className="flex justify-between text-xs font-semibold text-slate-600">
                            <span>Đang xử lý</span>
                            <span>{progress}%</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                            <div
                                className="h-full bg-primary transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
