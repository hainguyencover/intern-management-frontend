import React, { useEffect, useState } from "react";
import { Card, Button, Table, Modal } from "antd";
import StatusBadge from "../../../components/StatusBadge";
import { toast } from "sonner";
import {documentApi as contractApi} from "../../../api/contractApi.js";

export default function InternContractConfirmPage() {
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [confirming, setConfirming] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        loadContracts();
    }, []);

    const loadContracts = async () => {
        setLoading(true);
        try {
            const res = await contractApi.getMyContracts();
            setContracts(res.data);
        } catch (error) {
            toast.error("Không thể tải danh sách hợp đồng");
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async (id) => {
        setConfirming(true);
        try {
            await contractApi.confirmContract(id);
            toast.success("Xác nhận hợp đồng thành công!");
            loadContracts();
            setSelectedId(null);
        } catch (error) {
            toast.error("Xác nhận thất bại");
        } finally {
            setConfirming(false);
        }
    };

    const columns = [
        {
            title: "Vị trí",
            dataIndex: ["application", "position"],
            key: "position",
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status) => <StatusBadge status={status} />,
        },
        {
            title: "Ngày ký",
            dataIndex: "signedAt",
            key: "signedAt",
            render: (date) => (date ? new Date(date).toLocaleString() : "-"),
        },
        {
            title: "Thao tác",
            key: "actions",
            render: (_, record) => (
                <div className="flex gap-2">
                    <Button onClick={() => setPreviewUrl(record.fileUrl)}>Xem</Button>
                    {record.status === "SENT" && (
                        <Button
                            type="primary"
                            onClick={() => setSelectedId(record.id)}
                        >
                            Xác nhận ký
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className="mx-auto max-w-6xl">
            <Card title="Hợp đồng thực tập">
                <Table
                    dataSource={contracts}
                    columns={columns}
                    rowKey="id"
                    loading={loading}
                />
            </Card>

            <Modal
                title="Xem hợp đồng"
                open={!!previewUrl}
                onCancel={() => setPreviewUrl(null)}
                footer={null}
                width={800}
            >
                {previewUrl && (
                    <iframe
                        src={previewUrl}
                        className="h-screen w-full"
                        title="Contract Preview"
                    />
                )}
            </Modal>

            <Modal
                title="Xác nhận ký hợp đồng"
                open={!!selectedId}
                onOk={() => handleConfirm(selectedId)}
                onCancel={() => setSelectedId(null)}
                confirmLoading={confirming}
                okText="Xác nhận ký"
                cancelText="Hủy"
            >
                <p>Bạn có chắc chắn muốn ký hợp đồng này không?</p>
                <p className="text-sm text-gray-500">
                    Sau khi ký, bạn không thể thay đổi.
                </p>
            </Modal>
        </div>
    );
}
