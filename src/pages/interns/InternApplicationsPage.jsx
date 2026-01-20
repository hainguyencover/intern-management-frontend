import React, { useEffect, useState } from "react";
import { Card, Steps, Button, Result, Typography, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import {
    UserOutlined,
    FileTextOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    RocketOutlined
} from "@ant-design/icons";
import { toast } from "sonner";
import { documentApi as applicationApi } from "../../api/applicationApi.js";
import { useAuth } from "../../auth/AuthContext";

const { Title, Paragraph, Text } = Typography;

export default function InternApplicationsPage() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = async () => {
        setLoading(true);
        try {
            const res = await applicationApi.getMyApplications();
            setApplications(res.data);
        } catch (error) {
            toast.error("Không thể tải thông tin hồ sơ");
        } finally {
            setLoading(false);
        }
    };

    // Determine current step based on application status
    const getStepInfo = () => {
        // Backend Enums: DRAFT, SUBMITTED, APPROVED, REJECTED, CONTRACT_SENT, CONTRACT_SIGNED

        const approvedApp = applications.find(app => ['APPROVED', 'CONTRACT_SENT', 'CONTRACT_SIGNED'].includes(app.status));
        const pendingApp = applications.find(app => ['SUBMITTED', 'PENDING'].includes(app.status)); // Keep PENDING just in case legacy
        const rejectedApp = applications.find(app => app.status === 'REJECTED');

        if (approvedApp) return { step: 3, status: 'finish', app: approvedApp };
        if (pendingApp) return { step: 2, status: 'process', app: pendingApp };
        if (rejectedApp) return { step: 1, status: 'error', app: rejectedApp };

        return { step: 1, status: 'wait' }; // Not submitted yet
    };

    const { step, status, app } = getStepInfo();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl w-full space-y-8">
                {/* Hero Section */}
                <div className="text-center">
                    <Title level={2} style={{ marginBottom: 8 }}>
                        Chào mừng, {user?.fullName}!
                    </Title>
                    <Paragraph type="secondary" style={{ fontSize: '1.1em' }}>
                        Hoàn tất các bước dưới đây để chính thức tham gia chương trình thực tập.
                    </Paragraph>
                </div>

                {/* Progress Steps */}
                {/* Progress Steps */}
                <Card className="shadow-sm">
                    <Steps current={step} items={[
                        {
                            title: 'Tạo tài khoản',
                            subTitle: 'Đã hoàn thành',
                            icon: <UserOutlined />,
                        },
                        {
                            title: 'Nộp hồ sơ',
                            subTitle: 'Điền thông tin ứng tuyển',
                            icon: <FileTextOutlined />,
                        },
                        {
                            title: 'Chờ xét duyệt',
                            subTitle: 'HR xem xét hồ sơ',
                            icon: <ClockCircleOutlined />,
                        },
                        {
                            title: 'Bắt đầu',
                            subTitle: 'Chính thức thực tập',
                            icon: <RocketOutlined />,
                        },
                    ]} />
                </Card>

                {/* Main Content Area based on Status */}
                <div className="transition-all duration-300">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Spin size="large" />
                            <div className="mt-4 text-gray-500">Đang tải dữ liệu...</div>
                        </div>
                    ) : (
                        <>
                            {/* Case 1: Chưa nộp hồ sơ */}
                            {step === 1 && status !== 'error' && (
                                <Card className="text-center py-10 shadow-md border-t-4 border-blue-500">
                                    <Result
                                        icon={<FileTextOutlined style={{ color: '#3b82f6' }} />}
                                        title="Bạn chưa có hồ sơ ứng tuyển nào"
                                        subTitle="Hãy gửi hồ sơ ngay để chúng tôi có thể hiểu rõ hơn về năng lực và nguyện vọng của bạn."
                                        extra={
                                            <Button type="primary" size="large" onClick={() => navigate("/intern/apply")}>
                                                Nộp hồ sơ ngay
                                            </Button>
                                        }
                                    />
                                </Card>
                            )}

                            {/* Case 2: Đang chờ duyệt */}
                            {step === 2 && (
                                <Card className="text-center py-10 shadow-md border-t-4 border-yellow-500">
                                    <Result
                                        icon={<ClockCircleOutlined style={{ color: '#eab308' }} />}
                                        title="Hồ sơ đang chờ phê duyệt"
                                        subTitle={
                                            <div className="space-y-2">
                                                <Text>Hồ sơ ứng tuyển vị trí <strong>{app?.position}</strong> của bạn đã được gửi thành công.</Text>
                                                <br />
                                                <Text type="secondary">Chúng tôi sẽ xem xét và phản hồi trong thời gian sớm nhất. Vui lòng kiểm tra email hoặc quay lại trang này thường xuyên.</Text>
                                            </div>
                                        }
                                        extra={[
                                            <Button key="docs" onClick={() => navigate("/intern/documents")}>
                                                Quản lý tài liệu
                                            </Button>
                                        ]}
                                    />
                                </Card>
                            )}

                            {/* Case 3: Đã được duyệt (Lý thuyết sẽ redirect vào dashboard, nhưng hiển thị fallback) */}
                            {step === 3 && (
                                <Card className="text-center py-10 shadow-md border-t-4 border-green-500">
                                    <Result
                                        status="success"
                                        title="Chúc mừng! Hồ sơ của bạn đã được duyệt"
                                        subTitle="Bạn đã chính thức trở thành thực tập sinh. Hãy truy cập Dashboard để bắt đầu công việc."
                                        extra={
                                            <Button type="primary" size="large" onClick={() => window.location.href = "/dashboard/intern"}>
                                                Vào Dashboard
                                            </Button>
                                        }
                                    />
                                </Card>
                            )}

                            {/* Case 4: Bị từ chối */}
                            {status === 'error' && (
                                <Card className="text-center py-10 shadow-md border-t-4 border-red-500">
                                    <Result
                                        status="warning"
                                        title="Hồ sơ cần bổ sung hoặc bị từ chối"
                                        subTitle="Rất tiếc, hồ sơ của bạn chưa đạt yêu cầu hoặc cần bổ sung thông tin. Vui lòng kiểm tra ghi chú của HR và thử lại."
                                        extra={[
                                            <Button key="retry" type="primary" onClick={() => navigate("/intern/apply")}>
                                                Nộp lại hồ sơ
                                            </Button>,
                                            <Button key="docs" onClick={() => navigate("/intern/documents")}>
                                                Kiểm tra tài liệu
                                            </Button>
                                        ]}
                                    />
                                </Card>
                            )}
                        </>
                    )}
                </div>

                <div className="text-center text-gray-400 text-sm mt-8">
                    &copy; 2024 CodeGym Internship Management System
                </div>
            </div>
        </div>
    );
}
