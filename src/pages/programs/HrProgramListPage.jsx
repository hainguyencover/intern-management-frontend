import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {Calendar, Building2, Plus, Search, Edit2, CheckCircle} from 'lucide-react';
import {hrListPrograms, hrPublishProgram} from '../../api/hrProgramsApi';
import {listDepartments} from '../../api/departmentsApi';
import {toast} from 'sonner';

const StatusBadge = ({status}) => {
    const colors = {
        DRAFT: 'bg-gray-100 text-gray-700',
        ACTIVE: 'bg-green-100 text-green-700',
        CLOSED: 'bg-red-100 text-red-700'
    };
    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || colors.DRAFT}`}>
      {status}
    </span>
    );
};

export default function HrProgramListPage() {
    const navigate = useNavigate();
    const [programs, setPrograms] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        departmentId: '',
        status: '',
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
    }, [filters, pagination.page, pagination.size]);

    const loadDepartments = async () => {
        try {
            const data = await listDepartments();
            setDepartments(data);
        } catch (error) {
            console.error('Error loading departments:', error);
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
            if (filters.departmentId) params.departmentId = filters.departmentId;
            if (filters.status) params.status = filters.status;

            const data = await hrListPrograms(params);
            setPrograms(data.content || []);
            setPagination(prev => ({
                ...prev,
                totalPages: data.totalPages || 0
            }));
        } catch (error) {
            console.error('Error loading programs:', error);
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
            console.error('Error publishing program:', error);
            toast.error('Không thể publish chương trình');
        }
    };

    const filteredPrograms = programs.filter(p =>
        !filters.search || p.name.toLowerCase().includes(filters.search.toLowerCase())
    );

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Chương trình thực tập</h1>
                    <p className="text-gray-600 mt-1">Quản lý các chương trình thực tập theo phòng ban</p>
                </div>
                <button
                    onClick={() => navigate('/hr/programs/new')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-5 h-5"/>
                    Tạo chương trình mới
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
                        <input
                            type="text"
                            placeholder="Tìm kiếm chương trình..."
                            value={filters.search}
                            onChange={(e) => setFilters({...filters, search: e.target.value})}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <select
                        value={filters.departmentId}
                        onChange={(e) => setFilters({...filters, departmentId: e.target.value})}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Tất cả phòng ban</option>
                        {departments.map(dept => (
                            <option key={dept.id} value={dept.id}>{dept.name}</option>
                        ))}
                    </select>
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters({...filters, status: e.target.value})}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="DRAFT">Draft</option>
                        <option value="ACTIVE">Active</option>
                        <option value="CLOSED">Closed</option>
                    </select>
                </div>
            </div>

            {/* Programs Grid */}
            {loading ? (
                <div className="text-center py-12">
                    <div
                        className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : filteredPrograms.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <p className="text-gray-500">Chưa có chương trình nào</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPrograms.map(program => (
                        <div key={program.id}
                             className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="p-6 space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 text-lg mb-1">{program.name}</h3>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Building2 className="w-4 h-4"/>
                                            {program.departmentName}
                                        </div>
                                    </div>
                                    <StatusBadge status={program.status}/>
                                </div>

                                <p className="text-sm text-gray-600 line-clamp-2">
                                    {program.description || 'Chưa có mô tả'}
                                </p>

                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Calendar className="w-4 h-4"/>
                                    {program.startDate ? new Date(program.startDate).toLocaleDateString('vi-VN') : 'N/A'}
                                    {' - '}
                                    {program.endDate ? new Date(program.endDate).toLocaleDateString('vi-VN') : 'N/A'}
                                </div>

                                <div className="flex items-center gap-2 pt-2 border-t">
                                    <button
                                        onClick={() => navigate(`/hr/programs/${program.id}/groups`)}
                                        className="flex-1 px-3 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
                                    >
                                        Quản lý nhóm
                                    </button>
                                    <button
                                        onClick={() => navigate(`/hr/programs/${program.id}`)}
                                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                        title="Chỉnh sửa"
                                    >
                                        <Edit2 className="w-4 h-4"/>
                                    </button>
                                    {program.status === 'DRAFT' && (
                                        <button
                                            onClick={() => handlePublish(program.id)}
                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                            title="Publish chương trình"
                                        >
                                            <CheckCircle className="w-4 h-4"/>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="flex justify-center gap-2">
                    <button
                        onClick={() => setPagination(prev => ({...prev, page: Math.max(0, prev.page - 1)}))}
                        disabled={pagination.page === 0}
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                        Trước
                    </button>
                    <span className="px-4 py-2">
            Trang {pagination.page + 1} / {pagination.totalPages}
          </span>
                    <button
                        onClick={() => setPagination(prev => ({
                            ...prev,
                            page: Math.min(prev.totalPages - 1, prev.page + 1)
                        }))}
                        disabled={pagination.page >= pagination.totalPages - 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                        Sau
                    </button>
                </div>
            )}
        </div>
    );
}
