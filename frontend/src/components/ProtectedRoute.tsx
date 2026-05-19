"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type ProtectedRouteProps = {
    children: React.ReactNode;
    allowedRole: "customer" | "seller";
};

export default function ProtectedRoute({
    children,
    allowedRole,
}: ProtectedRouteProps) {
    const router = useRouter();
    const { user, isAuthenticated, loading } = useAuth();

    useEffect(() => {
        if (loading) {
            return;
        }
        if (!isAuthenticated) {
            router.push("/login");
            return;
        }
        if (user?.role !== allowedRole) {
            if (user?.role === "seller") {
                router.push("/seller/dashboard");
            } else {
                router.push("/");
            }
        }
    }, [loading, isAuthenticated, user, allowedRole, router]);

    if (loading) {
        return (
            <div className="py-20 text-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (!isAuthenticated || user?.role !== allowedRole) {
        return null;
    }

    return <>{children}</>;
}