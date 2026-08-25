"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import api from "@/lib/api";
import Link from "next/link";

export default function SellerCategoriesPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingCategory, setEditingCategory] = useState<any>(null);
    const [name, setName] = useState("");

    const getCategories = async () => {
        try {
            setLoading(true);
            const response = await api.get("/categories");
            setCategories(response.data || []);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCategories();
    }, []);

    const resetForm = () => {
        setName("");
        setEditingCategory(null);
    };

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        try {
            if (editingCategory) {
                await api.patch(`/categories/${editingCategory.id}`, {
                    name,
                });
                alert("Category updated successfully");
            } else {
                await api.post("/categories", {
                    name,
                });
                alert("Category added successfully");
            }

            resetForm();
            getCategories();
        } catch (error: any) {
            alert(error?.response?.data?.message || "Failed to save category");
        }
    };

    const handleEdit = (category: any) => {
        setEditingCategory(category);
        setName(category.name);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: number) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this category?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            await api.delete(`/categories/${id}`);
            alert("Category deleted successfully");
            getCategories();
        } catch (error: any) {
            alert(error?.response?.data?.message || "Failed to delete category");
        }
    };

    if (loading) {
        return (
            <ProtectedRoute allowedRole="seller">
                <div className="min-h-[60vh] flex justify-center items-center">
                    <div className="w-12 h-12 border-4 border-gray-200 border-t-[#0047FF] rounded-full animate-spin"></div>
                </div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute allowedRole="seller">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/seller/dashboard" className="flex items-center justify-center w-10 h-10 bg-gray-100 text-gray-600 rounded-full hover:bg-[#0047FF] hover:text-white transition-colors" title="Back to Dashboard">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    </Link>
                    <h1 className="text-3xl font-extrabold text-gray-900">
                        Manage Categories
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm lg:sticky lg:top-28">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">
                            {editingCategory ? "Edit Category" : "Add New Category"}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                                    Category Name
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0047FF] focus:ring-1 focus:ring-[#0047FF] transition"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter category name"
                                    required
                                />
                            </div>

                            <div className="pt-4 space-y-3">
                                <button className="w-full bg-[#0047FF] text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition shadow-[0_4px_14px_0_rgba(0,71,255,0.39)] hover:shadow-[0_6px_20px_rgba(0,71,255,0.23)]">
                                    {editingCategory ? "Update Category" : "Save Category"}
                                </button>

                                {editingCategory && (
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="w-full border-2 border-gray-200 text-gray-700 font-bold py-3 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition"
                                    >
                                        Cancel Edit
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                            
                            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                                <h2 className="text-xl font-bold text-gray-900">
                                    Category List
                                </h2>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="pb-3 text-xs font-bold text-gray-500 uppercase tracking-wider w-16">ID</th>
                                            <th className="pb-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                                            <th className="pb-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="pb-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {categories.map((category) => (
                                            <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="py-4 text-sm font-bold text-gray-400">
                                                    #{category.id}
                                                </td>
                                                
                                                <td className="py-4">
                                                    <span className="font-bold text-gray-900 capitalize flex items-center gap-2">
                                                        {category.name}
                                                    </span>
                                                </td>

                                                <td className="py-4">
                                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-600 border border-green-100">
                                                        Active
                                                    </span>
                                                </td>

                                                <td className="py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleEdit(category)}
                                                            className="px-3 py-1.5 bg-blue-50 text-[#0047FF] font-bold text-xs rounded-lg hover:bg-[#0047FF] hover:text-white transition-colors"
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            onClick={() => handleDelete(category.id)}
                                                            className="px-3 py-1.5 bg-red-50 text-red-600 font-bold text-xs rounded-lg hover:bg-red-600 hover:text-white transition-colors"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {categories.length === 0 && (
                                    <div className="text-center py-12 flex flex-col items-center">
                                        <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mb-4 border border-gray-100">
                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                                            </svg>
                                        </div>
                                        <p className="text-gray-900 font-bold mb-1">No categories found</p>
                                        <p className="text-sm text-gray-500">Create your first category using the form.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </ProtectedRoute>
    );
}