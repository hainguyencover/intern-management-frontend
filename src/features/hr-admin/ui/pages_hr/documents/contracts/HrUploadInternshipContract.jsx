import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { contractApi } from "@/api/contractApi.js";
import { hrListApplications } from "@/api/hrApplications";

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
                const res = await hrListApplications({ status: "APPROVED", size: 100 });
                setApprovedApps(res.content || []);
            } catch (err) {
                console.error("Failed to load approved applications", err);
            }
        };
        fetchApproved();
    }, []);

    useEffect(() => {
        if (!form.applicationId) {
            setDocuments([]);
            return;
        }
        fetchContractForApplication(form.applicationId);
    }, [form.applicationId]);

    const fetchContractForApplication = async (appId) => {
        try {
            setLoadingDocs(true);
            const res = await contractApi.getAll();
            const contracts = (res.data || []).filter(c => String(c.applicationId) === String(appId));
            setDocuments(contracts);
        } catch (err) {
            console.error("Failed to load contract", err);
        } finally {
            setLoadingDocs(false);
        }
    };

    const handleHrConfirm = async (contractId) => {
        try {
            await contractApi.confirmByHr(contractId);
            toast.success("HR xác nhận hợp đồng thành công!");
            fetchContractForApplication(form.applicationId);
        } catch (err) {
            toast.error(err.response?.data?.message || "Xác nhận hợp đồng thất bại");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.file || !form.applicationId) {
            toast.error("Vui lòng chọn hồ sơ ứng viên và file hợp đồng PDF");
            return;
        }

        if (!form.file.name.toLowerCase().endsWith(".pdf")) {
            toast.error("Chỉ chấp nhận file định dạng PDF (.pdf)");
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("file", form.file);

            await contractApi.uploadByHr(form.applicationId, formData);
            toast.success("Tải hợp đồng PDF thành công");

            setForm({ ...form, file: null });
            fetchContractForApplication(form.applicationId);
        } catch (err) {
            toast.error(err.response?.data?.message || "Tải hợp đồng thất bại");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto w-full max-w-2xl">
            <h1 className="text-2xl font-bold text-slate-900">Quản lý & Tải lên hợp đồng thực tập (US-009)</h1>
            <p className="mt-1 text-sm text-slate-600">
                Upload file hợp đồng PDF cho ứng viên đã được phê duyệt (APPROVED) và xác nhận phía HR.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-slate-700">
                            Chọn ứng viên (Trạng thái APPROVED) *
                        </label>
                        <select
                            required
                            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900"
                            value={form.applicationId}
                            onChange={(e) => setForm({ ...form, applicationId: e.target.value })}
                        >
                            <option value="">-- Chọn đơn ứng tuyển --</option>
                            {approvedApps.map((app) => (
                                <option key={app.id} value={app.id}>
                                    {app.internName} - {app.position} (Đơn #{app.id})
                                </option>
                            ))}
                        </select>
                        {approvedApps.length === 0 && (
                            <p className="mt-1 text-xs text-amber-600">
                                Chưa có hồ sơ ứng viên nào ở trạng thái đã được duyệt (APPROVED).
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="text-sm font-medium text-slate-700">File hợp đồng (Bắt buộc PDF) *</label>
                        <input
                            required
                            type="file"
                            accept="application/pdf,.pdf"
                            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900"
                            onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
                        />
                        <p className="mt-1 text-xs text-slate-500">Định dạng chấp nhận: PDF (Tối đa 10MB)</p>
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                    >
                        {loading ? "Đang tải lên..." : "Tải lên Hợp đồng PDF"}
                    </button>
                </div>
            </form>

            {/* Document List Section */}
            {form.applicationId && (
                <div className="mt-8">
                    <h2 className="text-lg font-bold text-slate-800">Thông tin hợp đồng đã gắn</h2>
                    <div className="mt-4 rounded-xl border bg-white overflow-hidden shadow-sm">
                        {loadingDocs ? (
                            <div className="p-4 text-center text-sm text-slate-500">Đang tải thông tin hợp đồng...</div>
                        ) : documents.length === 0 ? (
                            <div className="p-4 text-center text-sm text-slate-500">Chưa có hợp đồng nào được tải lên cho đơn này.</div>
                        ) : (
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-700">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">Tên file</th>
                                        <th className="px-4 py-3 font-medium">Xác nhận HR</th>
                                        <th className="px-4 py-3 font-medium">Xác nhận Intern</th>
                                        <th className="px-4 py-3 font-medium">Trạng thái</th>
                                        <th className="px-4 py-3 font-medium text-right">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {documents.map((doc) => (
                                        <tr key={doc.id} className="hover:bg-slate-50">
                                            <td className="px-4 py-3 font-medium text-slate-900 max-w-[180px] truncate" title={doc.fileName}>
                                                📄 {doc.fileName || 'contract.pdf'}
                                            </td>
                                            <td className="px-4 py-3 text-xs">
                                                {doc.hrConfirmedAt ? (
                                                    <span className="text-emerald-600 font-semibold">✓ Đã xác nhận</span>
                                                ) : (
                                                    <button
                                                        onClick={() => handleHrConfirm(doc.id)}
                                                        className="rounded-lg bg-blue-50 px-2 py-1 text-blue-700 font-medium hover:bg-blue-100"
                                                    >
                                                        Xác nhận (HR)
                                                    </button>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-xs">
                                                {doc.internConfirmedAt ? (
                                                    <span className="text-emerald-600 font-semibold">✓ Đã xác nhận</span>
                                                ) : (
                                                    <span className="text-amber-600 font-medium">Chưa xác nhận</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                                    doc.status === 'SIGNED' ? 'bg-emerald-100 text-emerald-800' :
                                                    doc.status === 'HR_CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                                                    doc.status === 'INTERN_CONFIRMED' ? 'bg-purple-100 text-purple-800' :
                                                    'bg-amber-100 text-amber-800'
                                                }`}>
                                                    {doc.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right space-x-2">
                                                <button
                                                    onClick={() => window.open(`/api/v1/contracts/${doc.id}/download`, '_blank')}
                                                    className="text-blue-600 hover:text-blue-800 hover:underline text-xs font-medium"
                                                >
                                                    Xem PDF
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
