import React, {useState} from "react";
import HrInternDocuments from "../../components/documents/HrInternDocuments";
import {useAuth} from "../../auth/AuthContext";

export default function HrDocumentsPage() {
    const {user} = useAuth();
    const hrUserId = user?.id;
    const [internId, setInternId] = useState("");

    return (
        <div className="mx-auto w-full max-w-4xl p-4">
            <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold">Quản lý tài liệu thực tập sinh</h1>
                    <p className="text-sm text-slate-600">Chọn ID thực tập sinh để xem và duyệt tài liệu.</p>
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        placeholder="Intern ID"
                        value={internId}
                        onChange={(e) => setInternId(e.target.value)}
                        className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
                    />
                </div>
            </div>

            {internId ? (
                <HrInternDocuments internId={Number(internId)} hrUserId={hrUserId} />
            ) : (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
                    Vui lòng nhập ID thực tập sinh để xem tài liệu.
                </div>
            )}
        </div>
    );
}

