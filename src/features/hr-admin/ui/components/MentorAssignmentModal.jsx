import React, { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import { internApi } from "@/features/intern/api/internApi";
import { listMentors } from "@/features/mentor/api/mentorApi";

export default function MentorAssignmentModal({
    isOpen,
    onClose,
    internId,
    currentMentorId,
    onSuccess,
    internName,
}) {
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [assigning, setAssigning] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedMentor, setSelectedMentor] = useState(currentMentorId || "");

    useEffect(() => {
        if (isOpen) {
            loadMentors();
            setSelectedMentor(currentMentorId ? String(currentMentorId) : "");
            setSearch("");
        }
    }, [isOpen, currentMentorId]);

    const loadMentors = async () => {
        setLoading(true);
        try {
            const data = await listMentors();
            // Handle both plain array and paginated response
            const list = Array.isArray(data) ? data : (data.content || []);
            setMentors(list);
        } catch (error) {
            console.error(error);
            toast.error("Không thể tải danh sách Mentor");
        } finally {
            setLoading(false);
        }
    };

    const filteredMentors = useMemo(() => {
        if (!search.trim()) return mentors;
        const lower = search.toLowerCase();
        return mentors.filter(
            (m) =>
                m.fullName?.toLowerCase().includes(lower) ||
                m.email?.toLowerCase().includes(lower) ||
                m.departmentName?.toLowerCase().includes(lower)
        );
    }, [mentors, search]);

    const handleAssign = async () => {
        if (!selectedMentor) {
            toast.warning("Vui lòng chọn Mentor");
            return;
        }

        try {
            setAssigning(true);
            await internApi.assignMentor(internId, Number(selectedMentor));
            toast.success("Phân công Mentor thành công");
            onSuccess?.();
            onClose();
        } catch (e) {
            console.error(e);
            toast.error(e?.response?.data?.message || "Phân công thất bại");
        } finally {
            setAssigning(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-lg flex flex-col max-h-[90vh] rounded-2xl bg-white shadow-xl animate-in zoom-in-95 duration-200 outline-none">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">
                            Phân công Mentor
                        </h3>
                        <p className="text-sm text-slate-500">
                            Cho thực tập sinh <span className="font-semibold text-slate-700">{internName}</span>
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Tìm kiếm mentor (tên, email, phòng ban)..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:bg-white focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                            autoFocus
                        />
                    </div>

                    {loading ? (
                        <div className="py-8 text-center text-sm text-slate-500">
                            Đang tải danh sách...
                        </div>
                    ) : mentors.length === 0 ? (
                        <div className="py-8 text-center text-sm text-slate-500">
                            Chưa có Mentor nào trong hệ thống.
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filteredMentors.length > 0 ? (
                                filteredMentors.map((m) => {
                                    const isSelected = String(selectedMentor) === String(m.id);
                                    return (
                                        <div
                                            key={m.id}
                                            onClick={() => setSelectedMentor(String(m.id))}
                                            className={`group flex cursor-pointer items-center justify-between rounded-xl border p-3 transition ${isSelected
                                                ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900"
                                                : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${isSelected ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
                                                    }`}>
                                                    {m.fullName?.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-slate-900">
                                                        {m.fullName}
                                                    </div>
                                                    <div className="text-xs text-slate-500">
                                                        {m.departmentName || "General"} • {m.email}
                                                    </div>
                                                </div>
                                            </div>
                                            {isSelected && (
                                                <div className="text-slate-900">
                                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="py-8 text-center text-sm text-slate-500">
                                    Không tìm thấy mentor nào khớp với "{search}".
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
                    <button
                        onClick={onClose}
                        disabled={assigning}
                        className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 disabled:opacity-50"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleAssign}
                        disabled={assigning || !selectedMentor}
                        className="rounded-xl bg-slate-900 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {assigning ? "Đang lưu..." : "Xác nhận phân công"}
                    </button>
                </div>
            </div>
        </div>
    );
}
