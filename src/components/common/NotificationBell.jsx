import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { notificationApi } from "../../api/notificationApi";

export default function NotificationBell() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Poll for notifications every 60s
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
            // Parallel fetch
            const [unreadRes, countRes] = await Promise.all([
                notificationApi.getUnread(),
                notificationApi.getUnreadCount()
            ]);

            setNotifications(unreadRes.data || []);
            setUnreadCount(countRes.data || 0);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleMarkRead = async () => {
        try {
            await notificationApi.markAllAsRead();
            setUnreadCount(0);
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={handleToggle}
                className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100 focus:outline-none"
            >
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                    <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg ring-1 ring-black/5 z-50">
                    <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3">
                        <h3 className="text-sm font-semibold text-slate-900">Thông báo</h3>
                        {unreadCount > 0 && (
                            <button onClick={handleMarkRead} className="text-xs font-medium text-blue-600 hover:text-blue-700">
                                Đánh dấu đã đọc
                            </button>
                        )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="px-4 py-8 text-center text-sm text-slate-500">
                                Không có thông báo mới
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {notifications.map((n) => (
                                    <div key={n.id} className={`p-4 hover:bg-slate-50 ${n.read ? 'opacity-60' : ''}`}>
                                        <div className="mb-1 text-sm font-semibold text-slate-900">{n.title}</div>
                                        <p className="text-xs text-slate-600">{n.content}</p>
                                        <p className="mt-2 text-[10px] text-slate-400">
                                            {new Date(n.createdAt).toLocaleString('vi-VN')}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
