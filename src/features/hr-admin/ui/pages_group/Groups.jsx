import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { programService } from "@/services/programService.js";
import { toast } from "sonner";
import * as PropTypes from "prop-types";
import axiosClient from "@/api/axiosClient.js";

export default function Groups() {
    const navigate = useNavigate();
    const [programs, setPrograms] = useState([]);
    const [selectedProgram, setSelectedProgram] = useState("");
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);

    useEffect(() => {
        fetchPrograms();
    }, []);

    useEffect(() => {
        if (selectedProgram) {
            fetchGroups();
        } else {
            setGroups([]);
        }
    }, [selectedProgram]);

    const fetchPrograms = async () => {
        try {
            const response = await programService.list({ status: "ACTIVE", size: 100 });
            setPrograms(response.data.content || []);
        } catch (error) {
            toast.error("Không thể tải danh sách chương trình");
        }
    };

    const fetchGroups = async () => {
        try {
            setLoading(true);
            const response = await programService.getGroups(selectedProgram);
            setGroups(response.data || []);
        } catch (error) {
            toast.error("Không thể tải danh sách nhóm");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteGroup = async (groupId) => {
        if (!window.confirm("Bạn có chắc muốn xóa nhóm này?")) return;

        try {
            await programService.deleteGroup(groupId);
            toast.success("Đã xóa nhóm");
            fetchGroups();
        } catch (error) {
            toast.error(error.response?.data?.message || "Không thể xóa nhóm");
        }
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Quản lý nhóm thực tập</h1>
                    <p className="mt-1 text-sm text-slate-600">
                        Tạo nhóm và phân công thực tập sinh cho mentor
                    </p>
                </div>
            </div>

            {/* Program Selector */}
            <div className="rounded-2xl border bg-white p-4">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Chọn chương trình
                </label>
                <select
                    value={selectedProgram}
                    onChange={(e) => setSelectedProgram(e.target.value)}
                    className="h-10 w-full rounded-xl border px-3 text-sm outline-none focus:ring-2 focus:ring-blue-200 md:w-96"
                >
                    <option value="">-- Chọn chương trình --</option>
                    {programs.map((program) => (
                        <option key={program.id} value={program.id}>
                            {program.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Groups List */}
            {selectedProgram && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold text-slate-700">
                            Danh sách nhóm ({groups.length})
                        </div>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            + Tạo nhóm mới
                        </button>
                    </div>

                    {loading ? (
                        <div className="rounded-2xl border bg-white p-8 text-center text-sm text-slate-600">
                            Đang tải...
                        </div>
                    ) : groups.length === 0 ? (
                        <div className="rounded-2xl border bg-white p-8 text-center text-sm text-slate-600">
                            Chưa có nhóm nào. Nhấn "Tạo nhóm mới" để bắt đầu.
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {groups.map((group) => (
                                <div
                                    key={group.id}
                                    className="rounded-2xl border bg-white p-4 hover:shadow-md"
                                >
                                    <div className="mb-3 flex items-start justify-between">
                                        <div>
                                            <h3 className="font-semibold text-slate-900">{group.name}</h3>
                                            <p className="mt-1 text-xs text-slate-600">
                                                {group.totalMembers || 0} thành viên
                                            </p>
                                        </div>
                                        <span
                                            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${group.status === "ACTIVE"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-gray-100 text-gray-700"
                                                }`}
                                        >
                                            {group.status === "ACTIVE" ? "Hoạt động" : "Không hoạt động"}
                                        </span>
                                    </div>

                                    <div className="mb-3 text-sm text-slate-700">
                                        <div className="flex items-center gap-2">
                                            <span className="text-slate-500">Mentor:</span>
                                            <span className="font-medium">
                                                {group.mentorName || "Chưa gán"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => {
                                                setSelectedGroup(group);
                                                setShowAssignModal(true);
                                            }}
                                            className="flex-1 rounded-lg bg-blue-50 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-100"
                                        >
                                            Phân công
                                        </button>
                                        <button
                                            onClick={() => handleDeleteGroup(group.id)}
                                            className="rounded-lg border px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Create Group Modal */}
            {showCreateModal && (
                <CreateGroupModal
                    programId={selectedProgram}
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={() => {
                        setShowCreateModal(false);
                        fetchGroups();
                    }}
                />
            )}

            {/* Assign Interns Modal */}
            {showAssignModal && selectedGroup && (
                <AssignInternsModal
                    group={selectedGroup}
                    onClose={() => {
                        setShowAssignModal(false);
                        setSelectedGroup(null);
                    }}
                    onSuccess={() => {
                        setShowAssignModal(false);
                        setSelectedGroup(null);
                        fetchGroups();
                    }}
                />
            )}
        </div>
    );
}


function CreateGroupModal({ programId, onClose, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [mentors, setMentors] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        mentorId: "",
    });

    useEffect(() => {
        fetchMentors();
    }, []);

    const fetchMentors = async () => {
        try {
            const response = await axiosClient.get("/api/v1/mentors");
            setMentors(response.data || []);
        } catch (error) {
            console.error("Failed to fetch mentors:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name) {
            toast.error("Vui lòng nhập tên nhóm");
            return;
        }

        try {
            setLoading(true);
            await programService.createGroup({
                programId: parseInt(programId),
                name: formData.name,
                mentorId: formData.mentorId ? parseInt(formData.mentorId) : null,
            });
            toast.success("Đã tạo nhóm thành công");
            onSuccess();
        } catch (error) {
            toast.error(error.response?.data?.message || "Không thể tạo nhóm");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                <h2 className="text-lg font-semibold text-slate-900">Tạo nhóm mới</h2>
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Tên nhóm <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="h-10 w-full rounded-xl border px-3 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                            placeholder="Ví dụ: Nhóm Frontend"
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Mentor
                        </label>
                        <select
                            value={formData.mentorId}
                            onChange={(e) => setFormData({ ...formData, mentorId: e.target.value })}
                            className="h-10 w-full rounded-xl border px-3 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                        >
                            <option value="">-- Chọn mentor (tuỳ chọn) --</option>
                            {mentors.map((mentor) => (
                                <option key={mentor.id} value={mentor.id}>
                                    {mentor.user?.fullName || mentor.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                        >
                            {loading ? "Đang tạo..." : "Tạo nhóm"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function AssignInternsModal({ group, onClose, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [interns, setInterns] = useState([]);
    const [members, setMembers] = useState([]);
    const [selectedInterns, setSelectedInterns] = useState([]);

    useEffect(() => {
        fetchInterns();
        fetchMembers();
    }, []);

    const fetchInterns = async () => {
        try {
            const response = await axiosClient.get("/api/v1/interns/search", {
                params: { size: 100 },
            });
            setInterns(response.data.content || []);
        } catch (error) {
            console.error("Failed to fetch interns:", error);
        }
    };

    const fetchMembers = async () => {
        try {
            const response = await programService.getGroupMembers(group.id);
            setMembers(response.data || []);
        } catch (error) {
            console.error("Failed to fetch members:", error);
        }
    };

    const handleAssign = async () => {
        if (selectedInterns.length === 0) {
            toast.error("Vui lòng chọn ít nhất 1 thực tập sinh");
            return;
        }

        try {
            setLoading(true);
            await programService.assignInterns(group.id, selectedInterns);
            toast.success(`Đã phân công ${selectedInterns.length} thực tập sinh`);
            onSuccess();
        } catch (error) {
            toast.error(error.response?.data?.message || "Không thể phân công");
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (internId) => {
        if (!window.confirm("Bạn có chắc muốn gỡ thực tập sinh này khỏi nhóm?")) return;

        try {
            await programService.removeIntern(group.id, internId);
            toast.success("Đã gỡ thực tập sinh");
            fetchMembers();
        } catch (error) {
            toast.error("Không thể gỡ thực tập sinh");
        }
    };

    const memberIds = new Set(members.map((m) => m.internId));
    const availableInterns = interns.filter((i) => !memberIds.has(i.id));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl">
                <h2 className="text-lg font-semibold text-slate-900">
                    Phân công thực tập sinh - {group.name}
                </h2>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                    {/* Available Interns */}
                    <div>
                        <div className="mb-2 text-sm font-semibold text-slate-700">
                            Chọn thực tập sinh ({availableInterns.length})
                        </div>
                        <div className="max-h-80 space-y-2 overflow-y-auto rounded-xl border p-3">
                            {availableInterns.map((intern) => (
                                <label
                                    key={intern.id}
                                    className="flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-slate-50"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedInterns.includes(intern.id)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedInterns([...selectedInterns, intern.id]);
                                            } else {
                                                setSelectedInterns(
                                                    selectedInterns.filter((id) => id !== intern.id)
                                                );
                                            }
                                        }}
                                        className="h-4 w-4 rounded border-slate-300"
                                    />
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-slate-900">
                                            {intern.user?.fullName}
                                        </div>
                                        <div className="text-xs text-slate-600">
                                            {intern.university} - {intern.major}
                                        </div>
                                    </div>
                                </label>
                            ))}
                            {availableInterns.length === 0 && (
                                <div className="py-4 text-center text-sm text-slate-600">
                                    Không có thực tập sinh khả dụng
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Current Members */}
                    <div>
                        <div className="mb-2 text-sm font-semibold text-slate-700">
                            Thành viên hiện tại ({members.length})
                        </div>
                        <div className="max-h-80 space-y-2 overflow-y-auto rounded-xl border p-3">
                            {members.map((member) => (
                                <div
                                    key={member.id}
                                    className="flex items-center justify-between rounded-lg p-2 hover:bg-slate-50"
                                >
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-slate-900">
                                            {member.internName}
                                        </div>
                                        <div className="text-xs text-slate-600">
                                            {member.university} - {member.major}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleRemove(member.internId)}
                                        className="rounded-lg px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                                    >
                                        Gỡ
                                    </button>
                                </div>
                            ))}
                            {members.length === 0 && (
                                <div className="py-4 text-center text-sm text-slate-600">
                                    Chưa có thành viên
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="rounded-xl border px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        Đóng
                    </button>
                    <button
                        onClick={handleAssign}
                        disabled={loading || selectedInterns.length === 0}
                        className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                    >
                        {loading ? "Đang phân công..." : `Phân công (${selectedInterns.length})`}
                    </button>
                </div>
            </div>
        </div>
    );
}
