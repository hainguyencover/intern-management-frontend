import React from "react";
import {Modal} from "antd";

export default function DocumentPreview({url, open, onClose, title = "Xem tài liệu"}) {
    const isPdf = url?.toLowerCase().endsWith('.pdf');
    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(url || '');

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            width={800}
            title={title}
        >
            <div className="max-h-[600px] overflow-auto">
                {isPdf && (
                    <iframe
                        src={url}
                        className="h-[600px] w-full border-0"
                        title="PDF Preview"
                    />
                )}
                {isImage && (
                    <img
                        src={url}
                        alt="Document preview"
                        className="w-full"
                    />
                )}
                {!isPdf && !isImage && (
                    <div className="py-8 text-center text-slate-600">
                        <p>Không thể xem trước file này</p>
                        <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                        >
                            Tải xuống
                        </a>
                    </div>
                )}
            </div>
        </Modal>
    );
}
