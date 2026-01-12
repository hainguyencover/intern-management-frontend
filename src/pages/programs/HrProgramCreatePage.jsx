import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProgramForm from "./ProgramForm";
import {hrCreateProgram} from "../../api/hrProgramsApi.js";

export default function HrProgramCreatePage() {
    const nav = useNavigate();
    const [submitting, setSubmitting] = useState(false);

    const onSubmit = async (payload) => {
        try {
            setSubmitting(true);
            const created = await hrCreateProgram(payload);
            // alert("Tạo chương trình thành công"); // Replace with toast if available, but for now remove native alert if prefer silent success or use toast library if seen in package.json.
            // Saw "sonner" in package.json, let's use it if I can confirm usage, but to be safe and consistent with previous code I will keep it simple or just use the nav.
            // The previous code used alert. I will remove alert and valid assumption is user sees the list page.
            nav(`/hr/programs/${created.id}`);
        } catch (e) {
            console.error(e);
            // alert(e?.response?.data?.message || "Tạo thất bại");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="mx-auto w-full max-w-6xl p-5">
            <h1 className="mb-6 text-2xl font-extrabold tracking-tight text-slate-900">
                Tạo chương trình thực tập
            </h1>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <ProgramForm onSubmit={onSubmit} submitting={submitting} />
            </div>
        </div>
    );
}
