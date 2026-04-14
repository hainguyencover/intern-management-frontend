import React, { useEffect, useState } from "react";
import { scheduleApi } from "@/api/scheduleApi";
import { toast } from "sonner";
import {
    CalendarDays,
    Clock,
    MapPin,
    User,
    Calendar as CalendarIcon,
    ChevronRight,
    Search
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

export default function MySchedule() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadSchedule();
    }, []);

    const loadSchedule = async () => {
        setLoading(true);
        try {
            const res = await scheduleApi.getMySchedule();
            setEvents(res.data || []);
        } catch (error) {
            toast.error("Không thể tải lịch thực tập");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-4xl space-y-8 pb-20 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
                        <CalendarDays className="h-10 w-10 text-primary" />
                        Lịch trình của tôi
                    </h1>
                    <p className="text-slate-500 font-medium italic">Theo dõi lộ trình, các buổi review và lịch check-in định kỳ.</p>
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input placeholder="Tìm kiếm sự kiện..." className="pl-10 rounded-xl border-slate-200" />
                </div>
            </div>

            {loading ? (
                <div className="space-y-4">
                    <Skeleton className="h-32 w-full rounded-2xl" />
                    <Skeleton className="h-32 w-full rounded-2xl" />
                    <Skeleton className="h-32 w-full rounded-2xl" />
                </div>
            ) : events.length === 0 ? (
                <Card className="border-none shadow-xl shadow-slate-200/50 bg-slate-50/50">
                    <CardContent className="py-20 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="h-16 w-16 rounded-3xl bg-white flex items-center justify-center text-slate-300 shadow-sm">
                            <CalendarIcon className="h-8 w-8" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-lg font-bold text-slate-900">Chưa có lịch trình</h3>
                            <p className="text-sm text-slate-500 max-w-[250px]">Lịch thực tập của bạn chưa được thiết lập. Vui lòng liên hệ Mentor hoặc HR.</p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {events.map((event) => (
                        <Card key={event.id} className="group border-none shadow-lg shadow-slate-200/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 overflow-hidden">
                            <CardContent className="p-0">
                                <div className="flex flex-col md:flex-row">
                                    <div className="w-full md:w-40 bg-slate-900 p-6 flex flex-col items-center justify-center text-center space-y-1">
                                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">
                                            {event.date ? new Date(event.date).toLocaleDateString('vi-VN', { month: 'long' }) : 'THÁNG'}
                                        </span>
                                        <span className="text-4xl font-black text-white">
                                            {event.date ? new Date(event.date).getDate() : '--'}
                                        </span>
                                        <span className="text-xs font-bold text-slate-400">
                                            {event.date ? new Date(event.date).toLocaleDateString('vi-VN', { weekday: 'long' }) : 'Ngày'}
                                        </span>
                                    </div>
                                    <div className="flex-grow p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <Badge className="rounded-md bg-primary/10 text-primary hover:bg-primary/20 border-none px-2 text-[10px] font-black uppercase tracking-wider">
                                                    {event.type || 'Sự kiện'}
                                                </Badge>
                                                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-tighter">
                                                    <Clock className="h-3 w-3" />
                                                    {event.startTime || '08:00'} — {event.endTime || '17:00'}
                                                </div>
                                            </div>
                                            <h3 className="text-xl font-black text-slate-900 group-hover:text-primary transition-colors">
                                                {event.title}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-500">
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin className="h-4 w-4 text-slate-400" />
                                                    {event.location || 'Văn phòng CodeGym'}
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <User className="h-4 w-4 text-slate-400" />
                                                    {event.mentorName || 'Mentor phụ trách'}
                                                </div>
                                            </div>
                                        </div>
                                        <Button variant="ghost" className="h-12 w-12 rounded-2xl group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                            <ChevronRight className="h-6 w-6" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
