import React, { useEffect, useState } from "react";
import { Card, Table, Empty } from "antd";
import StatusBadge from "../../components/StatusBadge";
import { toast } from "sonner";
import {documentApi as applicationApi} from "../../api/applicationApi.js";

export default function InternApplicationsPage() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = async () => {
        setLoading(true);
        try {
            const res = await applicationApi.getMyApplications();
            setApplications(res.data);
        } catch (error) {
            toast.error("Không thể tải danh sách hồ sơ");
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: "Vị trí",
            dataIndex: "position",
            key: "position",
        },
        {
            title: "Ngày nộp",
            dataIndex: "appliedAt",
            key: "appliedAt",
            render: (date) => (date ? new Date(date).toLocaleString() : "-"),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status) => <StatusBadge status={status} />,
        },
        {
            title: "Ghi chú",
            dataIndex: "note",
            key: "note",
            render: (note) => note || "-",
        },
    ];

    return (
        <div className="mx-auto max-w-6xl">
            <Card title="Hồ sơ ứng tuyển của tôi">
                {applications.length === 0 && !loading ? (
                    <Empty description="Chưa có hồ sơ nào" />
                ) : (
                    <Table
                        dataSource={applications}
                        columns={columns}
                        rowKey="id"
                        loading={loading}
                    />
                )}
            </Card>
        </div>
    );
}
