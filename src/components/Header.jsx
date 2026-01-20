import React from "react";
import { useAuth } from "../auth/AuthContext";
import NotificationBell from "./common/NotificationBell";
import { Button } from "antd";

export default function Header() {
    const { user, logout } = useAuth();
    const name = user?.fullName || user?.email || "User";
    const roles = (user?.roles || []).join(", ");

    return (
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4">
            <div className="font-extrabold tracking-tight text-slate-900">
                Intern Management
            </div>

            <div className="flex items-center gap-4">
                <NotificationBell />

                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <div className="text-sm font-semibold text-slate-900">{name}</div>
                        <div className="text-xs text-slate-500">{roles}</div>
                    </div>
                    <Button variant="secondary" onClick={logout}>
                        Logout
                    </Button>
                </div>
            </div>
        </header>
    );
}
