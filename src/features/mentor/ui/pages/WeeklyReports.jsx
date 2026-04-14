import React, { useEffect, useState } from "react";
import { mentorApi } from "@/features/mentor/api/mentorApi";
import { reportApi } from "@/api/reportApi";
import { toast } from "sonner";
import ReportCard from "@/features/mentor/ui/components/ReportCard";

export default function WeeklyReports() {
    const [interns, setInterns] = useState([]);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedIntern, setSelectedIntern] = useState("");
    const [selectedReport, setSelectedReport] = useState(null);
    const [feedback, setFeedback] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadInterns();
    }, []);

    useEffect(() => {
        if (selectedIntern) {
            loadReports();
        }
    }, [selectedIntern]);

    const loadInterns = async () => {
        try {
            const res = await mentorApi.getAssignedInterns({});
            const internList = res.data.content || res.data || [];
            setInterns(internList);
            if (internList.length > 0 && !selectedIntern) {
                setSelectedIntern(internList[0].id);
            }
        } catch (error) {
            console.error("Failed to load interns:", error);
            toast.error("Không thể tải danh sách thực tập sinh");
        }
    };

    const loadReports = async () => {
        try {
            setLoading(true);
            const res = await reportApi.getInternReports(selectedIntern, {});
            setReports(res.data.content || res.data || []);
        } catch (error) {
            console.error("Failed to load reports:", error);
            toast.error("Không thể tải báo cáo");
        } finally {
            setLoading(false);
        }
    };

    const handleReportClick = (report) => {
        setSelectedReport(report);
        setFeedback(report.mentorFeedback || "");
    };

    const handleSubmitFeedback = async () => {
        if (!selectedReport) return;

        try {
            setSubmitting(true);
            await reportApi.addFeedback(selectedReport.id, {
                mentorComment: feedback,
                status: "REVIEWED",
            });
            toast.success("Đã gửi phản hồi");
            setSelectedReport(null);
            setFeedback("");
            loadReports();
        } catch (error) {
            console.error("Failed to submit feedback:", error);
            toast.error("Không thể gửi phản hồi");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    Báo cáo tuần
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                    Xem và phản hồi báo cáo của thực tập sinh
                </p>
            </div>

            {/* Chọn thực tập sinh */}
            <div className="rounded-xl border border-slate-200 bg-white p-4">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Chọn thực tập sinh
                </label>
                <select
                    value={selectedIntern}
                    onChange={(e) => setSelectedIntern(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200 md:w-96"
                >
                    <option value="">-- Chọn --</option>
                    {interns.map((intern) => (
                        <option key={intern.id} value={intern.id}>
                            {intern.fullName || intern.name} ({intern.email})
                        </option>
                    ))}
                </select>
            </div>

            {/* Danh sách báo cáo */}
            {loading ? (
                <div className="flex h-64 items-center justify-center">
                    <div className="text-slate-600">Đang tải...</div>
                </div>
            ) : reports.length === 0 ? (
                <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
                    <p className="text-sm text-slate-600">
                        {selectedIntern
                            ? "Thực tập sinh chưa nộp báo cáo nào"
                            : "Vui lòng chọn thực tập sinh"}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {reports.map((report) => (
                        <ReportCard
                            key={report.id}
                            report={report}
                            onClick={handleReportClick}
                        />
                    ))}
                </div>
            )}

            {/* Modal phản hồi */}
            {selectedReport && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
                        <div className="border-b border-slate-200 p-6">
                            <h3 className="text-lg font-semibold text-slate-900">
                                Báo cáo tuần {selectedReport.weekNumber || selectedReport.week}
                            </h3>
                            <p className="mt-1 text-sm text-slate-600">
                                {selectedReport.internName} •{" "}
                                {new Date(
                                    selectedReport.submittedAt || selectedReport.reportDate
                                ).toLocaleDateString("vi-VN")}
                            </p>
                        </div>

                        <div className="max-h-96 overflow-y-auto p-6">
                            <div className="space-y-4">
                                <div>
                                    <div className="text-sm font-semibold text-slate-700">
                                        Công việc đã hoàn thành
                                    </div>
                                    <div className="mt-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-900">
                                        {selectedReport.completedWork || selectedReport.content || "-"}
                                    </div>
                                </div>

                                {selectedReport.plannedWork && (
                                    <div>
                                        <div className="text-sm font-semibold text-slate-700">
                                            Kế hoạch tuần tới
                                        </div>
                                        <div className="mt-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-900">
                                            {selectedReport.plannedWork}
                                        </div>
                                    </div>
                                )}

                                {selectedReport.challenges && (
                                    <div>
                                        <div className="text-sm font-semibold text-slate-700">
                                            Khó khăn gặp phải
                                        </div>
                                        <div className="mt-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-900">
                                            {selectedReport.challenges}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Phản hồi của bạn
                                    </label>
                                    <textarea
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                        rows={5}
                                        placeholder="Nhập phản hồi, gợi ý, đánh giá..."
                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 border-t border-slate-200 p-6">
                            <button
                                onClick={() => {
                                    setSelectedReport(null);
                                    setFeedback("");
                                }}
                                disabled={submitting}
                                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleSubmitFeedback}
                                disabled={submitting}
                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                {submitting ? "Đang gửi..." : "Gửi phản hồi"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
