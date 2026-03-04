import React, { useEffect, useState } from "react";
import { internApi } from "../../api/internApi";
import { useAuth } from "../../auth/AuthContext";
import { toast } from "sonner";
import {
    User,
    GraduationCap,
    Smartphone,
    MapPin,
    Award,
    Calendar,
    ShieldCheck,
    Save,
    Loader2
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Skeleton } from "../../components/ui/skeleton";
import { Separator } from "../../components/ui/separator";

export default function MyProfile() {
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [formData, setFormData] = useState({
        studentCode: "",
        university: "",
        major: "",
        phone: "",
        address: "",
        gpa: "",
        dob: ""
    });

    const { user } = useAuth();
    const isIntern = user?.roles?.includes("INTERN");

    useEffect(() => {
        if (isIntern) {
            loadProfile();
        } else {
            setFetching(false);
        }
    }, [isIntern]);

    const loadProfile = async () => {
        try {
            setFetching(true);
            const res = await internApi.getMyProfile();
            const data = res.data;
            setFormData({
                studentCode: data.studentCode || "",
                university: data.university || "",
                major: data.major || "",
                phone: data.phone || "",
                address: data.address || "",
                gpa: data.gpa || "",
                dob: data.dob ? data.dob.split('T')[0] : ""
            });
        } catch (error) {
            toast.error("Không thể tải thông tin hồ sơ");
        } finally {
            setFetching(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await internApi.updateMyProfile(formData);
            toast.success("Cập nhật hồ sơ thành công!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Cập nhật thất bại");
        } finally {
            setLoading(false);
        }
    };

    if (!isIntern) {
        return (
            <div className="mx-auto max-w-4xl py-20 text-center animate-in fade-in zoom-in duration-300">
                <div className="mx-auto h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 mb-6">
                    <ShieldCheck className="h-10 w-10" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">Quyền truy cập hạn chế</h2>
                <p className="text-slate-500 max-w-md mx-auto">
                    Trang hồ sơ cá nhân chỉ khả dụng cho người dùng có vai trò <strong>Intern</strong>.
                    Tài khoản của bạn hiện có vai trò: <span className="text-primary font-bold">{user?.roles?.join(", ")}</span>
                </p>
                <Button variant="outline" className="mt-8 rounded-full px-8" onClick={() => window.history.back()}>
                    Quay lại Dashboard
                </Button>
            </div>
        );
    }

    if (fetching) {
        return (
            <div className="mx-auto max-w-3xl space-y-6">
                <Skeleton className="h-40 w-full rounded-2xl" />
                <div className="grid grid-cols-2 gap-6">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                </div>
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-12 w-32" />
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-3xl pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8 flex items-end justify-between">
                <div>
                    <h1 className="text-4xl font-black tracking-tight flex items-center gap-4">
                        <User className="h-10 w-10 text-primary" />
                        Hồ sơ cá nhân
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">Quản lý và cập nhật thông tin học vấn và liên lạc của bạn.</p>
                </div>
                <div className="hidden md:flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-2xl">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Đang trực tuyến</span>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <Card className="border-none shadow-2xl shadow-slate-200/60 overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b pb-6">
                        <CardTitle className="text-xl flex items-center gap-2">
                            <GraduationCap className="h-5 w-5 text-indigo-500" />
                            Thông tin Học vấn
                        </CardTitle>
                        <CardDescription>Các thông tin liên quan đến trường lớp và kết quả học tập.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Mã sinh viên *</label>
                                <Input
                                    name="studentCode"
                                    value={formData.studentCode}
                                    onChange={handleChange}
                                    placeholder="Ví dụ: SV12345"
                                    className="border-slate-200 focus:ring-4 focus:ring-primary/10 transition-all"
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Trường Đại học *</label>
                                <Input
                                    name="university"
                                    value={formData.university}
                                    onChange={handleChange}
                                    placeholder="Tên trường đầy đủ"
                                    className="border-slate-200 focus:ring-4 focus:ring-primary/10 transition-all"
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Chuyên ngành *</label>
                                <Input
                                    name="major"
                                    value={formData.major}
                                    onChange={handleChange}
                                    placeholder="Ví dụ: Kỹ thuật phần mềm"
                                    className="border-slate-200 focus:ring-4 focus:ring-primary/10 transition-all"
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <Award className="h-3 w-3 text-amber-500" /> Điểm GPA (4.0)
                                </label>
                                <Input
                                    name="gpa"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="4"
                                    value={formData.gpa}
                                    onChange={handleChange}
                                    placeholder="Ví dụ: 3.5"
                                    className="border-slate-200 focus:ring-4 focus:ring-primary/10 transition-all"
                                />
                            </div>
                        </div>

                        <Separator className="bg-slate-100" />

                        <div className="space-y-6">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <Smartphone className="h-5 w-5 text-emerald-500" />
                                Thông tin Liên lạc
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Điện thoại di động</label>
                                    <Input
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="0xxxxxxxxx"
                                        className="border-slate-200 focus:ring-4 focus:ring-primary/10 transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                        <Calendar className="h-3 w-3 text-rose-500" /> Ngày sinh
                                    </label>
                                    <Input
                                        name="dob"
                                        type="date"
                                        value={formData.dob}
                                        onChange={handleChange}
                                        className="border-slate-200 focus:ring-4 focus:ring-primary/10 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <MapPin className="h-3 w-3 text-rose-500" /> Địa chỉ hiện tại
                                </label>
                                <textarea
                                    name="address"
                                    rows={3}
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Số nhà, tên đường, quận/huyện, thành phố..."
                                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all resize-none"
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="bg-slate-50/50 p-6 flex justify-between items-center border-t">
                        <p className="text-xs text-slate-400 font-medium">* Trường thông tin bắt buộc phải nhập.</p>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="rounded-full px-12 shadow-xl shadow-primary/20 h-12 text-base font-bold"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Đang lưu...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-5 w-5" />
                                    Lưu thay đổi
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}
