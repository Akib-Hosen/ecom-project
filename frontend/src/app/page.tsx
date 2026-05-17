"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function HomePage() {
  const [categories, setCategories] = useState<string[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);

  useEffect(() => {
    const getHomeData = async () => {
      try {
        const response = await api.get("/products");

        const products = response.data.data || [];

        const uniqueCategories: string[] = Array.from(
          new Set(products.map((product: any) => product.category))
        );

        setCategories(uniqueCategories);

        setFeaturedProducts(products.slice(0, 4));
      } catch (error) {
        console.log(error);
      }
    };

    getHomeData();
  }, []);

  return (
    <main className="min-h-screen">
      <section className="bg-white py-24 px-4 border-b border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-extrabold text-black mb-6 tracking-tight">
            Welcome to bdMart
          </h1>
          <p className="text-lg text-gray-500 mb-10 leading-relaxed">
            A simple e-commerce website where customers can browse products,
            add items to cart, place orders, and track order status.
          </p>
          <Link 
            href="/products" 
            className="inline-block bg-[#0047FF] text-white font-bold py-4 px-10 rounded-xl hover:bg-blue-700 transition shadow-[0_4px_14px_0_rgba(0,71,255,0.39)] hover:shadow-[0_6px_20px_rgba(0,71,255,0.23)]"
          >
            Shop Now
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-black mb-10">
          Featured Categories
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              href={`/products?category=${category}`}
              key={category}
              className="group bg-white rounded-2xl border border-gray-100 p-8 text-center shadow-lg hover:border-[#0047FF] hover:shadow-2xl transition-all duration-300"
            >
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#0047FF] transition-colors mb-2 capitalize">
                {category}
              </h3>
              <p className="text-sm text-gray-500">
                Explore {category} products
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-black mb-10">
          Featured Products
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xl hover:shadow-2xl hover:border-[#0047FF] transition-all duration-300 flex flex-col group">
              <div className="h-56 overflow-hidden bg-gray-50 relative">
                <img
                  src={product.imageUrl}
                  alt={product.pname}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                  {product.pname}
                </h3>
                
                <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow">
                  {product.description}
                </p>

                <p className="font-extrabold text-xl text-black mb-5">
                  ৳ {product.price}
                </p>

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
      </section>

      <section className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 mb-10">
        <h2 className="text-3xl font-bold text-center text-black mb-10">
          Why Choose Us?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-10 shadow-xl text-center">
            <div className="w-12 h-12 bg-blue-50 text-[#0047FF] rounded-xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Easy Shopping</h3>
            <p className="text-gray-500 leading-relaxed">
              Browse products and place orders easily with our seamless checkout process.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-10 shadow-xl text-center">
            <div className="w-12 h-12 bg-blue-50 text-[#0047FF] rounded-xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Order Tracking</h3>
            <p className="text-gray-500 leading-relaxed">
              Check your order status anytime and stay updated on your deliveries.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-10 shadow-xl text-center">
            <div className="w-12 h-12 bg-blue-50 text-[#0047FF] rounded-xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Secure Account</h3>
            <p className="text-gray-500 leading-relaxed">
              JWT based login and protected dashboard ensures your data is safe.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}