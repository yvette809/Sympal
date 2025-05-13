"use client"

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useAuthToken from "@/app/hooks/useAuthToken";
import { fetchCategories } from "@/app/api";
import {useRouter}  from "next/navigation";
import Link from "next/link";


export default function HomePage() {
    const [categories, setCategories] = useState([]);
    const { user, isLoggedIn } = useAuthToken();

    const router = useRouter()

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await fetchCategories();
                // Filter out categories with null names
                const validCategories = data.filter((cat) => cat.name);
                if (validCategories.length > 0) {
                    setCategories(validCategories);
                } else {
                    setCategories([]);
                }
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };

        loadCategories();
    }, []);


    return (
        <main className="min-h-screen flex flex-col justify-between bg-white text-gray-800">


            <section className="text-center py-16 px-6">
                <h2 className="text-4xl font-semibold mb-4">Explore Symbol Categories</h2>
                <p className="mb-10 text-gray-600">AI-generated symbols for every situation</p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    {categories.map((cat) => (
                            <Link  key={cat.id} href={`/categories/${cat.id}`}>
                            <motion.div
                            className="bg-blue-100 p-6 rounded-2xl shadow hover:scale-105 transition transform cursor-pointer"
                            whileHover={{ scale: 1.05 }}

                        >
                            <div className="text-5xl mb-2">
                                {cat.icon}
                            </div>
                            <p className="text-lg font-medium">
                                {cat.name}
                            </p>
                        </motion.div>
                        </Link>
                    ))}
                </div>
            </section>

            <footer className="bg-gray-100 py-6 text-center text-sm text-gray-500">
                <p>
                    <a href="/about" className="mx-2 hover:underline">About</a>|
                    <a href="/privacy" className="mx-2 hover:underline">Privacy</a>|
                    <a href="/terms" className="mx-2 hover:underline">Terms</a>
                </p>
                <p className="mt-2">© 2025 SymPal</p>
            </footer>
        </main>
    );
}
