import React, {useState} from "react";
import {useAuth} from "../auth/AuthContext";
import {useNavigate, Link} from "react-router-dom";

export default function Login() {
    const {login, loading} = useAuth();
    const nav = useNavigate();
    const [email, setEmail] = useState("hr@company.com");
    const [password, setPassword] = useState("hr123");
    const [err, setErr] = useState("");

    const inputClass =
        "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none " +
        "placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100";

    const onSubmit = async (e) => {
        e.preventDefault();
        setErr("");
        try {
            const u = await login({email, password});
            const roles = u?.roles || [];
            if (roles.includes("ADMIN")) nav("/dashboard/admin");
            else if (roles.includes("HR")) nav("/dashboard/hr");
            else if (roles.includes("MENTOR")) nav("/dashboard/mentor");
            else nav("/dashboard/intern");
        } catch (e2) {
            setErr(e2?.response?.data?.message || e2.message || "Login failed");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 grid place-items-center p-4">
            <form
                onSubmit={onSubmit}
                className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
                <h2 className="text-xl font-extrabold text-slate-900">Login</h2>
                <p className="mt-1 text-sm text-slate-500">Welcome back. Please sign in to continue.</p>

                <div className="mt-5 space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Email</label>
                        <input
                            className={inputClass}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Password</label>
                        <input
                            className={inputClass}
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                        />
                    </div>

                    {err && (
                        <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                            {err}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Signing in..." : "Sign in"}
                    </button>

                    <Link
                        to="/register"
                        className="block text-center text-sm font-semibold text-slate-700 hover:text-slate-900"
                    >
                        Create an account
                    </Link>
                </div>
            </form>
        </div>
    );
}
