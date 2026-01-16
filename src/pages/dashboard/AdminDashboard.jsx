import React from "react";
import { useNavigate } from "react-router-dom";
import { Users, Shield, Database, FileText } from "lucide-react";

export default function AdminDashboard() {
    const nav = useNavigate();

    const cards = [
        {
            title: "User Management",
            desc: "Create, edit, and manage system accounts (HR, Mentors, Interns).",
            icon: Users,
            color: "bg-blue-50 text-blue-600",
            path: "/admin/users",
        },
        {
            title: "Role & Permissions",
            desc: "Configure Role-Based Access Control (RBAC) and permissions.",
            icon: Shield,
            color: "bg-indigo-50 text-indigo-600",
            path: "/admin/roles",
        },
        {
            title: "System Backup",
            desc: "Manage database backups, restore points, and schedules.",
            icon: Database,
            color: "bg-emerald-50 text-emerald-600",
            path: "/admin/system/backup",
        },
        {
            title: "Audit Logs",
            desc: "View detailed system activity logs and security events.",
            icon: FileText,
            color: "bg-amber-50 text-amber-600",
            path: "/admin/audit-logs",
        },
    ];

    return (
        <div className="mx-auto w-full max-w-6xl p-5">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                    Admin Dashboard
                </h1>
                <p className="mt-2 text-lg text-slate-500">
                    Welcome back, Admin. Here is your system overview.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
                {cards.map((card) => (
                    <button
                        key={card.title}
                        onClick={() => nav(card.path)}
                        className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:shadow-md hover:bg-slate-50"
                    >
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${card.color}`}>
                            <card.icon size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">{card.title}</h3>
                            <p className="mt-1 text-sm text-slate-500">{card.desc}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
