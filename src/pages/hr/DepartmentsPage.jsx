import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
    listDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
} from "../../api/departmentsApi";
import {
    Plus,
    Pencil,
    Trash2,
    Search,
    Building2,
    Users,
    X,
    Loader2
} from "lucide-react";

// Validation Schema
const schema = z.object({
    code: z.string().min(2, "Department code must be at least 2 characters").max(10, "Code is too long"),
    name: z.string().min(2, "Department name must be at least 2 characters"),
    description: z.string().optional(),
});

export default function DepartmentsPage() {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDept, setEditingDept] = useState(null);
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(schema),
    });

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            setLoading(true);
            const data = await listDepartments();
            console.log("Fetched departments:", data); // Debugging log
            setDepartments(data);
        } catch (error) {
            toast.error("Failed to fetch departments");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const filteredDepartments = useMemo(() => {
        return departments.filter((dept) =>
            dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dept.code?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [departments, searchTerm]);

    const onSubmit = async (data) => {
        try {
            if (editingDept) {
                await updateDepartment(editingDept.id, data);
                toast.success("Department updated successfully");
            } else {
                await createDepartment(data);
                toast.success("Department created successfully");
            }
            setIsModalOpen(false);
            reset();
            setEditingDept(null);
            fetchDepartments();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Operation failed");
        }
    };

    const handleEdit = (dept) => {
        setEditingDept(dept);
        setValue("code", dept.code);
        setValue("name", dept.name);
        setValue("description", dept.description || "");
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setEditingDept(null);
        reset();
        setIsModalOpen(true);
    };

    const handleDeleteClick = (id) => {
        setDeletingId(id);
        setIsDeleteAlertOpen(true);
    };

    const confirmDelete = async () => {
        if (!deletingId) return;
        try {
            await deleteDepartment(deletingId);
            toast.success("Department deleted successfully");
            fetchDepartments();
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete department");
        } finally {
            setIsDeleteAlertOpen(false);
            setDeletingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        Departments
                    </h1>
                    <p className="text-slate-500 mt-1 text-base">
                        Manage your organization's structure and department details.
                    </p>
                </div>
                <button
                    onClick={handleAdd}
                    className="group inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition-all hover:bg-indigo-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 active:scale-95"
                >
                    <Plus className="mr-2 h-5 w-5 transition-transform group-hover:rotate-90" />
                    Add Department
                </button>
            </div>

            {/* Search & Stats Section */}
            <div className="grid gap-6 md:grid-cols-4">
                <div className="md:col-span-3 flex items-center rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition-all focus-within:border-indigo-300 focus-within:ring-4 focus-within:ring-indigo-100">
                    <Search className="mr-3 h-5 w-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search departments by name or code..."
                        className="w-full border-none bg-transparent p-0 text-base placeholder:text-slate-400 focus:outline-none focus:ring-0"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
                    <span className="text-sm font-medium text-slate-500">Total Departments</span>
                    <span className="text-2xl font-bold text-slate-900">{departments.length}</span>
                </div>
            </div>

            {/* Content Table */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50">
                                <th className="px-6 py-5 text-sm font-semibold text-slate-600 uppercase tracking-wider">Department Info</th>
                                <th className="px-6 py-5 text-sm font-semibold text-slate-600 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-5 text-sm font-semibold text-slate-600 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="3" className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                                            <p>Loading departments...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredDepartments.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <div className="p-3 bg-slate-100 rounded-full">
                                                <Building2 className="h-6 w-6 text-slate-400" />
                                            </div>
                                            <p className="font-medium text-slate-900">No departments found</p>
                                            <p className="text-sm">Try adjusting your search or add a new department.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredDepartments.map((dept) => (
                                    <tr key={dept.id} className="group hover:bg-slate-50/80 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 shadow-sm ring-1 ring-inset ring-indigo-100">
                                                    <span className="font-bold text-sm">{dept.code}</span>
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-slate-900 text-base">{dept.name}</div>
                                                    <div className="text-xs font-mono text-slate-400 mt-0.5">ID: {dept.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className={`text-sm ${dept.description ? 'text-slate-600' : 'text-slate-400 italic'}`}>
                                                {dept.description || 'No description provided'}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 transform translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0">
                                                <button
                                                    onClick={() => handleEdit(dept)}
                                                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                    title="Edit Department"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(dept.id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete Department"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-widest flex justify-between items-center">
                    <span>Showing {filteredDepartments.length} of {departments.length} records</span>
                </div>
            </div>

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    <div
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsModalOpen(false)}
                    />
                    <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white p-8 shadow-2xl ring-1 ring-slate-900/5 transition-all transform scale-100">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">
                                    {editingDept ? "Edit Department" : "New Department"}
                                </h2>
                                <p className="text-sm text-slate-500 mt-1">
                                    {editingDept ? "Update department details below." : "Enter the details for the new department."}
                                </p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                        Department Code <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        {...register("code")}
                                        className="w-full rounded-xl border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 shadow-sm transition-all"
                                        placeholder="e.g. DEPT01"
                                        autoFocus
                                    />
                                    {errors.code && (
                                        <p className="mt-1.5 text-sm text-red-600 font-medium flex items-center gap-1">
                                            <span className="w-1 h-1 rounded-full bg-red-600 inline-block" />
                                            {errors.code.message}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                        Department Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        {...register("name")}
                                        className="w-full rounded-xl border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 shadow-sm transition-all"
                                        placeholder="e.g. Engineering"
                                    />
                                    {errors.name && (
                                        <p className="mt-1.5 text-sm text-red-600 font-medium flex items-center gap-1">
                                            <span className="w-1 h-1 rounded-full bg-red-600 inline-block" />
                                            {errors.name.message}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                        Description
                                    </label>
                                    <textarea
                                        {...register("description")}
                                        rows="4"
                                        className="w-full rounded-xl border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 shadow-sm transition-all resize-none"
                                        placeholder="Briefly describe the department's responsibilities..."
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        "Save Changes"
                                    )}
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            )}

            {/* Delete Confirmation Alert */}
            {isDeleteAlertOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsDeleteAlertOpen(false)}
                    />
                    <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-slate-900/5 transition-all transform scale-100">
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600 mb-2 ring-4 ring-red-50">
                                <Trash2 className="h-7 w-7" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Delete Department?</h3>
                                <p className="text-sm text-slate-500 mt-2 max-w-xs mx-auto">
                                    You are about to delete this department. This action cannot be undone and might affect related data.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-8">
                            <button
                                onClick={() => setIsDeleteAlertOpen(false)}
                                className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-red-200 hover:bg-red-700 hover:shadow-lg transition-all"
                            >
                                Yes, Delete it
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
