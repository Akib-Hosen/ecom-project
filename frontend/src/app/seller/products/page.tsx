"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function SellerProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState<any>(null);

    const [pname, setPname] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [category, setCategory] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);

    const getProducts = async () => {
        try {
            setLoading(true);
            const response = await api.get("/products");
            setProducts(response.data.data || []);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getProducts();
    }, []);

    const resetForm = () => {
        setPname("");
        setDescription("");
        setPrice("");
        setStock("");
        setCategory("");
        setImageUrl("");
        setImageFile(null);
        setEditingProduct(null);
    };

    const uploadImage = async () => {
        if (!imageFile) {
            return imageUrl;
        }

        const formData = new FormData();
        formData.append("file", imageFile);

        const response = await api.post("/products/upload", formData);
        return response.data.imageUrl;
    };

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        try {
            const uploadedImageUrl = await uploadImage();

            const productData = {
                pname,
                description,
                price: Number(price),
                stock: Number(stock),
                category,
                imageUrl: uploadedImageUrl,
            };

            if (editingProduct) {
                await api.patch(`/products/${editingProduct.id}`, productData);
                alert("Product updated successfully");
            } else {
                await api.post("/products", productData);
                alert("Product added successfully");
            }

            resetForm();
            getProducts();
        } catch (error: any) {
            alert(error?.response?.data?.message || "Failed to save product");
        }
    };

    const handleEdit = (product: any) => {
        setEditingProduct(product);
        setPname(product.pname);
        setDescription(product.description);
        setPrice(product.price);
        setStock(product.stock);
        setCategory(product.category);
        setImageUrl(product.imageUrl);
        setImageFile(null);
    };

    const handleDelete = async (id: number) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this product?");

        if (!confirmDelete) {
            return;
        }

        try {
            await api.delete(`/products/${id}`);
            alert("Product deleted successfully");
            getProducts();
        } catch (error: any) {
            alert(error?.response?.data?.message || "Failed to delete product");
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
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
                Manage Products
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm lg:sticky lg:top-28">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">
                        {editingProduct ? "Edit Product" : "Add New Product"}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">Product Name</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0047FF] focus:ring-1 focus:ring-[#0047FF] transition"
                                placeholder="Enter product name"
                                value={pname}
                                onChange={(e) => setPname(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">Description</label>
                            <textarea
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0047FF] focus:ring-1 focus:ring-[#0047FF] transition resize-none h-24"
                                placeholder="Describe the product..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            ></textarea>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Price (৳)</label>
                                <input
                                    type="number"
                                    min="0"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0047FF] focus:ring-1 focus:ring-[#0047FF] transition"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Stock</label>
                                <input
                                    type="number"
                                    min="0"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0047FF] focus:ring-1 focus:ring-[#0047FF] transition"
                                    value={stock}
                                    onChange={(e) => setStock(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">Category</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0047FF] focus:ring-1 focus:ring-[#0047FF] transition"
                                placeholder="e.g. Electronics, Clothing"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">Product Image</label>
                            <input
                                type="file"
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-[#0047FF] hover:file:bg-blue-100 transition-all cursor-pointer border border-gray-200 rounded-xl"
                                accept="image/*"
                                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                            />
                        </div>

                        {imageUrl && !imageFile && (
                            <div className="mt-2">
                                <span className="block text-xs font-bold text-gray-500 mb-2">Current Image:</span>
                                <div className="w-24 h-24 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center p-2">
                                    <img src={imageUrl} alt="Preview" className="w-full h-full object-contain mix-blend-multiply" />
                                </div>
                            </div>
                        )}

                        <div className="pt-4 space-y-3">
                            <button type="submit" className="w-full bg-[#0047FF] text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition shadow-[0_4px_14px_0_rgba(0,71,255,0.39)] hover:shadow-[0_6px_20px_rgba(0,71,255,0.23)]">
                                {editingProduct ? "Update Product" : "Save Product"}
                            </button>

                            {editingProduct && (
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
                        <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">
                            Product List
                        </h2>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="pb-3 text-sm font-bold text-gray-500 uppercase tracking-wider">Product</th>
                                        <th className="pb-3 text-sm font-bold text-gray-500 uppercase tracking-wider">Category</th>
                                        <th className="pb-3 text-sm font-bold text-gray-500 uppercase tracking-wider text-right">Price</th>
                                        <th className="pb-3 text-sm font-bold text-gray-500 uppercase tracking-wider text-right">Stock</th>
                                        <th className="pb-3 text-sm font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {products.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="py-4 flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white border border-gray-100 rounded-lg flex items-center justify-center p-1 shrink-0">
                                                    <img
                                                        src={product.imageUrl}
                                                        alt={product.pname}
                                                        className="w-full h-full object-contain mix-blend-multiply"
                                                    />
                                                </div>
                                                <span className="font-bold text-gray-900 line-clamp-1">{product.pname}</span>
                                            </td>
                                            <td className="py-4">
                                                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold capitalize">
                                                    {product.category}
                                                </span>
                                            </td>
                                            <td className="py-4 text-right font-bold text-gray-900">
                                                ৳ {product.price}
                                            </td>
                                            <td className="py-4 text-right">
                                                <span className={`font-bold ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
                                                    {product.stock}
                                                </span>
                                            </td>
                                            <td className="py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEdit(product)}
                                                        className="px-3 py-1.5 bg-blue-50 text-[#0047FF] font-bold text-xs rounded-lg hover:bg-[#0047FF] hover:text-white transition-colors"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(product.id)}
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

                            {products.length === 0 && (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 mb-2">No products found in your inventory.</p>
                                    <p className="text-sm text-gray-400">Use the form on the left to add your first product.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}