import {useMemo} from "react";
import {useParams, Link} from "react-router-dom";
import HrInternDocuments from "../../components/documents/HrInternDocuments.jsx";

export default function InternDetail() {
    const {internId} = useParams();

    // TODO: thay bằng auth/me
    const hrUserId = useMemo(() => {
        // ví dụ tạm: lưu trong localStorage
        const v = localStorage.getItem("hrUserId");
        return v ? Number(v) : 1;
    }, []);

    const parsedInternId = Number(internId);

    return (
        <div className="mx-auto w-full max-w-6xl p-4 space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-slate-900">Chi tiết thực tập sinh</h1>
                    <p className="text-sm text-slate-600">
                        Intern ID: <span className="font-semibold">{parsedInternId}</span>
                    </p>
                </div>

                <Link
                    to="/hr/interns"
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                >
                    ← Quay lại danh sách
                </Link>
            </div>

            {/* Sprint 2: tab Documents */}
            {Number.isFinite(parsedInternId) ? (
                <HrInternDocuments internId={parsedInternId} hrUserId={hrUserId}/>
            ) : (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                    internId không hợp lệ trên URL.
                </div>
            )}
        </div>
    );
}
