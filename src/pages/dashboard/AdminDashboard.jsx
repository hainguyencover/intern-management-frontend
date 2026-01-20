import React, { useEffect, useState } from "react";
import { Card, Row, Col, Statistic } from "antd";
import { UserOutlined, FileTextOutlined, TeamOutlined, CheckCircleOutlined } from "@ant-design/icons";
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
        <div className="space-y-6">
            <PageHeader
                title="Bảng điều khiển Quản trị viên"
                subtitle="Tổng quan toàn bộ hệ thống"
            />

            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} className="shadow-sm">
                        <Statistic
                            title="Tổng số Người hướng dẫn"
                            value={stats?.totalMentors}
                            prefix={<UserOutlined />}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} className="shadow-sm">
                        <Statistic
                            title="Tổng số Thực tập sinh"
                            value={stats?.totalInterns}
                            prefix={<TeamOutlined />}
                            valueStyle={{ color: '#1677ff' }}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} className="shadow-sm">
                        <Statistic
                            title="Chương trình đang hoạt động"
                            value={stats?.activePrograms}
                            suffix={`/ ${stats?.totalPrograms}`}
                            prefix={<FileTextOutlined />}
                            valueStyle={{ color: '#cf1322' }}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} className="shadow-sm">
                        <Statistic
                            title="Tiến độ công việc toàn hệ thống"
                            value={stats?.completionRate ? Math.round(stats.completionRate) : 0}
                            suffix="%"
                            prefix={<CheckCircleOutlined />}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Combined Analytics Section */}
            <Row gutter={[16, 16]}>
                <Col xs={24} lg={16}>
                    <Card title="Quy trình Tuyển dụng (Tổng quan Nhân sự)" className="h-full shadow-sm hover:shadow-md transition-all">
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
                                <span className="mt-2 text-sm text-slate-600">Gửi lời mời</span>
                            </div>
                            <div className="h-0.5 flex-1 bg-slate-200 mx-4"></div>

                            <div className="flex flex-col items-center">
                                <div className="h-12 w-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-lg">
                                    {stats?.recruitmentStats?.onboarded || 0}
                                </div>
                                <span className="mt-2 text-sm text-slate-600">Đã tiếp nhận</span>
                            </div>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Card title="Thống kê Công việc" className="h-full shadow-sm hover:shadow-md transition-all">
                        <div className="flex flex-col justify-center h-full py-2">
                            <div className="mb-4">
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium text-slate-700">Đã hoàn thành</span>
                                    <span className="text-sm font-medium text-slate-700">{stats?.completedTasks || 0} / {stats?.totalTasks || 0}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                        className="bg-green-600 h-2.5 rounded-full"
                                        style={{ width: `${stats?.totalTasks ? (stats.completedTasks / stats.totalTasks * 100) : 0}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <div className="text-center p-3 bg-blue-50 rounded-lg">
                                    <div className="text-xl font-bold text-blue-600">{stats?.totalTasks || 0}</div>
                                    <div className="text-xs text-blue-500 uppercase font-semibold">Tổng công việc</div>
                                </div>
                                <div className="text-center p-3 bg-green-50 rounded-lg">
                                    <div className="text-xl font-bold text-green-600">{stats?.completedTasks || 0}</div>
                                    <div className="text-xs text-green-500 uppercase font-semibold">Đã hoàn thành</div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col xs={24} lg={8}>
                    <Card title="Trạng thái hệ thống" className="h-full shadow-sm">
                        <div className="flex flex-col items-center justify-center py-6">
                            <div className={`relative flex h-24 w-24 items-center justify-center rounded-full ${stats?.systemHealth === 'GOOD' ? 'bg-emerald-100' : 'bg-red-100'}`}>
                                <span className={`text-3xl font-bold ${stats?.systemHealth === 'GOOD' ? 'text-emerald-600' : 'text-red-600'}`}>
                                    {stats?.systemHealth === 'GOOD' ? '100%' : 'Cần kiểm tra'}
                                </span>
                            </div>
                            <p className="mt-4 text-lg font-semibold text-slate-700">
                                {stats?.systemHealth === 'GOOD' ? 'Hệ thống ổn định' : 'Vui lòng kiểm tra lại'}
                            </p>
                            <p className="text-sm text-slate-500">Cơ sở dữ liệu & Dịch vụ đang hoạt động</p>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Card title="Dung lượng lưu trữ" className="h-full">
                        <div className="space-y-6 py-2">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-600">Cơ sở dữ liệu & Sao lưu</span>
                                    <span className="font-semibold text-slate-900">{stats?.storageUsage || "0 MB"}</span>
                                </div>
                                <div className="h-2 w-full rounded-full bg-slate-100">
                                    <div className="h-full w-[40%] rounded-full bg-blue-500"></div>
                                </div>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-lg text-center text-xs text-slate-400">
                                Chi tiết dung lượng tệp tin đính kèm chưa khả dụng
                            </div>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Card title="Cảnh báo hệ thống" className="h-full shadow-sm">
                        <div className="space-y-3 max-h-[200px] overflow-y-auto">
                            {stats?.systemAlerts && stats.systemAlerts.length > 0 ? (
                                stats.systemAlerts.map((alert, index) => (
                                    <div key={index} className={`rounded-lg border p-3 ${alert.type === 'warning' ? 'border-yellow-200 bg-yellow-50 text-yellow-800' :
                                        alert.type === 'error' ? 'border-red-200 bg-red-50 text-red-800' :
                                            'border-blue-200 bg-blue-50 text-blue-800'
                                        }`}>
                                        <div className="flex items-start gap-2">
                                            {alert.type === 'warning' && <span className="text-lg">⚠️</span>}
                                            {alert.type === 'info' && <span className="text-lg">ℹ️</span>}
                                            <p className="text-sm font-medium">{alert.message}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="rounded-lg border border-green-200 bg-green-50 p-3 flex items-center gap-2">
                                    <span className="text-lg">✅</span>
                                    <p className="text-sm text-green-800 font-medium">Không có cảnh báo nào</p>
                                </div>
                            )}
                        </div>
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Card title="Hoạt động gần đây" className="h-full shadow-sm">
                        <div className="max-h-[200px] overflow-y-auto">
                            {stats?.recentActivities && stats.recentActivities.length > 0 ? (
                                <ul className="space-y-4">
                                    {stats.recentActivities.map((act, idx) => (
                                        <li key={idx} className="flex gap-3">
                                            <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${act.color === 'blue' ? 'bg-blue-500' : 'bg-slate-300'
                                                }`} />
                                            <div>
                                                <p className="text-sm font-medium text-slate-900">{act.content}</p>
                                                <p className="text-xs text-slate-500">{act.timeAgo}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-slate-500 text-center py-4">Chưa có hoạt động nào</p>
                            )}
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
