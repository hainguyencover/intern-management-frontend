import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import InternGuard from "./auth/InternGuard";
import ErrorBoundary from "./components/common/ErrorBoundary";
import "./index.css";

// Auth
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const MainLayout = lazy(() => import("./layouts/MainLayout"));

// Admin
const AdminDashboard = lazy(() => import("./pages/dashboard/AdminDashboard"));
const UserManagement = lazy(() => import("./pages/admin/UserManagement"));
const RoleManagement = lazy(() => import("./pages/admin/RolePermissionsPage.jsx"));
const BackupManagement = lazy(() => import("./pages/admin/BackupManagement"));
const AuditLogsPage = lazy(() => import("./pages/admin/AuditLogsPage.jsx"));
const SystemConfig = lazy(() => import("./pages/admin/SystemConfig"));
const HrmIntegration = lazy(() => import("./pages/admin/HrmIntegration"));
const TimekeepingIntegration = lazy(() => import("./pages/admin/TimekeepingIntegration"));

// Dashboards
const HrDashboard = lazy(() => import("./pages/dashboard/HrDashboard"));
const MentorDashboard = lazy(() => import("./pages/dashboard/MentorDashboard"));
const InternDashboard = lazy(() => import("./pages/dashboard/InternDashboard"));

// HR
const CreateIntern = lazy(() => import("./pages/hr/CreateIntern"));
const InternList = lazy(() => import("./pages/hr/InternList"));
const EditIntern = lazy(() => import("./pages/hr/EditIntern"));
const InternDetail = lazy(() => import("./pages/hr/InternDetail.jsx"));
const HrDocumentsPage = lazy(() => import("./pages/hr/documents/HrDocumentsPage"));
const HrUploadInternshipContract = lazy(() => import("./pages/hr/documents/contracts/HrUploadInternshipContract"));
const Programs = lazy(() => import("./pages/hr/Programs"));
const Groups = lazy(() => import("./pages/hr/Groups"));
const MentorList = lazy(() => import("./pages/hr/MentorList"));
const MentorDetail = lazy(() => import("./pages/hr/MentorDetail"));
const ApplicationListPage = lazy(() => import("./pages/hr/ApplicationListPage.jsx"));
const ApplicationDetailPage = lazy(() => import("./pages/hr/ApplicationDetailPage.jsx"));
const AttendanceReports = lazy(() => import("./pages/hr/AttendanceReports"));
const LeaveReports = lazy(() => import("./pages/hr/LeaveReports"));
const LeaveApprovals = lazy(() => import("./pages/hr/LeaveApprovals"));
const AllowanceManagement = lazy(() => import("./pages/hr/AllowanceManagement"));
const HelpDesk = lazy(() => import("./pages/hr/HelpDesk"));
const HrDepartmentsPage = lazy(() => import("./pages/hr/departments/HrDepartmentsPage"));
const HrReportsPage = lazy(() => import("./pages/hr/reports/HrReportsPage"));
const FinalReportPage = lazy(() => import("./pages/hr/reports/FinalReportPage"));
const Statistics = lazy(() => import("./pages/hr/Statistics"));

// Mentor
const MentorTasksPage = lazy(() => import("./pages/mentor/MentorTasksPage.jsx"));
const WeeklyReportsReviewPage = lazy(() => import("./pages/mentor/WeeklyReportsReviewPage.jsx"));
const MentorInternList = lazy(() => import("./pages/mentor/MentorInternList"));
const InternDetailView = lazy(() => import("./pages/mentor/InternDetailView"));
const TaskManagement = lazy(() => import("./pages/mentor/TaskManagement"));
const TaskCreate = lazy(() => import("./pages/mentor/TaskCreate"));
const TaskDetail = lazy(() => import("./pages/mentor/TaskDetail"));
const WeeklyReports = lazy(() => import("./pages/mentor/WeeklyReports"));
const EvaluationCreate = lazy(() => import("./pages/mentor/EvaluationCreate"));
const EvaluationList = lazy(() => import("./pages/mentor/EvaluationList"));
const EvaluationDetail = lazy(() => import("./pages/mentor/EvaluationDetail"));
const ReportDetail = lazy(() => import("./pages/mentor/ReportDetail"));

// Intern
const MyProfile = lazy(() => import("./pages/interns/MyProfile"));
const InternDocumentsPage = lazy(() => import("./pages/interns/InternDocumentsPage"));
const InternContractsPage = lazy(() => import("./pages/interns/InternContractsPage"));
const ApplicationSubmitPage = lazy(() => import("./pages/interns/ApplicationSubmitPage.jsx"));
const InternApplicationsPage = lazy(() => import("./pages/interns/InternApplicationsPage.jsx"));
const MySchedule = lazy(() => import("./pages/interns/MySchedule"));
const MyTasksPage = lazy(() => import("./pages/interns/MyTasksPage.jsx"));
const WeeklyReportSubmitPage = lazy(() => import("./pages/interns/WeeklyReportSubmitPage.jsx"));
const AttendancePage = lazy(() => import("./pages/interns/AttendancePage"));
const LeaveRequests = lazy(() => import("./pages/interns/LeaveRequests"));
const MyAllowance = lazy(() => import("./pages/interns/MyAllowance"));
const SupportTickets = lazy(() => import("./pages/interns/SupportTickets"));


function Loader() {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p className="text-sm font-medium text-muted-foreground">Đang tải hệ thống...</p>
            </div>
        </div>
    );
}

function Unauthorized() {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-background p-6 text-center">
            <h2 className="text-2xl font-bold tracking-tight">Không có quyền truy cập</h2>
            <p className="mt-2 text-muted-foreground">Bạn không có quyền truy cập vào trang này.</p>
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
            <Suspense fallback={<Loader />}>
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
                                <Route path="/mentor/reports/:id" element={<ReportDetail />} />
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
            </Suspense>
            <Toaster richColors position="top-right" />
        </BrowserRouter>
    );
}

export default function App() {
    return (
        <ErrorBoundary>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </ErrorBoundary>
    );
}
