import React, { useEffect, useState } from "react";
import { Bell, CheckCheck, Inbox } from "lucide-react";
import { notificationApi } from "@/api/notificationApi";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";

export default function NotificationBell() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
            const [listRes, countRes] = await Promise.all([
                notificationApi.getAll({ page: 0, size: 10 }),
                notificationApi.getUnreadCount()
            ]);
            const pageData = listRes.data?.data || listRes.data || {};
            const items = pageData.content || (Array.isArray(listRes.data) ? listRes.data : []);
            const cntData = countRes.data?.data || countRes.data || {};
            const countVal = cntData.count !== undefined ? cntData.count : (typeof cntData === "number" ? cntData : 0);

            setNotifications(items);
            setUnreadCount(countVal);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };

    const handleMarkRead = async () => {
        try {
            await notificationApi.markAllAsRead();
            setUnreadCount(0);
            setNotifications(prev => prev.map(n => ({ ...n, status: 'READ' })));
        } catch (error) {
            console.error(error);
        }
    };

    const handleItemClick = async (notification) => {
        if (notification.status === 'UNREAD') {
            try {
                await notificationApi.markAsRead(notification.id);
                setUnreadCount(prev => Math.max(0, prev - 1));
                setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, status: 'READ' } : n));
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    {unreadCount > 0 && (
                        <Badge className="absolute -right-1 -top-1 h-4 w-4 justify-center bg-destructive p-0 text-[10px] font-bold text-destructive-foreground hover:bg-destructive">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </Badge>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 shadow-xl" align="end">
                <div className="flex items-center justify-between px-4 py-3 bg-slate-50/50">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Thông báo</h3>
                    {unreadCount > 0 && (
                        <Button variant="ghost" size="sm" onClick={handleMarkRead} className="h-7 px-2 text-xs text-primary hover:text-primary hover:bg-primary/10">
                            <CheckCheck className="mr-1 h-3 w-3" />
                            Đánh dấu đã đọc
                        </Button>
                    )}
                </div>
                <Separator />
                <ScrollArea className="h-[350px]">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center opacity-40">
                            <Inbox className="h-10 w-10 mb-2" />
                            <p className="text-xs font-medium">Không có thông báo mới</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-border">
                            {notifications.map((n) => {
                                const isUnread = n.status === 'UNREAD';
                                return (
                                    <div
                                        key={n.id}
                                        onClick={() => handleItemClick(n)}
                                        className={`group relative flex flex-col gap-1 p-4 cursor-pointer transition-colors hover:bg-slate-50 ${
                                            isUnread ? "bg-blue-50/40 font-medium" : ""
                                        }`}
                                    >
                                        {isUnread && (
                                            <div className="absolute left-1.5 top-5 h-2 w-2 rounded-full bg-primary" />
                                        )}
                                        <div className="text-sm text-slate-900 leading-tight">{n.title}</div>
                                        <p className="text-xs text-muted-foreground line-clamp-2">{n.message || n.content}</p>
                                        <span className="text-[10px] text-slate-400 mt-1">
                                            {n.createdAt ? new Date(n.createdAt).toLocaleString('vi-VN') : ''}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </ScrollArea>
                <Separator />
                <div className="p-2 text-center">
                    <Link to="/notifications" onClick={() => setIsOpen(false)}>
                        <Button variant="ghost" size="sm" className="w-full text-xs text-primary">
                            Xem tất cả thông báo
                        </Button>
                    </Link>
                </div>
            </PopoverContent>
        </Popover>
    );
}
