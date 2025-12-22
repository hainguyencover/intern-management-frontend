import React, {useMemo, useState} from "react";

const empty = {
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    university: "",
    major: "",
    address: "",
    startDate: "",
    endDate: "",
    studentCode: "",
};

export default function InternForm({
                                       mode = "create",
                                       initialValues,
                                       resetKey,
                                       submitting = false,
                                       serverErrors = {},
                                       onSubmit,
                                       onCancel,
                                       submitText,
                                   }) {
    const [form, setForm] = useState({...empty, ...initialValues});
    const [touched, setTouched] = useState({});
    const [localErrors, setLocalErrors] = useState({});

    React.useEffect(() => {
        setForm({...empty, ...(initialValues || {})});
        setTouched({});
        setLocalErrors({});
    }, [resetKey]);

    const validate = useMemo(() => {
        const e = {};
        if (!form.fullName.trim()) e.fullName = "Full name is required";
        if (!form.email.trim()) e.email = "Email is required";
        if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Invalid email format";
        if (!form.studentCode.trim()) e.studentCode = "Student code is required";
        if (!form.university.trim()) e.university = "University is required";
        if (!form.major.trim()) e.major = "Major is required";
        if (!form.startDate) e.startDate = "Start date is required";
        if (!form.endDate) e.endDate = "End date is required";
        if (form.startDate && form.endDate && form.startDate > form.endDate) {
            e.endDate = "End date must be after start date";
        }
        return e;
    }, [form]);

    const set = (k) => (ev) => {
        const v = ev.target.value;
        setForm((p) => ({...p, [k]: v}));
        setTouched((p) => ({...p, [k]: true}));
        setLocalErrors((p) => ({...p, [k]: ""}));
    };

    const submit = async (e) => {
        e.preventDefault();

        setTouched({
            fullName: true,
            email: true,
            phone: true,
            dob: true,
            university: true,
            major: true,
            address: true,
            startDate: true,
            endDate: true,
            studentCode: true,
        });

        if (Object.keys(validate).length > 0) {
            setLocalErrors(validate);
            return;
        }

        const payload = {
            fullName: form.fullName.trim(),
            email: form.email.trim().toLowerCase(),
            phone: form.phone.trim() || null,
            dob: form.dob || null,
            university: form.university.trim(),
            major: form.major.trim(),
            address: form.address.trim() || null,
            startDate: form.startDate,
            endDate: form.endDate,
            studentCode: form.studentCode.trim(),
        };

        await onSubmit(payload);
    };

    const fieldErrorText = (name) => {
        const showLocal = touched[name] && (localErrors[name] || validate[name]);
        const local = showLocal ? (localErrors[name] || validate[name]) : "";
        const server = serverErrors?.[name] || "";
        return server || local || "";
    };

    const inputClass = (name) => {
        const hasErr = Boolean(serverErrors?.[name] || (touched[name] && validate[name]));
        return [
            "w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none",
            "placeholder:text-slate-400 focus:ring-4",
            hasErr
                ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
                : "border-slate-200 focus:border-slate-400 focus:ring-slate-100",
        ].join(" ");
    };

    const renderField = (label, name, type = "text", placeholder) => (
        <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">{label}</label>
            <input
                type={type}
                value={form[name] ?? ""}
                onChange={set(name)}
                placeholder={placeholder}
                className={inputClass(name)}
            />
            {fieldErrorText(name) ? (
                <div className="text-xs font-medium text-rose-700">{fieldErrorText(name)}</div>
            ) : null}
        </div>
    );

    return (
        <form onSubmit={submit} className="grid gap-4">
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="text-base font-extrabold text-slate-900">
                    {mode === "create" ? "Basic Information" : "Edit Basic Information"}
                </h3>

                <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                    {renderField("Full name *", "fullName", "text", "Nguyen Van A")}
                    {renderField("Email *", "email", "text", "intern@example.com")}
                    {renderField("Student code *", "studentCode", "text", "SE123456")}
                    {renderField("Phone", "phone", "text", "0900000000")}
                    {renderField("Date of birth", "dob", "date")}
                </div>

                <div className="mt-3 space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Address</label>
                    <input
                        value={form.address}
                        onChange={set("address")}
                        placeholder="Ho Chi Minh City..."
                        className={inputClass("address")}
                    />
                    {fieldErrorText("address") ? (
                        <div className="text-xs font-medium text-rose-700">{fieldErrorText("address")}</div>
                    ) : null}
                </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="text-base font-extrabold text-slate-900">Internship</h3>

                <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                    {renderField("University *", "university", "text", "HCMUT")}
                    {renderField("Major *", "major", "text", "Software Engineering")}
                    {renderField("Start date *", "startDate", "date")}
                    {renderField("End date *", "endDate", "date")}

                </div>
            </section>

            <div className="flex justify-end gap-2">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={submitting}
                    className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {submitting ? "Saving..." : submitText || (mode === "create" ? "Create" : "Save")}
                </button>
            </div>
        </form>
    );
}
