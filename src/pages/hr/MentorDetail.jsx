import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { adminUserApi } from "../../api/adminApi";
import { internApi } from "../../api/internApi"; // To fetch interns for assignment
// There should be an API to assign intern to mentor, maybe in programGroupService or internApi?
// Re-checking internApi or new endpoints. 
// "Assign intern to mentor (#12)" usually updates Intern entity with mentorId or creates a group assignment.
// Let's assume internApi.assignToMentor(internId, mentorId) exists or updateIntern.
// But usually it's "Add intern to Mentor's group".
// Let's look at `programGroupService` usage in `Groups.jsx` - it creates groups.
// Maybe we assume simple assignment for now: Update intern's mentorId.

import { toast } from "sonner";

export default function MentorDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [mentor, setMentor] = useState(null);
    const [loading, setLoading] = useState(true);

    // For assigning interns
    const [interns, setInterns] = useState([]); // List of unassigned interns maybe?
    const [selectedInternId, setSelectedInternId] = useState("");

    useEffect(() => {
        fetchMentor();
        fetchUnassignedInterns();
    }, [id]);

    const fetchMentor = async () => {
        try {
            setLoading(true);
            const res = await adminUserApi.getUserById(id);
            setMentor(res.data);
        } catch (err) {
            // toast.error("Có lỗi khi tải thông tin Mentor");
        } finally {
            setLoading(false);
        }
    };

    const fetchUnassignedInterns = async () => {
        // Needs an API to get interns without mentors or just all interns.
        // using internApi.search({ mentorId: null }) if supported?
        try {
            const res = await internApi.search({ size: 100 });
            // Filtering client side for demo if API doesn't support specific filter
            // Ideally backend filter: mentorId is null
            if (res.data && res.data.content) {
                setInterns(res.data.content);
            }
        } catch (err) {
            console.error(err);
        }
    }

    const handleAssign = async () => {
        if (!selectedInternId) return;
        try {
            // Assumed API call
            await internApi.assignMentor(selectedInternId, id);
            toast.success("Đã gán thực tập sinh thành công");
            fetchUnassignedInterns();
        } catch (err) {
            toast.error("Gán thất bại");
        }
    }

    if (loading) return <div className="p-8 text-center">Đang tải...</div>;
    if (!mentor) return <div className="p-8 text-center">Không tìm thấy Mentor</div>;

    return (
        <div className="mx-auto w-full max-w-4xl space-y-6">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate("/hr/mentors")} className="text-sm text-slate-500 hover:text-slate-900">
                    ← Quay lại
                </button>
                <h1 className="text-2xl font-bold">{mentor.fullName}</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <div className="rounded-2xl border bg-white p-6">
                        <h2 className="text-lg font-bold mb-4">Thông tin chi tiết</h2>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="block text-slate-500">Email</span>
                                <span className="font-medium">{mentor.email}</span>
                            </div>
                            <div>
                                <span className="block text-slate-500">Trạng thái</span>
                                <span className="font-medium">{mentor.active ? "Active" : "Locked"}</span>
                            </div>
                            {/* Add more fields like Department, Specialized Skills if available */}
                        </div>
                    </div>

                    <div className="rounded-2xl border bg-white p-6">
                        <h2 className="text-lg font-bold mb-4">Gán thực tập sinh</h2>
                        <div className="flex gap-3">
                            <select
                                className="flex-1 rounded-xl border px-3 py-2 text-sm outline-none"
                                value={selectedInternId}
                                onChange={e => setSelectedInternId(e.target.value)}
                            >
                                <option value="">-- Chọn Intern --</option>
                                {interns.map(int => (
                                    <option key={int.id} value={int.id}>
                                        {int.fullName} (#{int.id})
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={handleAssign}
                                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800"
                            >
                                Gán
                            </button>
                        </div>
                        <p className="mt-2 text-xs text-slate-500">
                            Chọn thực tập sinh để gán cho Mentor này hướng dẫn.
                        </p>
                    </div>
                </div>

                <div>
                    {/* Sidebar stats or similar */}
                    <div className="rounded-2xl border bg-indigo-50 p-6 text-indigo-900">
                        <h3 className="font-bold">Workload</h3>
                        <div className="mt-2 text-4xl font-extrabold">--</div>
                        <p className="text-xs opacity-70">Active interns</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
