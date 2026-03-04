import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Calendar,
    Building2,
    Plus,
    Search,
    Edit2,
    CheckCircle,
    Filter,
    ArrowRight,
    Target,
    Users,
    ChevronLeft,
    ChevronRight,
    Layout
} from 'lucide-react';
import { hrListPrograms, hrPublishProgram } from '../../api/hrProgramsApi';
import { listDepartments } from '../../api/departmentApi';
import { toast } from 'sonner';
import StatusBadge from '../../components/StatusBadge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";

export default function HrProgramListPage() {
    const navigate = useNavigate();
    const [programs, setPrograms] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        departmentId: 'all',
        status: 'all',
        search: ''
    });
    const [pagination, setPagination] = useState({
        page: 0,
        size: 10,
        totalPages: 0
    });

    useEffect(() => {
        loadDepartments();
    }, []);

    useEffect(() => {
        loadPrograms();
    }, [filters.departmentId, filters.status, pagination.page, pagination.size]);

    const loadDepartments = async () => {
        try {
            const data = await listDepartments();
            setDepartments(data);
        } catch (error) {
            toast.error('Không thể tải danh sách phòng ban');
        }
    };

    const loadPrograms = async () => {
        setLoading(true);
        try {
            const params = {
                page: pagination.page,
                size: pagination.size
            };
            if (filters.departmentId !== 'all') params.departmentId = filters.departmentId;
            if (filters.status !== 'all') params.status = filters.status;

            const data = await hrListPrograms(params);
            setPrograms(data.content || []);
            setPagination(prev => ({
                ...prev,
                totalPages: data.totalPages || 0
            }));
        } catch (error) {
            toast.error('Không thể tải danh sách chương trình');
        } finally {
            setLoading(false);
        }
    };

    const handlePublish = async (programId) => {
        if (!confirm('Bạn có chắc chắn muốn publish chương trình này?')) return;

        try {
            await hrPublishProgram(programId);
            toast.success('Đã publish chương trình thành công');
            loadPrograms();
        } catch (error) {
            toast.error('Không thể publish chương trình');
        }
    };

    const filteredPrograms = programs.filter(p =>
        !filters.search || p.name.toLowerCase().includes(filters.search.toLowerCase())
    );

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                        Internship Programs
                    </h1>
                    <p className="text-sm font-medium text-slate-500 italic flex items-center gap-2">
                        <Layout className="h-4 w-4" /> Kiến tạo lộ trình thực tập chuyên nghiệp theo phòng ban.
                    </p>
                </div>
                <Button
                    onClick={() => navigate('/hr/programs/new')}
                    className="h-12 px-6 rounded-2xl bg-slate-900 hover:bg-black font-black shadow-xl shadow-slate-200 transition-all active:scale-95"
                >
                    <Plus className="mr-2 h-5 w-5" /> TẠO CHƯƠNG TRÌNH MỚI
                </Button>
            </div>

            {/* Filters Bar */}
            <Card className="border-none shadow-xl shadow-slate-200/50 bg-white/50 backdrop-blur-sm">
                <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                        <div className="md:col-span-5 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                            <Input
                                placeholder="Tìm kiếm tên chương trình..."
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                className="h-11 pl-10 rounded-xl border-slate-200 focus:ring-primary/20"
                            />
                        </div>
                        <div className="md:col-span-3">
                            <Select
                                value={filters.departmentId}
                                onValueChange={(val) => setFilters({ ...filters, departmentId: val })}
                            >
                                <SelectTrigger className="h-11 rounded-xl border-slate-200 font-bold text-slate-600">
                                    <SelectValue placeholder="Phòng ban" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="all">Tất cả phòng ban</SelectItem>
                                    {departments.map(dept => (
                                        <SelectItem key={dept.id} value={String(dept.id)} className="font-medium">{dept.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="md:col-span-3">
                            <Select
                                value={filters.status}
                                onValueChange={(val) => setFilters({ ...filters, status: val })}
                            >
                                <SelectTrigger className="h-11 rounded-xl border-slate-200 font-bold text-slate-600">
                                    <SelectValue placeholder="Trạng thái" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="all">Mọi trạng thái</SelectItem>
                                    <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                                    <SelectItem value="CLOSED">Đã đóng</SelectItem>
                                    <SelectItem value="DRAFT">Bản nháp</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="md:col-span-1 flex justify-center">
                            <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                                <Filter className="h-5 w-5" />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Content Area */}
            {loading ? (
                <div className="p-20 flex flex-col items-center justify-center space-y-4">
                    <div className="h-12 w-12 rounded-full border-4 border-slate-200 border-t-primary animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing Program Database...</p>
                </div>
            ) : filteredPrograms.length === 0 ? (
                <div className="p-20 flex flex-col items-center justify-center space-y-4 bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-100">
                    <Target className="h-16 w-16 text-slate-200" />
                    <p className="text-slate-400 font-bold uppercase tracking-tight text-sm">Chưa có chương trình nào được ghi nhận.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
                    {filteredPrograms.map(program => (
                        <Card key={program.id} className="group border-none shadow-2xl shadow-slate-200/60 overflow-hidden hover:shadow-primary/10 transition-all duration-500">
                            <CardHeader className="bg-slate-50/50 p-6 border-b">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2 max-w-[70%]">
                                        <h3 className="text-lg font-black text-slate-900 group-hover:text-primary transition-colors truncate">
                                            {program.name}
                                        </h3>
                                        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 italic">
                                            <Building2 className="h-3 w-3" /> {program.departmentName}
                                        </div>
                                    </div>
                                    <StatusBadge status={program.status} />
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <p className="text-sm text-slate-500 font-medium line-clamp-2 leading-relaxed h-10">
                                    {program.description || 'Chương trình này hiện chưa có mô tả chi tiết từ HR.'}
                                </p>

                                <div className="flex items-center justify-between pt-2">
                                    <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
                                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                        {program.startDate ? new Date(program.startDate).toLocaleDateString('vi-VN') : 'N/A'}
                                        <ArrowRight className="h-3 w-3 text-slate-300" />
                                        {program.endDate ? new Date(program.endDate).toLocaleDateString('vi-VN') : 'N/A'}
                                    </div>
                                    <Badge variant="outline" className="h-6 border-slate-100 text-[10px] font-black tracking-tighter">
                                        DEP_UID: {program.departmentId}
                                    </Badge>
                                </div>
                            </CardContent>
                            <CardFooter className="p-4 bg-white border-t flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => navigate(`/hr/programs/${program.id}/groups`)}
                                    className="flex-1 rounded-xl h-11 font-black text-[10px] uppercase tracking-widest border-slate-200 hover:bg-slate-900 hover:text-white transition-all"
                                >
                                    <Users className="mr-2 h-4 w-4" /> Quản lý nhóm
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => navigate(`/hr/programs/${program.id}`)}
                                    className="h-11 w-11 rounded-xl border border-slate-100 hover:bg-slate-100 transition-all shrink-0"
                                >
                                    <Edit2 className="h-4 w-4 text-slate-500" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 pt-4 pb-12">
                    <Button
                        variant="ghost"
                        onClick={() => setPagination(prev => ({ ...prev, page: Math.max(0, prev.page - 1) }))}
                        disabled={pagination.page === 0}
                        className="h-10 px-4 rounded-xl font-bold text-slate-500 transition-all active:scale-95"
                    >
                        <ChevronLeft className="mr-2 h-4 w-4" /> Trước
                    </Button>
                    <div className="px-6 py-2 rounded-xl bg-slate-900 text-white text-xs font-black tracking-widest">
                        PHASE {pagination.page + 1} / {pagination.totalPages}
                    </div>
                    <Button
                        variant="ghost"
                        onClick={() => setPagination(prev => ({
                            ...prev,
                            page: Math.min(prev.totalPages - 1, prev.page + 1)
                        }))}
                        disabled={pagination.page >= pagination.totalPages - 1}
                        className="h-10 px-4 rounded-xl font-bold text-slate-500 transition-all active:scale-95"
                    >
                        Sau <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}
