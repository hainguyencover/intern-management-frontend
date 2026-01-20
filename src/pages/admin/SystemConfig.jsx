import React, { useState } from "react";
import { toast } from "sonner";
import { Save, Settings, Mail, Database, Cloud, Shield } from "lucide-react";

export default function SystemConfig() {
    const [activeTab, setActiveTab] = useState("general");
    const [configs, setConfigs] = useState([]);
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        loadConfigs();
    }, []);

    const loadConfigs = async () => {
        try {
            const res = await import("../../api/adminApi").then(m => m.adminUserApi.getSystemConfigs());
            setConfigs(res.data);
        } catch (error) {
            console.error("Failed to load configs", error);
        }
    };

    const getValue = (key, def) => {
        const conf = configs.find(c => c.configKey === key);
        return conf ? conf.configValue : def;
    };

    const handleSaveConfig = async (key, value) => {
        try {
            await import("../../api/adminApi").then(m => m.adminUserApi.updateSystemConfig(key, { value }));
            toast.success("Đã cập nhật cấu hình");
            loadConfigs();
        } catch (error) {
            toast.error("Lỗi khi lưu cấu hình");
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    Cấu hình hệ thống
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                    Quản lý các thiết lập toàn hệ thống
                </p>
            </div>

            <div className="flex flex-col gap-6 md:flex-row">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-64 shrink-0">
                    <nav className="flex flex-col gap-1 rounded-xl border border-slate-200 bg-white p-2">
                        {[
                            { id: "general", label: "Chung", icon: Settings },
                            { id: "email", label: "Email Service", icon: Mail },
                            { id: "backup", label: "Sao lưu & Database", icon: Database },
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition ${activeTab === item.id
                                    ? "bg-blue-50 text-blue-700"
                                    : "text-slate-600 hover:bg-slate-50"
                                    }`}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content Area */}
                <div className="flex-1 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    {activeTab === "general" && (
                        <div className="space-y-4">
                            <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">Thông tin hệ thống</h3>
                            <div className="grid gap-4">
                                <div>
                                    <label className="mb-1 block text-sm font-semibold text-slate-700">Tên hệ thống</label>
                                    <input
                                        type="text"
                                        defaultValue={getValue("system.name", "Intern Management System")}
                                        onBlur={(e) => handleSaveConfig("system.name", e.target.value)}
                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-semibold text-slate-700">Email liên hệ Admin</label>
                                    <input
                                        type="email"
                                        defaultValue={getValue("system.admin_email", "admin@company.com")}
                                        onBlur={(e) => handleSaveConfig("system.admin_email", e.target.value)}
                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "email" && (
                        <div className="space-y-4">
                            <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">SMTP Cấu hình</h3>
                            <div className="grid gap-4">
                                <div>
                                    <label className="mb-1 block text-sm font-semibold text-slate-700">SMTP Host</label>
                                    <input
                                        type="text"
                                        defaultValue={getValue("mail.host", "smtp.gmail.com")}
                                        onBlur={(e) => handleSaveConfig("mail.host", e.target.value)}
                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-semibold text-slate-700">SMTP Port</label>
                                    <input
                                        type="number"
                                        defaultValue={getValue("mail.port", "587")}
                                        onBlur={(e) => handleSaveConfig("mail.port", e.target.value)}
                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "backup" && (
                        <div className="space-y-4">
                            <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">Lịch sao lưu tự động</h3>
                            <div className="grid gap-4">
                                <div>
                                    <label className="mb-1 block text-sm font-semibold text-slate-700">Retention (Days)</label>
                                    <input
                                        type="number"
                                        defaultValue={getValue("backup.retention_days", "30")}
                                        onBlur={(e) => handleSaveConfig("backup.retention_days", e.target.value)}
                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
