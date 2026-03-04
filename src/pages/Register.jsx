import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { authApi } from "../api/authApi";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/card";
import { Shield, CheckCircle2, Info } from "lucide-react";

const currentYear = new Date().getFullYear();

const registerSchema = z.object({
    fullName: z.string().min(1, "Vui lòng nhập họ và tên"),
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
    phone: z.string().min(10, "Số điện thoại tối thiểu 10 số"),
    dobYear: z.string().or(z.number()),
    address: z.string().min(1, "Vui lòng nhập địa chỉ"),
    studentCode: z.string().min(1, "Vui lòng nhập mã sinh viên"),
    university: z.string().min(1, "Vui lòng nhập tên trường"),
    major: z.string().min(1, "Vui lòng nhập ngành học"),
    startYear: z.string().or(z.number()),
    endYear: z.string().or(z.number()),
}).refine((data) => Number(data.endYear) >= Number(data.startYear), {
    message: "Năm kết thúc phải lớn hơn hoặc bằng năm bắt đầu",
    path: ["endYear"],
});

export default function Register() {
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);

    const yearOptions = useMemo(() => {
        const start = 1980;
        const end = currentYear + 5;
        const arr = [];
        for (let y = end; y >= start; y--) arr.push(y);
        return arr;
    }, []);

    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(registerSchema),
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
    });

    const watchStartYear = watch("startYear");
    const watchEndYear = watch("endYear");

    const onSubmit = async (values) => {
        const payload = {
            ...values,
            dobYear: Number(values.dobYear),
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
        <div className="relative min-h-screen w-full bg-slate-50 py-12 px-4 selection:bg-primary/10">
            {/* Background decorative elements */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute -left-[5%] -top-[5%] h-[400px] w-[400px] rounded-full bg-primary/5 blur-[100px]" />
                <div className="absolute -right-[5%] -bottom-[5%] h-[400px] w-[400px] rounded-full bg-blue-500/5 blur-[100px]" />
            </div>

            <div className="relative z-10 mx-auto max-w-5xl">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
                    {/* Left Column: Info */}
                    <div className="lg:col-span-2 space-y-8 py-4">
                        <div className="space-y-4">
                            <Link to="/login" className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-border shadow-sm text-xs font-semibold text-muted-foreground hover:bg-slate-50 transition-colors">
                                <Shield className="h-3.5 w-3.5 text-primary" />
                                Intern Management System
                            </Link>
                            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                                Bắt đầu hành trình <span className="text-primary italic">Thực tập sinh</span> của bạn
                            </h1>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                Gia nhập đội ngũ trẻ, năng động và phát triển kỹ năng thực chiến tại môi trường chuyên nghiệp.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {[
                                "Quy trình đăng ký nhanh gọn",
                                "Quản lý lộ trình thực tập minh bạch",
                                "Đánh giá và phản hồi từ Mentor",
                                "Cơ hội trở thành nhân viên chính thức"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <CheckCircle2 className="h-4 w-4" />
                                    </div>
                                    <span className="text-sm font-medium text-slate-700">{item}</span>
                                </div>
                            ))}
                        </div>

                        <Card className="bg-slate-900 border-none text-slate-50 shadow-2xl">
                            <CardContent className="p-6">
                                <div className="flex gap-4">
                                    <Info className="h-5 w-5 shrink-0 text-primary" />
                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-sm">Lưu ý quan trọng</h4>
                                        <ul className="text-xs text-slate-400 space-y-1 mt-1 list-disc list-inside">
                                            <li>Email phải duy nhất và đang hoạt động.</li>
                                            <li>Mật khẩu tối thiểu 6 ký tự để bảo mật.</li>
                                            <li>Thông tin sinh viên cần chính xác để xét duyệt.</li>
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Form */}
                    <div className="lg:col-span-3">
                        <Card className="border-border/60 shadow-2xl shadow-slate-200/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-2xl">Đăng ký tài khoản</CardTitle>
                                <CardDescription>
                                    Cung cấp thông tin chi tiết để chúng tôi hiểu thêm về bạn
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="fullName">Họ và tên</Label>
                                            <Input id="fullName" placeholder="Nguyễn Văn A" {...register("fullName")} className={errors.fullName ? "border-destructive" : ""} />
                                            {errors.fullName && <p className="text-[10px] font-medium text-destructive">{errors.fullName.message}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input id="email" type="email" placeholder="example@mail.com" {...register("email")} className={errors.email ? "border-destructive" : ""} />
                                            {errors.email && <p className="text-[10px] font-medium text-destructive">{errors.email.message}</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="password">Mật khẩu</Label>
                                            <Input id="password" type="password" placeholder="••••••••" {...register("password")} className={errors.password ? "border-destructive" : ""} />
                                            {errors.password && <p className="text-[10px] font-medium text-destructive">{errors.password.message}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Số điện thoại</Label>
                                            <Input id="phone" placeholder="0123 456 789" {...register("phone")} className={errors.phone ? "border-destructive" : ""} />
                                            {errors.phone && <p className="text-[10px] font-medium text-destructive">{errors.phone.message}</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="dobYear">Năm sinh</Label>
                                            <Controller
                                                name="dobYear"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                                                        <SelectTrigger id="dobYear">
                                                            <SelectValue placeholder="Chọn năm sinh" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {yearOptions.map(year => (
                                                                <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="address">Địa chỉ</Label>
                                            <Input id="address" placeholder="Hà Nội, Việt Nam" {...register("address")} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="studentCode">Mã sinh viên</Label>
                                            <Input id="studentCode" placeholder="SV001" {...register("studentCode")} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="university">Trường đại học</Label>
                                            <Input id="university" placeholder="FPT University" {...register("university")} />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="major">Ngành học</Label>
                                        <Input id="major" placeholder="Kỹ thuật phần mềm" {...register("major")} />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="startYear">Năm bắt đầu</Label>
                                            <Controller
                                                name="startYear"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                                                        <SelectTrigger id="startYear">
                                                            <SelectValue placeholder="Chọn năm" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {yearOptions.map(year => (
                                                                <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="endYear">Năm kết thúc dự kiến</Label>
                                            <Controller
                                                name="endYear"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                                                        <SelectTrigger id="endYear" className={errors.endYear ? "border-destructive" : ""}>
                                                            <SelectValue placeholder="Chọn năm" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {yearOptions.map(year => (
                                                                <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                            {errors.endYear && <p className="text-[10px] font-medium text-destructive">{errors.endYear.message}</p>}
                                        </div>
                                    </div>

                                    <Button type="submit" className="w-full h-11 text-base shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99]" disabled={submitting}>
                                        {submitting ? "Đang xử lý đăng ký..." : "Hoàn tất đăng ký"}
                                    </Button>
                                </form>
                            </CardContent>
                            <CardFooter className="flex flex-col gap-4">
                                <div className="text-center text-sm">
                                    <span className="text-muted-foreground">Đã có tài khoản? </span>
                                    <Link to="/login" className="font-bold text-primary hover:underline">
                                        Đăng nhập ngay
                                    </Link>
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
