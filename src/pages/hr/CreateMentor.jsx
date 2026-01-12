import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MentorForm from "./MentorForm";
import { mentorApi } from "../../api/mentorApi";
import { toast } from "sonner";

export default function CreateMentor() {
    const nav = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [serverErrors, setServerErrors] = useState({});

    const handleSubmit = async (values) => {
        setSubmitting(true);
        setServerErrors({});
        try {
            await mentorApi.create(values);
            toast.success("Mentor created successfully");
            nav("/hr/mentors");
        } catch (e) {
            console.error(e);
            const data = e?.response?.data;
            if (data?.errors) setServerErrors(data.errors);
            toast.error(data?.message || "Failed to create mentor");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="mx-auto w-full max-w-4xl p-5">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                        Create Mentor
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Add a new mentor to the system.
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
                    mode="create"
                    onSubmit={handleSubmit}
                    onCancel={() => nav("/hr/mentors")}
                    submitting={submitting}
                    serverErrors={serverErrors}
                />
            </div>
        </div>
    );
}
