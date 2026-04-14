import React, { useEffect, useState } from "react";
import { internApi } from "@/features/intern/api/internApi";
import { toast } from "sonner";
import {
    BarChart3,
    GraduationCap,
    Briefcase,
    Users,
    FileBarChart2,
    Search,
    Filter,
    ArrowUpRight,
    SearchCheck,
    Calendar,
    LayoutPanelTop,
    Info,
    History
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";

export default function Reports() {
    const [statsUni, setStatsUni] = useState([]);
    const [statsMajor, setStatsMajor] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [resUni, resMajor] = await Promise.all([
                    internApi.getStatsUniversity(),
                    internApi.getStatsMajor(),
                ]);
                setStatsUni(resUni.data);
                setStatsMajor(resMajor.data);
            } catch (err) {
                toast.error("Không thể tải báo cáo thống kê");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="p-8 space-y-8 animate-pulse">
                <div className="h-10 w-48 bg-slate-100 rounded-xl" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="h-96 bg-slate-50 rounded-3xl" />
                    <div className="h-96 bg-slate-50 rounded-3xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 pb-20 space-y-8 animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        Distribution Reports
                        <Badge variant="outline" className="h-6 border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            DEMOGRAPHICS
                        </Badge>
                    </h1>
                    <p className="text-slate-400 font-medium italic mt-1 text-sm flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 opacity-50" /> Thống kê phân bổ thực tập sinh theo cơ sở giáo dục và chuyên môn.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="h-12 px-6 rounded-2xl bg-slate-50 flex items-center gap-2 text-slate-500 font-black text-[10px] uppercase tracking-widest border border-slate-100 shadow-sm">
                        <History className="h-4 w-4" /> Snapshot: {new Date().toLocaleDateString('vi-VN')}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Stats by University */}
                <Card className="border-none shadow-2xl shadow-slate-200/60 overflow-hidden rounded-3xl bg-white group">
                    <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-900 text-white">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center text-white transition-all group-hover:bg-white group-hover:text-slate-900">
                                <GraduationCap className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Educational Institution</h2>
                                <p className="text-lg font-black tracking-tight uppercase">Theo Trường Đại Học</p>
                            </div>
                        </div>
                        <FileBarChart2 className="h-6 w-6 text-slate-700 opacity-50" />
                    </div>
                    <Table>
                        <TableHeader className="bg-slate-50/80">
                            <TableRow className="hover:bg-transparent border-slate-100">
                                <TableHead className="text-[10px] font-black uppercase text-slate-400 py-4 pl-8 italic">University / College</TableHead>
                                <TableHead className="text-right text-[10px] font-black uppercase text-slate-400 py-4 pr-8 italic">Headcount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {statsUni.map((item, idx) => (
                                <TableRow key={idx} className="group/row hover:bg-slate-50/80 border-slate-50 transition-colors">
                                    <TableCell className="py-5 pl-8">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover/row:bg-primary/10 group-hover/row:text-primary transition-all">
                                                <SearchCheck className="h-4 w-4" />
                                            </div>
                                            <span className="text-[14px] font-bold text-slate-800 italic tracking-tight">{item.groupName}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-5 pr-8 text-right">
                                        <Badge className="bg-primary/5 text-primary border-none shadow-none font-black text-[11px] px-4 py-1 h-7">
                                            {item.count}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {statsUni.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={2} className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-2 opacity-20">
                                            <Info className="h-10 w-10" />
                                            <p className="text-xs font-black uppercase tracking-widest">No University Data</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Card>

                {/* Stats by Major */}
                <Card className="border-none shadow-2xl shadow-slate-200/60 overflow-hidden rounded-3xl bg-white group">
                    <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-white">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary transition-all group-hover:bg-primary group-hover:text-white">
                                <Briefcase className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Academic Major</h2>
                                <p className="text-lg font-black text-slate-900 tracking-tight uppercase leading-none mt-1">Theo Chuyên Ngành</p>
                            </div>
                        </div>
                        <LayoutPanelTop className="h-6 w-6 text-slate-100" />
                    </div>
                    <Table>
                        <TableHeader className="bg-slate-50/80">
                            <TableRow className="hover:bg-transparent border-slate-100">
                                <TableHead className="text-[10px] font-black uppercase text-slate-400 py-4 pl-8 italic">Field of Study</TableHead>
                                <TableHead className="text-right text-[10px] font-black uppercase text-slate-400 py-4 pr-8 italic">Headcount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {statsMajor.map((item, idx) => (
                                <TableRow key={idx} className="group/row hover:bg-slate-50/80 border-slate-50 transition-colors">
                                    <TableCell className="py-5 pl-8">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover/row:bg-emerald-50 group-hover/row:text-emerald-600 transition-all">
                                                <Users className="h-4 w-4" />
                                            </div>
                                            <span className="text-[14px] font-bold text-slate-800 italic tracking-tight">{item.groupName}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-5 pr-8 text-right">
                                        <Badge className="bg-emerald-50 text-emerald-600 border-none shadow-none font-black text-[11px] px-4 py-1 h-7">
                                            {item.count}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {statsMajor.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={2} className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-2 opacity-20">
                                            <Info className="h-10 w-10" />
                                            <p className="text-xs font-black uppercase tracking-widest">No Major Data</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Card>
            </div>
        </div>
    );
}
