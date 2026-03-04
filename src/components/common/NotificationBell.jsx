import React, { useEffect, useState } from "react";
import { Bell, CheckCheck, Inbox } from "lucide-react";
import { notificationApi } from "../../api/notificationApi";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";

export default function NotificationBell() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
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
                            {notifications.map((n) => (
                                <div key={n.id} className={cn(
                                    "group relative flex flex-col gap-1 p-4 transition-colors hover:bg-slate-50",
                                    !n.read && "bg-blue-50/30 font-medium"
                                )}>
                                    {!n.read && (
                                        <div className="absolute left-1 top-5 h-1.5 w-1.5 rounded-full bg-primary" />
                                    )}
                                    <div className="text-sm text-slate-900 leading-tight">{n.title}</div>
                                    <p className="text-xs text-muted-foreground line-clamp-2">{n.content}</p>
                                    <span className="text-[10px] text-slate-400 mt-1">
                                        {new Date(n.createdAt).toLocaleString('vi-VN')}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
                <Separator />
                <div className="p-2 text-center">
                    <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground">
                        Xem tất cả thông báo
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}

const cn = (...inputs) => {
    // Helper to avoid circular dependency in this chunk if needed, 
    // but better use the global one. Since I'm replacing the whole file,
    // I'll just import it correctly or define locally if I must.
    // I already have utils/utils.js. I'll import it.
    return inputs.filter(Boolean).join(" ");
};
