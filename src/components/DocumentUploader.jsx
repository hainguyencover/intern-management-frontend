import React, { useState, useRef } from "react";
import { UploadCloud, FileText, X, AlertCircle } from "lucide-react";
import { documentApi } from "../api/documentApi";
import { toast } from "sonner";
import { Button } from "./ui/button";

export default function DocumentUploader({ type = "CV", internId, onUploadSuccess }) {
    const [uploading, setUploading] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef(null);

    const handleUpload = async (file) => {
        if (!file) return;

        // Validation
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            toast.error("File phải nhỏ hơn 5MB!");
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", type);
        if (internId) {
            formData.append("internId", internId);
        }

        try {
            await documentApi.upload(formData);
            toast.success("Tải lên thành công!");
            onUploadSuccess?.();
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (error) {
            toast.error(error.response?.data?.message || "Tải lên thất bại");
        } finally {
            setUploading(false);
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
        <div
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`
                group relative cursor-pointer rounded-2xl border-2 border-dashed p-12 transition-all duration-300
                ${isDragOver
                    ? "border-primary bg-primary/5 scale-[0.99] shadow-inner"
                    : "border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50"
                }
                ${uploading ? "pointer-events-none opacity-50" : ""}
            `}
        >
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={(e) => handleUpload(e.target.files[0])}
                accept=".pdf,.doc,.docx,.jpg,.png"
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
                        {uploading ? "Đang tải lên..." : "Kéo thả file hoặc click để chọn"}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-slate-500">
                        Định dạng hỗ trợ: <span className="text-slate-900">PDF, DOC, JPG, PNG</span>
                    </p>
                </div>

                <div className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <AlertCircle className="h-3 w-3" />
                    Kích thước tối đa: 5MB
                </div>
            </div>

            {uploading && (
                <div className="absolute inset-x-8 bottom-8">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full bg-primary animate-progress-indeterminate"></div>
                    </div>
                </div>
            )}
        </div>
    );
}
