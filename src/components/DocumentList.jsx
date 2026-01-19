import React from "react";
import { Table, Button, Popconfirm } from "antd";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import StatusBadge from "./StatusBadge";

export default function DocumentList({ documents, onDelete, loading }) {
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
                <a href={record.fileUrl} target="_blank" rel="noopener noreferrer">
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
                        href={record.fileUrl}
                        target="_blank"
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
