import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const navClass = ({ isActive }) =>
    [
        "block rounded-xl px-3 py-2 text-sm font-semibold transition",
        isActive
            ? "bg-slate-900 text-white"
            : "text-slate-700 hover:bg-slate-100",
    ].join(" ");

export default function Sidebar() {
    const location = useLocation();
    const { user } = useAuth();

    const items = useMemo(() => {
        const roles = user?.roles || [];
        const isAdmin = roles.includes("ADMIN");
        const isHr = roles.includes("HR");
        const isMentor = roles.includes("MENTOR");
        const isIntern = roles.includes("INTERN");

        const menu = [];

        // Common items
        menu.push({ label: "Dashboard", to: "/dashboard" });
        if (isIntern) {
            menu.push({ label: "Hồ sơ cá nhân", to: "/profile" });
        }

        // Admin items
        if (isAdmin) {
            menu.push(
                { label: "Quản lý người dùng", to: "/admin/users" },
                { label: "Phân quyền & Vai trò", to: "/admin/roles" },
                { label: "Nhật ký hoạt động", to: "/admin/audit-logs" },
                { label: "Sao lưu hệ thống", to: "/admin/system/backup" },
                { label: "Tích hợp HRM", to: "/admin/hrm" },
                { label: "Tích hợp Chấm công", to: "/admin/attendance-sync" },
                { label: "Cấu hình hệ thống", to: "/admin/system-config" }
            );
        }

        // HR items
        if (isHr) {
            menu.push(
                { label: "Thực tập sinh", to: "/hr/interns" },
                { label: "Hồ sơ ứng tuyển", to: "/hr/applications" },
                { label: "Tài liệu (HR)", to: "/hr/documents" },
                { label: "Hợp đồng thực tập", to: "/hr/documents/contracts" },
                { label: "Chương trình", to: "/hr/programs" },
                { label: "Nhóm thực tập", to: "/hr/groups" },
                { label: "Người hướng dẫn", to: "/hr/mentors" },
                { label: "Phòng ban", to: "/hr/departments" },
                { label: "Kết quả thực tập", to: "/hr/reports" },
                { label: "Báo cáo Điểm danh", to: "/hr/attendance-reports" },
                { label: "Báo cáo Nghỉ phép", to: "/hr/leave-reports" },
                { label: "Thống kê", to: "/hr/statistics" },
                { label: "Duyệt nghỉ phép", to: "/hr/leave-approvals" },
                { label: "Quản lý phụ cấp", to: "/hr/allowances" },
                { label: "HelpDesk", to: "/hr/helpdesk" }
            );
        }

        // Mentor items
        if (isMentor) {
            menu.push(
                { label: "TTS được phân công", to: "/mentor/interns" },
                { label: "Đánh giá", to: "/mentor/evaluations" },
                { label: "Công việc", to: "/mentor/tasks" },
                { label: "Báo cáo tuần", to: "/mentor/reports" }
            );
        }

        // Intern items
        if (isIntern) {
            menu.push(
                { label: "Tài liệu của tôi", to: "/intern/documents" },
                { label: "Nộp hồ sơ", to: "/intern/apply" },
                { label: "Hồ sơ đã nộp", to: "/intern/applications" },
                { label: "Hợp đồng", to: "/intern/contracts" },
                { label: "Lịch của tôi", to: "/interns/me/schedule" },
                { label: "Chấm công", to: "/intern/attendance" },
                { label: "Công việc của tôi", to: "/intern/tasks" },
                { label: "Báo cáo tuần", to: "/intern/reports/weekly/submit" },
                { label: "Xin nghỉ phép", to: "/intern/leave-requests" },
                { label: "Phụ cấp của tôi", to: "/intern/allowances" },
                { label: "Hỗ trợ (HelpDesk)", to: "/intern/support" }
            );
        }

        // Filter duplicates by 'to' path if multiple roles share items
        const uniqueParams = new Set();
        return menu.filter(item => {
            if (!uniqueParams.has(item.to)) {
                uniqueParams.add(item.to);
                return true;
            }
            return false;
        });
    }, [user?.roles]);

    return (
        <aside className="border-r border-slate-200 bg-white p-4">
            <div className="mb-3 text-sm font-extrabold text-slate-900">Menu</div>
            <nav className="grid gap-1">
                {items.map((it) => (
                    <NavLink key={`${it.to}-${it.label}`} to={it.to} className={navClass}>
                        {it.label}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}
