import { useState } from "react";
import mentorApi from "@/features/mentor/api/mentorApi";

export default function Mentors() {
    const [form, setForm] = useState({
        email: "",
        password: "",
        fullName: "",
        phone: "",
        title: "",
    });
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ type: "", text: "" });

    const onChange = (k) => (e) => {
        setMsg({ type: "", text: "" });
        setForm((f) => ({ ...f, [k]: e.target.value }));
    };

    const submit = async (e) => {
        e.preventDefault();
        if (!form.email.trim() || !form.password.trim() || !form.fullName.trim()) {
            setMsg({ type: "error", text: "Vui lòng nhập email, password, fullName." });
            return;
        }

        setLoading(true);
        try {
            await mentorApi.create({
                email: form.email.trim(),
                password: form.password,
                fullName: form.fullName.trim(),
                phone: form.phone?.trim() || null,
                title: form.title?.trim() || null,
            });
            setMsg({ type: "success", text: "Tạo mentor thành công!" });
            setForm({ email: "", password: "", fullName: "", phone: "", title: "" });
        } catch (err) {
            setMsg({
                type: "error",
                text: err?.response?.data?.message || "Tạo mentor thất bại",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-xl p-6">
            <h1 className="text-xl font-extrabold text-slate-900">Thêm Mentor</h1>
            <p className="mt-1 text-sm text-slate-500">HR tạo mentor để phân công thực tập sinh.</p>

            {msg.text && (
                <div
                    className={[
                        "mt-4 rounded-xl border px-3 py-2 text-sm",
                        msg.type === "success"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-rose-200 bg-rose-50 text-rose-700",
                    ].join(" ")}
                >
                    {msg.text}
                </div>
            )}

            <form onSubmit={submit} className="mt-4 grid gap-3">
                <input
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                    placeholder="email"
                    value={form.email}
                    onChange={onChange("email")}
                />
                <input
                    type="password"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                    placeholder="password"
                    value={form.password}
                    onChange={onChange("password")}
                />
                <input
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                    placeholder="fullName"
                    value={form.fullName}
                    onChange={onChange("fullName")}
                />
                <input
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                    placeholder="phone (optional)"
                    value={form.phone}
                    onChange={onChange("phone")}
                />
                <input
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                    placeholder="title (optional)"
                    value={form.title}
                    onChange={onChange("title")}
                />

                <button
                    disabled={loading}
                    className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white disabled:bg-slate-400"
                >
                    {loading ? "Đang tạo..." : "Tạo mentor"}
                </button>
            </form>
        </div>
    );
}
