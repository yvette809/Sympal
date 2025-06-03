"use client";

import { useEffect, useState } from "react";
import useAuthToken from "@/app/hooks/useAuthToken";
import { fetchCategories } from "@/app/api";
import { fetchSymbols, approveAndCategorizeSymbol } from "@/app/api/adminApi";

export default function AdminComponent() {
    const { token, user, isLoggedIn } = useAuthToken();
    const [symbols, setSymbols] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const imagesPerPage = 6;

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
            loadSymbols();
            setSelectedCategories(prev => {
                const updated = { ...prev };
                delete updated[requestId];
                return updated;
            });
        } catch (err) {
            setError(err.message);
        }
    };

    if (!isLoggedIn) return <p>You must be logged in to view this page.</p>;
    if (loading) return <p>Loading symbols...</p>;
    if (error) return <p className="text-red-600">{error}</p>;

    const lastIndex = currentPage * imagesPerPage;
    const firstIndex = lastIndex - imagesPerPage;
    const currentSymbols = symbols.slice(firstIndex, lastIndex);
    const totalPages = Math.ceil(symbols.length / imagesPerPage);

    return (
        <div className="flex justify-center w-full">
            <div className="w-full p-6 bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl">
                <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
                    Symbols Control Section
                </h1>

                {successMessage && (
                    <p className="text-green-600 font-semibold mb-4 text-center">
                        {successMessage}
                    </p>
                )}

                {symbols.length === 0 ? (
                    <p className="text-center">No generated symbols to show.</p>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full table-auto border border-gray-300 shadow-md">
                                <thead className="bg-gray-100 text-left text-sm sm:text-base">
                                <tr>
                                    <th className="p-2 sm:p-3 border">Description</th>
                                    <th className="p-2 sm:p-3 border">Image</th>
                                    <th className="p-2 sm:p-3 border">Categories</th>
                                    <th className="p-2 sm:p-3 border">Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {currentSymbols.map((symbolRequest) => (
                                    <tr key={symbolRequest.id} className="border-t">
                                        <td className="p-2 sm:p-3 border text-sm sm:text-base">
                                            {symbolRequest.description}
                                        </td>
                                        <td className="p-2 sm:p-3 border">
                                            {symbolRequest.tempImageUrl ? (
                                                <img
                                                    src={symbolRequest.tempImageUrl}
                                                    alt={symbolRequest.description}
                                                    className="w-20 h-20 sm:w-24 sm:h-24 object-contain mx-auto"
                                                />
                                            ) : (
                                                <span>No image</span>
                                            )}
                                        </td>
                                        <td className="p-2 sm:p-3 border">
                                            <div className="max-h-32 overflow-y-auto border rounded px-2 py-1">
                                                {categories.map((cat) => {
                                                    const isChecked =
                                                        (selectedCategories[symbolRequest.id] || []).includes(cat.id);
                                                    return (
                                                        <div
                                                            key={cat.id}
                                                            className="flex items-center gap-2 text-sm sm:text-base"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                id={`cat-${symbolRequest.id}-${cat.id}`}
                                                                checked={isChecked}
                                                                onChange={(e) => {
                                                                    const prev = selectedCategories[symbolRequest.id] || [];
                                                                    const updated = e.target.checked
                                                                        ? [...prev, cat.id]
                                                                        : prev.filter((id) => id !== cat.id);
                                                                    setSelectedCategories((prevState) => ({
                                                                        ...prevState,
                                                                        [symbolRequest.id]: updated,
                                                                    }));
                                                                }}
                                                            />
                                                            <label htmlFor={`cat-${symbolRequest.id}-${cat.id}`}>
                                                                {cat.name}
                                                            </label>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </td>
                                        <td className="p-2 sm:p-3 border">
                                            <button
                                                onClick={() => handleApproveAndCategorize(symbolRequest.id)}
                                                className="bg-purple-600 text-white px-2 py-1 sm:px-3 sm:py-1 rounded hover:bg-purple-700 w-full text-sm sm:text-base"
                                            >
                                                Approve & Categorize
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-6 flex flex-wrap justify-center gap-2 mb-3">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((p) => p - 1)}
                                className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50 text-sm sm:text-base"
                            >
                                Prev
                            </button>
                            {[...Array(totalPages).keys()].map((num) => (
                                <button
                                    key={num + 1}
                                    onClick={() => setCurrentPage(num + 1)}
                                    className={`px-3 py-1 rounded text-sm sm:text-base ${
                                        currentPage === num + 1
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-200"
                                    }`}
                                >
                                    {num + 1}
                                </button>
                            ))}
                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage((p) => p + 1)}
                                className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50 text-sm sm:text-base"
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
