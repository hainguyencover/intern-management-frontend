import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { internApi } from "../../api/internApi";
import { toast } from "sonner";

export default function EditIntern() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [form, setForm] = useState({
        email: "",
        fullName: "",
        phone: "",
        university: "",
        major: "",
        gpa: "",
        dob: "",
        address: "",
        studentCode: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setFetching(true);
                const res = await internApi.getById(id);
                const data = res.data;
                setForm({
                    email: data.email || "",
                    fullName: data.fullName || "",
                    phone: data.phone || "",
                    university: data.university || "",
                    major: data.major || "",
                    gpa: data.gpa || "",
                    dob: data.dob || "",
                    address: data.address || "",
                    studentCode: data.studentCode || "",
                });
            } catch (err) {
                toast.error("Không thể tải thông tin thực tập sinh");
                navigate("/hr/interns");
            } finally {
                setFetching(false);
            }
        };
        fetchData();
    }, [id, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await internApi.update(id, form);
            toast.success("Cập nhật thành công");
            navigate(`/hr/interns/${id}`);
        } catch (err) {
            toast.error(err.response?.data?.message || "Cập nhật thất bại");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="text-sm text-slate-600">Đang tải...</div>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-3xl">
            <div className="mb-4">
                <button
                    onClick={() => navigate(-1)}
                    className="text-sm font-semibold text-slate-600 hover:text-slate-900"
                >
                    ← Quay lại
                </button>
                <h1 className="mt-2 text-2xl font-bold">Chỉnh sửa thực tập sinh #{id}</h1>
            </div>

            <form onSubmit={handleSubmit} className="rounded-2xl border bg-white p-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label className="text-sm font-medium text-slate-700">Email *</label>
                        <input
                            required
                            type="email"
                            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-700">Họ tên *</label>
                        <input
                            required
                            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                            value={form.fullName}
                            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-700">Mã sinh viên</label>
                        <input
                            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                            value={form.studentCode}
                            onChange={(e) => setForm({ ...form, studentCode: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-700">Điện thoại</label>
                        <input
                            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-700">Trường *</label>
                        <input
                            required
                            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                            value={form.university}
                            onChange={(e) => setForm({ ...form, university: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-700">Ngành *</label>
                        <input
                            required
                            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                            value={form.major}
                            onChange={(e) => setForm({ ...form, major: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-700">GPA</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="4"
                            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                            value={form.gpa}
                            onChange={(e) => setForm({ ...form, gpa: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-700">Ngày sinh</label>
                        <input
                            type="date"
                            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                            value={form.dob}
                            onChange={(e) => setForm({ ...form, dob: e.target.value })}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="text-sm font-medium text-slate-700">Địa chỉ</label>
                        <textarea
                            rows={3}
                            className="mt-1 w-full resize-none rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                            value={form.address}
                            onChange={(e) => setForm({ ...form, address: e.target.value })}
                        />
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-slate-50"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                    >
                        {loading ? "Đang lưu..." : "Cập nhật"}
                    </button>
                </div>
            </form>
        </div>
    );
}
