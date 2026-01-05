import React, { useEffect, useState } from "react";
import { scheduleService } from "../../services/scheduleService";

export default function MySchedule() {
    const [data, setData] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        scheduleService
            .mySchedule()
            .then((res) => setData(res.data))
            .catch((err) => {
                const msg =
                    err?.response?.data?.message ||
                    err?.response?.data?.error ||
                    "Không tìm thấy lịch thực tập";
                setError(msg);
            });
    }, []);

    return (
        <div className="p-6">
            <h1 className="mb-4 text-xl font-bold">Lịch thực tập của tôi</h1>

            {error && (
                <div className="rounded bg-red-50 p-3 text-red-700">
                    {error}
                </div>
            )}

            {!error && !data && <div>Đang tải...</div>}

            {data && (
                <div className="rounded border bg-white p-4 space-y-3">
                    <div>
                        <div className="text-sm text-slate-500">Chương trình</div>
                        <div className="font-semibold">{data.programName}</div>
                    </div>

                    <div>
                        <div className="text-sm text-slate-500">Nhóm</div>
                        <div className="font-semibold">{data.groupName}</div>
                    </div>

                    {(() => {
                        const start = data?.programStartDate ?? data?.internStartDate;
                        const end = data?.programEndDate ?? data?.internEndDate;

                        return (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-sm text-slate-500">Bắt đầu</div>
                                    <div className="font-semibold">{start || "-"}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-slate-500">Kết thúc</div>
                                    <div className="font-semibold">{end || "-"}</div>
                                </div>
                            </div>
                        );
                    })()}
                </div>
            )}

        </div>
    );
}
