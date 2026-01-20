import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function InternGuard({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="p-10 text-center">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Nếu không phải INTERN, cho qua (để RoleGuard khác xử lý hoặc Admin/Hr access)
    // Hoặc nếu logic này chỉ dùng cho route của Intern thì chặn luôn.
    // Giả sử Guard này chỉ kẹp vào route inter, nên user phải là INTERN (hoặc ADMIN?)
    // Tuy nhiên, logic ở đây là: Nếu là Intern mà chưa Approved thì chặn.

    const isIntern = user.roles && user.roles.includes('INTERN');
    const approvedStatuses = ['APPROVED', 'CONTRACT_SENT', 'CONTRACT_SIGNED'];
    const isApproved = approvedStatuses.includes(user.applicationStatus) || user.status === 'APPROVED';
    // Backend trả về applicationStatus. Ngoài ra check user.internId có null không?

    // Nếu là Intern và CHƯA Approved
    if (isIntern && !isApproved) {
        // Redirect về trang ứng tuyển/trạng thái
        return <Navigate to="/intern/applications" replace />;
    }

    // Nếu đã Approved hoặc không phải Intern (VD: Admin test), cho phép truy cập
    return children ? children : <Outlet />;
}
