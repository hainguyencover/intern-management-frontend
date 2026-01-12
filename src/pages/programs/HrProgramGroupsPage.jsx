import React, {useState, useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Users, Plus, UserPlus, Trash2, X} from 'lucide-react';
import {hrGetProgramDetail} from '../../api/hrProgramsApi';
import {
    hrListGroups,
    hrCreateGroup,
    hrListGroupMembers,
    hrAssignMember,
    hrRemoveMember
} from '../../api/hrProgramGroupsApi';
import {hrListApplications} from '../../api/hrApplications';
import {listMentors} from '../../api/mentorApi';
import {toast} from 'sonner';

const Modal = ({isOpen, onClose, title, children}) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5"/>
                    </button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
};

export default function HrProgramGroupsPage() {
    const {id: programId} = useParams();
    const navigate = useNavigate();

    const [program, setProgram] = useState(null);
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [members, setMembers] = useState([]);
    const [eligibleInterns, setEligibleInterns] = useState([]);
    const [mentors, setMentors] = useState([]);

    const [loading, setLoading] = useState(true);
    const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
    const [showAddMemberModal, setShowAddMemberModal] = useState(false);

    const [groupFormData, setGroupFormData] = useState({
        name: '',
        mentorId: ''
    });

    useEffect(() => {
        loadProgram();
        loadGroups();
        loadEligibleInterns();
        loadMentors();
    }, [programId]);

    useEffect(() => {
        if (selectedGroup) {
            loadMembers(selectedGroup.id);
        }
    }, [selectedGroup]);

    const loadProgram = async () => {
        try {
            const data = await hrGetProgramDetail(programId);
            setProgram(data);
        } catch (error) {
            console.error('Error loading program:', error);
            toast.error('Không thể tải thông tin chương trình');
        }
    };

    const loadGroups = async () => {
        setLoading(true);
        try {
            const data = await hrListGroups(programId);
            setGroups(data);
            if (data.length > 0 && !selectedGroup) {
                setSelectedGroup(data[0]);
            }
        } catch (error) {
            console.error('Error loading groups:', error);
            toast.error('Không thể tải danh sách nhóm');
        } finally {
            setLoading(false);
        }
    };

    const loadMembers = async (groupId) => {
        try {
            const data = await hrListGroupMembers(groupId);
            setMembers(data);
        } catch (error) {
            console.error('Error loading members:', error);
            toast.error('Không thể tải danh sách thành viên');
        }
    };

    const loadEligibleInterns = async () => {
        try {
            // Lấy danh sách applications với status APPROVED hoặc CONTRACT_SIGNED
            const approvedApps = await hrListApplications({
                status: 'APPROVED',
                size: 100
            });
            const signedApps = await hrListApplications({
                status: 'CONTRACT_SIGNED',
                size: 100
            });

            // Combine và extract intern info
            const allInterns = [
                ...approvedApps.content.map(app => ({
                    id: app.internId,
                    name: app.internName,
                    email: app.internEmail || ''
                })),
                ...signedApps.content.map(app => ({
                    id: app.internId,
                    name: app.internName,
                    email: app.internEmail || ''
                }))
            ];

            // Remove duplicates by id
            const uniqueInterns = Array.from(
                new Map(allInterns.map(i => [i.id, i])).values()
            );

            setEligibleInterns(uniqueInterns);
        } catch (error) {
            console.error('Error loading eligible interns:', error);
            toast.error('Không thể tải danh sách thực tập sinh');
        }
    };

    const loadMentors = async () => {
        try {
            const data = await listMentors();
            setMentors(data);
        } catch (error) {
            console.error('Error loading mentors:', error);
            toast.error('Không thể tải danh sách mentor');
        }
    };

    const handleCreateGroup = async () => {
        if (!groupFormData.name.trim()) {
            toast.error('Vui lòng nhập tên nhóm');
            return;
        }
        if (!groupFormData.mentorId) {
            toast.error('Vui lòng chọn mentor');
            return;
        }

        try {
            await hrCreateGroup(programId, {
                name: groupFormData.name.trim(),
                mentorId: parseInt(groupFormData.mentorId)
            });
            toast.success('Tạo nhóm thành công');
            setShowCreateGroupModal(false);
            setGroupFormData({name: '', mentorId: ''});
            loadGroups();
        } catch (error) {
            console.error('Error creating group:', error);
            toast.error(error.response?.data?.message || 'Không thể tạo nhóm');
        }
    };

    const handleAddMember = async (internId) => {
        if (!selectedGroup) return;

        try {
            await hrAssignMember(selectedGroup.id, internId);
            toast.success('Thêm thành viên thành công');
            setShowAddMemberModal(false);
            loadMembers(selectedGroup.id);
            loadGroups(); // Refresh để cập nhật memberCount
        } catch (error) {
            console.error('Error adding member:', error);
            const msg = error.response?.data?.message || 'Không thể thêm thành viên';
            toast.error(msg);
        }
    };

    const handleRemoveMember = async (internId) => {
        if (!selectedGroup) return;
        if (!confirm('Bạn có chắc chắn muốn xóa thành viên này khỏi nhóm?')) return;

        try {
            await hrRemoveMember(selectedGroup.id, internId);
            toast.success('Đã xóa thành viên');
            loadMembers(selectedGroup.id);
            loadGroups();
        } catch (error) {
            console.error('Error removing member:', error);
            toast.error('Không thể xóa thành viên');
        }
    };

    if (loading && !program) {
        return (
            <div className="p-6 flex justify-center items-center">
                <div
                    className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <button
                        onClick={() => navigate('/hr/programs')}
                        className="text-blue-600 hover:text-blue-700 mb-2"
                    >
                        ← Quay lại danh sách chương trình
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">{program?.name}</h1>
                    <p className="text-gray-600 mt-1">Quản lý nhóm và phân công thực tập sinh cho mentor</p>
                </div>
                <button
                    onClick={() => setShowCreateGroupModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-5 h-5"/>
                    Tạo nhóm mới
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Groups List */}
                <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <h2 className="font-semibold text-gray-900 mb-4">
                        Danh sách nhóm ({groups.length})
                    </h2>
                    {loading ? (
                        <div className="text-center py-8">
                            <div
                                className="inline-block w-6 h-6 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : groups.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <Users className="w-12 h-12 mx-auto mb-2 opacity-50"/>
                            <p>Chưa có nhóm nào</p>
                            <button
                                onClick={() => setShowCreateGroupModal(true)}
                                className="mt-3 text-sm text-blue-600 hover:text-blue-700"
                            >
                                Tạo nhóm đầu tiên
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {groups.map(group => (
                                <button
                                    key={group.id}
                                    onClick={() => setSelectedGroup(group)}
                                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                                        selectedGroup?.id === group.id
                                            ? 'bg-blue-50 border-2 border-blue-600'
                                            : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                                    }`}
                                >
                                    <div className="font-medium text-gray-900">{group.name}</div>
                                    <div className="text-sm text-gray-600 mt-1">
                                        Mentor: {group.mentorName || 'Chưa có'}
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Users className="w-4 h-4 text-gray-400"/>
                                        <span className="text-sm text-gray-600">
                      {group.memberCount || 0} thành viên
                    </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Members List */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    {selectedGroup ? (
                        <>
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="font-semibold text-gray-900 text-lg">
                                        {selectedGroup.name}
                                    </h2>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Mentor: {selectedGroup.mentorName || 'Chưa có'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowAddMemberModal(true)}
                                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                >
                                    <UserPlus className="w-4 h-4"/>
                                    Thêm thành viên
                                </button>
                            </div>

                            {members.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    <Users className="w-16 h-16 mx-auto mb-3 opacity-30"/>
                                    <p className="text-lg">Chưa có thành viên nào</p>
                                    <p className="text-sm mt-1">
                                        Nhấn "Thêm thành viên" để phân công thực tập sinh vào nhóm
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {members.map(member => (
                                        <div
                                            key={member.internId}
                                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                        >
                                            <div>
                                                <div className="font-medium text-gray-900">
                                                    {member.internName}
                                                </div>
                                                <div className="text-sm text-gray-600 mt-1">
                                                    Tham gia: {new Date(member.joinedAt).toLocaleDateString('vi-VN')}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveMember(member.internId)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Xóa khỏi nhóm"
                                            >
                                                <Trash2 className="w-4 h-4"/>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            <Users className="w-16 h-16 mx-auto mb-3 opacity-30"/>
                            <p className="text-lg">Chọn một nhóm để xem thành viên</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Group Modal */}
            <Modal
                isOpen={showCreateGroupModal}
                onClose={() => {
                    setShowCreateGroupModal(false);
                    setGroupFormData({name: '', mentorId: ''});
                }}
                title="Tạo nhóm mới"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tên nhóm <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={groupFormData.name}
                            onChange={(e) => setGroupFormData({...groupFormData, name: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="VD: Nhóm Backend Development"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mentor <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={groupFormData.mentorId}
                            onChange={(e) => setGroupFormData({...groupFormData, mentorId: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Chọn mentor</option>
                            {mentors.map(mentor => (
                                <option key={mentor.id} value={mentor.id}>
                                    {mentor.user?.fullName || mentor.fullName || `Mentor #${mentor.id}`}
                                </option>
                            ))}
                        </select>
                        {mentors.length === 0 && (
                            <p className="text-xs text-amber-600 mt-1">
                                Chưa có mentor nào trong hệ thống
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            onClick={() => {
                                setShowCreateGroupModal(false);
                                setGroupFormData({name: '', mentorId: ''});
                            }}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleCreateGroup}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Tạo nhóm
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Add Member Modal */}
            <Modal
                isOpen={showAddMemberModal}
                onClose={() => setShowAddMemberModal(false)}
                title="Thêm thành viên vào nhóm"
            >
                <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                        <p className="text-sm text-blue-800">
                            <strong>Lưu ý:</strong> Chỉ những thực tập sinh có trạng thái đơn ứng tuyển
                            là APPROVED hoặc CONTRACT_SIGNED mới có thể được phân công.
                        </p>
                    </div>

                    {eligibleInterns.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <p>Không có thực tập sinh đủ điều kiện</p>
                        </div>
                    ) : (
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {eligibleInterns.map(intern => (
                                <button
                                    key={intern.id}
                                    onClick={() => handleAddMember(intern.id)}
                                    className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="font-medium text-gray-900">{intern.name}</div>
                                    {intern.email && (
                                        <div className="text-sm text-gray-600 mt-1">{intern.email}</div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
}
