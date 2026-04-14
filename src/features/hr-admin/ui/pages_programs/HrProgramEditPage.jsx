import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProgramForm from "@/features/hr-admin/ui/pages_programs/ProgramForm";
import { hrGetProgramDetail, hrPublishProgram, hrUpdateProgram } from "@/api/hrProgramsApi.js";

export default function HrProgramEditPage() {
    const { id } = useParams();
    const nav = useNavigate();
    const [program, setProgram] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        hrGetProgramDetail(id).then(setProgram).catch(() => setProgram(null));
    }, [id]);

    const onSubmit = async (payload) => {
        try {
            setSubmitting(true);
            const updated = await hrUpdateProgram(id, payload);
            alert("Cập nhật thành công");
            setProgram(updated);
        } catch (e) {
            alert(e?.response?.data?.message || "Cập nhật thất bại");
        } finally {
            setSubmitting(false);
        }
    };

    const onPublish = async () => {
        try {
            setSubmitting(true);
            const updated = await hrPublishProgram(id);
            alert("Publish thành công");
            setProgram(updated);
        } catch (e) {
            alert(e?.response?.data?.message || "Publish thất bại");
        } finally {
            setSubmitting(false);
        }
    };

    if (!program) return <div style={{ padding: 16 }}>Đang tải...</div>;

    return (
        <div style={{ padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2>Chi tiết chương trình #{program.id}</h2>
                <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => nav(`/hr/programs/${program.id}/groups`)}>Phân công</button>
                </div>
            </div>

            <div style={{ margin: "8px 0" }}>
                <b>Status:</b> {program.status} — <b>Department:</b> {program.departmentName || program.departmentId}
            </div>

            <ProgramForm
                initialValue={{
                    departmentId: program.departmentId,
                    name: program.name,
                    description: program.description || "",
                    startDate: program.startDate || "",
                    endDate: program.endDate || "",
                }}
                onSubmit={onSubmit}
                submitting={submitting}
            />
        </div>
    );
}
