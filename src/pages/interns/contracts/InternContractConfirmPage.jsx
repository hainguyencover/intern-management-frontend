import {useEffect, useMemo, useState} from "react";
import {toast} from "react-toastify";
import {internDocumentApi} from "../../../api/internDocumentApi.js";

const CONTRACT_TYPE = "INTERNSHIP_CONTRACT";

function normalizeStatus(s) {
    return String(s || "").toUpperCase();
}

function StatusBadge({status}) {
    const s = String(status || "").toUpperCase();
    const styles = {
        PENDING: "bg-amber-50 text-amber-700 border-amber-200",
        APPROVED: "bg-green-50 text-green-700 border-green-200",
        REJECTED: "bg-rose-50 text-rose-700 border-rose-200",
        SIGNED: "bg-sky-50 text-sky-700 border-sky-200",
    };
    const cls = styles[s] || "bg-slate-50 text-slate-700 border-slate-200";

    return (
        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs border ${cls}`}>
      {s || "-"}
    </span>
    );
}

function Step({title, active, done, subtitle}) {
    const dot = done ? "bg-sky-600" : active ? "bg-slate-900" : "bg-slate-300";
    return (
        <div className="flex items-start gap-3">
            <div className={`mt-1 h-3 w-3 rounded-full ${dot}`}/>
            <div>
                <div className="text-sm font-medium">{title}</div>
                {subtitle && <div className="text-xs text-slate-500">{subtitle}</div>}
            </div>
        </div>
    );
}

export default function InternContractConfirmPage() {
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingPreview, setLoadingPreview] = useState(false);
    const [checked, setChecked] = useState(false);
    const [confirming, setConfirming] = useState(false);
    const [error, setError] = useState("");
    const [previewUrl, setPreviewUrl] = useState("");

    const contractDoc = useMemo(() => {
        return (docs || []).find((d) => String(d?.type || "").toUpperCase() === CONTRACT_TYPE) || null;
    }, [docs]);

    const loadPreview = async (doc) => {
        if (!doc) return;
        try {
            const res = await internDocumentApi.downloadMyAsBlob(doc.id);
            const blob = new Blob([res.data], {type: "application/pdf"});
            const url = URL.createObjectURL(blob);
            setPreviewUrl(url);
        } catch (e) {
            toast.error(e?.backendMessage || e?.message || "Không thể preview hợp đồng");
        }
    };

    useEffect(() => {
        if (contractDoc?.id) loadPreview(contractDoc);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contractDoc?.id]);

    const fetchMyDocs = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await internDocumentApi.getMyDocuments();
            setDocs(res || []);
        } catch (e) {
            const msg = e?.response?.data?.message || "Không thể tải tài liệu của bạn";
            setError(msg);
            setDocs([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyDocs();
    }, []);



    const status = normalizeStatus(contractDoc?.status);

    const canConfirm = useMemo(() => status === "APPROVED", [status]);
    const isSigned = useMemo(() => status === "SIGNED", [status]);
    const isRejected = useMemo(() => status === "REJECTED", [status]);
    const isPending = useMemo(() => status === "PENDING", [status]);

    const fileUrl = contractDoc?.fileUrl || "";

    // preview: chỉ preview khi có fileUrl và nhìn như pdf
    const isPdf = useMemo(() => fileUrl?.toLowerCase().endsWith(".pdf"), [fileUrl]);

    const handleDownload = async () => {
        if (!contractDoc) return;
        if (!fileUrl) {
            toast.info("Hợp đồng chưa có file để tải.");
            return;
        }
        try {
            const res = await internDocumentApi.downloadMyAsBlob(contractDoc.id);
            const blob = new Blob([res.data], {type: "application/pdf"});
            const url = URL.createObjectURL(blob);
            window.open(url, "_blank", "noopener,noreferrer");
        } catch (e) {
            toast.error(e?.backendMessage || e?.message || "Không thể tải hợp đồng");
        }
    };

    const handleConfirm = async () => {
        if (!contractDoc) return;
        if (!canConfirm) {
            toast.info("Hợp đồng cần được HR duyệt (APPROVED) trước khi bạn xác nhận.");
            return;
        }
        if (!checked) {
            toast.info("Bạn cần tick xác nhận đã đọc và đồng ý trước khi gửi.");
            return;
        }
        if (!window.confirm("Bạn chắc chắn muốn xác nhận hợp đồng này chứ?")) return;

        setConfirming(true);
        try {
            await internDocumentApi.confirmMyContract(contractDoc.id);
            toast.success("Xác nhận hợp đồng thành công!");
            setChecked(false);
            await fetchMyDocs();
        } catch (e) {
            toast.error(e?.backendMessage || e?.message || "Xác nhận hợp đồng thất bại");
        } finally {
            setConfirming(false);
        }
    };

    const helperMessage = useMemo(() => {
        if (!contractDoc) {
            return {
                title: "Chưa có hợp đồng",
                desc: "HR chưa tải lên hợp đồng cho bạn. Vui lòng quay lại sau.",
                tone: "bg-slate-50 border-slate-200 text-slate-700",
            };
        }
        if (isSigned) {
            return {
                title: "Bạn đã xác nhận hợp đồng",
                desc: "Thủ tục xác nhận hợp đồng đã hoàn tất. Vui lòng theo dõi các thông báo tiếp theo.",
                tone: "bg-sky-50 border-sky-200 text-sky-800",
            };
        }
        if (isRejected) {
            return {
                title: "Hợp đồng bị từ chối",
                desc: "HR đã từ chối hợp đồng. Vui lòng chờ HR tải lên bản hợp đồng mới hoặc liên hệ để được hỗ trợ.",
                tone: "bg-rose-50 border-rose-200 text-rose-800",
            };
        }
        if (isPending) {
            return {
                title: "Đang chờ HR duyệt",
                desc: "HR đã tải lên hợp đồng nhưng chưa duyệt. Bạn có thể tải về xem trước, sau đó quay lại xác nhận khi trạng thái là APPROVED.",
                tone: "bg-amber-50 border-amber-200 text-amber-800",
            };
        }
        if (status === "APPROVED") {
            return {
                title: "Hợp đồng đã được duyệt",
                desc: "Bạn có thể xác nhận hợp đồng để hoàn tất thủ tục.",
                tone: "bg-green-50 border-green-200 text-green-800",
            };
        }
        return {
            title: `Trạng thái: ${status || "-"}`,
            desc: "Vui lòng kiểm tra lại hoặc liên hệ HR.",
            tone: "bg-slate-50 border-slate-200 text-slate-700",
        };
    }, [contractDoc, isSigned, isRejected, isPending, status]);

    const stepState = useMemo(() => {
        // step1: uploaded (có contractDoc)
        const uploaded = !!contractDoc;
        // step2: hr approved (APPROVED hoặc SIGNED)
        const hrApproved = status === "APPROVED" || status === "SIGNED";
        // step3: intern signed
        const internSigned = status === "SIGNED";
        return {uploaded, hrApproved, internSigned};
    }, [contractDoc, status]);

    return (
        <div className="p-6 space-y-5">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-xl font-semibold">Hợp đồng thực tập</h1>
                    <div className="text-sm text-slate-500">Xem, tải về và xác nhận hợp đồng trên hệ thống.</div>
                </div>

                <button
                    onClick={fetchMyDocs}
                    className="h-10 px-3 rounded-lg border border-slate-200 hover:bg-slate-50"
                    disabled={loading}
                >
                    Refresh
                </button>
            </div>

            {/* Error */}
            {error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-800">
                    <div className="font-semibold">Không tải được dữ liệu</div>
                    <div className="text-sm mt-1">{error}</div>
                </div>
            )}

            {/* Loading state */}
            {loading && (
                <div className="rounded-xl border border-slate-200 p-4">
                    <div className="text-sm text-slate-600">Đang tải dữ liệu...</div>
                </div>
            )}

            {/* Main */}
            {!loading && (
                <>
                    {/* Summary card */}
                    <div className={`rounded-xl border p-4 ${helperMessage.tone}`}>
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <div className="font-semibold">{helperMessage.title}</div>
                                <div className="text-sm mt-1">{helperMessage.desc}</div>
                            </div>

                            {contractDoc && <StatusBadge status={status}/>}
                        </div>

                        {/* show reject note if any */}
                        {isRejected && (contractDoc?.reviewNote || contractDoc?.reviewedAt) && (
                            <div className="mt-3 text-sm">
                                {contractDoc?.reviewNote && (
                                    <div>
                                        <span className="font-medium">Lý do: </span>
                                        <span>{contractDoc.reviewNote}</span>
                                    </div>
                                )}
                                {contractDoc?.reviewedAt && (
                                    <div className="text-xs text-slate-500 mt-1">
                                        Thời điểm HR xử lý: {new Date(contractDoc.reviewedAt).toLocaleString()}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Steps */}
                    <div className="rounded-xl border border-slate-200 p-4">
                        <div className="font-semibold mb-3">Tiến trình</div>
                        <div className="grid gap-3 md:grid-cols-3">
                            <Step
                                title="1) HR tải lên hợp đồng"
                                done={stepState.uploaded}
                                active={!stepState.uploaded}
                                subtitle={stepState.uploaded ? "Đã có hợp đồng trên hệ thống" : "Chưa có hợp đồng"}
                            />
                            <Step
                                title="2) HR duyệt hợp đồng"
                                done={stepState.hrApproved}
                                active={stepState.uploaded && !stepState.hrApproved && !isRejected}
                                subtitle={
                                    isRejected
                                        ? "Đã từ chối"
                                        : stepState.hrApproved
                                            ? "Đã duyệt"
                                            : "Đang chờ duyệt"
                                }
                            />
                            <Step
                                title="3) Intern xác nhận"
                                done={stepState.internSigned}
                                active={stepState.hrApproved && !stepState.internSigned}
                                subtitle={stepState.internSigned ? "Hoàn tất" : "Chưa xác nhận"}
                            />
                        </div>
                    </div>

                    {/* Contract actions */}
                    <div className="rounded-xl border border-slate-200 p-4 space-y-4">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <div className="font-semibold">Tài liệu hợp đồng</div>
                                <div className="text-sm text-slate-500">
                                    {contractDoc ? "Bạn có thể tải về để đọc trước khi xác nhận." : "Chưa có file hợp đồng."}
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={handleDownload}
                                    disabled={!contractDoc || !fileUrl}
                                    className="h-10 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50"
                                >
                                    Download
                                </button>
                            </div>
                        </div>

                        {/* Preview */}
                        {contractDoc && fileUrl && (
                            <div className="rounded-xl border border-slate-200 overflow-hidden">
                                <div className="px-4 py-2 text-sm bg-slate-50 flex items-center justify-between">
                                    <div className="text-slate-600">Preview</div>
                                    <button
                                        className="text-sm underline"
                                        onClick={() => window.open(`/${fileUrl}`, "_blank", "noopener,noreferrer")}
                                    >
                                        Open in new tab
                                    </button>
                                </div>

                                {isPdf ? (
                                    <div className="relative">
                                        {loadingPreview && (
                                            <div
                                                className="absolute inset-0 bg-white/70 flex items-center justify-center text-sm">
                                                Đang tải preview...
                                            </div>
                                        )}
                                        <iframe
                                            title="contract-preview"
                                            src={previewUrl}
                                            className="w-full h-[560px]"
                                            onLoad={() => setLoadingPreview(false)}
                                            onLoadStart={() => setLoadingPreview(true)}
                                        />
                                    </div>
                                ) : (
                                    <div className="p-4 text-sm text-slate-600">
                                        File không phải PDF nên không preview trực tiếp. Bạn hãy bấm Download.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Confirm section */}
                    <div className="rounded-xl border border-slate-200 p-4 space-y-3">
                        <div className="font-semibold">Xác nhận hợp đồng</div>

                        {!contractDoc && (
                            <div className="text-sm text-slate-600">
                                Chưa có hợp đồng để xác nhận.
                            </div>
                        )}

                        {contractDoc && isPending && (
                            <div className="text-sm text-slate-600">
                                Hợp đồng đang <b>PENDING</b>. Vui lòng chờ HR duyệt để có thể xác nhận.
                            </div>
                        )}

                        {contractDoc && isRejected && (
                            <div className="text-sm text-slate-600">
                                Hợp đồng đã bị <b>REJECTED</b>. Bạn không thể xác nhận bản hợp đồng này.
                            </div>
                        )}

                        {contractDoc && isSigned && (
                            <div className="text-sm text-slate-600">
                                Bạn đã xác nhận hợp đồng. Không cần thao tác thêm.
                            </div>
                        )}

                        {contractDoc && canConfirm && !isSigned && (
                            <>
                                <label className="flex items-start gap-3 text-sm">
                                    <input
                                        type="checkbox"
                                        className="mt-1"
                                        checked={checked}
                                        onChange={(e) => setChecked(e.target.checked)}
                                    />
                                    <span>
                    Tôi đã đọc hợp đồng và đồng ý với các điều khoản, thông tin trong hợp đồng là chính xác.
                  </span>
                                </label>

                                <div className="flex gap-2">
                                    <button
                                        onClick={handleConfirm}
                                        disabled={!checked || confirming}
                                        className="h-10 px-4 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50"
                                    >
                                        {confirming ? "Đang xác nhận..." : "Xác nhận hợp đồng"}
                                    </button>

                                    <button
                                        onClick={() => window.open(`/${fileUrl}`, "_blank", "noopener,noreferrer")}
                                        disabled={!fileUrl}
                                        className="h-10 px-4 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50"
                                    >
                                        Mở hợp đồng
                                    </button>
                                </div>

                                <div className="text-xs text-slate-500">
                                    Lưu ý: Bạn chỉ có thể xác nhận khi hợp đồng đã được HR duyệt (APPROVED).
                                </div>
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
