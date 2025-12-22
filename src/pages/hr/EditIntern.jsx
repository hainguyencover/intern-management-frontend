import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import InternForm from "./InternForm";
import {internApi} from "../../api/internApi";

export default function EditIntern() {
    const {id} = useParams();
    const nav = useNavigate();

    const [initialValues, setInitialValues] = useState(null);
    const [loading, setLoading] = useState(true);

    const [submitting, setSubmitting] = useState(false);
    const [serverErrors, setServerErrors] = useState({});
    const [message, setMessage] = useState("");

    useEffect(() => {
        const run = async () => {
            setLoading(true);
            setMessage("");
            try {
                const res = await internApi.getById(id);
                const d = res.data;
                setInitialValues({
                    fullName: d.fullName || "",
                    email: d.email || "",
                    phone: d.phone || "",
                    dob: d.dob || "",
                    university: d.university || "",
                    major: d.major || "",
                    address: d.address || "",
                    startDate: d.startDate || "",
                    endDate: d.endDate || "",
                });
            } catch (e) {
                setMessage(e?.response?.data?.message || "Failed to load intern");
            } finally {
                setLoading(false);
            }
        };
        run();
    }, [id]);

    const onSubmit = async (payload) => {
        setSubmitting(true);
        setServerErrors({});
        setMessage("");
        try {
            await internApi.update(id, payload);
            nav("/hr/interns", {replace: true});
        } catch (e) {
            const data = e?.response?.data;
            if (data?.errors) setServerErrors(data.errors);
            setMessage(data?.message || "Failed to update intern");
        } finally {
            setSubmitting(false);
        }
    };

    const isSuccess =
        message &&
        (message.toLowerCase().includes("updated") ||
            message.toLowerCase().includes("success"));

    return (
        <div className="mx-auto w-full max-w-4xl p-5">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                        Edit Intern
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">Update intern profile.</p>
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
                {loading && (
                    <div className="px-2 py-6 text-sm text-slate-600">Loading...</div>
                )}

                {!loading && initialValues && (
                    <InternForm
                        mode="edit"
                        resetKey={id}
                        initialValues={initialValues}
                        submitting={submitting}
                        serverErrors={serverErrors}
                        onSubmit={onSubmit}
                        onCancel={() => nav("/hr/interns")}
                        submitText="Save changes"
                    />
                )}

                {!loading && !initialValues && !message && (
                    <div className="px-2 py-6 text-sm text-slate-600">
                        No data to edit.
                    </div>
                )}
            </div>
        </div>
    );
}
