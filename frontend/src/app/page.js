"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import useAuthToken from "@/app/hooks/useAuthToken";
import { fetchCategories } from "@/app/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HomePage() {
    const [categories, setCategories] = useState([]);
    const { user, isLoggedIn } = useAuthToken();
    const router = useRouter();

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await fetchCategories();
                const validCategories = data.filter((cat) => cat.name);
                setCategories(validCategories);
            } catch (err) {
                console.error("Error fetching categories:", err);
                setCategories([]);
            }
        };

        loadCategories();
    }, []);

    return (
        <main className="min-h-screen flex flex-col justify-between bg-white text-gray-800">

            {/* Show dashboard button if logged in */}
            {isLoggedIn && user && (
                <div className="text-right p-4">
                    <button
                        onClick={() => {
                            if (user.role === "ROLE_USER") {
                                router.push("/clientpage");
                            } else {
                                router.push("/adminpage");
                            }
                        }}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition"
                    >
                        Go to Dashboard
                    </button>
                </div>
            )}

            <section className="text-center py-16 px-6">
                <h2 className="text-4xl font-semibold mb-4">Explore Symbol Categories</h2>
                <p className="mb-10 text-gray-600">AI-generated symbols for every situation</p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    {categories.map((cat) => (
                        <Link key={cat.id} href={`/categories/${cat.id}`}>
                            <motion.div
                                className="bg-blue-100 p-6 rounded-2xl shadow hover:scale-105 transition transform cursor-pointer"
                                whileHover={{ scale: 1.05 }}
                            >
                                <div className="text-5xl mb-2">{cat.icon}</div>
                                <p className="text-lg font-medium">{cat.name}</p>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </section>
        </main>
    );
}
