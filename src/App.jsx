import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import InternGuard from "./auth/InternGuard";
import "./index.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MainLayout from "./layouts/MainLayout";

import AdminDashboard from "./pages/dashboard/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import RoleManagement from "./pages/admin/RolePermissionsPage.jsx";
import BackupManagement from "./pages/admin/BackupManagement";
import AuditLogsPage from "./pages/admin/AuditLogsPage.jsx";
import SystemConfig from "./pages/admin/SystemConfig"; // Phase 2
import HrmIntegration from "./pages/admin/HrmIntegration";
import TimekeepingIntegration from "./pages/admin/TimekeepingIntegration";

import HrDashboard from "./pages/dashboard/HrDashboard";
import MentorDashboard from "./pages/dashboard/MentorDashboard";
import InternDashboard from "./pages/dashboard/InternDashboard";
import CreateIntern from "./pages/hr/CreateIntern";
import InternList from "./pages/hr/InternList";
import EditIntern from "./pages/hr/EditIntern";
import InternDetail from "./pages/hr/InternDetail.jsx";
import MyProfile from "./pages/interns/MyProfile";
import HrDocumentsPage from "./pages/hr/documents/HrDocumentsPage";

import InternDocumentsPage from "./pages/interns/InternDocumentsPage";
import HrUploadInternshipContract from "./pages/hr/documents/contracts/HrUploadInternshipContract";
import InternContractsPage from "./pages/interns/InternContractsPage";
// import InternContractConfirmPage from "./pages/interns/contracts/InternContractConfirmPage.jsx";
import ApplicationListPage from "./pages/hr/ApplicationListPage.jsx";
import ApplicationDetailPage from "./pages/hr/ApplicationDetailPage.jsx";
import ApplicationSubmitPage from "./pages/interns/ApplicationSubmitPage.jsx";
import InternApplicationsPage from "./pages/interns/InternApplicationsPage.jsx";

import Programs from "./pages/hr/Programs";
import MySchedule from "./pages/interns/MySchedule";

import Groups from "./pages/hr/Groups";
import MentorList from "./pages/hr/MentorList";
import MentorDetail from "./pages/hr/MentorDetail";
import MentorTasksPage from "./pages/mentor/MentorTasksPage.jsx";
import WeeklyReportsReviewPage from "./pages/mentor/WeeklyReportsReviewPage.jsx";
import MyTasksPage from "./pages/interns/MyTasksPage.jsx";
import WeeklyReportSubmitPage from "./pages/interns/WeeklyReportSubmitPage.jsx";

import MentorInternList from "./pages/mentor/MentorInternList";
import InternDetailView from "./pages/mentor/InternDetailView";
import TaskManagement from "./pages/mentor/TaskManagement";
import TaskCreate from "./pages/mentor/TaskCreate";
import TaskDetail from "./pages/mentor/TaskDetail";
import WeeklyReports from "./pages/mentor/WeeklyReports";
import EvaluationCreate from "./pages/mentor/EvaluationCreate";
import EvaluationList from "./pages/mentor/EvaluationList";
import EvaluationDetail from "./pages/mentor/EvaluationDetail";

import AttendancePage from "./pages/interns/AttendancePage";
import AttendanceReports from "./pages/hr/AttendanceReports";
import LeaveReports from "./pages/hr/LeaveReports";

import LeaveRequests from "./pages/interns/LeaveRequests";
import LeaveApprovals from "./pages/hr/LeaveApprovals";

import AllowanceManagement from "./pages/hr/AllowanceManagement";
import MyAllowance from "./pages/interns/MyAllowance";
import HelpDesk from "./pages/hr/HelpDesk";
import SupportTickets from "./pages/interns/SupportTickets";
import HrDepartmentsPage from "./pages/hr/departments/HrDepartmentsPage";
import FinalReportPage from "./pages/hr/reports/FinalReportPage";
import HrReportsPage from "./pages/hr/reports/HrReportsPage";
import Statistics from "./pages/hr/Statistics";

function Unauthorized() {
    return (
        <div style={{ padding: 24 }}>
            <h2>Unauthorized</h2>
            <p>You don’t have permission to access this page.</p>
        </div>
    );
}

