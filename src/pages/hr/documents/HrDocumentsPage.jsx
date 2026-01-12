import React, {useState} from "react";
import {Link} from "react-router-dom";
import HrInternDocuments from "../../../components/documents/HrInternDocuments";
import {useAuth} from "../../../auth/AuthContext";

export default function HrDocumentsPage() {
    const {user} = useAuth();
    const hrUserId = user?.id;
    const [internId, setInternId] = useState("");

    return (
        <div className="mx-auto w-full max-w-5xl space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">Documents (HR)</h1>
                        <p className="text-sm text-slate-600">
                            Nhập ID thực tập sinh để xem và duyệt tài liệu.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            placeholder="Intern ID"
                            value={internId}
                            onChange={(e) => setInternId(e.target.value)}
                            className="h-10 w-[160px] rounded-xl border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                        />

                        <Link
                            to="/hr/documents/contracts"
                            className="h-10 inline-flex items-center justify-center px-4 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800"
                        >
                            Upload hợp đồng
                        </Link>
                    </div>
                </div>
            </div>

            {internId ? (
                <HrInternDocuments internId={Number(internId)} hrUserId={hrUserId}/>
            ) : (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
                    Vui lòng nhập ID thực tập sinh để xem tài liệu.
                </div>
            )}
        </div>
    );
}
