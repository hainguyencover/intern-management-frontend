import React, {useMemo} from "react";
import {NavLink} from "react-router-dom";
import {useAuth} from "../auth/AuthContext";

const navClass = ({isActive}) =>
    [
        "block rounded-xl px-3 py-2 text-sm font-semibold transition",
        isActive
            ? "bg-slate-900 text-white"
            : "text-slate-700 hover:bg-slate-100",
    ].join(" ");

export default function Sidebar() {
    const {user} = useAuth();

    const items = useMemo(() => {
        const roles = user?.roles || [];
        const isAdmin = roles.includes("ADMIN");
        const isHr = roles.includes("HR");
        const isMentor = roles.includes("MENTOR");
        const isIntern = roles.includes("INTERN");

        const common = [
            {label: "Dashboard", to: "/dashboard"},
        ];
        if (!isHr) {
            common.push({label: "Profile", to: "/profile"});
        }
        const admin = [
            {label: "Users", to: "/admin/users"},
            {label: "Roles & Permissions", to: "/admin/roles"},
        ];
        const hr = [
            { label: "Interns", to: "/hr/interns" },
            { label: "Documents (HR)", to: "/hr/documents" },
            { label: "Programs", to: "/hr/programs" },
            { label: "Groups", to: "/hr/groups" },

        ];
        const mentor = [
            {label: "Assigned Interns", to: "/mentor/interns"},
            {label: "Reviews", to: "/mentor/reviews"},
        ];
        const intern = [
            { label: "My Documents", to: "/intern/documents" },
            { label: "Tasks", to: "/intern/tasks" },
            { label: "My Schedule", to: "/interns/me/schedule" },
        ];

        return [
            ...common,
            ...(isAdmin ? admin : []),
            ...(isHr ? hr : []),
            ...(isMentor ? mentor : []),
            ...(isIntern ? intern : []),
        ];
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
