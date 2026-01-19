import React, { useEffect, useState } from "react";
import { Card, Row, Col, Statistic } from "antd";
import { UserOutlined, FileTextOutlined, TeamOutlined } from "@ant-design/icons";
import Loading from "../../components/Loading";
import PageHeader from "../../components/PageHeader";
import { dashboardApi } from "../../api/dashboardApi";

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const res = await dashboardApi.getOverview();
            setStats(res.data);
        } catch (error) {
            console.error("Error loading stats:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loading />;

    return (
        <div>
            <PageHeader
                title="Dashboard Admin"
                subtitle="Tổng quan hệ thống"
            />

            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Mentors"
                            value={stats?.totalMentors}
                            prefix={<UserOutlined />}
                            styles={{ content: { color: '#3f8600' } }}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Thực tập sinh"
                            value={stats?.totalInterns}
                            prefix={<TeamOutlined />}
                            styles={{ content: { color: '#1677ff' } }}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Chương trình"
                            value={stats?.totalPrograms}
                            prefix={<FileTextOutlined />}
                            styles={{ content: { color: '#cf1322' } }}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Hồ sơ chờ duyệt"
                            value={stats?.pendingApplications}
                            prefix={<FileTextOutlined />}
                            styles={{ content: { color: '#faad14' } }}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} className="mt-4">
                <Col xs={24} lg={12}>
                    <Card title="Hoạt động gần đây" className="h-full">
                        <div className="space-y-3">
                            <div className="rounded-lg border border-slate-200 p-3">
                                <p className="text-sm text-slate-600">
                                    Người dùng <span className="font-semibold">admin@company.com</span> đã đăng nhập
                                </p>
                                <p className="text-xs text-slate-400 mt-1">2 giờ trước</p>
                            </div>
                            <div className="rounded-lg border border-slate-200 p-3">
                                <p className="text-sm text-slate-600">
                                    Tạo chương trình thực tập mới: <span className="font-semibold">Summer 2024</span>
                                </p>
                                <p className="text-xs text-slate-400 mt-1">5 giờ trước</p>
                            </div>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card title="Cảnh báo hệ thống" className="h-full">
                        <div className="space-y-3">
                            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                                <p className="text-sm text-yellow-800">
                                    ⚠️ Có 5 tài liệu chờ xác minh
                                </p>
                            </div>
                            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                                <p className="text-sm text-blue-800">
                                    ℹ️ Sao lưu dữ liệu lần cuối: 2 ngày trước
                                </p>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
