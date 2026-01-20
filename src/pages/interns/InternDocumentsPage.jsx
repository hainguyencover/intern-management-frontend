import React, { useEffect, useState } from "react";
import { Card, Tabs, Space } from "antd";
import { documentApi } from "../../api/documentApi";
import DocumentUploader from "../../components/DocumentUploader";
import DocumentList from "../../components/DocumentList";
import { toast } from "sonner";

export default function InternDocumentsPage() {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadDocuments();
    }, []);

    const loadDocuments = async () => {
        setLoading(true);
        try {
            const res = await documentApi.getMyDocuments();
            setDocuments(res.data);
        } catch (error) {
            toast.error("Không thể tải danh sách tài liệu");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await documentApi.deleteDocument(id);
            toast.success("Xóa thành công");
            loadDocuments();
        } catch (error) {
            toast.error("Xóa thất bại");
        }
    };

    const items = [
        {
            key: "upload",
            label: "Tải lên tài liệu",
            children: (
                <div className="flex flex-col w-full gap-6">
                    <DocumentUploader type="CV" onUploadSuccess={loadDocuments} />
                </div>
            ),
        },
        {
            key: "list",
            label: "Danh sách tài liệu",
            children: (
                <DocumentList
                    documents={documents}
                    onDelete={handleDelete}
                    loading={loading}
                />
            ),
        },
    ];

    return (
        <div className="mx-auto max-w-6xl">
            <Card title="Quản lý tài liệu">
                <Tabs items={items} />
            </Card>
        </div>
    );
}
