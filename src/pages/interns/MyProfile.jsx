import React, { useEffect, useState } from "react";
import { Form, Input, DatePicker, Button, Card, Spin } from "antd";
import { internApi } from "../../api/internApi";
import { useAuth } from "../../auth/AuthContext";
import dayjs from "dayjs";
import { toast } from "sonner";

export default function MyProfile() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const { user } = useAuth();
    const isIntern = user?.roles?.includes("INTERN");

    useEffect(() => {
        if (isIntern) {
            loadProfile();
        } else {
            setFetching(false);
        }
    }, [isIntern]);

    const loadProfile = async () => {
        try {
            setFetching(true);
            const res = await internApi.getMyProfile();
            const data = res.data;
            form.setFieldsValue({
                ...data,
                dob: data.dob ? dayjs(data.dob) : null,
                startDate: data.startDate ? dayjs(data.startDate) : null,
                endDate: data.endDate ? dayjs(data.endDate) : null,
            });
        } catch (error) {
            toast.error("Không thể tải thông tin");
        } finally {
            setFetching(false);
        }
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        const payload = {
            ...values,
            dob: values.dob ? values.dob.format("YYYY-MM-DD") : null,
            startDate: values.startDate ? values.startDate.format("YYYY-MM-DD") : null,
            endDate: values.endDate ? values.endDate.format("YYYY-MM-DD") : null,
        };

        try {
            await internApi.updateMyProfile(payload);
            toast.success("Cập nhật thành công!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Cập nhật thất bại");
        } finally {
            setLoading(false);
        }
    };

    if (!isIntern) {
        return (
            <div className="mx-auto max-w-4xl pt-10 text-center">
                <h2 className="text-xl font-semibold text-slate-700">
                    Profile page is only available for Interns
                </h2>
                <p className="text-slate-500">
                    You are logged in as {user?.roles?.join(", ")}
                </p>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl">
            <Spin spinning={fetching}>
                <Card title="Hồ sơ cá nhân">
                    <Form form={form} layout="vertical" onFinish={handleSubmit}>
                        <Form.Item label="Mã sinh viên" name="studentCode">
                            <Input placeholder="SV001" />
                        </Form.Item>

                        <Form.Item label="Trường" name="university" rules={[{ required: true }]}>
                            <Input placeholder="Đại học ABC" />
                        </Form.Item>

                        <Form.Item label="Chuyên ngành" name="major" rules={[{ required: true }]}>
                            <Input placeholder="Công nghệ thông tin" />
                        </Form.Item>

                        <Form.Item label="Điện thoại" name="phone">
                            <Input placeholder="0901234567" />
                        </Form.Item>

                        <Form.Item label="Địa chỉ" name="address">
                            <Input.TextArea rows={2} />
                        </Form.Item>

                        <Form.Item label="GPA" name="gpa">
                            <Input type="number" step="0.01" min="0" max="4" />
                        </Form.Item>

                        <Form.Item label="Ngày sinh" name="dob">
                            <DatePicker format="DD/MM/YYYY" className="w-full" />
                        </Form.Item>

                        <Button type="primary" htmlType="submit" loading={loading} size="large">
                            Cập nhật
                        </Button>
                    </Form>
                </Card>
            </Spin>
        </div>
    );
}
