import React, { useEffect, useState, useMemo } from "react";
import { departmentsApi } from "../../api/departmentsApi";

const empty = {
    fullName: "",
    email: "",
    phone: "",
    departmentId: "",
    username: "",
    password: "", // Only for create
};

export default function MentorForm({
    mode = "create",
    initialValues,
    onSubmit,
    onCancel,
    submitting,
    serverErrors = {},
}) {
    const [form, setForm] = useState(empty);
    const [touched, setTouched] = useState({});
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        if (initialValues) {
            setForm({ ...empty, ...initialValues });
        }
    }, [initialValues]);

    useEffect(() => {
        departmentsApi.getAll().then((res) => setDepartments(res.data || []));
    }, []);

    const validate = useMemo(() => {
        const e = {};
        if (!form.fullName.trim()) e.fullName = "Full name is required";
        if (!form.email.trim()) e.email = "Email is required";
        if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Invalid email";
        if (!form.departmentId) e.departmentId = "Department is required";
        if (mode === "create") {
            if (!form.username.trim()) e.username = "Username is required";
            if (!form.password) e.password = "Password is required";
        }
        return e;
    }, [form, mode]);

    const set = (k) => (ev) => {
        setForm((p) => ({ ...p, [k]: ev.target.value }));
        setTouched((p) => ({ ...p, [k]: true }));
    };

    const submit = (e) => {
        e.preventDefault();
        setTouched({
            fullName: true,
            email: true,
            phone: true,
            departmentId: true,
            username: true,
            password: true,
        });

        if (Object.keys(validate).length === 0) {
            onSubmit(form);
        }
    };

    const getError = (k) => {
        return (touched[k] && validate[k]) || serverErrors[k] || "";
    };

    const inputClass = (k) =>
        `w-full rounded-xl border px-3 py-2 text-sm outline-none transition ${getError(k)
            ? "border-rose-300 focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
            : "border-slate-200 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
        }`;

    return (
        <form onSubmit={submit} className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Full Name *</label>
                <input
                    value={form.fullName}
                    onChange={set("fullName")}
                    className={inputClass("fullName")}
                    placeholder="e.g. Nguyen Van Mentor"
                />
                {getError("fullName") && (
                    <div className="text-xs font-medium text-rose-600">{getError("fullName")}</div>
                )}
            </div>

            <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Email *</label>
                <input
                    value={form.email}
                    onChange={set("email")}
                    className={inputClass("email")}
                    placeholder="mentor@example.com"
                />
                {getError("email") && (
                    <div className="text-xs font-medium text-rose-600">{getError("email")}</div>
                )}
            </div>

            <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Phone</label>
                <input
                    value={form.phone}
                    onChange={set("phone")}
                    className={inputClass("phone")}
                    placeholder="0912..."
                />
            </div>

            <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Department *</label>
                <select
                    value={form.departmentId}
                    onChange={set("departmentId")}
                    className={inputClass("departmentId")}
                >
                    <option value="">-- Select Department --</option>
                    {departments.map((d) => (
                        <option key={d.id} value={d.id}>
                            {d.name} ({d.code})
                        </option>
                    ))}
                </select>
                {getError("departmentId") && (
                    <div className="text-xs font-medium text-rose-600">{getError("departmentId")}</div>
                )}
            </div>

            {mode === "create" && (
                <>
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Username *</label>
                        <input
                            value={form.username}
                            onChange={set("username")}
                            className={inputClass("username")}
                            placeholder="mentor123"
                        />
                        {getError("username") && (
                            <div className="text-xs font-medium text-rose-600">{getError("username")}</div>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Password *</label>
                        <input
                            type="password"
                            value={form.password}
                            onChange={set("password")}
                            className={inputClass("password")}
                            placeholder="••••••"
                        />
                        {getError("password") && (
                            <div className="text-xs font-medium text-rose-600">{getError("password")}</div>
                        )}
                    </div>
                </>
            )}

            <div className="flex justify-end gap-3 md:col-span-2 pt-4 border-t border-slate-100">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={submitting}
                    className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-xl bg-slate-900 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-50"
                >
                    {submitting ? "Saving..." : mode === "create" ? "Create Mentor" : "Update Mentor"}
                </button>
            </div>
        </form>
    );
}
