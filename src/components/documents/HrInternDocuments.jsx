import {useEffect, useState} from "react";
import {toast} from "sonner";
import StatusBadge from "./StatusBadge";
import {internDocumentApi} from "../../api/internDocumentApi.js";

export default function HrInternDocuments({internId, hrUserId}) {
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [actingId, setActingId] = useState(null);
    const [rejecting, setRejecting] = useState(null); // {id, note}
    const [errorMessage, setErrorMessage] = useState("");

    const load = async () => {
        setLoading(true);
        setErrorMessage("");
        try {
            const data = await internDocumentApi.getInternDocuments({internId});
            setDocs(Array.isArray(data) ? data : []);
        } catch (e) {
            const backendMsg = e?.backendMessage || e?.message || "";
            if (e && e.code === "UNAUTHORIZED") {
                toast.error(backendMsg || "Bạn chưa được xác thực. Vui lòng đăng nhập lại.");
            } else if (e && e.code === "PROFILE_NOT_FOUND") {
                // show persistent banner in UI + toast
                const msg = backendMsg || "Không tìm thấy profile thực tập sinh. Vui lòng liên hệ HR.";
                setErrorMessage(msg);
                toast.error(msg);
            } else {
                const msg = backendMsg || "Không tải được tài liệu của thực tập sinh.";
                setErrorMessage(msg);
                toast.error(msg);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (internId) load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [internId]);

    const approve = async (id) => {
        setActingId(id);
        try {
            await internDocumentApi.approveDocument({id, hrUserId});
            toast.success("Đã duyệt tài liệu.");
            await load();
        } catch (e) {
            const backendMsg = e?.backendMessage || e?.message || "";
            if (e && e.code === "UNAUTHORIZED") {
                toast.error(backendMsg || "Bạn chưa được xác thực. Vui lòng đăng nhập lại.");
            } else if (e && e.code === "PROFILE_NOT_FOUND") {
                const msg = backendMsg || "Không tìm thấy profile thực tập sinh. Vui lòng liên hệ HR.";
                setErrorMessage(msg);
                toast.error(msg);
            } else {
                toast.error(backendMsg || "Duyệt thất bại.");
            }
        } finally {
            setActingId(null);
        }
    };

    const reject = async () => {
        const id = rejecting?.id;
        if (!id) return;
        setActingId(id);
        try {
            await internDocumentApi.rejectDocument({id, hrUserId, note: rejecting.note || ""});
            toast.success("Đã từ chối tài liệu.");
            setRejecting(null);
            await load();
        } catch (e) {
            const backendMsg = e?.backendMessage || e?.message || "";
            if (e && e.code === "UNAUTHORIZED") {
                toast.error(backendMsg || "Bạn chưa được xác thực. Vui lòng đăng nhập lại.");
            } else if (e && e.code === "PROFILE_NOT_FOUND") {
                const msg = backendMsg || "Không tìm thấy profile thực tập sinh. Vui lòng liên hệ HR.";
                setErrorMessage(msg);
                toast.error(msg);
            } else {
                toast.error(backendMsg || "Từ chối thất bại.");
            }
        } finally {
            setActingId(null);
        }
    };

    const download = async (doc) => {
        try {
            const res = await internDocumentApi.downloadDocument({
                id: doc.id,
                requesterUserId: hrUserId,
                isHr: true,
            });

            const blob = new Blob([res.data], {type: res.headers["content-type"] || "application/octet-stream"});
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            const ext = (res.headers?.["content-type"] || "").includes("pdf") ? ".pdf" : "";
            a.download = `${doc.type || "document"}-${doc.id}${ext}`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (e) {
            const backendMsg = e?.backendMessage || e?.message || "";
            if (e && e.code === "UNAUTHORIZED") {
                toast.error(backendMsg || "Bạn chưa được xác thực. Vui lòng đăng nhập lại.");
            } else if (e && e.code === "PROFILE_NOT_FOUND") {
                const msg = backendMsg || "Không tìm thấy profile thực tập sinh. Vui lòng liên hệ HR.";
                setErrorMessage(msg);
                toast.error(msg);
            } else {
                toast.error(backendMsg || "Tải file thất bại.");
            }
        }
    };

    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h2 className="text-lg font-bold text-slate-900">Tài liệu thực tập sinh</h2>
                    <p className="text-sm text-slate-600">Xem, tải xuống và duyệt tài liệu.</p>
                </div>
                <button
                    type="button"
                    onClick={load}
                    disabled={loading}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-60"
                >
                    {loading ? "Đang tải..." : "Tải lại"}
                </button>
            </div>

            {errorMessage ? (
                <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-800">
                    {errorMessage}
                </div>
            ) : null}

            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
                <table className="min-w-full text-sm">
                    <thead className="bg-slate-50 text-left text-slate-600">
                    <tr>
                        <th className="px-4 py-3 font-semibold">Loại</th>
                        <th className="px-4 py-3 font-semibold">Trạng thái</th>
                        <th className="px-4 py-3 font-semibold">Upload lúc</th>
                        <th className="px-4 py-3 font-semibold">Hành động</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                    {docs.map((d) => (
                        <tr key={d.id} className="bg-white">
                            <td className="px-4 py-3 font-semibold text-slate-900">{d.type}</td>
                            <td className="px-4 py-3">
                                <StatusBadge status={d.status}/>
                                {d.reviewNote ?
                                    <div className="mt-1 text-xs text-rose-700">Lý do: {d.reviewNote}</div> : null}
                            </td>
                            <td className="px-4 py-3 text-slate-700">
                                {d.uploadedAt ? new Date(d.uploadedAt).toLocaleString() : "-"}
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        onClick={() => download(d)}
                                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50"
                                    >
                                        Download
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => approve(d.id)}
                                        disabled={actingId === d.id}
                                        className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                                    >
                                        {actingId === d.id ? "Đang xử lý..." : "Approve"}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setRejecting({id: d.id, note: ""})}
                                        disabled={actingId === d.id}
                                        className="rounded-xl bg-rose-600 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-60"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}

                    {!loading && docs.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="px-4 py-6 text-center text-slate-500">
                                Chưa có tài liệu.
                            </td>
                        </tr>
                    ) : null}
                    </tbody>
                </table>
            </div>

            {/* Reject modal */}
            {rejecting ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl">
                        <div className="text-base font-bold text-slate-900">Từ chối tài liệu</div>
                        <div className="mt-1 text-sm text-slate-600">Nhập lý do để thực tập sinh chỉnh sửa.</div>

                        <textarea
                            value={rejecting.note}
                            onChange={(e) => setRejecting({...rejecting, note: e.target.value})}
                            rows={4}
                            className="mt-4 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
                            placeholder="Ví dụ: CV thiếu thông tin liên hệ..."
                        />

                        <div className="mt-4 flex items-center justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setRejecting(null)}
                                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                            >
                                Hủy
                            </button>
                            <button
                                type="button"
                                onClick={reject}
                                disabled={actingId === rejecting.id}
                                className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-60"
                            >
                                {actingId === rejecting.id ? "Đang xử lý..." : "Xác nhận Reject"}
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </section>
    );
}
