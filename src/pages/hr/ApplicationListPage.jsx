import {useEffect, useState} from "react";
import {hrListApplications} from "../../api/hrApplications";
import {Link} from "react-router-dom";

const STATUS = ["", "SUBMITTED", "APPROVED", "REJECTED", "DRAFT"];

export default function ApplicationListPage() {
    const [status, setStatus] = useState("SUBMITTED");
    const [page, setPage] = useState(0);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    const load = async () => {
        setLoading(true);
        try {
            const res = await hrListApplications({page, size: 10, status});
            setData(res);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, [status, page]);

    return (
        <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Applications</h1>

                <select
                    value={status}
                    onChange={(e) => {
                        setPage(0);
                        setStatus(e.target.value);
                    }}
                    className="h-10 px-3 rounded-lg border border-slate-200"
                >
                    {STATUS.map(s => (
                        <option key={s} value={s}>
                            {s || "ALL"}
                        </option>
                    ))}
                </select>
            </div>

            <div className="rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50">
                    <tr>
                        <th className="text-left p-3">Intern</th>
                        <th className="text-left p-3">Email</th>
                        <th className="text-left p-3">Position</th>
                        <th className="text-left p-3">Applied At</th>
                        <th className="text-left p-3">Status</th>
                        <th className="text-left p-3">Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading && (
                        <tr>
                            <td className="p-3" colSpan={6}>Loading...</td>
                        </tr>
                    )}
                    {!loading && data?.content?.map(row => (
                        <tr key={row.id} className="border-t">
                            <td className="p-3">{row.internName}</td>
                            <td className="p-3">{row.internEmail}</td>
                            <td className="p-3">{row.position || "-"}</td>
                            <td className="p-3">{row.appliedAt ? new Date(row.appliedAt).toLocaleString() : "-"}</td>
                            <td className="p-3">{row.status}</td>
                            <td className="p-3">
                                <Link className="underline" to={`/hr/applications/${row.id}`}>View</Link>
                            </td>
                        </tr>
                    ))}
                    {!loading && (!data?.content || data.content.length === 0) && (
                        <tr>
                            <td className="p-3" colSpan={6}>No data</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {data && (
                <div className="flex items-center gap-2">
                    <button
                        disabled={data.first}
                        onClick={() => setPage(p => Math.max(0, p - 1))}
                        className="px-3 h-9 rounded-lg border disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <div className="text-sm">Page {data.number + 1} / {data.totalPages}</div>
                    <button
                        disabled={data.last}
                        onClick={() => setPage(p => p + 1)}
                        className="px-3 h-9 rounded-lg border disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
