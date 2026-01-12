// src/pages/contracts/documents/HrUploadInternshipContract.jsx
import {useEffect, useMemo, useState} from "react";
import {toast} from "sonner";
import {FileText, Download, Upload, XCircle} from "lucide-react";
import {internDocumentApi} from "../../../../api/internDocumentApi.js";

const DOC_TYPE = "INTERNSHIP_CONTRACT";
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

function formatDateTime(v) {
    if (!v) return "-";
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? String(v) : d.toLocaleString();
}

function isPdf(file) {
    if (!file) return false;
    const name = (file.name || "").toLowerCase();
    return file.type === "application/pdf" || name.endsWith(".pdf");
}

export default function HrUploadInternshipContract() {
    const [internId, setInternId] = useState("");

    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");

    const [loadingList, setLoadingList] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [documents, setDocuments] = useState([]);

    const contractDocs = useMemo(() => {
        return (documents || []).filter((d) => d?.type === DOC_TYPE);
    }, [documents]);

    // Cleanup preview URL
    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    const fetchDocs = async (id) => {
        if (!id) return;
        setLoadingList(true);
        try {
            const res = await internDocumentApi.getDocumentsOfIntern(id);
            setDocuments(res || []);
        } catch (e) {
            toast.error(e?.response?.data?.message || "Không thể tải danh sách tài liệu của intern");
            setDocuments([]);
        } finally {
            setLoadingList(false);
        }
    };

    const onPickFile = (f) => {
        if (!f) return;

        if (!isPdf(f)) {
            toast.error("Chỉ chấp nhận file PDF");
            return;
        }
        if (f.size > MAX_SIZE) {
            toast.error("File vượt quá 10MB");
            return;
        }

        setFile(f);

        const url = URL.createObjectURL(f);
        setPreviewUrl((old) => {
            if (old) URL.revokeObjectURL(old);
            return url;
        });
    };

    const clearFile = () => {
        setFile(null);
        setPreviewUrl((old) => {
            if (old) URL.revokeObjectURL(old);
            return "";
        });
    };

    const handleUpload = async () => {
        const id = String(internId).trim();
        if (!id) {
            toast.error("Vui lòng nhập internId");
            return;
        }
        if (!file) {
            toast.error("Vui lòng chọn file PDF");
            return;
        }

        setUploading(true);
        try {
            await internDocumentApi.uploadContractForIntern(id, file);
            toast.success("Tải lên hợp đồng thành công");
            clearFile();
            fetchDocs(id);
        } catch (e) {
            toast.error(e?.response?.data?.message || "Upload thất bại");
        } finally {
            setUploading(false);
        }
    };

    const handleDownload = async (doc) => {
        try {
            const res = await internDocumentApi.downloadAsBlob(doc.id);
            const blob = new Blob([res.data], {type: "application/pdf"});
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `internship-contract-${doc.id}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();

            URL.revokeObjectURL(url);
        } catch (e) {
            toast.error("Tải xuống thất bại");
        }
    };

    return (
        <div className="mx-auto w-full max-w-5xl space-y-6">
            {/* Header */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                        <FileText size={18}/>
                    </div>
                    <div>
                        <div className="text-lg font-bold text-slate-900">Tải lên hợp đồng thực tập</div>
                        <div className="text-sm text-slate-600">
                            HR upload PDF hợp đồng theo từng intern để quản lý giấy tờ.
                        </div>
                    </div>
                </div>
            </div>

            {/* Intern Select (simple by internId) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
                <div className="font-bold text-slate-900">Chọn thực tập sinh</div>
                <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
                    <input
                        value={internId}
                        onChange={(e) => setInternId(e.target.value)}
                        placeholder="Nhập internId (vd: 12)"
                        className="h-11 w-full md:w-[280px] px-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-slate-300"
                    />
                    <button
                        onClick={() => fetchDocs(String(internId).trim())}
                        disabled={!String(internId).trim() || loadingList}
                        className="h-11 px-4 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 disabled:opacity-50"
                    >
                        {loadingList ? "Đang tải..." : "Tải danh sách tài liệu"}
                    </button>
                    <div className="text-sm text-slate-500 md:ml-auto">
                        Tip: Nếu bạn đã có API danh sách intern, mình có thể đổi phần này thành search/picker.
                    </div>
                </div>
            </div>

            {/* Upload */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="font-bold text-slate-900">Upload hợp đồng (PDF)</div>
                    <div className="text-xs text-slate-500">Tối đa 10MB • PDF</div>
                </div>

                {!file ? (
                    <label
                        className="block border-2 border-dashed border-slate-200 rounded-2xl p-8 cursor-pointer hover:border-slate-300 transition">
                        <input
                            type="file"
                            accept="application/pdf,.pdf"
                            className="hidden"
                            onChange={(e) => onPickFile(e.target.files?.[0])}
                        />
                        <div className="text-center space-y-2">
                            <div
                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 text-sm">
                                <Upload size={16}/> Chọn file PDF
                            </div>
                            <div className="text-sm text-slate-600">
                                File sẽ upload vào endpoint HR upload contract (type = <b>{DOC_TYPE}</b>).
                            </div>
                        </div>
                    </label>
                ) : (
                    <div className="space-y-3">
                        <div
                            className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                            <div>
                                <div className="font-semibold text-slate-900">{file.name}</div>
                                <div className="text-sm text-slate-600">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                </div>
                            </div>
                            <button
                                onClick={clearFile}
                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-white text-sm"
                            >
                                <XCircle size={16}/> Bỏ file
                            </button>
                        </div>

                        {previewUrl && (
                            <div className="border border-slate-200 rounded-2xl overflow-hidden">
                                <embed src={previewUrl} type="application/pdf" width="100%" height="520px"/>
                            </div>
                        )}

                        <button
                            onClick={handleUpload}
                            disabled={uploading}
                            className="w-full h-11 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 disabled:opacity-50"
                        >
                            {uploading ? "Đang upload..." : "Upload hợp đồng"}
                        </button>
                    </div>
                )}
            </div>

            {/* List */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                    <div className="font-bold text-slate-900">Hợp đồng đã tải lên</div>
                    <button
                        onClick={() => fetchDocs(String(internId).trim())}
                        disabled={!String(internId).trim() || loadingList}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-sm disabled:opacity-50"
                    >
                        Refresh
                    </button>
                </div>

                {loadingList ? (
                    <div className="text-sm text-slate-600">Đang tải dữ liệu...</div>
                ) : !String(internId).trim() ? (
                    <div className="text-sm text-slate-600">Nhập internId để xem danh sách tài liệu.</div>
                ) : contractDocs.length === 0 ? (
                    <div className="text-sm text-slate-600">Chưa có hợp đồng cho intern này.</div>
                ) : (
                    <div className="overflow-auto border border-slate-200 rounded-2xl">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50">
                            <tr className="text-left">
                                <th className="p-3 font-semibold text-slate-700">ID</th>
                                <th className="p-3 font-semibold text-slate-700">Status</th>
                                <th className="p-3 font-semibold text-slate-700">UploadedAt</th>
                                <th className="p-3 font-semibold text-slate-700">FileUrl</th>
                                <th className="p-3 font-semibold text-slate-700">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                            {contractDocs.map((d) => (
                                <tr key={d.id} className="hover:bg-slate-50">
                                    <td className="p-3 font-semibold text-slate-900">{d.id}</td>
                                    <td className="p-3">
                      <span className="inline-flex px-2 py-1 text-xs font-bold rounded-lg border border-slate-200">
                        {d.status || "-"}
                      </span>
                                    </td>
                                    <td className="p-3 text-slate-700">{formatDateTime(d.uploadedAt)}</td>
                                    <td className="p-3 text-slate-600 max-w-[420px] truncate">
                                        {d.fileUrl || "-"}
                                    </td>
                                    <td className="p-3">
                                        <button
                                            onClick={() => handleDownload(d)}
                                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-white"
                                            title="Download"
                                        >
                                            <Download size={16}/> Tải xuống
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
