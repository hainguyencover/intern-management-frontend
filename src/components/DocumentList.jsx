import React from "react";
import { Table, Button, Popconfirm } from "antd";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import StatusBadge from "./StatusBadge";
import { documentApi } from "../api/documentApi";
import { toast } from "sonner";

export default function DocumentList({ documents, onDelete, loading }) {
    const handleView = async (docId) => {
        try {
            const response = await documentApi.download(docId);
            const blob = new Blob([response.data], { type: response.headers['content-type'] || 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            window.open(url, "_blank");
            setTimeout(() => window.URL.revokeObjectURL(url), 10000);
        } catch (error) {
            console.error(error);
            toast.error("Không thể xem file. Vui lòng thử lại.");
        }
    };

    const columns = [
        {
            title: "Loại",
            dataIndex: "type",
            key: "type",
        },
        {
            title: "Tên file",
            dataIndex: "fileName",
            key: "fileName",
            render: (text, record) => (
                <a onClick={() => handleView(record.id)} className="cursor-pointer text-blue-600 hover:underline">
                    {text || "Document"}
                </a>
            ),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status) => <StatusBadge status={status} />,
        },
        {
            title: "Ngày tải lên",
            dataIndex: "uploadedAt",
            key: "uploadedAt",
            render: (date) => (date ? new Date(date).toLocaleString() : "-"),
        },
        {
            title: "Ghi chú",
            dataIndex: "reviewNote",
            key: "reviewNote",
            render: (note) => note || "-",
        },
        {
            title: "Thao tác",
            key: "actions",
            render: (_, record) => (
                <div className="flex gap-2">
                    <Button
                        icon={<EyeOutlined />}
                        size="small"
                        onClick={() => handleView(record.id)}
                    >
                        Xem
                    </Button>
                    {record.status === "PENDING" && (
                        <Popconfirm
                            title="Xác nhận xóa?"
                            onConfirm={() => onDelete(record.id)}
                        >
                            <Button icon={<DeleteOutlined />} size="small" danger>
                                Xóa
                            </Button>
                        </Popconfirm>
                    )}
                </div>
            ),
        },
    ];

    return (
        <Table
            dataSource={documents}
            columns={columns}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
        />
    );
}
