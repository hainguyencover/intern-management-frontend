import React from "react";
import InternDocuments from "@/components/documents/InternDocuments.jsx";
import {useAuth} from "@/features/auth/model/AuthContext.jsx";

export default function InternDocumentsPage() {
    const { user } = useAuth();
    const internId = user?.id || null;

    return (
        <div className="mx-auto w-full max-w-4xl p-4">
            <div className="mb-4">
                <h1 className="text-xl font-bold">Tài liệu của tôi</h1>
                <p className="text-sm text-slate-600">Upload và quản lý CV, đơn xin thực tập của bạn.</p>
            </div>

            {internId ? (
                <InternDocuments internId={internId} />
            ) : (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
                    Không xác định được thực tập sinh. Vui lòng đăng nhập lại.
                </div>
            )}
        </div>
    );
}

