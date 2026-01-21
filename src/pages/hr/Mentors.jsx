import { useEffect, useState } from "react";
import mentorApi from "../../api/mentorApi";

export default function Mentors() {
    /* ================= FORM CREATE ================= */
    const [form, setForm] = useState({
        email: "",
        password: "",
        fullName: "",
        phone: "",
        title: "",
    });
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ type: "", text: "" });

    /* ================= TABS ================= */
    const [tab, setTab] = useState("CREATE"); // CREATE | WORKLOAD

    /* ================= WORKLOAD ================= */
    const [workload, setWorkload] = useState([]);
    const [loadingWorkload, setLoadingWorkload] = useState(false);
    const [search, setSearch] = useState("");

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

    /* ================= FETCH WORKLOAD ================= */
    const fetchWorkload = async () => {
        setLoadingWorkload(true);
        try {
            const res = await mentorApi.workload({
                page: 0,
                size: 50,
                search,
            });
            const data = res?.data;
            const items = data?.content || data?.items || [];
            setWorkload(items);
        } catch (e) {
            setWorkload([]);
        } finally {
            setLoadingWorkload(false);
        }
    };

    useEffect(() => {
        if (tab === "WORKLOAD") fetchWorkload();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tab]);

    /* ================= RENDER ================= */
    return (
        <div className="mx-auto max-w-6xl space-y-8 p-6">
            {/* ===== TAB BUTTONS ===== */}
            <div className="flex gap-2">
                <button
                    onClick={() => setTab("CREATE")}
                    className={`rounded-xl px-4 py-2 text-sm font-bold ${
                        tab === "CREATE"
                            ? "bg-slate-900 text-white"
                            : "bg-slate-100 text-slate-700"
                    }`}
                >
                    Thêm Mentor
                </button>

                <button
                    onClick={() => setTab("WORKLOAD")}
                    className={`rounded-xl px-4 py-2 text-sm font-bold ${
                        tab === "WORKLOAD"
                            ? "bg-slate-900 text-white"
                            : "bg-slate-100 text-slate-700"
                    }`}
                >
                    Mentor workload
                </button>
            </div>

            {/* ===== CREATE FORM ===== */}
            {tab === "CREATE" && (
                <div className="max-w-xl rounded-2xl border bg-white p-6">
                    <h1 className="text-xl font-extrabold text-slate-900">Thêm Mentor</h1>
                    <p className="mt-1 text-sm text-slate-500">
                        HR tạo mentor để phân công thực tập sinh.
                    </p>

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
                        <input className="input" placeholder="email" value={form.email} onChange={onChange("email")} />
                        <input type="password" className="input" placeholder="password" value={form.password} onChange={onChange("password")} />
                        <input className="input" placeholder="fullName" value={form.fullName} onChange={onChange("fullName")} />
                        <input className="input" placeholder="phone (optional)" value={form.phone} onChange={onChange("phone")} />
                        <input className="input" placeholder="title (optional)" value={form.title} onChange={onChange("title")} />

                        <button
                            disabled={loading}
                            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white disabled:bg-slate-400"
                        >
                            {loading ? "Đang tạo..." : "Tạo mentor"}
                        </button>
                    </form>
                </div>
            )}

            {/* ===== WORKLOAD TABLE ===== */}
            {tab === "WORKLOAD" && (
                <div className="rounded-2xl border bg-white p-6">
                    <div className="mb-4 flex justify-between">
                        <h2 className="text-lg font-extrabold">Mentor workload</h2>
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && fetchWorkload()}
                            placeholder="Tìm theo tên/email"
                            className="rounded-xl border px-3 py-2 text-sm"
                        />
                    </div>

                    {loadingWorkload ? (
                        <p className="text-slate-500">Loading...</p>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                            <tr className="border-b text-left text-slate-500">
                                <th>Email</th>
                                <th>Họ tên</th>
                                <th>Department</th>
                                <th className="text-right">Số intern</th>
                            </tr>
                            </thead>
                            <tbody>
                            {workload.map((m) => (
                                <tr key={m.mentorId} className="border-b">
                                    <td>{m.email}</td>
                                    <td>{m.fullName}</td>
                                    <td>{m.departmentName || "-"}</td>
                                    <td className="text-right font-bold">{m.internCount}</td>
                                </tr>
                            ))}
                            {workload.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="py-4 text-center text-slate-500">
                                        Không có dữ liệu
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
}
