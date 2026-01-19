import React, { useEffect, useState } from "react";
import { Card, Row, Col, Statistic } from "antd";
import Loading from "../../components/Loading";
import PageHeader from "../../components/PageHeader";
import {hrApi} from "../../api/hrApi.js";

export default function HrDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            const response = await hrApi.dashboard();
            setStats(response.data);
        } catch (error) {
            console.error("Error loading dashboard:", error);
            // Mock data for demo
            setStats({
                totalInterns: 80,
                pendingApplications: 15,
                activePrograms: 8,
                documentsToReview: 12,
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loading />;

    return (
        <div>
            <PageHeader
                title="Dashboard HR"
                subtitle="Quản lý tuyển dụng và thực tập sinh"
            />

            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Tổng thực tập sinh"
                            value={stats?.totalInterns}
                            valueStyle={{ color: '#1677ff' }}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Hồ sơ chờ duyệt"
                            value={stats?.pendingApplications}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Chương trình đang chạy"
                            value={stats?.activePrograms}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Tài liệu cần xét duyệt"
                            value={stats?.documentsToReview}
                            valueStyle={{ color: '#cf1322' }}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
