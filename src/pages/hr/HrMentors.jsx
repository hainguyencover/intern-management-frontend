import React, { useEffect, useMemo, useState } from "react";
import { mentorApi } from "../../api/mentorApi";

const Input = ({ label, ...props }) => (
    <label className="grid gap-1">
        <span className="text-sm font-semibold text-slate-700">{label}</span>
        <input
            {...props}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
        />
    </label>
);

export default function HrMentors() {
    const [form, setForm] = useState({
        email: "",
        password: "",
        fullName: "",
        phone: "",
        title: "",
        // departmentId: "", // nếu sau này bạn muốn bật lại
    });

    const [submitting, setSubmitting] = useState(false);
    const [notice, setNotice] = useState({ type: "", message: "" });

    // optional list
    const [mentors, setMentors] = useState([]);
    const [loadingList, setLoadingList] = useState(false);

    const canSubmit = useMemo(() => {
        return (
            form.email.trim() &&
            form.password.trim() &&
            form.fullName.trim()
        );
    }, [form]);

    const fetchMentors = async () => {
        setLoadingList(true);
        try {
            const res = await mentorApi.list?.({ page: 0, size: 20 });
            const data = res?.data;
            // support both array and page
            const items = Array.isArray(data) ? data : data?.content || [];
            setMentors(items);
        } catch {
            // ignore if BE chưa có endpoint list
        } finally {
            setLoadingList(false);
        }
    };

    useEffect(() => {
        fetchMentors();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onChange = (key) => (e) => {
        setNotice({ type: "", message: "" });
        setForm((p) => ({ ...p, [key]: e.target.value }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!canSubmit) {
            setNotice({ type: "error", message: "Vui lòng nhập email, password, fullName." });
            return;
        }

        setSubmitting(true);
        setNotice({ type: "", message: "" });

        try {
            const payload = {
                email: form.email.trim(),
                password: form.password,
                fullName: form.fullName.trim(),
                phone: form.phone?.trim() || null,
                title: form.title?.trim() || null,
                // departmentId: form.departmentId ? Number(form.departmentId) : null,
            };

            const res = await mentorApi.create(payload);

            setNotice({
                type: "success",
                message: `Tạo mentor thành công: ${res.data?.email || payload.email}`,
            });

            setForm({
                email: "",
                password: "",
                fullName: "",
                phone: "",
                title: "",
            });

            await fetchMentors();
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                err?.message ||
                "Tạo mentor thất bại";
            setNotice({ type: "error", message: msg });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="grid gap-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4">
                    <div className="text-lg font-extrabold text-slate-900">Thêm mới Mentor</div>
                    <div className="text-sm text-slate-500">HR tạo tài khoản mentor để phân công cho thực tập sinh.</div>
                </div>

                {notice.message && (
                    <div
                        className={[
                            "mb-4 rounded-xl px-3 py-2 text-sm",
                            notice.type === "success"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-rose-50 text-rose-700 border border-rose-200",
                        ].join(" ")}
                    >
                        {notice.message}
                    </div>
                )}

                <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Input label="Email" value={form.email} onChange={onChange("email")} placeholder="mentor@company.com" />
                    <Input label="Mật khẩu" type="password" value={form.password} onChange={onChange("password")} placeholder="mentor123" />
                    <Input label="Họ tên" value={form.fullName} onChange={onChange("fullName")} placeholder="Mentor One" />
                    <Input label="Số điện thoại" value={form.phone} onChange={onChange("phone")} placeholder="0900000000" />
                    <Input label="Title (tuỳ chọn)" value={form.title} onChange={onChange("title")} placeholder="Senior Engineer" />

                    <div className="md:col-span-2 flex items-center gap-3">
                        <button
                            type="submit"
                            disabled={!canSubmit || submitting}
                            className={[
                                "rounded-xl px-4 py-2 text-sm font-bold text-white transition",
                                !canSubmit || submitting ? "bg-slate-400" : "bg-slate-900 hover:bg-slate-800",
                            ].join(" ")}
                        >
                            {submitting ? "Đang tạo..." : "Tạo mentor"}
                        </button>

                        <button
                            type="button"
                            onClick={() => setForm({ email: "", password: "", fullName: "", phone: "", title: "" })}
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            Reset
                        </button>
                    </div>
                </form>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                    <div className="text-base font-extrabold text-slate-900">Danh sách mentor</div>
                    <button
                        onClick={fetchMentors}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        Refresh
                    </button>
                </div>

                <div className="overflow-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead className="text-slate-500">
                        <tr className="border-b border-slate-200">
                            <th className="py-2 pr-3">ID</th>
                            <th className="py-2 pr-3">Email</th>
                            <th className="py-2 pr-3">Họ tên</th>
                            <th className="py-2 pr-3">Phone</th>
                            <th className="py-2 pr-3">Title</th>
                        </tr>
                        </thead>
                        <tbody>
                        {loadingList ? (
                            <tr>
                                <td className="py-3 text-slate-500" colSpan={5}>Loading...</td>
                            </tr>
                        ) : mentors.length === 0 ? (
                            <tr>
                                <td className="py-3 text-slate-500" colSpan={5}>
                                    (Nếu bạn chưa có GET /api/mentors thì bảng này sẽ trống — không ảnh hưởng chức năng tạo.)
                                </td>
                            </tr>
                        ) : (
                            mentors.map((m) => (
                                <tr key={m.id} className="border-b border-slate-100">
                                    <td className="py-2 pr-3 font-semibold text-slate-900">{m.id}</td>
                                    <td className="py-2 pr-3">{m.email}</td>
                                    <td className="py-2 pr-3">{m.fullName}</td>
                                    <td className="py-2 pr-3">{m.phone || "-"}</td>
                                    <td className="py-2 pr-3">{m.title || "-"}</td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
