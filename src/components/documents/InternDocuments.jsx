import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import StatusBadge from "@/components/StatusBadge.jsx";
import { internDocumentApi } from "@/api/internDocumentApi.js";
import { useAuth } from "@/features/auth/model/AuthContext";

const TYPE_LABEL = {
    CV: "CV",
    APPLICATION_LETTER: "Đơn xin thực tập",
};

function pickLatestByType(docs = []) {
    const map = new Map();
    for (const d of docs) {
        if (!d?.type) continue;
        // nếu backend trả 1 record/type thì map này vẫn OK
        if (!map.has(d.type)) map.set(d.type, d);
    }
    return map;
}

export default function InternDocuments({ internId }) {
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploadingType, setUploadingType] = useState(null);
    const { user } = useAuth();

    const byType = useMemo(() => pickLatestByType(docs), [docs]);

    const load = async () => {
        setLoading(true);
        try {
            // Backend reads the current intern from JWT/security context — no internId needed
            const data = await internDocumentApi.getMyDocuments();
            setDocs(Array.isArray(data) ? data : []);
        } catch (e) {
            // detect normalized errors from internDocumentApi
            const backendMsg = e?.backendMessage || e?.message || "";
            if (e && e.code === "UNAUTHORIZED") {
                toast.error(backendMsg || "Bạn chưa được xác thực. Vui lòng đăng nhập lại.");
            } else if (e && e.code === "PROFILE_NOT_FOUND") {
                toast.error(backendMsg || "Không tìm thấy profile thực tập sinh. Vui lòng liên hệ admin.");
            } else {
                toast.error(backendMsg || "Không tải được danh sách tài liệu.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Load documents on mount and whenever internId changes (safe even if internId not provided)
        load();
    }, [internId]);

    const validateFile = (file) => {
        const maxMB = 10;
        const okExt = ["pdf"]; // Only PDF for CV and Application Letter
        const name = (file?.name || "").toLowerCase();
        const ext = name.split(".").pop();

        if (!okExt.includes(ext)) {
            toast.error("Chỉ chấp nhận file PDF cho CV và Đơn xin thực tập.");
            return false;
        }
        if (file.size > maxMB * 1024 * 1024) {
            toast.error(`File quá lớn. Tối đa ${maxMB}MB.`);
            return false;
        }
        return true;
    };

    const onUpload = async (type, file) => {
        if (!file || !validateFile(file)) return;
        setUploadingType(type);
        try {
            // Call API with optional internId (required if user is HR/ADMIN)
            await internDocumentApi.uploadDocument({ type, file, internId });
            toast.success("Upload tài liệu thành công.");
            await load();
        } catch (e) {
            const backendMsg = e?.backendMessage || e?.message || "";
            if (e && e.code === "UNAUTHORIZED") {
                toast.error(backendMsg || "Bạn chưa được xác thực. Vui lòng đăng nhập lại.");
            } else if (e && e.code === "PROFILE_NOT_FOUND") {
                toast.error(backendMsg || "Không tìm thấy profile thực tập sinh. Vui lòng liên hệ admin.");
            } else {
                toast.error(backendMsg || "Upload thất bại. Vui lòng thử lại.");
            }
        } finally {
            setUploadingType(null);
        }
    };

    const download = async (doc) => {
        try {
            const res = await internDocumentApi.downloadDocument({
                id: doc.id,
                requesterUserId: user?.id,   // hoặc bỏ luôn nếu BE không cần
                isHr: false,
            });

            // lấy filename từ header (nếu backend có) hoặc fallback
            const contentDisposition = res.headers?.["content-disposition"] || "";
            const match = /filename="(.+?)"/i.exec(contentDisposition);
            const filename = match?.[1] || `${doc.type || "document"}-${doc.id}.pdf`;

            const blob = new Blob([res.data], {
                type: res.headers?.["content-type"] || "application/pdf",
            });

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (e) {
            const backendMsg = e?.backendMessage || e?.message || "";
            toast.error(backendMsg || "Tải file thất bại.");
        }
    };


    const Card = ({ type }) => {
        const d = byType.get(type);
        const isUploading = uploadingType === type;

        return (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <div className="text-sm font-semibold text-slate-900">{TYPE_LABEL[type]}</div>
                        <div className="mt-1 text-xs text-slate-500">
                            {d?.uploadedAt ? `Upload: ${new Date(d.uploadedAt).toLocaleString()}` : "Chưa upload"}
                        </div>
                    </div>
                    <StatusBadge status={d?.status} />
                </div>

                <div className="mt-3 rounded-xl bg-slate-50 p-3">
                    <div className="text-xs text-slate-600">
                        {d?.fileUrl ? (
                            <>
                                <span className="font-medium text-slate-800">File:</span>{" "}
                                <span className="break-all">{d.fileUrl}</span>
                            </>
                        ) : (
                            "Chưa có file."
                        )}
                    </div>

                    {d?.reviewNote ? (
                        <div className="mt-2 text-xs text-rose-700">
                            <span className="font-semibold">Lý do:</span> {d.reviewNote}
                        </div>
                    ) : null}
                </div>

                <div className="mt-3 flex items-center justify-between gap-3">
                    <label
                        className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 active:bg-slate-950">
                        <input
                            type="file"
                            className="hidden"
                            onChange={(e) => {
                                const f = e.target.files?.[0];
                                e.target.value = "";
                                onUpload(type, f);
                            }}
                            disabled={isUploading}
                        />
                        {isUploading ? "Đang upload..." : "Chọn file"}
                    </label>

                    <button
                        type="button"
                        onClick={load}
                        disabled={loading}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-60"
                    >
                        {loading ? "Đang tải..." : "Tải lại"}
                    </button>

                    {d?.fileUrl && (
                        <button
                            type="button"
                            onClick={() => download(d)}
                            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                        >
                            Tải về
                        </button>
                    )}
                </div>
            </div>
        );
    };

    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-1">
                <h2 className="text-lg font-bold text-slate-900">Tài liệu hồ sơ</h2>
                <p className="text-sm text-slate-600">Upload CV và đơn xin thực tập dưới dạng PDF để hoàn thiện hồ sơ.
                    HR sẽ download tài liệu dưới dạng PDF.</p>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                <Card type="CV" />
                <Card type="APPLICATION_LETTER" />
            </div>
        </section>
    );
}
