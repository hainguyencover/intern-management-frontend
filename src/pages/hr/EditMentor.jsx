import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MentorForm from "./MentorForm";
import { mentorApi, getMentorById } from "../../api/mentorApi";
import { toast } from "sonner";

export default function EditMentor() {
    const { id } = useParams();
    const nav = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [initialValues, setInitialValues] = useState(null);
    const [serverErrors, setServerErrors] = useState({});

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const data = await getMentorById(id);
                setInitialValues({
                    fullName: data.fullName,
                    email: data.email,
                    phone: data.phone || "",
                    departmentId: data.departmentId,
                    // username/password not editable here usually, or handled separately
                });
            } catch (e) {
                console.error(e);
                toast.error("Failed to load mentor details");
                nav("/hr/mentors");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id, nav]);

    const handleSubmit = async (values) => {
        setSubmitting(true);
        setServerErrors({});
        try {
            await mentorApi.update(id, values);
            toast.success("Mentor updated successfully");
            nav("/hr/mentors");
        } catch (e) {
            console.error(e);
            const data = e?.response?.data;
            if (data?.errors) setServerErrors(data.errors);
            toast.error(data?.message || "Failed to update mentor");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="mx-auto w-full max-w-4xl p-5">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                        Edit Mentor
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Update mentor information.
                    </p>
                </div>
                <button
                    onClick={() => nav("/hr/mentors")}
                    className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 transition hover:bg-slate-50"
                >
                    Back
                </button>
            </div>

            <div className="h-4" />

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <MentorForm
                    mode="edit"
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    onCancel={() => nav("/hr/mentors")}
                    submitting={submitting}
                    serverErrors={serverErrors}
                />
            </div>
        </div>
    );
}
