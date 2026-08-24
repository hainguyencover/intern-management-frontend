import React, { useEffect, useState, useMemo } from "react";
import { scheduleApi } from "@/api/scheduleApi";
import { toast } from "sonner";
import {
    CalendarDays,
    Clock,
    MapPin,
    User,
    Calendar as CalendarIcon,
    ChevronRight,
    Search,
    Filter,
    CheckCircle2,
    Flag,
    ListTodo
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function MySchedule() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState("ALL");

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

    const filteredEvents = useMemo(() => {
        return events.filter(event => {
            const matchesQuery = !searchQuery.trim() || 
                event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.type?.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesType = filterType === "ALL" || 
                (filterType === "PROGRAM" && (event.type === "PROGRAM_START" || event.type === "PROGRAM_END")) ||
                (filterType === "TASK" && event.type === "TASK");

            return matchesQuery && matchesType;
        });
    }, [events, searchQuery, filterType]);

    const getTypeBadge = (type) => {
        switch (type) {
            case "PROGRAM_START":
                return { label: "Khởi động chương trình", className: "bg-emerald-500/10 text-emerald-600 border-emerald-200" };
            case "PROGRAM_END":
                return { label: "Kết thúc chương trình", className: "bg-amber-500/10 text-amber-600 border-amber-200" };
            case "TASK":
                return { label: "Nhiệm vụ", className: "bg-blue-500/10 text-blue-600 border-blue-200" };
            default:
                return { label: type || "Sự kiện", className: "bg-slate-100 text-slate-600" };
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
                    <p className="text-slate-500 font-medium italic">Theo dõi lộ trình chương trình thực tập và danh sách nhiệm vụ được giao.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1">
                        <button
                            onClick={() => setFilterType("ALL")}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${filterType === "ALL" ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-900"}`}
                        >
                            Tất cả
                        </button>
                        <button
                            onClick={() => setFilterType("PROGRAM")}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${filterType === "PROGRAM" ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-900"}`}
                        >
                            Chương trình
                        </button>
                        <button
                            onClick={() => setFilterType("TASK")}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${filterType === "TASK" ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-900"}`}
                        >
                            Nhiệm vụ
                        </button>
                    </div>
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Tìm kiếm sự kiện..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 rounded-xl border-slate-200"
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="space-y-4">
                    <Skeleton className="h-32 w-full rounded-2xl" />
                    <Skeleton className="h-32 w-full rounded-2xl" />
                    <Skeleton className="h-32 w-full rounded-2xl" />
                </div>
            ) : filteredEvents.length === 0 ? (
                <Card className="border-none shadow-xl shadow-slate-200/50 bg-slate-50/50">
                    <CardContent className="py-20 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="h-16 w-16 rounded-3xl bg-white flex items-center justify-center text-slate-300 shadow-sm">
                            <CalendarIcon className="h-8 w-8" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-lg font-bold text-slate-900">Chưa có lịch trình</h3>
                            <p className="text-sm text-slate-500 max-w-[300px]">
                                {searchQuery || filterType !== "ALL"
                                    ? "Không tìm thấy mốc lịch trình nào phù hợp với bộ lọc."
                                    : "Lịch thực tập của bạn chưa được thiết lập hoặc chưa có nhiệm vụ nào. Vui lòng liên hệ Mentor hoặc HR."}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {filteredEvents.map((event, idx) => {
                        const typeInfo = getTypeBadge(event.type);
                        return (
                            <Card key={event.id || idx} className="group border-none shadow-lg shadow-slate-200/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 overflow-hidden">
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
                                                    <Badge className={`rounded-md border px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${typeInfo.className}`}>
                                                        {typeInfo.label}
                                                    </Badge>
                                                    {event.status && (
                                                        <Badge variant="outline" className="text-[10px] font-bold text-slate-500 border-slate-200">
                                                            {event.status}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <h3 className="text-xl font-black text-slate-900 group-hover:text-primary transition-colors">
                                                    {event.title}
                                                </h3>
                                            </div>
                                            <Button variant="ghost" className="h-12 w-12 rounded-2xl group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                                <ChevronRight className="h-6 w-6" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
