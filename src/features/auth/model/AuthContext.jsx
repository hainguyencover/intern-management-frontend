/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "@/features/auth/api/authApi";

function normalizeRole(role) {
    if (!role && typeof role !== 'string') return String(role || '').toUpperCase();
    const upper = String(role).toUpperCase();
    if (upper === "HUMAN RESOURCES" || upper === "HR" || upper === "ROLE_HR") return "HR";
    if (upper === "INTERN" || upper === "ROLE_INTERN") return "INTERN";
    if (upper === "ADMIN" || upper === "ADMINISTRATOR" || upper === "ROLE_ADMIN") return "ADMIN";
    if (upper === "MENTOR" || upper === "ROLE_MENTOR") return "MENTOR";
    return upper; // fallback to upper case
}

const AuthContext = createContext(null);

function mapRoles(rawRoles) {
    if (!rawRoles) return [];
    if (!Array.isArray(rawRoles)) return [normalizeRole(rawRoles)];
    return rawRoles.map((r) => {
        // handle objects like {name: 'ROLE_HR'} or {role: 'HR'}
        if (typeof r === 'string') return normalizeRole(r);
        if (r && typeof r === 'object') {
            if (r.name) return normalizeRole(r.name);
            if (r.role) return normalizeRole(r.role);
            if (r.authority) return normalizeRole(r.authority);
        }
        return normalizeRole(String(r));
    }).filter(Boolean);
}

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem("accessToken") || "");
    const [user, setUser] = useState(() => {
        const raw = localStorage.getItem("authUser");
        if (!raw) return null;
        try {
            const parsed = JSON.parse(raw);
            // Ensure roles are normalized even if stored previously in different shape
            return {
                id: parsed.id,
                email: parsed.email,
                fullName: parsed.fullName || parsed.name,
                roles: mapRoles(parsed.roles || parsed.role || parsed.authorities || parsed.authority),
                status: parsed.status,
                applicationStatus: parsed.applicationStatus,
                internId: parsed.internId,
            };
        } catch {
            return null;
        }
    });
    const [loading, setLoading] = useState(false);

    const isAuthenticated = !!token;

    const login = async ({ email, password }) => {
        setLoading(true);
        try {
            // Backend của bạn trả JwtResponse: { token, roles, email, fullName, id }
            const res = await authApi.login({ email, password });
            // res is now the unwrapped ApiResponse, so res.data is the payload
            const data = res.data;

            const accessToken = data.token || data.accessToken;
            if (!accessToken) throw new Error("Missing token from server response");

            setToken(accessToken);
            localStorage.setItem("accessToken", accessToken);
            if (data.refreshToken) {
                localStorage.setItem("refreshToken", data.refreshToken);
            }

            // Lấy thêm thông tin chi tiết (bao gồm cả applicationStatus, internId) từ endpoint /me
            try {
                const meRes = await authApi.me();
                const me = meRes.data;
                const nextUser = {
                    id: me.id,
                    email: me.email,
                    fullName: me.fullName || me.name,
                    roles: mapRoles(me.roles || me.authorities || me.authority),
                    status: me.status,
                    applicationStatus: me.applicationStatus,
                    internId: me.internId
                };
                setUser(nextUser);
                localStorage.setItem("authUser", JSON.stringify(nextUser));
                return nextUser;
            } catch (e) {
                // Fallback nếu không gọi được /me
                const nextUser = {
                    id: data.id,
                    email: data.email,
                    fullName: data.fullName,
                    roles: mapRoles(data.roles),
                };
                setUser(nextUser);
                localStorage.setItem("authUser", JSON.stringify(nextUser));
                return nextUser;
            }
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setToken("");
        setUser(null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("authUser");
    };

    // Nếu bạn muốn “hydrate” từ /me khi refresh:
    useEffect(() => {
        const run = async () => {
            if (!token) return; // Always refresh user data on mount if token exists
            try {
                const res = await authApi.me();
                const me = res.data; // res is already unwrapped, so res.data is the payload
                const nextUser = {
                    id: me.id,
                    email: me.email,
                    fullName: me.fullName || me.name,
                    roles: mapRoles(me.roles || me.authorities || me.authority),
                    // US10: Add fields for Intern Guard
                    status: me.status,
                    applicationStatus: me.applicationStatus,
                    internId: me.internId
                };
                setUser(nextUser);
                localStorage.setItem("authUser", JSON.stringify(nextUser));
            } catch {
                logout();
            }
        };
        run();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const value = useMemo(
        () => ({ token, user, loading, isAuthenticated, login, logout }),
        [token, user, loading, isAuthenticated]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}
