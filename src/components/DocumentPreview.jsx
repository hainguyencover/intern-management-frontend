import React from "react";
import { X, FileWarning, Download, ExternalLink, FileText, Image as ImageIcon } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "./ui/dialog";
import { Button } from "./ui/button";

export default function DocumentPreview({ url, open, onClose, title = "Xem tài liệu", fileType }) {
    const isPdf = fileType?.includes('pdf') || url?.toLowerCase().endsWith('.pdf');
    const isImage = fileType?.includes('image') || /\.(jpg|jpeg|png|gif|webp)$/i.test(url || '');

    return (
        <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
            <DialogContent className="max-w-4xl h-[85vh] p-0 overflow-hidden border-none shadow-2xl rounded-2xl">
                <DialogHeader className="p-6 bg-slate-900 text-white flex flex-row items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                            {isPdf ? <FileText className="h-4 w-4" /> : isImage ? <ImageIcon className="h-4 w-4" /> : <FileWarning className="h-4 w-4" />}
                        </div>
                        <DialogTitle className="text-lg font-black tracking-tight">{title}</DialogTitle>
                    </div>
                </DialogHeader>

                <div className="flex-grow overflow-auto bg-slate-100 flex items-center justify-center relative">
                    {open && (
                        <>
                            {isPdf && (
                                <iframe
                                    src={url}
                                    className="h-full w-full border-0 animate-in fade-in duration-700"
                                    title="PDF Preview"
                                />
                            )}
                            {isImage && (
                                <div className="p-8 w-full flex justify-center animate-in zoom-in-95 duration-500">
                                    <img
                                        src={url}
                                        alt="Document preview"
                                        className="max-w-full h-auto rounded-lg shadow-2xl border-4 border-white"
                                    />
                                </div>
                            )}
                            {!isPdf && !isImage && (
                                <div className="p-12 text-center space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                                    <div className="mx-auto h-20 w-20 rounded-3xl bg-white flex items-center justify-center text-slate-300 shadow-xl">
                                        <FileWarning className="h-10 w-10" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-black text-slate-900">Không hỗ trợ xem trước</h3>
                                        <p className="text-slate-500 font-medium">Định dạng file này cần được tải xuống để xem hoặc sử dụng phần mềm chuyên dụng.</p>
                                    </div>
                                    <div className="flex justify-center gap-3">
                                        <Button
                                            asChild
                                            className="rounded-xl h-12 px-8 bg-primary hover:bg-primary shadow-lg shadow-primary/20 font-bold"
                                        >
                                            <a href={url} download>
                                                <Download className="mr-2 h-4 w-4" /> Tải xuống ngay
                                            </a>
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className="p-4 bg-white border-t flex justify-end gap-3 shrink-0">
                    <Button variant="ghost" onClick={onClose} className="rounded-xl font-bold">
                        Đóng cửa sổ
                    </Button>
                    <Button asChild variant="outline" className="rounded-xl font-bold border-slate-200">
                        <a href={url} target="_blank" rel="noopener noreferrer">
                            Mở tab mới <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
