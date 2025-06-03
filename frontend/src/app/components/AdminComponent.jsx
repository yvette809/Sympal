"use client";

import { useEffect, useState } from "react";
import useAuthToken from "@/app/hooks/useAuthToken";
import { fetchCategories } from "@/app/api";
import {
    fetchSymbols,
    approveAndCategorizeSymbol,
    rejectSymbolRequest,
} from "@/app/api/adminApi";

export default function AdminComponent() {
    const { token, user, isLoggedIn } = useAuthToken();
    const [symbols, setSymbols] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [skippedSymbols, setSkippedSymbols] = useState([]);

    useEffect(() => {
        if (isLoggedIn) {
            loadSymbols();
            fetchCategories()
                .then(setCategories)
                .catch(() => setError("Failed to fetch categories."));
        }
    }, [isLoggedIn]);

    const loadSymbols = async () => {
        setLoading(true);
        try {
            const data = await fetchSymbols(token);
            setSymbols(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleApproveAndCategorize = async (requestId) => {
        const categoryIds = selectedCategories[requestId] || [];
        if (categoryIds.length === 0) {
            setError("Please select at least one category");
            return;
        }

        try {
            await approveAndCategorizeSymbol(requestId, categoryIds, token);
            setSuccessMessage("Symbol approved and categorized.");
            setSymbols((prev) => prev.slice(1));
        } catch (err) {
            setError(err.message);
        }
    };

    const handleReject = async (requestId) => {
        try {
            await rejectSymbolRequest(requestId, token);
            setSuccessMessage("Symbol rejected.");
            setSymbols((prev) => prev.slice(1));
        } catch (err) {
            setError(err.message);
        }
    };

    const handleSkip = () => {
        if (symbols.length === 0) return;
        setSymbols((prev) => [...prev.slice(1), prev[0]]);
    };

    if (!isLoggedIn) return <p>You must be logged in to view this page.</p>;
    if (loading) return <p>Loading symbols...</p>;
    if (error) return <p className="text-red-600">{error}</p>;

    const currentSymbol = symbols[0];

    return (
        <div className="flex justify-center w-full">
            <div className="w-full p-6 bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl">
                <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
                    Symbols Queue Management
                </h1>

                {successMessage && (
                    <p className="text-green-600 font-semibold mb-4 text-center">
                        {successMessage}
                    </p>
                )}

                {!currentSymbol ? (
                    <p className="text-center">No more symbols in queue.</p>
                ) : (
                    <div className="max-w-3xl mx-auto">
                        <div className="mb-4 text-center">
                            <p className="font-semibold mb-2">Description:</p>
                            <p className="text-lg">{currentSymbol.description}</p>
                        </div>

                        <div className="mb-4 flex justify-center">
                            {currentSymbol.tempImageUrl ? (
                                <img
                                    src={currentSymbol.tempImageUrl}
                                    alt={currentSymbol.description}
                                    className="w-48 h-48 object-contain border rounded"
                                />
                            ) : (
                                <span>No image available</span>
                            )}
                        </div>

                        <div className="mb-4">
                            <p className="font-semibold mb-2">Select Categories:</p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {categories.map((cat) => {
                                    const isChecked =
                                        (selectedCategories[currentSymbol.id] || []).includes(cat.id);
                                    return (
                                        <label
                                            key={cat.id}
                                            className="flex items-center gap-2 text-sm"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={(e) => {
                                                    const prev = selectedCategories[currentSymbol.id] || [];
                                                    const updated = e.target.checked
                                                        ? [...prev, cat.id]
                                                        : prev.filter((id) => id !== cat.id);
                                                    setSelectedCategories((prevState) => ({
                                                        ...prevState,
                                                        [currentSymbol.id]: updated,
                                                    }));
                                                }}
                                            />
                                            {cat.name}
                                        </label>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex gap-4 justify-center mt-6">
                            <button
                                onClick={() => handleApproveAndCategorize(currentSymbol.id)}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            >
                                Approve & Categorize
                            </button>
                            <button
                                onClick={() => handleReject(currentSymbol.id)}
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                            >
                                Reject
                            </button>
                            <button
                                onClick={handleSkip}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            >
                                Skip
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
