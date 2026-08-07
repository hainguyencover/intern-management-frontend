import React, { useMemo } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/model/AuthContext";
import { cn } from "@/utils/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    LayoutDashboard,
    UserCircle,
    Users,
    KeyRound,
    FileText,
    Database,
    Briefcase,
    Clock,
    FileSearch,
    UserCheck,
    FolderKanban,
    Building2,
    ClipboardList,
    FilePlus,
    BarChart3,
    CalendarCheck,
    LogOut,
    HelpCircle,
    Settings,
    Shield,
    HeartPulse,
    Sparkles
} from "lucide-react";

export default function Sidebar() {
    const { user, logout } = useAuth();
    const location = useLocation();

    const menuData = useMemo(() => {
        const roles = user?.roles || [];
        const isAdmin = roles.includes("ADMIN");
        const isHr = roles.includes("HR");
        const isMentor = roles.includes("MENTOR");
        const isIntern = roles.includes("INTERN");
        const isApprovedIntern = isIntern && ['APPROVED', 'CONTRACT_SENT', 'CONTRACT_SIGNED'].includes(user?.applicationStatus);

        const sections = [];

        // General Section
        const general = {
            title: "Tổng quan",
            items: [
                { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
                { label: "Hồ sơ cá nhân", to: "/profile", icon: UserCircle },
            ]
        };
        sections.push(general);

        if (isAdmin) {
            sections.push({
                title: "Hệ thống",
                items: [
                    { label: "Người dùng", to: "/admin/users", icon: Users },
                    { label: "Phân quyền", to: "/admin/roles", icon: KeyRound },
                    { label: "Nhật ký hệ thống", to: "/admin/audit-logs", icon: FileSearch },
                    { label: "Sao lưu", to: "/admin/system/backup", icon: Database },
                    { label: "Tích hợp HRM", to: "/admin/hrm", icon: Briefcase },
                    { label: "Chấm công Sync", to: "/admin/attendance-sync", icon: Clock },
                ]
            });
        }

        if (isHr) {
            sections.push({
                title: "Quản lý nhân sự",
                items: [
                    { label: "Thực tập sinh", to: "/hr/interns", icon: Users },
                    { label: "Hồ sơ ứng tuyển", to: "/hr/applications", icon: FilePlus },
                    { label: "Chương trình", to: "/hr/programs", icon: FolderKanban },
                    { label: "Nhóm thực tập", to: "/hr/groups", icon: Users },
                    { label: "Người hướng dẫn", to: "/hr/mentors", icon: UserCheck },
                    { label: "Phòng ban", to: "/hr/departments", icon: Building2 },
                ]
            });

            sections.push({
                title: "Hồ sơ & Tài liệu",
                items: [
                    { label: "Tài liệu HR", to: "/hr/documents", icon: FileText, end: true },
                    { label: "Hợp đồng", to: "/hr/documents/contracts", icon: ClipboardList },
                ]
            });

            sections.push({
                title: "Báo cáo & Phụ cấp",
                items: [
                    { label: "Báo cáo tổng kết", to: "/hr/reports", icon: BarChart3 },
                    { label: "Duyệt nghỉ phép", to: "/hr/leave-approvals", icon: CalendarCheck },
                    { label: "Phụ cấp", to: "/hr/allowances", icon: Database },
                    { label: "Thống kê", to: "/hr/statistics", icon: BarChart3 },
                    { label: "AI Matching", to: "/hr/matching", icon: Sparkles },
                    { label: "AI Analytics", to: "/hr/analytics", icon: TrendingUp },
                ]
            });
        }

        if (isMentor) {
            sections.push({
                title: "Quản lý TTS",
                items: [
                    { label: "TTS phân công", to: "/mentor/interns", icon: Users },
                    { label: "Đánh giá", to: "/mentor/evaluations", icon: UserCheck },
                    { label: "Công việc", to: "/mentor/tasks", icon: ClipboardList },
                    { label: "Báo cáo tuần", to: "/mentor/reports", icon: FileText },
                ]
            });
        }

        if (isIntern) {
            const internSection = {
                title: "Hành trình thực tập",
                items: [
                    { label: "Hồ sơ đã nộp", to: "/intern/applications", icon: FileSearch },
                    { label: "Nộp hồ sơ", to: "/intern/apply", icon: FilePlus },
                    { label: "Tài liệu của tôi", to: "/intern/documents", icon: FileText },
                ]
            };

            if (isApprovedIntern) {
                internSection.items.push(
                    { label: "Hợp đồng", to: "/intern/contracts", icon: ClipboardList },
                    { label: "Lịch trình", to: "/interns/me/schedule", icon: LayoutDashboard },
                    { label: "Chấm công", to: "/intern/attendance", icon: Clock },
                    { label: "Công việc", to: "/intern/tasks", icon: ClipboardList },
                    { label: "Báo cáo tuần", to: "/intern/reports/weekly/submit", icon: FileText },
                    { label: "Xin nghỉ phép", to: "/intern/leave-requests", icon: CalendarCheck },
                    { label: "Phụ cấp", to: "/intern/allowances", icon: Database },
                    { label: "Hỗ trợ", to: "/intern/support", icon: HelpCircle },
                );
            }
            sections.push(internSection);
        }

        return sections;
    }, [user]);

    return (
        <aside className="relative flex h-screen flex-col border-r bg-card shadow-sm transition-all print:hidden">
            {/* Logo area */}
            <div className="flex h-16 items-center border-b px-6">
                <Link to="/" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                        <Shield className="h-5 w-5" />
                    </div>
                    <span className="text-lg font-bold tracking-tight">Antigravity</span>
                </Link>
            </div>

            {/* Navigation area */}
            <ScrollArea className="flex-1 px-4 py-4">
                <div className="space-y-6">
                    {menuData.map((section, idx) => (
                        <div key={idx} className="space-y-2">
                            <h4 className="px-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">
                                {section.title}
                            </h4>
                            <div className="space-y-1">
                                {section.items.map((item) => (
                                    <NavLink
                                        key={item.to}
                                        to={item.to}
                                        end={item.end}
                                        className={({ isActive }) =>
                                            cn(
                                                "flex items-center gap-3 rounded-md px-2 py-1.5 text-sm font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground",
                                                isActive
                                                    ? "bg-secondary text-secondary-foreground shadow-sm"
                                                    : "text-muted-foreground"
                                            )
                                        }
                                    >
                                        <item.icon className="h-4 w-4 shrink-0" />
                                        <span>{item.label}</span>
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>

            {/* User Profile area */}
            <div className="border-t p-4">
                <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-2 border border-slate-100">
                    <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {user?.fullName?.charAt(0) || "U"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-1 flex-col overflow-hidden">
                        <span className="truncate text-xs font-bold text-slate-900">{user?.fullName || "N/A"}</span>
                        <span className="truncate text-[10px] text-muted-foreground capitalize">{user?.roles?.[0]?.toLowerCase() || "User"}</span>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={logout}
                        title="Đăng xuất"
                    >
                        <LogOut className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </aside>
    );
}
