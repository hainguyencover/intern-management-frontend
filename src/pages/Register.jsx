import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import axiosClient from "../api/axiosClient";
import {useNavigate, Link} from "react-router-dom";

const schema = yup.object({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    fullName: yup.string().required("Full name is required"),
    phone: yup.string().optional(),
    dob: yup.date().optional(),
    university: yup.string().required("University is required"),
    major: yup.string().required("Major is required"),
    address: yup.string().optional(),
    startDate: yup.date().required("Start date is required"),
    endDate: yup.date().required("End date is required").min(yup.ref('startDate'), "End date must be after start date"),
    studentCode: yup.string().required("Student code is required"),
    cv: yup.mixed().required("CV is required").test("fileSize", "File too large (max 10MB)", (value) => !value || value.size <= 10 * 1024 * 1024).test("fileType", "Only PDF allowed", (value) => !value || value.type === "application/pdf"),
    applicationLetter: yup.mixed().required("Application letter is required").test("fileSize", "File too large (max 10MB)", (value) => !value || value.size <= 10 * 1024 * 1024).test("fileType", "Only PDF allowed", (value) => !value || value.type === "application/pdf"),
});

export default function Register() {
    const navigate = useNavigate();
    const [serverErr, setServerErr] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: {errors},
        setValue,
        watch,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            email: "",
            password: "",
            fullName: "",
            phone: "",
            dob: "",
            university: "",
            major: "",
            address: "",
            startDate: "",
            endDate: "",
            studentCode: "",
            cv: null,
            applicationLetter: null,
        },
    });

    const cvFile = watch("cv");
    const appFile = watch("applicationLetter");

    const onSubmit = async (values) => {
        setServerErr("");
        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("email", values.email);
            formData.append("password", values.password);
            formData.append("fullName", values.fullName);
            formData.append("phone", values.phone || "");
            formData.append("dob", values.dob ? values.dob.toISOString().split('T')[0] : "");
            formData.append("university", values.university);
            formData.append("major", values.major);
            formData.append("address", values.address || "");
            formData.append("startDate", values.startDate.toISOString().split('T')[0]);
            formData.append("endDate", values.endDate.toISOString().split('T')[0]);
            formData.append("studentCode", values.studentCode);
            formData.append("cv", values.cv);
            formData.append("applicationLetter", values.applicationLetter);

            await axiosClient.post("/auth/register", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            navigate("/login", {replace: true});
        } catch (e) {
            setServerErr(e?.response?.data?.message || "Register failed");
        } finally {
            setSubmitting(false);
        }
    };

    const Field = ({label, error, children}) => (
        <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">{label}</label>
            {children}
            {error ? <div className="text-sm text-rose-700">{error}</div> : null}
        </div>
    );

    const inputClass =
        "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none " +
        "placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100";

    return (
        <div className="min-h-screen bg-slate-50 grid place-items-center p-4">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-extrabold text-slate-900">Register as Intern</h2>
                <p className="mt-1 text-sm text-slate-500">Sign up and submit your profile to join the internship program.</p>

                <form className="mt-5 space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="Full name *" error={errors.fullName?.message}>
                            <input className={inputClass} placeholder="Your name" {...register("fullName")} />
                        </Field>

                        <Field label="Email *" error={errors.email?.message}>
                            <input className={inputClass} placeholder="you@company.com" {...register("email")} />
                        </Field>

                        <Field label="Password *" error={errors.password?.message}>
                            <input type="password" className={inputClass} placeholder="••••••••" {...register("password")} />
                        </Field>

                        <Field label="Phone" error={errors.phone?.message}>
                            <input className={inputClass} placeholder="0900000000" {...register("phone")} />
                        </Field>

                        <Field label="Date of birth" error={errors.dob?.message}>
                            <input type="date" className={inputClass} {...register("dob")} />
                        </Field>

                        <Field label="Student code *" error={errors.studentCode?.message}>
                            <input className={inputClass} placeholder="SE123456" {...register("studentCode")} />
                        </Field>
                    </div>

                    <Field label="Address" error={errors.address?.message}>
                        <input className={inputClass} placeholder="Ho Chi Minh City..." {...register("address")} />
                    </Field>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="University *" error={errors.university?.message}>
                            <input className={inputClass} placeholder="HCMUT" {...register("university")} />
                        </Field>

                        <Field label="Major *" error={errors.major?.message}>
                            <input className={inputClass} placeholder="Software Engineering" {...register("major")} />
                        </Field>

                        <Field label="Start date *" error={errors.startDate?.message}>
                            <input type="date" className={inputClass} {...register("startDate")} />
                        </Field>

                        <Field label="End date *" error={errors.endDate?.message}>
                            <input type="date" className={inputClass} {...register("endDate")} />
                        </Field>
                    </div>

                    <Field label="CV (PDF) *" error={errors.cv?.message}>
                        <input
                            type="file"
                            accept=".pdf"
                            className={inputClass}
                            onChange={(e) => setValue("cv", e.target.files[0])}
                        />
                        {cvFile && <div className="text-xs text-slate-600">Selected: {cvFile.name}</div>}
                    </Field>

                    <Field label="Application Letter (PDF) *" error={errors.applicationLetter?.message}>
                        <input
                            type="file"
                            accept=".pdf"
                            className={inputClass}
                            onChange={(e) => setValue("applicationLetter", e.target.files[0])}
                        />
                        {appFile && <div className="text-xs text-slate-600">Selected: {appFile.name}</div>}
                    </Field>

                    {serverErr && (
                        <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                            {serverErr}
                        </div>
                    )}

                    <button
                        disabled={submitting}
                        className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {submitting ? "Registering..." : "Register and Submit"}
                    </button>

                    <Link
                        to="/login"
                        className="inline-flex w-full items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50"
                    >
                        Already have an account?
                    </Link>
                </form>
            </div>
        </div>
    );
}
