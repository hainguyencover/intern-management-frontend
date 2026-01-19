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
            setForm({ applicationId: "", file: null });
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
            </form>
        </div>
    );
}
