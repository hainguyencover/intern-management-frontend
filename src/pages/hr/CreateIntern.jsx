import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import InternForm from "./InternForm";
import {internApi} from "../../api/internApi";

export default function CreateIntern() {
    const nav = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [serverErrors, setServerErrors] = useState({});
    const [message, setMessage] = useState("");

    const onSubmit = async (payload) => {
        setSubmitting(true);
        setServerErrors({});
        setMessage("");
        try {
            await internApi.create(payload);
            nav("/hr/interns", {replace: true});
        } catch (e) {
            const data = e?.response?.data;
            if (data?.errors) setServerErrors(data.errors);
            setMessage(data?.message || "Failed to create intern");
        } finally {
            setSubmitting(false);
        }
    };

    const isSuccess =
        message &&
        (message.toLowerCase().includes("success") ||
            message.toLowerCase().includes("created"));

    return (
        <div className="mx-auto w-full max-w-4xl p-5">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                        Create Intern
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Add a new intern profile.
                    </p>
                </div>

                <button
                    onClick={() => nav(-1)}
                    className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 transition hover:bg-slate-50"
                >
                    Back
                </button>
            </div>

            <div className="h-4"/>

            {message && (
                <div
                    className={[
                        "mb-4 rounded-2xl border px-4 py-3 text-sm",
                        isSuccess
                            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                            : "border-rose-200 bg-rose-50 text-rose-800",
                    ].join(" ")}
                >
                    {message}
                </div>
            )}

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <InternForm
                    mode="create"
                    resetKey="create"
                    submitting={submitting}
                    serverErrors={serverErrors}
                    onSubmit={onSubmit}
                    onCancel={() => nav("/hr/interns")}
                />
            </div>
        </div>
    );
}
