import React, { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/card";
import { AlertCircle, User, Shield, Briefcase, GraduationCap } from "lucide-react";

export default function Login() {
    const { login, loading } = useAuth();
    const nav = useNavigate();
    const [email, setEmail] = useState("hr@company.com");
    const [password, setPassword] = useState("hr123");
    const [err, setErr] = useState("");

    const onSubmit = async (e) => {
        e.preventDefault();
        setErr("");
        try {
            const u = await login({ email, password });
            const roles = u?.roles || [];
            if (roles.includes("ADMIN")) nav("/dashboard/admin");
            else if (roles.includes("HR")) nav("/dashboard/hr");
            else if (roles.includes("MENTOR")) nav("/dashboard/mentor");
            else nav("/dashboard/intern");
        } catch (e2) {
            setErr(e2?.response?.data?.message || e2.message || "Đăng nhập thất bại");
        }
    };

    const DemoCredential = ({ label, role, icon: Icon, color, e, p }) => (
        <Button
            type="button"
            variant="outline"
            className={`h-auto flex-col items-start gap-1 p-3 text-left transition-all hover:ring-2 hover:ring-primary/20 ${color}`}
            onClick={() => {
                setEmail(e);
                setPassword(p);
            }}
        >
            <div className="flex w-full items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">{role}</span>
                <Icon className="h-4 w-4 opacity-60" />
            </div>
            <span className="text-sm font-semibold">{label}</span>
        </Button>
    );

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-slate-50">
            {/* Background decorative elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute -left-[10%] -top-[10%] h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
                <div className="absolute -right-[10%] -bottom-[10%] h-[500px] w-[500px] rounded-full bg-purple-500/5 blur-[120px]" />
            </div>

            <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
                <div className="w-full max-w-[420px] space-y-6">
                    <div className="flex flex-col items-center space-y-2 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20">
                            <Shield className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight">Antigravity Intern</h1>
                        <p className="text-sm text-muted-foreground">
                            Hệ thống Quản lý Thực tập sinh chuẩn Production
                        </p>
                    </div>

                    <Card className="border-border/60 shadow-xl shadow-slate-200/50 backdrop-blur-sm">
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-xl">Đăng nhập</CardTitle>
                            <CardDescription>
                                Nhập thông tin tài khoản của bạn để tiếp tục
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <form onSubmit={onSubmit} className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        autoComplete="email"
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password">Mật khẩu</Label>
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        autoComplete="current-password"
                                        required
                                    />
                                </div>

                                {err && (
                                    <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <span>{err}</span>
                                    </div>
                                )}

                                <Button type="submit" className="w-full shadow-md transition-all active:scale-[0.98]" disabled={loading}>
                                    {loading ? "Đang xử lý..." : "Đăng nhập ngay"}
                                </Button>
                            </form>

                            <div className="relative py-4">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-card px-2 text-muted-foreground">Demo Accounts</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <DemoCredential
                                    role="Admin"
                                    label="Root System"
                                    icon={Shield}
                                    e="admin@company.com"
                                    p="admin123"
                                    color="hover:bg-slate-50"
                                />
                                <DemoCredential
                                    role="HR"
                                    label="Manager"
                                    icon={Briefcase}
                                    e="hr@company.com"
                                    p="hr123"
                                    color="hover:bg-purple-50"
                                />
                                <DemoCredential
                                    role="Mentor"
                                    label="Supervisor"
                                    icon={User}
                                    e="mentor2@company.com"
                                    p="mentor123"
                                    color="hover:bg-orange-50"
                                />
                                <DemoCredential
                                    role="Intern"
                                    label="Student"
                                    icon={GraduationCap}
                                    e="intern@student.com"
                                    p="intern123"
                                    color="hover:bg-blue-50"
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <div className="w-full text-center text-sm">
                                <span className="text-muted-foreground">Chưa có tài khoản? </span>
                                <Link to="/register" className="font-semibold text-primary hover:underline">
                                    Đăng ký ngay
                                </Link>
                            </div>
                        </CardFooter>
                    </Card>

                    <p className="px-8 text-center text-xs text-muted-foreground">
                        Bằng cách đăng nhập, bạn đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của chúng tôi.
                    </p>
                </div>
            </div>
        </div>
    );
}