function AppContent() {
    const { user } = useAuth();
    const roles = user?.roles || [];

    // Determine default dashboard based on user's primary role
    const getDefaultDashboard = () => {
        if (roles.includes("ADMIN")) return "/dashboard/admin";
        if (roles.includes("HR")) return "/dashboard/hr";
        if (roles.includes("MENTOR")) return "/dashboard/mentor";
        return "/dashboard/intern";
    };

    const defaultDashboard = getDefaultDashboard();

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* Protected area */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<MainLayout />}>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route
                            path="/dashboard"
                            element={<Navigate to={defaultDashboard} replace />}
                        />

                        {/* profile accessible to any authenticated user */}
                        <Route path="/profile" element={<MyProfile />} />

                        <Route element={<ProtectedRoute allowRoles={["ADMIN"]} />}>
                            <Route path="/dashboard/admin" element={<AdminDashboard />} />
                            <Route path="/admin/users" element={<UserManagement />} />
                            <Route path="/admin/roles" element={<RoleManagement />} />
                            <Route path="/admin/system/backup" element={<BackupManagement />} />
                            <Route path="/admin/audit-logs" element={<AuditLogsPage />} />

                            {/* Phase 2: System Config */}
                            <Route path="/admin/hrm" element={<HrmIntegration />} />
                            <Route path="/admin/attendance-sync" element={<TimekeepingIntegration />} />
                        </Route>

                        <Route element={<ProtectedRoute allowRoles={["HR", "ADMIN"]} />}>
                            <Route path="/dashboard/hr" element={<HrDashboard />} />
                            <Route path="/hr/interns" element={<InternList />} />
                            <Route path="/hr/interns/new" element={<CreateIntern />} />
                            <Route path="/hr/interns/:id/edit" element={<EditIntern />} />
                            <Route path="/hr/interns/:internId" element={<InternDetail />} />
                            <Route path="/hr/applications" element={<ApplicationListPage />} />
                            <Route path="/hr/applications/:id" element={<ApplicationDetailPage />} />
                            {/* HR document viewer (choose intern inside the page) */}
                            <Route path="/hr/documents" element={<HrDocumentsPage />} />
                            <Route path="/hr/documents/contracts" element={<HrUploadInternshipContract />} />

                            <Route path="/hr/programs" element={<Programs />} />
                            <Route path="/hr/groups" element={<Groups />} />
                            <Route path="/hr/mentors" element={<MentorList />} />
                            <Route path="/hr/mentors/:id" element={<MentorDetail />} />

                            {/* Phase 2: Attendance */}
                            <Route path="/hr/attendance-reports" element={<AttendanceReports />} />
                            <Route path="/hr/leave-reports" element={<LeaveReports />} />

                            {/* Phase 2: Leave */}
                            <Route path="/hr/leave-approvals" element={<LeaveApprovals />} />

                            <Route path="/hr/departments" element={<HrDepartmentsPage />} />

                            {/* Phase 2: Allowance & Support */}
                            <Route path="/hr/allowances" element={<AllowanceManagement />} />
                            <Route path="/hr/helpdesk" element={<HelpDesk />} />

                            {/* Final Report */}
                            <Route path="/hr/reports" element={<HrReportsPage />} />
                            <Route path="/hr/statistics" element={<Statistics />} />
                            <Route path="/hr/reports/final/:internId" element={<FinalReportPage />} />

                        </Route>

                        <Route
                            element={<ProtectedRoute allowRoles={["MENTOR", "ADMIN"]} />}
                        >
                            <Route path="/dashboard/mentor" element={<MentorDashboard />} />
                            <Route path="/mentor/tasks" element={<TaskManagement />} />
                            <Route path="/mentor/tasks/new" element={<TaskCreate />} />
                            <Route path="/mentor/tasks/:id" element={<TaskDetail />} />
                            <Route path="/mentor/tasks/:id/edit" element={<TaskCreate />} />

                            {/* Reports */}
                            <Route path="/mentor/reports" element={<WeeklyReportsReviewPage />} />
                            {/* <Route path="/mentor/reports/by-intern" element={<WeeklyReports />} /> */}

                            {/* Quản lý thực tập sinh */}
                            <Route path="/mentor/interns" element={<MentorInternList />} />
                            <Route path="/mentor/interns/:internId" element={<InternDetailView />} />

                            {/* Đánh giá */}
                            <Route path="/mentor/evaluations" element={<EvaluationList />} />
                            <Route path="/mentor/evaluations/new" element={<EvaluationCreate />} />
                            <Route path="/mentor/evaluations/:id" element={<EvaluationDetail />} />
                        </Route>

                        <Route
                            element={<ProtectedRoute allowRoles={["INTERN", "ADMIN"]} />}
                        >
                            {/* Public Intern Routes (Onboarding) */}
                            <Route path="/intern/documents" element={<InternDocumentsPage />} />
                            <Route path="/intern/contracts" element={<InternContractsPage />} />
                            <Route path="/intern/apply" element={<ApplicationSubmitPage />} />
                            <Route
                                path="/intern/applications"
                                element={<InternApplicationsPage />}
                            />

                            {/* Protected Intern Routes (Approved only) */}
                            <Route element={<InternGuard />}>
                                <Route path="/dashboard/intern" element={<InternDashboard />} />
                                {/* <Route
                                    path="/intern/contracts"
                                    element={<InternContractConfirmPage />}
                                /> */}
                                <Route
                                    path="/interns/me/schedule"
                                    element={<MySchedule />}
                                />
                                <Route path="/intern/tasks" element={<MyTasksPage />} />
                                <Route
                                    path="/intern/reports/weekly/submit"
                                    element={<WeeklyReportSubmitPage />}
                                />

                                {/* Phase 2: Attendance */}
                                <Route
                                    path="/intern/attendance"
                                    element={<AttendancePage />}
                                />

                                {/* Phase 2: Leave */}
                                <Route
                                    path="/intern/leave-requests"
                                    element={<LeaveRequests />}
                                />

                                {/* Phase 2: Allowance & Support */}
                                <Route
                                    path="/intern/allowances"
                                    element={<MyAllowance />}
                                />
                                <Route
                                    path="/intern/support"
                                    element={<SupportTickets />}
                                />
                            </Route>
                        </Route>
                    </Route>
                </Route>

                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
            <Toaster richColors position="top-right" />
        </BrowserRouter>
    );
}

import ErrorBoundary from "./components/common/ErrorBoundary";

export default function App() {
    return (
        <ErrorBoundary>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </ErrorBoundary>
    );
}
