import React, { useState, useRef } from "react";
import { UploadCloud, File, X, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function FileUpload({
    onUpload,
    accept = "*",
    maxSize = 5, // MB
    multiple = false,
}) {
    const [fileList, setFileList] = useState([]);
    const inputRef = useRef(null);

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files || []);
        const validFiles = [];

        files.forEach(file => {
            const sizeMB = file.size / 1024 / 1024;
            if (sizeMB > maxSize) {
                toast.error(`File "${file.name}" vượt quá kích thước tối đa ${maxSize}MB`);
            } else {
                validFiles.push(file);
            }
        });

        if (validFiles.length > 0) {
            const newList = multiple ? [...fileList, ...validFiles] : validFiles;
            setFileList(newList);
            if (onUpload) onUpload(newList);
        }

        // Reset input to allow re-selecting same file
        if (inputRef.current) inputRef.current.value = "";
    };

    const removeFile = (index) => {
        const newList = fileList.filter((_, i) => i !== index);
        setFileList(newList);
        if (onUpload) onUpload(newList);
    };

    return (
        <div className="space-y-4 w-full">
            <div className="flex flex-col gap-3">
                <input
                    type="file"
                    ref={inputRef}
                    onChange={handleFileSelect}
                    multiple={multiple}
                    accept={accept}
                    className="hidden"
                />

                <Button
                    type="button"
                    variant="outline"
                    onClick={() => inputRef.current?.click()}
                    className="w-full flex items-center justify-center gap-2 h-12 border-dashed border-2 hover:border-primary hover:bg-primary/5 transition-all rounded-xl"
                >
                    <UploadCloud className="h-5 w-5 text-slate-400" />
                    <span className="font-bold text-slate-600">Chọn tệp tin ({accept === "*" ? "Mọi định dạng" : accept})</span>
                </Button>

                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center italic">
                    Tối đa {maxSize}MB mỗi tệp
                </p>
            </div>

            {fileList.length > 0 && (
                <div className="grid gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    {fileList.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 group">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center text-primary shadow-sm border border-slate-100">
                                    <File className="h-4 w-4" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-sm font-bold text-slate-700 truncate">{file.name}</span>
                                    <span className="text-[10px] font-medium text-slate-400 italic">
                                        {(file.size / 1024).toFixed(1)} KB
                                    </span>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeFile(index)}
                                className="h-8 w-8 rounded-full hover:bg-rose-50 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
