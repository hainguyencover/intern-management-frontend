import React, { useEffect, useMemo, useState } from "react";

import { mentorApi } from "../../api/mentorApi";
import { toast } from "sonner";

export default function MentorList() {

    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchList = async () => {
        setLoading(true);
        try {
            const data = await mentorApi.list();
            const list = Array.isArray(data) ? data : (data.content || []);
            setMentors(list);
        } catch (e) {
            console.error(e);
            toast.error("Failed to load mentors");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchList();
    }, []);

    const filtered = useMemo(() => {
        if (!search.trim()) return mentors;
        const lower = search.toLowerCase();
        return mentors.filter(
            (m) =>
                m.fullName?.toLowerCase().includes(lower) ||
                m.email?.toLowerCase().includes(lower) ||
                m.departmentName?.toLowerCase().includes(lower)
        );
    }, [mentors, search]);



    return (
        <div className="mx-auto w-full max-w-6xl p-5">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                        Mentors
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Manage mentors and their department assignments.
                    </p>
                </div>


            </div>

            <div className="h-4" />

            {/* Filter */}
            <div className="mb-4">
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name, email, department..."
                    className="w-full max-w-md rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                />
            </div>

            {/* List */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {loading ? (
                    <div className="p-8 text-center text-sm text-slate-500">Loading...</div>
                ) : filtered.length === 0 ? (
                    <div className="p-8 text-center text-sm text-slate-500">
                        No mentors found.
                    </div>
                ) : (
                    <div className="w-full overflow-x-auto">
                        <table className="w-full min-w-[800px] border-collapse text-left text-sm">
                            <thead className="bg-slate-50">
                                <tr className="border-b border-slate-200 text-xs font-bold uppercase tracking-wide text-slate-500">
                                    <th className="px-4 py-3">Full Name</th>
                                    <th className="px-4 py-3">Email</th>
                                    <th className="px-4 py-3">Phone</th>
                                    <th className="px-4 py-3">Department</th>

                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filtered.map((m) => (
                                    <tr key={m.id} className="hover:bg-slate-50">
                                        <td className="px-4 py-3 font-semibold text-slate-900">
                                            {m.fullName}
                                        </td>
                                        <td className="px-4 py-3 text-slate-600">{m.email}</td>
                                        <td className="px-4 py-3 text-slate-600">
                                            {m.phone || "---"}
                                        </td>
                                        <td className="px-4 py-3">
                                            {m.departmentName ? (
                                                <span className="inline-flex rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                                                    {m.departmentName}
                                                </span>
                                            ) : (
                                                <span className="text-slate-400 italic">---</span>
                                            )}
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
