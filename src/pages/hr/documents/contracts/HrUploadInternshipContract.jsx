import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { documentApi as contractApi } from "../../../../api/contractApi.js";
import { hrListApplications } from "../../../../api/hrApplications";

export default function HrUploadInternshipContract() {
    const [loading, setLoading] = useState(false);
    const [approvedApps, setApprovedApps] = useState([]);
    const [form, setForm] = useState({
        applicationId: "",
        file: null,
    });

    const [documents, setDocuments] = useState([]);
    const [loadingDocs, setLoadingDocs] = useState(false);

    useEffect(() => {
        const fetchApproved = async () => {
            try {
                // Fetch approved applications (adjust size if needed)
                const res = await hrListApplications({ status: "APPROVED", size: 100 });
                setApprovedApps(res.content || []);
            } catch (err) {
                console.error("Failed to load approved applications", err);
            }
        };
        fetchApproved();
    }, []);

    // Fetch documents when application selected
    useEffect(() => {
        if (!form.applicationId) {
            setDocuments([]);
            return;
        }

        const selectedApp = approvedApps.find(app => String(app.id) === String(form.applicationId));
        if (selectedApp) {
            fetchDocuments(selectedApp.internId);
        }
    }, [form.applicationId, approvedApps]);

    const fetchDocuments = async (internId) => {
        try {
            setLoadingDocs(true);
            const res = await contractApi.getByIntern(internId);
            // Filter only contracts if needed, specifically INTERNSHIP_CONTRACT
            const contracts = res.data.filter(d => d.type === 'INTERNSHIP_CONTRACT' || d.type === 'CONTRACT');
            setDocuments(contracts);
        } catch (err) {
            console.error("Failed to load documents", err);
            // Don't toast error here to avoid spamming if just empty
        } finally {
            setLoadingDocs(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa file này không?")) return;
        try {
            await contractApi.delete(id);
            toast.success("Đã xóa file");

            // Refresh list
            const selectedApp = approvedApps.find(app => String(app.id) === String(form.applicationId));
            if (selectedApp) {
                fetchDocuments(selectedApp.internId);
            }
        } catch (err) {
            toast.error("Không thể xóa file");
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.file || !form.applicationId) {
            toast.error("Vui lòng điền đầy đủ thông tin");
            return;
        }

        const selectedApp = approvedApps.find(app => String(app.id) === String(form.applicationId));
        if (!selectedApp) {
            toast.error("Vui lòng chọn ứng viên hợp lệ");
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("file", form.file);
            formData.append("internId", selectedApp.internId);
            formData.append("type", "INTERNSHIP_CONTRACT");

            await contractApi.upload(formData);
            toast.success("Tải hợp đồng thành công");

            setForm({ ...form, file: null }); // Keep application selected to show list
            // Refresh list
            fetchDocuments(selectedApp.internId);
        } catch (err) {
            toast.error(err.response?.data?.message || "Tải hợp đồng thất bại");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto w-full max-w-2xl">
            <h1 className="text-2xl font-bold">Tải lên hợp đồng thực tập</h1>
            <p className="mt-1 text-sm text-slate-600">
                Upload file hợp đồng cho ứng viên đã được duyệt
            </p>

            <form onSubmit={handleSubmit} className="mt-6 rounded-2xl border bg-white p-6">
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-slate-700">
                            Chọn ứng viên (Đã duyệt) *
                        </label>
                        <select
                            required
                            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                            value={form.applicationId}
                            onChange={(e) => setForm({ ...form, applicationId: e.target.value })}
                        >
                            <option value="">-- Chọn hồ sơ --</option>
                            {approvedApps.map((app) => (
                                <option key={app.id} value={app.id}>
                                    {app.internName} - {app.position} (#{app.id})
                                </option>
                            ))}
                        </select>
                        {approvedApps.length === 0 && (
                            <p className="mt-1 text-xs text-amber-600">
                                Không tìm thấy hồ sơ nào đã được duyệt.
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="text-sm font-medium text-slate-700">File hợp đồng *</label>
                        <input
                            required
                            type="file"
                            accept=".pdf,.doc,.docx"
                            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                            onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
                        />
                        <p className="mt-1 text-xs text-slate-500">Chấp nhận: PDF, DOC, DOCX</p>
                    </div>
                </div>



                <div className="mt-6 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                    >
                        {loading ? "Đang tải lên..." : "Tải lên"}
                    </button>
                </div>
            </form >

            {/* Document List Section */}
            {
                form.applicationId && (
                    <div className="mt-8">
                        <h2 className="text-lg font-bold text-slate-800">Danh sách hợp đồng đã tải lên</h2>
                        <div className="mt-4 rounded-xl border bg-white overflow-hidden">
                            {loadingDocs ? (
                                <div className="p-4 text-center text-sm text-slate-500">Đang tải danh sách...</div>
                            ) : documents.length === 0 ? (
                                <div className="p-4 text-center text-sm text-slate-500">Chưa có hợp đồng nào.</div>
                            ) : (
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-50 text-slate-700">
                                        <tr>
                                            <th className="px-4 py-3 font-medium">Tên file</th>
                                            <th className="px-4 py-3 font-medium">Ngày upload</th>
                                            <th className="px-4 py-3 font-medium">Trạng thái</th>
                                            <th className="px-4 py-3 font-medium text-right">Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {documents.map((doc) => (
                                            <tr key={doc.id} className="hover:bg-slate-50">
                                                <td className="px-4 py-3 font-medium text-slate-900 max-w-[200px] truncate" title={doc.fileUrl}>
                                                    {doc.fileUrl.split('/').pop()}
                                                </td>
                                                <td className="px-4 py-3 text-slate-600">
                                                    {new Date(doc.uploadedAt).toLocaleString()}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${doc.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                                                        doc.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                                            'bg-amber-100 text-amber-700'
                                                        }`}>
                                                        {doc.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-right space-x-2">
                                                    <button
                                                        onClick={() => window.open(`http://localhost:8080/api/documents/${doc.id}/download`, '_blank')}
                                                        className="text-blue-600 hover:text-blue-800 hover:underline"
                                                    >
                                                        Tải về
                                                    </button>
                                                    {/* Optional: Add delete button if needed */}
                                                    <button
                                                        onClick={() => handleDelete(doc.id)}
                                                        className="text-red-500 hover:text-red-700 hover:underline"
                                                    >
                                                        Xóa
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                )
            }
        </div >
    );
}
