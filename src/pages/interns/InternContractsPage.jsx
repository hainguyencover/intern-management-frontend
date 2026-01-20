import React, { useEffect, useState } from "react";
import { Button, Card, Spin, Table, Tag, Modal } from "antd";
import { contractApi } from "../../api/contractApi";
import { toast } from "sonner";
import { useAuth } from "../../auth/AuthContext";
import { ExclamationCircleOutlined } from "@ant-design/icons";

export default function InternContractsPage() {
    const { user, setUser } = useAuth();
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [confirming, setConfirming] = useState(null);

    const fetchContracts = async () => {
        setLoading(true);
        try {
            const res = await contractApi.myDocuments();
            // Filter contracts only
            const list = res.data.filter(
                (d) => d.type === "INTERNSHIP_CONTRACT" || d.type === "CONTRACT"
            );
            setContracts(list);
        } catch (error) {
            console.error(error);
            toast.error("Không thể tải danh sách hợp đồng");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContracts();
    }, []);

    const handleView = async (docId) => {
        try {
            // Fetch as blob with auth header
            const response = await contractApi.download(docId);

            // Create object URL
            const blob = new Blob([response.data], { type: response.headers['content-type'] || 'application/pdf' });
            const url = window.URL.createObjectURL(blob);

            // Open in new tab
            window.open(url, "_blank");

            // Clean up URL after a delay (optional but good practice, though window.open needs it valid)
            setTimeout(() => window.URL.revokeObjectURL(url), 10000);
        } catch (error) {
            console.error(error);
            toast.error("Không thể xem file. Vui lòng thử lại.");
        }
    };

    const handleConfirm = (doc) => {
        Modal.confirm({
            title: "Xác nhận ký hợp đồng?",
            icon: <ExclamationCircleOutlined />,
            content: "Bạn có chắc chắn muốn xác nhận đã ký hợp đồng này? Hành động này không thể hoàn tác.",
            onOk: async () => {
                try {
                    setConfirming(doc.id);
                    await contractApi.confirmContract(doc.id);
                    toast.success("Đã xác nhận ký hợp đồng thành công!");
                    fetchContracts();
                    // Optional: refresh user context if status changed
                    // setUser({...user, applicationStatus: 'CONTRACT_SIGNED'});
                } catch (err) {
                    console.error(err);
                    toast.error("Xác nhận thất bại");
                } finally {
                    setConfirming(null);
                }
            },
        });
    };

    const columns = [
        {
            title: "Tên file",
            key: "filename",
            render: (_, r) => {
                const parts = r.fileUrl.split("/");
                return parts[parts.length - 1];
            },
        },
        {
            title: "Ngày tải lên",
            dataIndex: "uploadedAt",
            key: "uploadedAt",
            render: (val) => new Date(val).toLocaleString("vi-VN"),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (st) => {
                let color = "default";
                if (st === "APPROVED" || st === "APPROVE") color = "blue";
                if (st === "SIGNED") color = "green";
                if (st === "REJECTED") color = "red";
                if (st === "PENDING") color = "orange";
                return <Tag color={color}>{st}</Tag>;
            },
        },
        {
            title: "Hành động",
            key: "actions",
            render: (_, r) => (
                <div className="flex gap-2">
                    <Button type="default" size="small" onClick={() => handleView(r.id)}>
                        Xem
                    </Button>
                    {(r.status === "APPROVED" || r.status === "APPROVE") && (
                        <Button
                            type="primary"
                            size="small"
                            loading={confirming === r.id}
                            onClick={() => handleConfirm(r)}
                        >
                            Xác nhận đã ký
                        </Button>
                    )}
                    {r.status === "SIGNED" && (
                        <span className="text-green-600 text-sm font-semibold">Đã hoàn tất</span>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Hợp đồng thực tập của tôi</h1>
            <Card>
                {loading ? (
                    <div className="flex flex-col justify-center items-center p-8 gap-3">
                        <Spin size="large" />
                        <div className="text-slate-500">Đang tải...</div>
                    </div>
                ) : (
                    <Table
                        dataSource={contracts}
                        columns={columns}
                        rowKey="id"
                        pagination={false}
                        locale={{ emptyText: "Chưa có hợp đồng nào" }}
                    />
                )}
            </Card>
        </div>
    );
}
