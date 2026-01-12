import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import HrInternDocuments from "../../components/documents/HrInternDocuments.jsx";
import { internApi } from "../../api/internApi.js";
import { toast } from "sonner";
import MentorAssignmentModal from "../../components/hr/MentorAssignmentModal.jsx";

import { mentorApi } from "../../api/mentorApi.js";

export default function InternDetail() {
    const { internId } = useParams();
    const parsedInternId = Number(internId);

    // Data state
    const [intern, setIntern] = useState(null);
    const [loading, setLoading] = useState(false);

    // Mentor assignment state
    const [showAssignModal, setShowAssignModal] = useState(false);

    // Mock HR ID
    const hrUserId = useMemo(() => {
        const v = localStorage.getItem("hrUserId");
        return v ? Number(v) : 1;
    }, []);

    const fetchIntern = async () => {
        try {
            setLoading(true);
            const res = await internApi.getById(parsedInternId);
            let internData = res.data;

            // Fix missing mentorName if mentorId exists
            if (internData.mentorId && !internData.mentorName) {
                try {
                    const mentorRes = await mentorApi.get(internData.mentorId);
                    if (mentorRes && mentorRes.fullName) {
                        internData = { ...internData, mentorName: mentorRes.fullName };
                    }
                } catch (err) {
                    console.error("Failed to fetch mentor details", err);
                }
            }

            setIntern(internData);
        } catch (error) {
            console.error(error);
            toast.error("Không thể tải thông tin thực tập sinh");
        } finally {
            setLoading(false);
        }
    };

    const handleAssignSuccess = () => {
        fetchIntern();
    };

    useEffect(() => {
        if (parsedInternId) fetchIntern();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [parsedInternId]);

    if (!parsedInternId) {
        return (
            <div className="mx-auto max-w-6xl p-5">
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                    ID thực tập sinh không hợp lệ.
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-6xl p-5 space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                        Chi tiết thực tập sinh
                    </h1>
                    <Link to="/hr/interns" className="text-sm font-semibold text-slate-500 hover:text-slate-700">
                        ← Quay lại danh sách
                    </Link>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setShowAssignModal(true)}
                        className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                    >
                        {intern?.mentorId ? "Thay đổi Mentor" : "Phân công Mentor"}
                    </button>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Left Column: Info Card */}
                <div className="lg:col-span-1">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-bold text-slate-900">Thông tin chung</h2>
                        {loading ? (
                            <div className="text-sm text-slate-500">Loading...</div>
                        ) : intern ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-400">Họ và tên</label>
                                    <div className="mt-1 font-semibold text-slate-900">{intern.fullName}</div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-400">Email</label>
                                    <div className="mt-1 text-slate-700">{intern.email}</div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-400">Số điện thoại</label>
                                    <div className="mt-1 text-slate-700">{intern.phone || "---"}</div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-400">Trường</label>
                                    <div className="mt-1 text-slate-700">{intern.university}</div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-400">Chuyên ngành</label>
                                    <div className="mt-1 text-slate-700">{intern.major}</div>
                                </div>
                                <div className="pt-4 border-t border-slate-100">
                                    <label className="block text-xs font-bold uppercase text-slate-400">Mentor hướng dẫn</label>
                                    {intern.mentorName ? (
                                        <div className="mt-1 flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                                            <span className="font-semibold text-slate-900">{intern.mentorName}</span>
                                        </div>
                                    ) : (
                                        <div className="mt-1 flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-slate-300"></div>
                                            <span className="text-slate-500 italic">Chưa phân công</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="text-sm text-slate-500">Không tìm thấy dữ liệu.</div>
                        )}
                    </div>
                </div>

                {/* Right Column: Documents & Others */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Documents */}
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                            <h2 className="text-base font-bold text-slate-900">Tài liệu & Hồ sơ</h2>
                        </div>
                        <div className="p-6">
                            <HrInternDocuments internId={parsedInternId} hrUserId={hrUserId} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Assign Mentor Modal */}
            <MentorAssignmentModal
                isOpen={showAssignModal}
                onClose={() => setShowAssignModal(false)}
                internId={parsedInternId}
                currentMentorId={intern?.mentorId}
                onSuccess={handleAssignSuccess}
                internName={intern?.fullName}
            />
        </div>
    );
}
