import React, { useState } from "react";
import { Upload, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { documentApi } from "../api/documentApi";
import { toast } from "sonner";

const { Dragger } = Upload;

export default function DocumentUploader({ type = "CV", internId, onUploadSuccess }) {
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (file) => {
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
        } catch (error) {
            toast.error(error.response?.data?.message || "Tải lên thất bại");
        } finally {
            setUploading(false);
        }
        return false; // prevent default upload
    };

    return (
        <Dragger
            name="file"
            multiple={false}
            beforeUpload={handleUpload}
            showUploadList={false}
            disabled={uploading}
        >
            <p className="ant-upload-drag-icon">
                <InboxOutlined />
            </p>
            <p className="ant-upload-text">Kéo thả file hoặc click để chọn</p>
            <p className="ant-upload-hint">
                Hỗ trợ: PDF, DOC, DOCX, JPG, PNG (Max 5MB)
            </p>
        </Dragger>
    );
}
