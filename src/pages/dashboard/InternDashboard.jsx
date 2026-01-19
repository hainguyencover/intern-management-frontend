import React from "react";
import { Card, Row, Col, Statistic } from "antd";
import { FileTextOutlined, CalendarOutlined, CheckCircleOutlined } from "@ant-design/icons";

export default function InternDashboard() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Dashboard - Thực tập sinh</h1>

            <Row gutter={16}>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Tài liệu đã upload"
                            value={5}
                            prefix={<FileTextOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Hồ sơ đã nộp"
                            value={1}
                            prefix={<CheckCircleOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Lịch tuần này"
                            value={3}
                            prefix={<CalendarOutlined />}
                            suffix="sự kiện"
                        />
                    </Card>
                </Col>
            </Row>

            <Card title="Thông báo mới">
                <p>Chưa có thông báo mới</p>
            </Card>
        </div>
    );
}
