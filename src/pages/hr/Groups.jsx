import React, { useEffect, useState } from "react";
import { programService } from "../../services/programService";
import { programGroupService } from "../../services/programGroupService";

export default function Groups() {
    const [programs, setPrograms] = useState([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Form tạo group
    const [groupForm, setGroupForm] = useState({
        programId: "",
        name: "",
        status: "ACTIVE",
    });

    // Form assign intern
    const [assignForm, setAssignForm] = useState({
        groupId: "",
        internId: "",
    });

    useEffect(() => {
        programService
            .list()
            .then((res) => setPrograms(res.data || []))
            .catch(() => setPrograms([]));
    }, []);

    const createGroup = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!groupForm.programId) return setError("Vui lòng chọn chương trình.");
        if (!groupForm.name.trim()) return setError("Vui lòng nhập tên nhóm.");

        try {
            const res = await programGroupService.create({
                programId: Number(groupForm.programId),
                name: groupForm.name.trim(),
                status: groupForm.status,
            });

            // res.data có id group
            const created = res.data;
            setSuccess(`Tạo nhóm thành công! Group ID: ${created.id}`);
            setAssignForm((s) => ({ ...s, groupId: String(created.id) }));
            setGroupForm((s) => ({ ...s, name: "" }));
        } catch (err) {
            setError(err?.response?.data?.message || "Tạo nhóm thất bại.");
        }
    };

    const assignIntern = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const groupId = Number(assignForm.groupId);
        const internId = Number(assignForm.internId);

        if (!groupId) return setError("Vui lòng nhập Group ID.");
        if (!internId) return setError("Vui lòng nhập Intern ID (intern_profiles.id).");

        try {
            await programGroupService.assignIntern(groupId, internId);
            setSuccess("Assign intern thành công! Intern có thể xem My Schedule.");
        } catch (err) {
            setError(err?.response?.data?.message || "Assign thất bại.");
        }
    };

    return (
        <div className="p-6">
            <h1 className="mb-4 text-xl font-bold">Quản lý nhóm & gán thực tập sinh</h1>

            {error && (
                <div className="mb-3 rounded bg-red-50 p-3 text-red-700">{error}</div>
            )}
            {success && (
                <div className="mb-3 rounded bg-green-50 p-3 text-green-700">{success}</div>
            )}

            <div className="grid gap-4 lg:grid-cols-2">
                {/* Tạo group */}
                <div className="rounded border bg-white p-4">
                    <h2 className="mb-3 font-semibold">Tạo Program Group</h2>

                    <form onSubmit={createGroup} className="space-y-3">
                        <div>
                            <div className="text-sm text-slate-600">Chương trình</div>
                            <select
                                className="mt-1 w-full rounded border px-3 py-2"
                                value={groupForm.programId}
                                onChange={(e) =>
                                    setGroupForm((s) => ({ ...s, programId: e.target.value }))
                                }
                            >
                                <option value="">-- Chọn program --</option>
                                {programs.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        #{p.id} - {p.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <div className="text-sm text-slate-600">Tên nhóm</div>
                            <input
                                className="mt-1 w-full rounded border px-3 py-2"
                                placeholder="VD: Backend Team B"
                                value={groupForm.name}
                                onChange={(e) =>
                                    setGroupForm((s) => ({ ...s, name: e.target.value }))
                                }
                            />
                        </div>

                        <div>
                            <div className="text-sm text-slate-600">Trạng thái</div>
                            <select
                                className="mt-1 w-full rounded border px-3 py-2"
                                value={groupForm.status}
                                onChange={(e) =>
                                    setGroupForm((s) => ({ ...s, status: e.target.value }))
                                }
                            >
                                <option value="ACTIVE">ACTIVE</option>
                                <option value="INACTIVE">INACTIVE</option>
                            </select>
                        </div>

                        <button className="rounded bg-blue-600 px-4 py-2 text-white">
                            Tạo nhóm
                        </button>
                    </form>

                    <div className="mt-3 text-xs text-slate-500">
                        * Sau khi tạo nhóm thành công, Group ID sẽ tự điền qua form Assign.
                    </div>
                </div>

                {/* Assign intern */}
                <div className="rounded border bg-white p-4">
                    <h2 className="mb-3 font-semibold">Gán Intern vào Group</h2>

                    <form onSubmit={assignIntern} className="space-y-3">
                        <div>
                            <div className="text-sm text-slate-600">Group ID</div>
                            <input
                                className="mt-1 w-full rounded border px-3 py-2"
                                placeholder="VD: 1"
                                value={assignForm.groupId}
                                onChange={(e) =>
                                    setAssignForm((s) => ({ ...s, groupId: e.target.value }))
                                }
                            />
                        </div>

                        <div>
                            <div className="text-sm text-slate-600">
                                Intern ID (intern_profiles.id)
                            </div>
                            <input
                                className="mt-1 w-full rounded border px-3 py-2"
                                placeholder="VD: 1"
                                value={assignForm.internId}
                                onChange={(e) =>
                                    setAssignForm((s) => ({ ...s, internId: e.target.value }))
                                }
                            />
                        </div>

                        <button className="rounded bg-green-600 px-4 py-2 text-white">
                            Assign
                        </button>
                    </form>

                    <div className="mt-3 text-xs text-slate-500">
                        * internId là ID trong bảng <b>intern_profiles</b>.
                    </div>
                </div>
            </div>
        </div>
    );
}
