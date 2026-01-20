import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { evaluationApi } from "../../api/evaluationApi";
import { mentorApi } from "../../api/mentorApi";
import { toast } from "sonner";

export default function EvaluationCreate() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [interns, setInterns] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        internId: searchParams.get("intern") || "",
        period: "MIDTERM", // WEEKLY, MIDTERM, FINAL
        skills: 5,
        attitude: 5,
        teamwork: 5,
        communication: 5,
        comment: "",
    });

    useEffect(() => {
        loadInterns();
    }, []);

    const loadInterns = async () => {
        try {
            const res = await mentorApi.getAssignedInterns({});
            setInterns(res.data.content || res.data || []);
        } catch (error) {
            console.error("Failed to load interns:", error);
            toast.error("Không thể tải danh sách thực tập sinh");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleScoreChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: parseInt(value) }));
    };

    const calculateAverageScore = () => {
        const { skills, attitude, teamwork, communication } = formData;
        return ((skills + attitude + teamwork + communication) / 4).toFixed(1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.internId) {
            toast.error("Vui lòng chọn thực tập sinh");
            return;
        }

        try {
            setLoading(true);
            const payload = {
                ...formData,
                score: Math.round(parseFloat(calculateAverageScore())),
            };
            await evaluationApi.createEvaluation(payload);
            toast.success("Đã tạo đánh giá");
            navigate("/mentor/evaluations");
        } catch (error) {
            console.error("Failed to create evaluation:", error);
            toast.error(error.response?.data?.message || "Không thể tạo đánh giá");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <div>
                <button
                    onClick={() => navigate(-1)}
                    className="text-sm font-semibold text-slate-600 hover:text-slate-900"
                >
                    ← Quay lại
                </button>
                <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                    Đánh giá thực tập sinh
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                    Đánh giá kỹ năng và thái độ làm việc
                </p>
            </div>

            <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-6">
                <div className="space-y-6">
                    {/* Chọn thực tập sinh */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Thực tập sinh <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="internId"
                            value={formData.internId}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                            required
                        >
                            <option value="">-- Chọn thực tập sinh --</option>
                            {interns.map((intern) => (
                                <option key={intern.id} value={intern.id}>
                                    {intern.fullName || intern.name} ({intern.email})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Loại đánh giá */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Loại đánh giá
                        </label>
                        <select
                            name="period"
                            value={formData.period}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                        >
                            <option value="WEEKLY">Tuần</option>
                            <option value="MIDTERM">Giữa kỳ</option>
                            <option value="FINAL">Cuối kỳ</option>
                        </select>
                    </div>

                    {/* Tiêu chí đánh giá */}
                    <div className="space-y-4 rounded-lg bg-slate-50 p-4">
                        <div className="text-sm font-semibold text-slate-900">
                            Tiêu chí đánh giá (thang điểm 1-10)
                        </div>

                        {/* Kỹ năng chuyên môn */}
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <label className="text-sm font-medium text-slate-700">
                                    Kỹ năng chuyên môn
                                </label>
                                <span className="text-lg font-bold text-blue-600">
                                    {formData.skills}
                                </span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={formData.skills}
                                onChange={(e) => handleScoreChange("skills", e.target.value)}
                                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-blue-200"
                            />
                            <div className="mt-1 flex justify-between text-xs text-slate-500">
                                <span>1 (Kém)</span>
                                <span>10 (Xuất sắc)</span>
                            </div>
                        </div>

                        {/* Thái độ làm việc */}
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <label className="text-sm font-medium text-slate-700">
                                    Thái độ làm việc
                                </label>
                                <span className="text-lg font-bold text-blue-600">
                                    {formData.attitude}
                                </span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={formData.attitude}
                                onChange={(e) => handleScoreChange("attitude", e.target.value)}
                                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-blue-200"
                            />
                            <div className="mt-1 flex justify-between text-xs text-slate-500">
                                <span>1 (Kém)</span>
                                <span>10 (Xuất sắc)</span>
                            </div>
                        </div>

                        {/* Làm việc nhóm */}
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <label className="text-sm font-medium text-slate-700">
                                    Làm việc nhóm
                                </label>
                                <span className="text-lg font-bold text-blue-600">
                                    {formData.teamwork}
                                </span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={formData.teamwork}
                                onChange={(e) => handleScoreChange("teamwork", e.target.value)}
                                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-blue-200"
                            />
                            <div className="mt-1 flex justify-between text-xs text-slate-500">
                                <span>1 (Kém)</span>
                                <span>10 (Xuất sắc)</span>
                            </div>
                        </div>

                        {/* Giao tiếp */}
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <label className="text-sm font-medium text-slate-700">
                                    Giao tiếp
                                </label>
                                <span className="text-lg font-bold text-blue-600">
                                    {formData.communication}
                                </span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={formData.communication}
                                onChange={(e) => handleScoreChange("communication", e.target.value)}
                                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-blue-200"
                            />
                            <div className="mt-1 flex justify-between text-xs text-slate-500">
                                <span>1 (Kém)</span>
                                <span>10 (Xuất sắc)</span>
                            </div>
                        </div>

                        {/* Điểm trung bình */}
                        <div className="mt-4 rounded-lg bg-white p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-slate-700">
                                    Điểm trung bình
                                </span>
                                <span className="text-2xl font-bold text-blue-600">
                                    {calculateAverageScore()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Nhận xét */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Nhận xét chi tiết
                        </label>
                        <textarea
                            name="comment"
                            value={formData.comment}
                            onChange={handleChange}
                            rows={5}
                            placeholder="Điểm mạnh, điểm cần cải thiện, gợi ý..."
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                        />
                    </div>
                </div>

                <div className="mt-6 flex gap-3">
                    <button
                        type="submit"
                        disabled={loading}
                        className="h-10 flex-1 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "Đang lưu..." : "Lưu đánh giá"}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="h-10 rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        Hủy
                    </button>
                </div>
            </form>
        </div>
    );
}
