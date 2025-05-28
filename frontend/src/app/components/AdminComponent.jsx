"use client";

import { useEffect, useState } from "react";
import useAuthToken from "@/app/hooks/useAuthToken";
import { fetchCategories } from "@/app/api";
import { fetchSymbols, approveSymbol, categorizeSymbol } from "@/app/api/adminApi";

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

    const handleApprove = async (symbolId) => {
        try {
            await approveSymbol(symbolId, token);
            setSuccessMessage("Symbol approved.");
            loadSymbols();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleCategorize = async (requestId) => {
        const categoryIds = selectedCategories[requestId] || [];
        if (categoryIds.length === 0) {
            setError("Please select at least one category");
            return;
        }

        try {
            await categorizeSymbol(requestId, categoryIds, token);
            setSuccessMessage("Symbol successfully categorized");
            setError("");
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
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Symbols Control Section</h1>

            {successMessage && (
                <p className="text-green-600 font-semibold mb-4 text-center">{successMessage}</p>
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
                                <th className="p-2 sm:p-3 border">Actions</th>
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
                                        <select
                                            multiple
                                            className="w-full border rounded px-2 py-1 text-sm sm:text-base"
                                            value={selectedCategories[symbolRequest.id] || []}
                                            onChange={(e) => {
                                                const selected = Array.from(
                                                    e.target.selectedOptions
                                                ).map((o) => Number(o.value));
                                                setSelectedCategories((prev) => ({
                                                    ...prev,
                                                    [symbolRequest.id]: selected,
                                                }));
                                            }}
                                        >
                                            {categories.map((cat) => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="p-2 sm:p-3 border space-y-2">
                                        <button
                                            onClick={() => handleApprove(symbolRequest.id)}
                                            className="bg-green-600 text-white px-2 py-1 sm:px-3 sm:py-1 rounded hover:bg-green-700 w-full text-sm sm:text-base"
                                        >
                                            Approve
                                        </button>

                                        <button
                                            onClick={() => handleCategorize(symbolRequest.id)}
                                            className="bg-blue-600 text-white px-2 py-1 sm:px-3 sm:py-1 rounded hover:bg-blue-700 w-full text-sm sm:text-base"
                                        >
                                            Categorize
                                        </button>

                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination buttons */}
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
