"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import api from "@/lib/api";

export default function ProductsPage() {
    const searchParams = useSearchParams();
    const categoryFromUrl = searchParams.get("category");

    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl || "");
    const [loading, setLoading] = useState(true);

    const getProducts = async () => {
        try {
            setLoading(true);

            let url = "/products";

            if (selectedCategory) {
                url = `/products?category=${selectedCategory}`;
            }

            if (search) {
                url = `/products?search=${search}`;
            }

            const response = await api.get(url);
            const productList = response.data.data || [];

            setProducts(productList);

            const allResponse = await api.get("/products");
            const allProducts = allResponse.data.data || [];

            const uniqueCategories: string[] = Array.from(
                new Set(allProducts.map((product: any) => product.category))
            );

            setCategories(uniqueCategories);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
        setSelectedCategory(categoryFromUrl || "");
    }, [categoryFromUrl]);

    useEffect(() => {
        getProducts();
    }, [selectedCategory]);

    const handleSearch = (e: React.SyntheticEvent) => {
        e.preventDefault();
        getProducts();
    };

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900">Products</h1>
                    <p className="text-gray-500 mt-2">Browse all available products</p>
                </div>

                <form onSubmit={handleSearch} className="w-full md:w-auto flex-1 max-w-md">
                    <div className="flex w-full border border-gray-200 rounded-xl overflow-hidden focus-within:border-[#0047FF] focus-within:ring-1 focus-within:ring-[#0047FF] transition-all shadow-sm bg-white">
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="w-full px-4 py-3 outline-none text-sm text-gray-700 placeholder-gray-400"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button type="submit" className="bg-[#0047FF] text-white px-6 font-bold text-sm hover:bg-blue-700 transition-colors">
                            Search
                        </button>
                    </div>
                </form>
            </div>

            {loading ? (
                <div className="min-h-[40vh] flex justify-center items-center">
                    <div className="w-12 h-12 border-4 border-gray-200 border-t-[#0047FF] rounded-full animate-spin"></div>
                </div>
            ) : products.length === 0 ? (
                <div className="min-h-[40vh] flex flex-col justify-center items-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">No products found</h2>
                    <p className="text-gray-500 mt-2">Try another search or category</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xl hover:shadow-2xl hover:border-[#0047FF] transition-all duration-300 flex flex-col group"
                        >
                            <div className="h-56 overflow-hidden bg-gray-50 relative flex items-center justify-center p-4">
                                <img
                                    src={product.imageUrl}
                                    alt={product.pname}
                                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>

                            <div className="p-6 flex flex-col grow">
                                <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                                    {product.pname}
                                </h2>

                                <p className="text-sm text-gray-500 line-clamp-2 mb-4 grow">
                                    {product.description}
                                </p>

                                <div className="flex justify-between items-center mt-2 mb-5">
                                    <span className="font-extrabold text-xl text-black">৳ {product.price}</span>
                                    <span className="bg-blue-50 text-[#0047FF] px-3 py-1 rounded-full text-xs font-bold capitalize">
                                        {product.category}
                                    </span>
                                </div>

                                <Link
                                    href={`/products/${product.id}`}
                                    className="block w-full text-center bg-gray-50 text-[#0047FF] font-bold py-3 rounded-xl hover:bg-[#0047FF] hover:text-white transition-colors"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}