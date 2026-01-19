import React, { useState } from "react";
import { Button, Card, Descriptions, Result, Spin, Tag } from "antd";
import { useAuth } from "../../auth/AuthContext";
import axiosClient from "../../api/axiosClient";
import { toast } from "sonner";
import { SyncOutlined, CheckCircleOutlined, CloudServerOutlined } from "@ant-design/icons";

export default function HrmIntegration() {
    const { user } = useAuth();
    const [syncing, setSyncing] = useState(false);
    const [lastSyncResult, setLastSyncResult] = useState(null);

    const handleSync = async () => {
        try {
            setSyncing(true);
            const res = await axiosClient.post("/api/admin/hrm/sync");
            setLastSyncResult({
                status: "success",
                message: res.data || "Đồng bộ thành công",
                time: new Date().toLocaleString()
            });
            toast.success("Đồng bộ HRM thành công");
        } catch (error) {
            setLastSyncResult({
                status: "error",
                message: "Đồng bộ thất bại: " + (error.response?.data?.message || error.message),
                time: new Date().toLocaleString()
            });
            toast.error("Đồng bộ thất bại");
        } finally {
            setSyncing(false);
        }
    };

    if (!user?.roles?.includes("ADMIN")) {
        return <div className="p-8 text-center text-red-500">Bạn không có quyền truy cập trang này.</div>;
    }

    return (
        <div className="mx-auto w-full max-w-5xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <CloudServerOutlined className="text-blue-600" />
                    Tích hợp HRM
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                    Đồng bộ dữ liệu nhân sự (Mentor, HR) từ hệ thống HRM
                </p>
            </div>

            <Card className="shadow-sm rounded-xl">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-800">Trạng thái kết nối</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                            </span>
                            <span className="text-sm font-medium text-emerald-600">Đã kết nối (Mock HRM)</span>
                        </div>
                    </div>
                    <Button
                        type="primary"
                        size="large"
                        icon={<SyncOutlined spin={syncing} />}
                        onClick={handleSync}
                        loading={syncing}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        {syncing ? "Đang đồng bộ..." : "Đồng bộ ngay"}
                    </Button>
                </div>

                <Descriptions bordered column={1}>
                    <Descriptions.Item label="HRM API URL">https://api.hrm-system.internal/v1/employees</Descriptions.Item>
                    <Descriptions.Item label="API Key">************************</Descriptions.Item>
                    <Descriptions.Item label="Lần đồng bộ cuối">
                        {lastSyncResult ? lastSyncResult.time : "Chưa có dữ liệu"}
                    </Descriptions.Item>
                </Descriptions>

                {lastSyncResult && (
                    <div className="mt-6 p-4 rounded-lg bg-slate-50 border border-slate-200">
                        <Result
                            status={lastSyncResult.status}
                            title={lastSyncResult.status === 'success' ? "Hoàn tất" : "Lỗi"}
                            subTitle={lastSyncResult.message}
                            icon={lastSyncResult.status === 'success' ? <CheckCircleOutlined className="text-emerald-500" /> : null}
                            extra={[
                                <Tag color={lastSyncResult.status === 'success' ? "success" : "error"}>
                                    {lastSyncResult.time}
                                </Tag>
                            ]}
                        />
                    </div>
                )}
            </Card>
        </div>
    );
}
