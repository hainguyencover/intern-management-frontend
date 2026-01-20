import React from "react";
import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";

export default function ReportCard({ report, onClick }) {
    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("vi-VN");
    };

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900">
                            Báo cáo tuần {report.weekNumber || report.week}
                        </h3>
                        <StatusBadge status={report.status} />
                    </div>

                    <div className="mt-2 space-y-1 text-sm">
                        <div className="text-slate-600">
                            <span className="font-medium">Thực tập sinh:</span>{" "}
                            {report.internName || `ID: ${report.internId}`}
                        </div>
                        <div className="text-slate-600">
                            <span className="font-medium">Ngày nộp:</span>{" "}
                            {formatDate(report.submittedAt || report.reportDate)}
                        </div>
                        {report.reviewedAt && (
                            <div className="text-slate-600">
                                <span className="font-medium">Đã xem:</span> {formatDate(report.reviewedAt)}
                            </div>
                        )}
                    </div>

                    {report.summary && (
                        <p className="mt-2 text-sm text-slate-600 line-clamp-2">{report.summary}</p>
                    )}

                    {report.mentorFeedback && (
                        <div className="mt-3 rounded-lg bg-blue-50 p-3">
                            <div className="text-xs font-semibold text-blue-900">Phản hồi của bạn:</div>
                            <p className="mt-1 text-sm text-blue-800 line-clamp-2">{report.mentorFeedback}</p>
                        </div>
                    )}
                </div>

                <div className="ml-4">
                    {onClick ? (
                        <button
                            onClick={() => onClick(report)}
                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            Xem & Phản hồi
                        </button>
                    ) : (
                        <Link
                            to={`/mentor/reports/${report.id}`}
                            className="inline-block rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            Xem chi tiết
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
