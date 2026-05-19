"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function SellerUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingUser, setEditingUser] = useState<any>(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("customer");

    const getUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get("/users");
            setUsers(response.data || []);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUsers();
    }, []);

    const handleEdit = (user: any) => {
        setEditingUser(user);
        setName(user.name);
        setEmail(user.email);
        setRole(user.role);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingUser(null);
        setName("");
        setEmail("");
        setRole("customer");
    };

    const updateUser = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (!editingUser) {
            return;
        }
        try {
            await api.patch(`/users/${editingUser.id}`, {
                name,
                email,
                role,
            });
            alert("User updated successfully");
            cancelEdit();
            getUsers();
        } catch (error: any) {
            alert(error?.response?.data?.message || "Failed to update user");
        }
    };

    const deleteUser = async (id: number) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this user?");

        if (!confirmDelete) {
            return;
        }

        try {
            await api.delete(`/users/${id}`);
            alert("User deleted successfully");
            getUsers();
        } catch (error: any) {
            alert(error?.response?.data?.message || "Failed to delete user");
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex justify-center items-center">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-[#0047FF] rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <ProtectedRoute allowedRole="seller">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
                    Manage Users
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* User Edit Form Panel */}
                    <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm lg:sticky lg:top-28">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">
                            {editingUser ? "Edit User" : "Select User"}
                        </h2>

                        {editingUser ? (
                            <form onSubmit={updateUser} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0047FF] focus:ring-1 focus:ring-[#0047FF] transition"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0047FF] focus:ring-1 focus:ring-[#0047FF] transition"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">
                                        Role
                                    </label>
                                    <div className="relative">
                                        <select
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0047FF] focus:ring-1 focus:ring-[#0047FF] transition bg-white text-gray-900 appearance-none cursor-pointer pr-10"
                                            value={role}
                                            onChange={(e) => setRole(e.target.value)}
                                        >
                                            <option value="customer">Customer</option>
                                            <option value="seller">Seller</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 space-y-3">
                                    <button className="w-full bg-[#0047FF] text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition shadow-[0_4px_14px_0_rgba(0,71,255,0.39)] hover:shadow-[0_6px_20px_rgba(0,71,255,0.23)]">
                                        Update User
                                    </button>
                                    <button
                                        type="button"
                                        onClick={cancelEdit}
                                        className="w-full border-2 border-gray-200 text-gray-700 font-bold py-3 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 text-center">
                                <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                    </svg>
                                </div>
                                <p className="text-gray-500 text-sm">
                                    Click the <span className="font-bold text-[#0047FF]">Edit</span> button on a user from the table to modify their account details.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* User List Panel */}
                    <div className="lg:col-span-2">
                        <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">

                            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                                <h2 className="text-xl font-bold text-gray-900">
                                    User List
                                </h2>
                                <span className="text-sm font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                    {users.length} Users
                                </span>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="pb-3 text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                                            <th className="pb-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                                            <th className="pb-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {users.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="py-4 flex items-center gap-4">
                                                    {/* User Avatar Circle */}
                                                    <div className="w-10 h-10 rounded-full bg-blue-50 text-[#0047FF] font-bold flex items-center justify-center border border-blue-100 shrink-0">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 line-clamp-1">{user.name}</p>
                                                        <p className="text-xs text-gray-500">{user.email}</p>
                                                    </div>
                                                </td>

                                                <td className="py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${user.role === 'seller'
                                                            ? 'bg-purple-50 text-purple-700'
                                                            : 'bg-gray-100 text-gray-600'
                                                        }`}>
                                                        {user.role}
                                                    </span>
                                                </td>

                                                <td className="py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleEdit(user)}
                                                            className="px-3 py-1.5 bg-blue-50 text-[#0047FF] font-bold text-xs rounded-lg hover:bg-[#0047FF] hover:text-white transition-colors"
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            onClick={() => deleteUser(user.id)}
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

                                {users.length === 0 && (
                                    <div className="text-center py-12">
                                        <p className="text-gray-500">No users found.</p>
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