"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import useAuthToken from "@/app/hooks/useAuthToken"; // Assuming this is your useAuth hook

const categories = [
    { icon: '🏠', name: 'Daily Living' },
    { icon: '🍽️', name: 'Food & Drinks' },
    { icon: '😄', name: 'Emotions' },
    { icon: '🏥', name: 'Health' },
    { icon: '🚗', name: 'Travel' },
    { icon: '🐶', name: 'Animals' },
];

export default function HomePage() {
    const router = useRouter();
    const { user, isLoggedIn } = useAuthToken();
    console.log("User info:", user);


    const handleCategoryClick = () => {
        if (!isLoggedIn) {
            alert('Please log in to access this category.');
        } else {
            // You can route to the category page here in future
        }
    };

    return (
        <main className="min-h-screen flex flex-col justify-between bg-white text-gray-800">
            <header className="p-6 flex justify-between items-center shadow-md">
                <h1 className="text-2xl font-bold">SymPal</h1>
                <div className="space-x-4">
                    {isLoggedIn ? (
                        <button
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                            onClick={() =>
                                user?.role === "ROLE_ADMIN"
                                    ? router.push('/adminpage')
                                    : router.push('/clientpage')
                            }
                        >
                            Go to Dashboard
                        </button>
                    ) : (
                        <button
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                            onClick={() => router.push('/login')}
                        >
                            Login
                        </button>
                    )}
                </div>
            </header>

            <section className="text-center py-16 px-6">
                <h2 className="text-4xl font-semibold mb-4">Explore Symbol Categories</h2>
                <p className="mb-10 text-gray-600">AI-generated symbols for every situation</p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    {categories.map((cat) => (
                        <motion.div
                            key={cat.name}
                            className="bg-blue-100 p-6 rounded-2xl shadow hover:scale-105 transition transform cursor-pointer"
                            whileHover={{ scale: 1.05 }}
                            onClick={handleCategoryClick}
                        >
                            <div className="text-5xl mb-2">{cat.icon}</div>
                            <p className="text-lg font-medium">{cat.name}</p>
                        </motion.div>
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
