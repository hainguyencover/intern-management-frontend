import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import "./index.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MainLayout from "./layouts/MainLayout";

import AdminDashboard from "./pages/dashboard/AdminDashboard";
import HrDashboard from "./pages/dashboard/HrDashboard";
import MentorDashboard from "./pages/dashboard/MentorDashboard";
import InternDashboard from "./pages/dashboard/InternDashboard";
import CreateIntern from "./pages/hr/CreateIntern";
import InternList from "./pages/hr/InternList";
import EditIntern from "./pages/hr/EditIntern";
import InternDetail from "./pages/hr/InternDetail.jsx";
import MyProfile from "./pages/interns/MyProfile";

import HrDocumentsPage from "./pages/hr/documents/HrDocumentsPage";
import InternDocumentsPage from "./pages/hr/documents/InternDocumentsPage";
import HrUploadInternshipContract from "./pages/hr/documents/contracts/HrUploadInternshipContract";

import InternContractConfirmPage from "./pages/interns/contracts/InternContractConfirmPage.jsx";
import ApplicationListPage from "./pages/hr/ApplicationListPage.jsx";
import ApplicationDetailPage from "./pages/hr/ApplicationDetailPage.jsx";
import ApplicationSubmitPage from "./pages/interns/ApplicationSubmitPage.jsx";
import InternApplicationsPage from "./pages/interns/InternApplicationsPage.jsx";

import { Toaster } from "sonner";

import Programs from "./pages/hr/Programs";
import MySchedule from "./pages/interns/MySchedule";

import Groups from "./pages/hr/Groups";
import Mentors from "./pages/hr/Mentors";

import HrSupportTicketsPage from "./pages/hr/HrSupportTicketsPage";
import InternSupportTicketsPage from "./pages/interns/InternSupportTicketsPage";


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
                        </Route>

                        <Route element={<ProtectedRoute allowRoles={["HR", "ADMIN"]} />}>
                            <Route path="/dashboard/hr" element={<HrDashboard />} />
                            <Route path="/hr/interns" element={<InternList />} />
                            <Route path="/hr/interns/new" element={<CreateIntern />} />
                            <Route path="/hr/interns/:id/edit" element={<EditIntern />} />
                            <Route path="/hr/interns/:internId" element={<InternDetail />} />

                            <Route path="/hr/applications" element={<ApplicationListPage />} />

                            <Route path="/hr/support-tickets" element={<HrSupportTicketsPage />} />

                            <Route
                                path="/hr/applications/:id"
                                element={<ApplicationDetailPage />}
                            />

                            <Route path="/hr/documents" element={<HrDocumentsPage />} />
                            <Route
                                path="/hr/documents/contracts"
                                element={<HrUploadInternshipContract />}
                            />

                            <Route path="/hr/programs" element={<Programs />} />
                            <Route path="/hr/groups" element={<Groups />} />
                            <Route path="/hr/mentors" element={<Mentors />} />
                        </Route>

                        <Route element={<ProtectedRoute allowRoles={["MENTOR", "ADMIN"]} />}>
                            <Route path="/dashboard/mentor" element={<MentorDashboard />} />
                        </Route>

                        <Route element={<ProtectedRoute allowRoles={["INTERN", "ADMIN"]} />}>
                            <Route path="/dashboard/intern" element={<InternDashboard />} />
                            <Route path="/intern/documents" element={<InternDocumentsPage />} />
                            <Route path="/intern/apply" element={<ApplicationSubmitPage />} />
                            <Route
                                path="/intern/applications"
                                element={<InternApplicationsPage />}
                            />
                            <Route
                                path="/intern/contracts"
                                element={<InternContractConfirmPage />}
                            />
                            <Route path="/interns/me/schedule" element={<MySchedule />} />

                            <Route path="/intern/support-tickets" element={<InternSupportTicketsPage />} />

                        </Route>
                    </Route>
                </Route>

                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>

            <Toaster richColors position="top-right" />
        </BrowserRouter>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}
