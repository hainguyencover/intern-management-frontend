import React, { useState } from "react";
import { Button, Card, Col, Row, Table, Input, Form } from "antd";
import { QrcodeOutlined, UploadOutlined, SyncOutlined } from "@ant-design/icons";
import axiosClient from "../../api/axiosClient";
import { toast } from "sonner";

export default function TimekeepingIntegration() {
    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState([]);

    // Mock initial data
    const handleSimulateFile = () => {
        const now = new Date();
        const fourHoursAgo = new Date(now.getTime() - 4 * 60 * 60 * 1000);

        const mockData = [
            { employeeCode: "NV001", timestamp: fourHoursAgo.toISOString(), deviceId: "GATE_01" },
            { employeeCode: "NV002", timestamp: new Date(fourHoursAgo.getTime() + 10 * 60000).toISOString(), deviceId: "GATE_01" },
            { employeeCode: "NV001", timestamp: now.toISOString(), deviceId: "GATE_01" }, // Checkout
        ];
        setLogs(mockData);
        toast.info("Đã tải dữ liệu mẫu. Nhấn Đồng bộ để gửi lên server.");
    };

    const handleSync = async () => {
        if (logs.length === 0) {
            toast.warning("Chưa có dữ liệu để đồng bộ");
            return;
        }
        try {
            setLoading(true);
            const res = await axiosClient.post("/api/admin/attendance/sync/qr", logs);
            toast.success("Đồng bộ thành công: " + res.data);
            setLogs([]);
        } catch (error) {
            toast.error("Lỗi đồng bộ: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { title: "Mã Nhân Viên (Email)", dataIndex: "employeeCode", key: "employeeCode" },
        { title: "Thời gian", dataIndex: "timestamp", key: "timestamp", render: (t) => new Date(t).toLocaleString("vi-VN") },
        { title: "Thiết bị", dataIndex: "deviceId", key: "deviceId" },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <QrcodeOutlined className="text-purple-600" />
                    Tích hợp Chấm công QR/Thẻ
                </h1>
                <p className="text-slate-600">
                    Đồng bộ dữ liệu chấm công từ máy chấm công hoặc file log
                </p>
            </div>

            <Card title="Upload Log Chấm Công" extra={<Button onClick={handleSimulateFile}>Tải dữ liệu mẫu</Button>}>
                <div className="flex flex-col gap-4">
                    <div className="p-8 border-2 border-dashed border-slate-300 rounded-lg text-center bg-slate-50">
                        <UploadOutlined className="text-3xl text-slate-400 mb-2" />
                        <p className="text-slate-500">Kéo thả file log (.csv, .xlsx) hoặc click để upload</p>
                        <p className="text-xs text-slate-400 mt-1">(Chức năng upload đang phát triển, vui lòng dùng nút Tải dữ liệu mẫu)</p>
                    </div>

                    {logs.length > 0 && (
                        <>
                            <div className="flex justify-between items-center">
                                <h3 className="font-medium">Dữ liệu chờ đồng bộ ({logs.length} bản ghi)</h3>
                                <Button
                                    type="primary"
                                    icon={<SyncOutlined spin={loading} />}
                                    onClick={handleSync}
                                    loading={loading}
                                >
                                    Đồng bộ ngay
                                </Button>
                            </div>
                            <Table
                                dataSource={logs}
                                columns={columns}
                                rowKey={(r, i) => i}
                                pagination={{ pageSize: 5 }}
                                size="small"
                            />
                        </>
                    )}
                </div>
            </Card>

            <Card title="Cấu hình kết nối Máy chấm công">
                <Form layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="IP Máy chấm công">
                                <Input placeholder="192.168.1.201" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Port">
                                <Input placeholder="4370" />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="Secret Key">
                                <Input.Password placeholder="********" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Button disabled>Lưu cấu hình (Coming soon)</Button>
                </Form>
            </Card>
        </div>
    );
}
