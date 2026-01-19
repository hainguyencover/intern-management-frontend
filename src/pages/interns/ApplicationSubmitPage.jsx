import React, { useState } from "react";
import { Form, Input, Button, Card, Alert, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { documentApi as applicationApi } from "../../api/applicationApi.js";

export default function ApplicationSubmitPage() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            await applicationApi.submit(values);
            toast.success("Nộp hồ sơ thành công!");
            navigate("/intern/applications");
        } catch (error) {
            toast.error(error.response?.data?.message || "Nộp hồ sơ thất bại");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-3xl">
            <Card title="Nộp hồ sơ ứng tuyển">
                <Alert
                    title="Lưu ý"
                    description="Hãy đảm bảo bạn đã upload đầy đủ CV và các tài liệu cần thiết trước khi nộp hồ sơ."
                    type="info"
                    showIcon
                    className="mb-6"
                />

                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item
                        label="Vị trí ứng tuyển"
                        name="position"
                        rules={[{ required: true, message: "Vui lòng nhập vị trí" }]}
                    >
                        <Input placeholder="Frontend Developer Intern" />
                    </Form.Item>

                    <Form.Item label="Ghi chú" name="note">
                        <Input.TextArea rows={4} placeholder="Thêm ghi chú (nếu có)" />
                    </Form.Item>

                    <Space>
                        <Button type="primary" htmlType="submit" loading={loading} size="large">
                            Nộp hồ sơ
                        </Button>
                        <Button onClick={() => navigate("/intern/documents")}>
                            Quản lý tài liệu
                        </Button>
                    </Space>
                </Form>
            </Card>
        </div>
    );
}
