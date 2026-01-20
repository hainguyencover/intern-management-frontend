import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { programGroupService } from "../../services/programGroupService";
import { programService } from "../../services/programService";
import { departmentApi } from "../../api/departmentApi";
import { mentorApi } from "../../api/mentorApi";
import { internApi } from "../../api/internApi";
import { toast } from "sonner";
import { Pencil, Users, Trash2, FileText, Clock, Calendar, MoreHorizontal } from "lucide-react";
import { Dropdown } from "antd";

const DAYS_OF_WEEK = [
    { value: "MONDAY", label: "Thứ 2" },
    { value: "TUESDAY", label: "Thứ 3" },
    { value: "WEDNESDAY", label: "Thứ 4" },
    { value: "THURSDAY", label: "Thứ 5" },
    { value: "FRIDAY", label: "Thứ 6" },
    { value: "SATURDAY", label: "Thứ 7" },
    { value: "SUNDAY", label: "Chủ nhật" },
];

export default function Groups() {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [programs, setPrograms] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [mentors, setMentors] = useState([]);
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingGroup, setEditingGroup] = useState(null);

    // Member Management State
    const [memberModalOpen, setMemberModalOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [members, setMembers] = useState([]);
    const [availableInterns, setAvailableInterns] = useState([]);
    const [internSearch, setInternSearch] = useState("");

    const [form, setForm] = useState({
        programId: "",
        name: "",
        departmentId: "",
        mentorId: "",
        workStartTime: "",
        workEndTime: "",
        workDays: [], // Array for UI, convert to string for API
    });

    const fetchGroups = async () => {
        try {
            setLoading(true);
            const res = await programGroupService.list({ size: 100 });
            setGroups(res.data.content || []);
        } catch (err) {
            console.error("Failed to load groups", err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch lists for dropdowns and groups
    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [progRes, deptRes, mentorRes] = await Promise.all([
                    programService.list({ size: 100 }),
                    departmentApi.getAll(),
                    mentorApi.list({ size: 100 })
                ]);
                setPrograms(progRes.data.content || []);
                setDepartments(deptRes.data || []);
                setMentors(mentorRes.data.content || []);

                await fetchGroups();
            } catch (err) {
                console.error("Failed to load options", err);
            }
        };
        fetchAll();
    }, []);

    const handleCreateOrUpdate = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...form, workDays: form.workDays.join(",") };
            if (editingGroup) {
                await programGroupService.update(editingGroup.id, payload);
                toast.success("Cập nhật nhóm thành công");
            } else {
                await programGroupService.create(payload);
                toast.success("Tạo nhóm thành công");
            }
            setShowModal(false);
            resetForm();
            fetchGroups();
        } catch (err) {
            const msg = err.response?.data?.message || (editingGroup ? "Cập nhật thất bại" : "Tạo nhóm thất bại");
            toast.error(msg);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await programGroupService.update(id, { status: newStatus });
            toast.success(`Đã cập nhật trạng thái: ${newStatus}`);
            fetchGroups();
        } catch (err) {
            toast.error("Không thể cập nhật trạng thái");
        }
    };

    const openCreate = () => {
        resetForm();
        setShowModal(true);
    };

    const openEdit = (g) => {
        setEditingGroup(g);
        setForm({
            programId: g.programId || "",
            name: g.name,
            departmentId: g.departmentId || "",
            mentorId: g.mentorId || "",
            workStartTime: g.workStartTime || "",
            workEndTime: g.workEndTime || "",
            workDays: g.workDays ? g.workDays.split(",") : [],
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setEditingGroup(null);
        setEditingGroup(null);
        setForm({
            programId: "",
            name: "",
            departmentId: "",
            mentorId: "",
            workStartTime: "",
            workEndTime: "",
            workDays: []
        });
    };

    const fetchMembers = async (groupId) => {
        try {
            const res = await programGroupService.getMembers(groupId);
            setMembers(res.data || []);
        } catch (err) {
            console.error("Failed to load members", err);
        }
    };

    const searchInterns = async (keyword = "") => {
        try {
            // Filter only AVAILABLE interns or allow reassignment? Usually AVAILABLE.
            // But let's just search first.
            const res = await internApi.search({ keyword, page: 0, size: 20, excludeBusy: true });
            setAvailableInterns(res.data.content || []);
        } catch (err) {
            console.error("Failed to search interns", err);
        }
    };

    const openMemberMgmt = (g) => {
        setSelectedGroup(g);
        setMembers([]);
        setInternSearch("");
        setMemberModalOpen(true);
        fetchMembers(g.id);
        searchInterns("");
    };

    const handleAssignIntern = async (internId) => {
        if (!selectedGroup) return;
        try {
            await programGroupService.assignIntern(selectedGroup.id, internId);
            toast.success("Đã thêm thực tập sinh vào nhóm");
            fetchMembers(selectedGroup.id);
            // Optionally refresh available list if status changes
        } catch (err) {
            toast.error(err.response?.data?.message || "Thêm thất bại");
        }
    };

    const handleRemoveMember = async (internId) => {
        if (!selectedGroup) return;
        if (!confirm("Bạn có chắc chắn muốn xóa thực tập sinh này khỏi nhóm?")) return;
        try {
            await programGroupService.removeMember(selectedGroup.id, internId);
            toast.success("Đã xóa thực tập sinh khỏi nhóm");
            fetchMembers(selectedGroup.id);
        } catch (err) {
            toast.error("Xóa thất bại");
        }
    };

    // Debounce search
    useEffect(() => {
        if (!memberModalOpen) return;
        const timer = setTimeout(() => {
            searchInterns(internSearch);
        }, 500);
        return () => clearTimeout(timer);
    }, [internSearch, memberModalOpen]);

    return (
        <div className="mx-auto w-full max-w-6xl space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Quản lý nhóm</h1>
                <button
                    onClick={openCreate}
                    className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                    + Tạo nhóm
                </button>
            </div>

            {loading ? (
                <div className="py-12 text-center text-sm text-slate-600">Đang tải...</div>
            ) : groups.length === 0 ? (
                <div className="py-12 text-center text-sm text-slate-600">Chưa có nhóm nào</div>
            ) : (
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 font-semibold text-slate-900">
                            <tr>
                                <th className="px-4 py-3">Tên nhóm</th>
                                <th className="px-4 py-3">Chương trình</th>
                                <th className="px-4 py-3">Khoa / Phòng ban</th>
                                <th className="px-4 py-3">Mentor</th>
                                <th className="px-4 py-3">Trạng thái</th>
                                <th className="px-4 py-3 text-right">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {groups.map((g) => {
                                const prog = programs.find(p => p.id === g.programId);
                                const dept = departments.find(d => d.id === g.departmentId);
                                const men = mentors.find(m => m.id === g.mentorId);
                                return (
                                    <tr key={g.id} className="hover:bg-slate-50">
                                        <td className="px-4 py-3 font-medium text-slate-900">{g.name}</td>
                                        <td className="px-4 py-3 text-slate-600">{prog?.name || g.programId}</td>
                                        <td className="px-4 py-3 text-slate-600">{dept?.name || g.departmentId || "—"}</td>
                                        <td className="px-4 py-3 text-slate-600">
                                            {men ? `${men.fullName} (${men.email})` : (g.mentorId || "—")}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${g.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'
                                                }`}>
                                                {g.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => openMemberMgmt(g)}
                                                    className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors mr-1"
                                                    title="Quản lý thành viên"
                                                >
                                                    <Users className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => openEdit(g)}
                                                    className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors mr-1"
                                                    title="Chỉnh sửa"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <Dropdown
                                                    menu={{
                                                        items: [
                                                            {
                                                                key: 'ACTIVE',
                                                                label: 'Kích hoạt / Mở lại',
                                                                disabled: g.status === 'ACTIVE',
                                                                onClick: () => handleStatusChange(g.id, 'ACTIVE')
                                                            },
                                                            {
                                                                key: 'CLOSED',
                                                                label: 'Đóng nhóm (Kết thúc)',
                                                                disabled: g.status === 'CLOSED',
                                                                danger: true,
                                                                onClick: () => handleStatusChange(g.id, 'CLOSED')
                                                            }
                                                        ]
                                                    }}
                                                    trigger={['click']}
                                                >
                                                    <button className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </button>
                                                </Dropdown>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl animate-in fade-in zoom-in duration-200">
                        <h3 className="text-lg font-semibold">
                            {editingGroup ? "Cập nhật nhóm" : "Tạo nhóm mới"}
                        </h3>
                        <form onSubmit={handleCreateOrUpdate} className="mt-4 space-y-3">
                            <div>
                                <label className="text-sm font-medium text-slate-700">Chương trình (Program) *</label>
                                <select
                                    required
                                    className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                                    value={form.programId}
                                    onChange={(e) => setForm({ ...form, programId: e.target.value })}
                                >
                                    <option value="">-- Chọn chương trình --</option>
                                    {programs.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-700">Tên nhóm *</label>
                                <input
                                    required
                                    className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-700">Phòng ban (Department)</label>
                                <select
                                    className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                                    value={form.departmentId}
                                    onChange={(e) => setForm({ ...form, departmentId: e.target.value })}
                                >
                                    <option value="">-- Chọn phòng ban --</option>
                                    {departments.map(d => (
                                        <option key={d.id} value={d.id}>{d.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-700">Mentor hướng dẫn</label>
                                <select
                                    className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                                    value={form.mentorId}
                                    onChange={(e) => setForm({ ...form, mentorId: e.target.value })}
                                >
                                    <option value="">-- Chọn Mentor --</option>
                                    {mentors.map(m => (
                                        <option key={m.id} value={m.id}>{m.fullName} ({m.email})</option>
                                    ))}
                                </select>
                            </div>

                            {/* Schedule Section */}
                            <div className="pt-2">
                                <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-800 mb-3 border-b pb-1">
                                    <Clock className="w-4 h-4" />
                                    Lịch làm việc linh hoạt
                                </h4>
                                <div className="grid grid-cols-2 gap-4 mb-3">
                                    <div>
                                        <label className="text-xs font-medium text-slate-600 mb-1 block">Giờ bắt đầu</label>
                                        <input
                                            type="time"
                                            className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                                            value={form.workStartTime}
                                            onChange={(e) => setForm({ ...form, workStartTime: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-slate-600 mb-1 block">Giờ kết thúc</label>
                                        <input
                                            type="time"
                                            className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                                            value={form.workEndTime}
                                            onChange={(e) => setForm({ ...form, workEndTime: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-slate-600 mb-2 block flex items-center gap-2">
                                        <Calendar className="w-3 h-3" />
                                        Ngày làm việc
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {DAYS_OF_WEEK.map((day) => {
                                            const isSelected = form.workDays.includes(day.value);
                                            return (
                                                <button
                                                    key={day.value}
                                                    type="button"
                                                    onClick={() => {
                                                        const newDays = isSelected
                                                            ? form.workDays.filter(d => d !== day.value)
                                                            : [...form.workDays, day.value];
                                                        setForm({ ...form, workDays: newDays });
                                                    }}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${isSelected
                                                        ? "bg-blue-50 border-blue-200 text-blue-700"
                                                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                                        }`}
                                                >
                                                    {day.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1.5">
                                        Chọn các ngày thực tập sinh cần có mặt.
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-slate-50"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                                >
                                    {editingGroup ? "Cập nhật" : "Tạo"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Member Management Modal */}
            {memberModalOpen && selectedGroup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-white p-6 shadow-xl animate-in fade-in zoom-in duration-200 flex flex-col">
                        <div className="flex items-center justify-between border-b pb-4">
                            <h3 className="text-lg font-semibold">
                                Quản lý thành viên - <span className="text-slate-600">{selectedGroup.name}</span>
                            </h3>
                            <button
                                onClick={() => setMemberModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="mt-4 flex flex-1 gap-6 overflow-hidden">
                            {/* Left: Current Members */}
                            <div className="flex-1 flex flex-col overflow-hidden border-r pr-6">
                                <h4 className="font-semibold text-slate-800 mb-3 flex items-center justify-between">
                                    Thành viên hiện tại
                                    <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full">{members.length}</span>
                                </h4>
                                <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                                    {members.length === 0 ? (
                                        <p className="text-sm text-slate-500 italic text-center py-8">Chưa có thành viên nào.</p>
                                    ) : (
                                        members.map(m => (
                                            <div key={m.internId} className="flex items-center justify-between rounded-lg border p-3 hover:bg-slate-50">
                                                <div>
                                                    <p className="font-medium text-sm text-slate-900">{m.internName}</p>
                                                    <p className="text-xs text-slate-500">{m.internEmail}</p>
                                                    <p className="text-xs text-slate-500">{m.studentCode}</p>
                                                </div>
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={() => navigate(`/hr/reports/final/${m.internId}`)}
                                                        className="p-1.5 text-blue-400 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                                                        title="Xem báo cáo tổng kết"
                                                    >
                                                        <FileText className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleRemoveMember(m.internId)}
                                                        className="p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                                                        title="Xóa khỏi nhóm"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Right: Add Member */}
                            <div className="flex-1 flex flex-col overflow-hidden">
                                <h4 className="font-semibold text-slate-800 mb-3">Thêm thành viên</h4>
                                <input
                                    className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200 mb-3"
                                    placeholder="Tìm kiếm intern theo tên, email, mssv..."
                                    value={internSearch}
                                    onChange={(e) => setInternSearch(e.target.value)}
                                />

                                <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                                    {availableInterns
                                        .filter(intern => !members.some(m => m.internId === intern.id))
                                        .length === 0 ? (
                                        <p className="text-sm text-slate-500 italic text-center py-8">
                                            {internSearch ? "Không tìm thấy kết quả mới." : "Nhập từ khóa để tìm kiếm."}
                                        </p>
                                    ) : (
                                        availableInterns
                                            .filter(intern => !members.some(m => m.internId === intern.id))
                                            .map(intern => (
                                                <div key={intern.id} className="flex items-center justify-between rounded-lg border border-dashed p-3 hover:bg-slate-50">
                                                    <div>
                                                        <p className="font-medium text-sm text-slate-900">{intern.fullName}</p>
                                                        <p className="text-xs text-slate-500">{intern.email} - {intern.studentCode}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleAssignIntern(intern.id)}
                                                        className="rounded-lg bg-slate-900 px-3 py-1 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
                                                    >
                                                        + Thêm
                                                    </button>
                                                </div>
                                            ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
