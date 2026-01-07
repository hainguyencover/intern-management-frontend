import {useEffect, useState} from "react";
import {internGetMyApplications} from "../../api/internApplications";

const statusBadge = (status) => {
    const base = "inline-flex items-center px-2 py-1 rounded-md text-xs border";
    if (status === "APPROVED") return <span className={`${base}`}>APPROVED</span>;
    if (status === "REJECTED") return <span className={`${base}`}>REJECTED</span>;
    if (status === "SUBMITTED") return <span className={`${base}`}>SUBMITTED</span>;
    return <span className={`${base}`}>{status}</span>;
};

export default function InternApplicationsPage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const load = async () => {
        setLoading(true);
        try {
            const res = await internGetMyApplications();
            setData(res || []);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-xl font-semibold">Hồ sơ ứng tuyển của tôi</h1>

            <div className="rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50">
                    <tr>
                        <th className="text-left p-3">Vị trí</th>
                        <th className="text-left p-3">Ngày nộp</th>
                        <th className="text-left p-3">Trạng thái</th>
                        <th className="text-left p-3">Ghi chú</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading && (
                        <tr>
                            <td className="p-3" colSpan={4}>Loading...</td>
                        </tr>
                    )}

                    {!loading && data.map((row) => (
                        <tr key={row.id} className="border-t">
                            <td className="p-3">{row.position || "-"}</td>
                            <td className="p-3">{row.appliedAt ? new Date(row.appliedAt).toLocaleString() : "-"}</td>
                            <td className="p-3">{statusBadge(row.status)}</td>
                            <td className="p-3">{row.note || "-"}</td>
                        </tr>
                    ))}

                    {!loading && data.length === 0 && (
                        <tr>
                            <td className="p-3" colSpan={4}>Bạn chưa nộp hồ sơ nào.</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* Gợi ý UX nhỏ */}
            {data.some(a => a.status === "APPROVED") && (
                <div className="text-sm text-slate-600">
                    Bạn đã được duyệt. Vui lòng chờ HR gửi hợp đồng (phần Part 3) hoặc kiểm tra mục Hợp đồng.
                </div>
            )}
            {data.some(a => a.status === "REJECTED") && (
                <div className="text-sm text-slate-600">
                    Có hồ sơ bị từ chối. Bạn có thể nộp lại nếu hệ thống cho phép (tuỳ rule).
                </div>
            )}
        </div>
    );
}
