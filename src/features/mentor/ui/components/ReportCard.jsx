import React from "react";
import { Link } from "react-router-dom";
import StatusBadge from "@/components/StatusBadge";
import {
    FileText,
    Users,
    Calendar,
    CheckCircle,
    MessageSquare,
    Eye,
    ChevronRight,
    Search
} from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ReportCard({ report, onClick }) {
    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("vi-VN");
    };

    return (
        <Card className="group border-none shadow-xl shadow-slate-200/50 overflow-hidden hover:shadow-2xl hover:shadow-slate-300/50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2">
            <CardHeader className="p-6 pb-2">
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <StatusBadge status={report.status} />
                            {report.rating && (
                                <Badge variant="secondary" className="h-5 px-1.5 rounded-md bg-indigo-50 text-indigo-600 border-indigo-100 font-black text-[9px] uppercase tracking-tighter">
                                    Score: {report.rating}/10
                                </Badge>
                            )}
                        </div>
                        <h3 className="font-black text-slate-900 leading-tight group-hover:text-primary transition-colors">
                            Báo cáo tuần {report.weekNumber || report.week}
                        </h3>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary/5 group-hover:text-primary transition-all">
                        <FileText className="h-5 w-5" />
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-6 pt-2 space-y-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                        <Users className="h-3 w-3" />
                        <span>{report.internName || `ID: ${report.internId}`}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                        <Calendar className="h-3 w-3" />
                        <span>Nộp ngày: {formatDate(report.submittedAt || report.reportDate)}</span>
                    </div>
                </div>

                {report.summary && (
                    <p className="text-sm text-slate-500 font-medium line-clamp-2 leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-dashed border-slate-100 italic">
                        "{report.summary}"
                    </p>
                )}

                {report.mentorFeedback && (
                    <div className="space-y-2 pt-2">
                        <div className="flex justify-between text-[9px] font-black tracking-widest text-primary uppercase">
                            <span className="flex items-center gap-1"><MessageSquare className="h-2.5 w-2.5" /> Mentor Insighter</span>
                        </div>
                        <p className="text-xs text-slate-600 font-bold leading-relaxed line-clamp-2">
                            {report.mentorFeedback}
                        </p>
                    </div>
                )}
            </CardContent>

            <CardFooter className="p-0 border-t bg-slate-50/30">
                {onClick ? (
                    <Button
                        variant="ghost"
                        className="w-full h-12 rounded-none font-black text-[11px] uppercase tracking-widest text-slate-500 hover:text-primary hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
                        onClick={() => onClick(report)}
                    >
                        <Search className="h-3.5 w-3.5" /> Review & Feedback
                    </Button>
                ) : (
                    <Button asChild variant="ghost" className="w-full h-12 rounded-none font-black text-[11px] uppercase tracking-widest text-slate-500 hover:text-primary hover:bg-slate-100 transition-all">
                        <Link to={`/mentor/reports/${report.id}`} className="flex items-center justify-center gap-2">
                            <Eye className="h-3.5 w-3.5" /> View Detailed Insights <ChevronRight className="h-3 w-3" />
                        </Link>
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
