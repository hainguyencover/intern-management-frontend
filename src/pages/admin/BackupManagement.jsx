import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Database, Download, History, PlayCircle } from "lucide-react";
import {backupApi as adminApi} from "../../api/backupApi.js";

export default function BackupManagement() {
    const [backups, setBackups] = useState([]);
    const [loading, setLoading] = useState(false);
    const [running, setRunning] = useState(false);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const res = await adminApi.getBackupHistory();
            setBackups(res.data || []);
        } catch (error) {
            // toast.error("Failed to load backup history"); 
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleRunBackup = async () => {
        if (!window.confirm("Start a manual system backup? This might affect system performance.")) return;
        setRunning(true);
        try {
            await adminApi.triggerBackup();
            toast.success("Backup job started");
            // Poll for updates or just refresh list after a delay
            setTimeout(fetchHistory, 2000);
        } catch (error) {
            toast.error("Failed to start backup");
        } finally {
            setRunning(false);
        }
    }

    // Helper to format bytes
    const formatSize = (bytes) => {
        if (!bytes) return "0 B";
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    return (
        <div className="mx-auto w-full max-w-4xl p-5">
            <div className="mb-8">
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                    System Backups
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    Manage database backups and restore points.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card: Actions */}
                <div className="md:col-span-1 space-y-4">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                            <Database size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Manual Backup</h3>
                        <p className="mb-6 mt-2 text-sm text-slate-500">
                            Trigger an immediate full database backup.
                        </p>
                        <button
                            onClick={handleRunBackup}
                            disabled={running}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
                        >
                            {running ? (
                                <>Running...</>
                            ) : (
                                <>
                                    <PlayCircle size={18} />
                                    Run Backup Now
                                </>
                            )}
                        </button>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-indigo-600 p-6 shadow-sm text-white">
                        <h3 className="text-lg font-bold">Scheduled Backup</h3>
                        <p className="mt-2 text-sm text-indigo-100">
                            System automatically backs up data every day at 02:00 AM using Cron.
                        </p>
                        <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white/20 px-3 py-1 text-xs font-medium">
                            Status: Active
                        </div>
                    </div>
                </div>

                {/* Card: History List */}
                <div className="md:col-span-2">
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
                            <div className="flex items-center gap-2 font-bold text-slate-900">
                                <History size={18} />
                                Backup History
                            </div>
                            <button onClick={fetchHistory} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">Refresh</button>
                        </div>

                        <div className="max-h-[500px] overflow-y-auto">
                            {loading ? (
                                <div className="p-8 text-center text-sm text-slate-500">Loading history...</div>
                            ) : backups.length === 0 ? (
                                <div className="p-8 text-center text-sm text-slate-500">No backup records found.</div>
                            ) : (
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-white border-b border-slate-100">
                                        <tr className="text-xs uppercase text-slate-400">
                                            <th className="px-6 py-3 font-semibold">Date</th>
                                            <th className="px-6 py-3 font-semibold">Status</th>
                                            <th className="px-6 py-3 font-semibold">Size</th>
                                            <th className="px-6 py-3 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {backups.map((item) => (
                                            <tr key={item.id} className="hover:bg-slate-50">
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-slate-900">
                                                        {new Date(item.createdAt).toLocaleString()}
                                                    </div>
                                                    <div className="text-xs text-slate-500 capitalize">{item.type}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${item.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-700' :
                                                            item.status === 'RUNNING' ? 'bg-amber-50 text-amber-700' :
                                                                'bg-rose-50 text-rose-700'
                                                        }`}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-slate-600 font-mono text-xs">
                                                    {formatSize(item.fileSize)}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    {item.status === 'SUCCESS' && (
                                                        <button className="text-slate-400 hover:text-indigo-600 transition">
                                                            <Download size={18} />
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
