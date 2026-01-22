import React, { useEffect, useState } from "react";
import { Card, Row, Col, Statistic } from "antd";
import Loading from "../../components/Loading";
import PageHeader from "../../components/PageHeader";
import { hrApi } from "../../api/hrApi.js";

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
                            styles={{ content: { color: '#1677ff' } }}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Hồ sơ chờ duyệt"
                            value={stats?.pendingApplications}
                            styles={{ content: { color: '#faad14' } }}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Chương trình đang chạy"
                            value={stats?.activePrograms}
                            styles={{ content: { color: '#3f8600' } }}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Tài liệu cần xét duyệt"
                            value={stats?.documentsToReview}
                            styles={{ content: { color: '#cf1322' } }}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} className="mt-4">
                <Col xs={24} lg={16}>
                    <Card title="Quy trình tuyển dụng" className="h-full">
                        <div className="flex items-center justify-between px-4 py-8">
                            <div className="flex flex-col items-center">
                                <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                                    {stats?.recruitmentStats?.applied || 0}
                                </div>
                                <span className="mt-2 text-sm text-slate-600">Ứng tuyển</span>
                            </div>
                            <div className="h-0.5 flex-1 bg-slate-200 mx-4"></div>

                            <div className="flex flex-col items-center">
                                <div className="h-12 w-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-lg">
                                    {stats?.recruitmentStats?.interviewing || 0}
                                </div>
                                <span className="mt-2 text-sm text-slate-600">Phỏng vấn</span>
                            </div>
                            <div className="h-0.5 flex-1 bg-slate-200 mx-4"></div>

                            <div className="flex flex-col items-center">
                                <div className="h-12 w-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-lg">
                                    {stats?.recruitmentStats?.offerSent || 0}
                                </div>
                                <span className="mt-2 text-sm text-slate-600">Gửi Offer</span>
                            </div>
                            <div className="h-0.5 flex-1 bg-slate-200 mx-4"></div>

                            <div className="flex flex-col items-center">
                                <div className="h-12 w-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-lg">
                                    {stats?.recruitmentStats?.onboarded || 0}
                                </div>
                                <span className="mt-2 text-sm text-slate-600">Tiếp nhận</span>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card title="Sinh nhật sắp tới" className="h-full">
                        <div className="space-y-4">
                            {stats?.upcomingBirthdays && stats.upcomingBirthdays.length > 0 ? (
                                stats.upcomingBirthdays.map((birthday, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-xs font-bold">
                                            {birthday.date}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">{birthday.name}</p>
                                            <p className="text-xs text-slate-500">{birthday.position}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-slate-500">Không có sinh nhật nào trong tháng này.</p>
                            )}
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
