import React from "react";
import {Navigate, Outlet} from "react-router-dom";
import {useAuth} from "./AuthContext";

export default function ProtectedRoute({ allowRoles = [] }) {
    const { isAuthenticated, user} = useAuth();

    if (!isAuthenticated) return <Navigate to="/login" replace />;

    // nếu token có nhưng user chưa có (đang hydrate), đừng check role vội
    if (!user) return <div className="p-6 text-sm text-slate-600">Loading...</div>;

    if (allowRoles.length > 0) {
        const roles = user.roles || [];
        const ok = allowRoles.some((r) => roles.includes(r));
        if (!ok) return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
}
