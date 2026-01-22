import React, { useMemo, useState, useEffect } from "react";
import { Card, Row, Col, Progress, Timeline, Alert } from "antd";
import {
    FileTextOutlined,
    CalendarOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    TrophyOutlined,
    RocketOutlined
} from "@ant-design/icons";
import { useAuth } from "../../auth/AuthContext";
import { Link } from "react-router-dom";
import { internApi } from "../../api/internApi";

export default function InternDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await internApi.getDashboard();
                setStats(res.data);
            } catch (error) {
                console.error("Failed to load dashboard", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    // Fallback/Default values if stats is null (e.g. first load or error)
    const displayStats = stats || {
        tasksCompleted: 0,
        tasksTotal: 1, // Avoid division by zero
        daysInternship: 0,
        totalDays: 90,
        nextMeeting: "Không có lịch họp",
        recentActivities: []
    };

    const taskProgress = Math.round((displayStats.tasksCompleted / (displayStats.tasksTotal || 1)) * 100);
    const internshipProgress = Math.round((displayStats.daysInternship / (displayStats.totalDays || 1)) * 100);

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white shadow-lg">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Xin chào, {displayStats.internName || user?.name || "Thực tập sinh"}! 👋</h1>
                        <p className="mt-2 text-blue-100 text-lg opacity-90">
                            "Thành công không phải là đích đến, mà là cả một hành trình."
                        </p>
                        <div className="mt-6 flex flex-wrap gap-4">
                            <div className="rounded-lg bg-white/20 px-4 py-2 backdrop-blur-sm">
                                <span className="block text-xs uppercase opacity-70">Vị trí</span>
                                <span className="font-semibold">{displayStats.position || "N/A"}</span>
                            </div>
                            <div className="rounded-lg bg-white/20 px-4 py-2 backdrop-blur-sm">
                                <span className="block text-xs uppercase opacity-70">Người hướng dẫn</span>
                                <span className="font-semibold">{displayStats.mentorName || "Chưa có"}</span>
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <RocketOutlined style={{ fontSize: '80px', opacity: 0.2 }} />
                    </div>
                </div>
            </div>

            <Row gutter={[16, 16]}>


                <Col xs={24} md={12} lg={8}>
                    <Card title="Công việc tuần này" className="h-full border-slate-200">
                        <div className="space-y-6 py-2">
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium">Hoàn thành Task</span>
                                    <span className="text-sm text-slate-500">{displayStats.tasksCompleted}/{displayStats.tasksTotal}</span>
                                </div>
                                <Progress percent={taskProgress} status="active" strokeColor="#52c41a" />
                            </div>
                            <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
                                <p className="text-xs text-slate-500 uppercase font-bold mb-1">Sự kiện tiếp theo</p>
                                <div className="flex items-center gap-2 text-blue-700 font-medium">
                                    <CalendarOutlined />
                                    {displayStats.nextMeeting}
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Card title="Phím tắt nhanh" className="h-full border-slate-200">
                        <div className="grid grid-cols-2 gap-3">
                            <Link to="/intern/tasks" className="flex flex-col items-center justify-center rounded-xl bg-blue-50 p-4 text-blue-700 hover:bg-blue-100 transition">
                                <CheckCircleOutlined className="text-2xl mb-2" />
                                <span className="text-sm font-semibold">Công việc</span>
                            </Link>
                            <Link to="/intern/reports/weekly/submit" className="flex flex-col items-center justify-center rounded-xl bg-purple-50 p-4 text-purple-700 hover:bg-purple-100 transition">
                                <FileTextOutlined className="text-2xl mb-2" />
                                <span className="text-sm font-semibold">Báo cáo tuần</span>
                            </Link>
                            <Link to="/interns/me/schedule" className="flex flex-col items-center justify-center rounded-xl bg-orange-50 p-4 text-orange-700 hover:bg-orange-100 transition">
                                <CalendarOutlined className="text-2xl mb-2" />
                                <span className="text-sm font-semibold">Lịch họp</span>
                            </Link>
                            <Link to="/intern/documents" className="flex flex-col items-center justify-center rounded-xl bg-emerald-50 p-4 text-emerald-700 hover:bg-emerald-100 transition">
                                <TrophyOutlined className="text-2xl mb-2" />
                                <span className="text-sm font-semibold">Tài liệu</span>
                            </Link>
                        </div>
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col xs={24} lg={16}>
                    <Card title="Hoạt động gần đây" className="border-slate-200">
                        <Timeline
                            items={displayStats.recentActivities && displayStats.recentActivities.length > 0 ? displayStats.recentActivities.map(act => ({
                                color: act.color || 'blue',
                                children: (
                                    <>
                                        <p className="font-semibold text-slate-800">{act.content}</p>
                                        <p className="text-xs text-slate-500">{act.timeAgo}</p>
                                    </>
                                )
                            })) : [
                                { color: 'gray', children: <p className="text-slate-500">Chưa có hoạt động nào gần đây</p> }
                            ]}
                        />
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Alert
                        message="Thông báo quan trọng"
                        description="Hạn nộp báo cáo thực tập cuối kỳ là ngày 25/05. Các bạn chú ý hoàn thiện hồ sơ đúng hạn."
                        type="warning"
                        showIcon
                        className="mb-4"
                    />
                    <Alert
                        message="Lịch nghỉ lễ"
                        description="Công ty nghỉ lễ 30/4 - 1/5 từ ngày 29/04 đến hết 02/05."
                        type="info"
                        showIcon
                    />
                </Col>
            </Row>
        </div>
    );
}
