"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";

export default function ProductDetailsPage() {
    const params = useParams();

    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    const getProduct = async () => {
        try {
            setLoading(true);

            const response = await api.get(`/products/${params.id}`);

            setProduct(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
        getProduct();
    }, []);

    const handleAddToCart = async () => {
        try {
            await api.post("/cart/items", {
                productId: product.id,
                quantity,
            });

            alert("Product added to cart");
        } catch (error: any) {
            alert(
                error?.response?.data?.message || "Failed to add to cart"
            );
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex justify-center items-center">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-[#0047FF] rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-[60vh] flex flex-col justify-center items-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Product not found
                </h1>
                <p className="text-gray-500">The product you are looking for does not exist.</p>
            </div>
        );
    }

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
                
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex justify-center items-center">
                    <img
                        src={product.imageUrl}
                        alt={product.pname}
                        className="w-full h-100 md:h-125 object-contain rounded-2xl"
                    />
                </div>

                <div className="flex flex-col">
                    <div className="mb-6">
                        <span className="inline-block bg-blue-50 text-[#0047FF] px-4 py-1.5 rounded-full text-sm font-bold mb-4 capitalize">
                            {product.category}
                        </span>
                        
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
                            {product.pname}
                        </h1>
                        
                        <p className="text-lg text-gray-500 leading-relaxed">
                            {product.description}
                        </p>
                    </div>

                    <div className="mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                        <p className="text-4xl font-extrabold text-black mb-2">
                            ৳ {product.price}
                        </p>
                        <p className="text-sm font-medium text-gray-500">
                            <span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
                                {product.stock > 0 ? `In Stock (${product.stock} available)` : "Out of Stock"}
                            </span>
                        </p>
                    </div>

                    <div className="flex items-center gap-4 mb-8">
                        <span className="font-bold text-gray-900">
                            Quantity:
                        </span>
                        <input
                            type="number"
                            min={1}
                            max={product.stock}
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            className="w-24 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0047FF] focus:ring-1 focus:ring-[#0047FF] text-center font-bold text-gray-900 transition"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                            className="flex-1 bg-[#0047FF] text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition shadow-[0_4px_14px_0_rgba(0,71,255,0.39)] hover:shadow-[0_6px_20px_rgba(0,71,255,0.23)] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Add to Cart
                        </button>

                        <Link 
                            href="" 
                            className="flex-1 flex items-center justify-center border-2 border-[#0047FF] text-[#0047FF] font-bold py-4 rounded-xl hover:bg-blue-50 transition"
                        >
                            Buy Now
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}