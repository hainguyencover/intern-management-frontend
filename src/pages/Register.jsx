import React, {useMemo, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import {toast} from "sonner";
import {authApi} from "../api/authApi";

const currentYear = new Date().getFullYear();

export default function Register() {
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);

    const yearOptions = useMemo(() => {
        // cho nhập năm linh hoạt, nhưng gợi ý range
        const start = 1980;
        const end = currentYear + 5;
        const arr = [];
        for (let y = end; y >= start; y--) arr.push(y);
        return arr;
    }, []);

    const {
        register,
        handleSubmit,
        watch,
        formState: {errors},
    } = useForm({
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
            phone: "",
            dobYear: 2004,
            address: "",
            studentCode: "",
            university: "",
            major: "",
            startYear: 2022,
            endYear: 2024,
        },
        mode: "onBlur",
    });

    const startYear = Number(watch("startYear"));
    const endYear = Number(watch("endYear"));

    const onSubmit = async (values) => {
        // client-side guard
        if (Number(values.endYear) < Number(values.startYear)) {
            toast.error("Năm kết thúc phải lớn hơn hoặc bằng năm bắt đầu");
            return;
        }

        const payload = {
            fullName: values.fullName?.trim(),
            email: values.email?.trim(),
            password: values.password,
            phone: values.phone?.trim(),
            dobYear: Number(values.dobYear),
            address: values.address?.trim(),
            studentCode: values.studentCode?.trim(),
            university: values.university?.trim(),
            major: values.major?.trim(),
            startYear: Number(values.startYear),
            endYear: Number(values.endYear),
        };

        try {
            setSubmitting(true);
            await authApi.register(payload);
            toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
            navigate("/login");
        } catch (e) {
            toast.error(e?.response?.data?.message || "Đăng ký thất bại");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 p-4 lg:grid-cols-2 lg:items-center lg:p-8">
                {/* Left */}
                <div className="space-y-4">
                    <div
                        className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-700 ring-1 ring-slate-200">
                        Intern Management System
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                        Tạo tài khoản thực tập sinh
                    </h1>
                    <p className="text-base text-slate-600">
                        Điền thông tin cơ bản để đăng ký. Bạn có thể bổ sung tài liệu/hồ sơ ở các bước sau.
                    </p>

                    <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                        <div className="text-sm font-semibold text-slate-900">Lưu ý</div>
                        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-slate-600">
                            <li>Email phải duy nhất.</li>
                            <li>Mật khẩu tối thiểu 6 ký tự.</li>
                            <li>Năm kết thúc phải ≥ năm bắt đầu.</li>
                        </ul>
                    </div>
                </div>

                {/* Right Form */}
                <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                    <div className="mb-4">
                        <h2 className="text-lg font-bold text-slate-900">Đăng ký</h2>
                        <p className="mt-1 text-sm text-slate-600">
                            Đã có tài khoản?{" "}
                            <Link to="/login"
                                  className="font-semibold text-slate-900 underline decoration-slate-300 hover:decoration-slate-700">
                                Đăng nhập
                            </Link>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* fullName */}
                        <Field label="Họ và tên" error={errors.fullName?.message}>
                            <input
                                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                                placeholder="Nguyễn Đức Hải"
                                {...register("fullName", {required: "Vui lòng nhập họ và tên"})}
                            />
                        </Field>

                        {/* email */}
                        <Field label="Email" error={errors.email?.message}>
                            <input
                                type="email"
                                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                                placeholder="hai@gmail.com"
                                {...register("email", {
                                    required: "Vui lòng nhập email",
                                    pattern: {value: /^\S+@\S+\.\S+$/, message: "Email không hợp lệ"},
                                })}
                            />
                        </Field>

                        {/* password */}
                        <Field label="Mật khẩu" error={errors.password?.message}>
                            <input
                                type="password"
                                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                                placeholder="••••••••"
                                {...register("password", {
                                    required: "Vui lòng nhập mật khẩu",
                                    minLength: {value: 6, message: "Mật khẩu tối thiểu 6 ký tự"},
                                })}
                            />
                        </Field>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {/* phone */}
                            <Field label="Số điện thoại" error={errors.phone?.message}>
                                <input
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                                    placeholder="0123456789"
                                    {...register("phone", {required: "Vui lòng nhập số điện thoại"})}
                                />
                            </Field>

                            {/* dobYear */}
                            <Field label="Năm sinh" error={errors.dobYear?.message}>
                                <select
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                                    {...register("dobYear", {
                                        required: "Vui lòng chọn năm sinh",
                                        valueAsNumber: true,
                                        min: {value: 1900, message: "Năm sinh không hợp lệ"},
                                        max: {value: currentYear, message: "Năm sinh không hợp lệ"},
                                    })}
                                >
                                    {yearOptions.map((y) => (
                                        <option key={y} value={y}>
                                            {y}
                                        </option>
                                    ))}
                                </select>
                            </Field>
                        </div>

                        {/* address */}
                        <Field label="Địa chỉ" error={errors.address?.message}>
                            <input
                                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                                placeholder="Ninh Bình"
                                {...register("address", {required: "Vui lòng nhập địa chỉ"})}
                            />
                        </Field>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {/* studentCode */}
                            <Field label="Mã sinh viên" error={errors.studentCode?.message}>
                                <input
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                                    placeholder="SV2004"
                                    {...register("studentCode", {required: "Vui lòng nhập mã sinh viên"})}
                                />
                            </Field>

                            {/* university */}
                            <Field label="Trường" error={errors.university?.message}>
                                <input
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                                    placeholder="Cao đẳng FPT Polytechnic"
                                    {...register("university", {required: "Vui lòng nhập tên trường"})}
                                />
                            </Field>
                        </div>

                        {/* major */}
                        <Field label="Ngành học" error={errors.major?.message}>
                            <input
                                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                                placeholder="CNTT"
                                {...register("major", {required: "Vui lòng nhập ngành học"})}
                            />
                        </Field>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {/* startYear */}
                            <Field label="Bắt đầu từ năm" error={errors.startYear?.message}>
                                <select
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                                    {...register("startYear", {
                                        required: "Vui lòng chọn năm bắt đầu",
                                        valueAsNumber: true,
                                        min: {value: 1900, message: "Năm bắt đầu không hợp lệ"},
                                        max: {value: currentYear + 10, message: "Năm bắt đầu không hợp lệ"},
                                    })}
                                >
                                    {yearOptions.map((y) => (
                                        <option key={y} value={y}>
                                            {y}
                                        </option>
                                    ))}
                                </select>
                            </Field>

                            {/* endYear */}
                            <Field label="Kết thúc từ năm" error={errors.endYear?.message}>
                                <select
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                                    {...register("endYear", {
                                        required: "Vui lòng chọn năm kết thúc",
                                        valueAsNumber: true,
                                        validate: (v) =>
                                            Number(v) >= Number(startYear) || "Năm kết thúc phải ≥ năm bắt đầu",
                                    })}
                                >
                                    {yearOptions.map((y) => (
                                        <option key={y} value={y}>
                                            {y}
                                        </option>
                                    ))}
                                </select>
                            </Field>
                        </div>

                        {/* inline hint */}
                        <div className="text-xs text-slate-500">
                            Đang chọn: <span className="font-semibold">{startYear}</span> →{" "}
                            <span className="font-semibold">{endYear}</span>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
                        >
                            {submitting ? "Đang đăng ký..." : "Đăng ký"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

function Field({label, error, children}) {
    return (
        <div>
            <div className="mb-1 flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-900">{label}</label>
                {error && <span className="text-xs font-semibold text-rose-600">{error}</span>}
            </div>
            {children}
        </div>
    );
}
