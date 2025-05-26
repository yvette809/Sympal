"use client";

import { useEffect, useState } from "react";
import useAuthToken from "@/app/hooks/useAuthToken";
import { fetchCategories } from "@/app/api";

export default function AdminComponent() {
    const { token, user, isLoggedIn, logout } = useAuthToken();
    const [symbols, setSymbols] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const imagesPerPage = 6;

    console.log("user", user)

    useEffect(() => {
        if (isLoggedIn) {
            fetchSymbols();
            fetchCategories()
                .then(setCategories)
                .catch((err) => {
                    console.error("Failed to fetch categories:", err);
                    setError("Failed to fetch categories.");
                });
        }
    }, [isLoggedIn]);

    const fetchSymbols = async () => {
        setLoading(true);
        try {
            const res = await fetch("http://localhost:8080/api/admin/symbols", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            setSymbols(data);
        } catch (err) {
            setError("Failed to fetch symbols.");
        } finally {
            setLoading(false);
        }
    };

    const approveSymbol = async (symbolId) => {
        try {
            await fetch(`http://localhost:8080/api/admin/approve/${symbolId}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSuccessMessage("Symbol approved.");
            fetchSymbols();
        } catch (err) {
            setError("Approval failed.");
        }
    };

    const categorizeSymbol = async (requestId) => {
        console.log("Current token:", token);
        const categoryIds = selectedCategories[requestId] || [];

        if (categoryIds.length === 0) {
            setError("Please select at least one category");
            return;
        }

        try {
            const res = await fetch(`http://localhost:8080/api/admin/categorize/${requestId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(categoryIds),
            });

            if (!res.ok) {
                const errMsg = await res.text();
                throw new Error(`Server responded with ${res.status}: ${errMsg}`);
            }

            setSuccessMessage("Symbol successfully categorized");
            setError("");
            fetchSymbols();
            // Clear the selected categories for this symbol
            setSelectedCategories(prev => {
                const newState = {...prev};
                delete newState[requestId];
                return newState;
            });
        } catch (err) {
            setError(err.message || "Categorization failed.");
        }
    };

    if (!isLoggedIn) return <p>You must be logged in to view this page.</p>;
    if (loading) return <p>Loading symbols...</p>;
    if (error) return <p className="text-red-600">{error}</p>;

    // Pagination calculations
    const lastIndex = currentPage * imagesPerPage;
    const firstIndex = lastIndex - imagesPerPage;
    const currentSymbols = symbols.slice(firstIndex, lastIndex);

    const totalPages = Math.ceil(symbols.length / imagesPerPage);

    return (
        <div className="p-4 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">Admin Panel</h1>

            {successMessage && (
                <p className="text-green-600 font-semibold mb-4">{successMessage}</p>
            )}

            {symbols.length === 0 ? (
                <p className="text-center">No generated symbols to show.</p>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto border border-gray-300 shadow-md">
                            <thead className="bg-gray-100 text-left">
                            <tr>
                                <th className="p-3 border">Description</th>
                                <th className="p-3 border">Image</th>
                                <th className="p-3 border">Categories</th>
                                <th className="p-3 border">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {currentSymbols.map((symbolRequest) => (
                                <tr key={symbolRequest.id} className="border-t">
                                    <td className="p-3 border">{symbolRequest.description}</td>
                                    <td className="p-3 border">
                                        {symbolRequest.tempImageUrl ? (
                                            <img
                                                src={symbolRequest.tempImageUrl}
                                                alt={symbolRequest.description}
                                                className="w-24 h-24 object-contain"
                                            />
                                        ) : (
                                            <span>No image</span>
                                        )}
                                    </td>
                                    <td className="p-3 border">
                                        <select
                                            multiple
                                            className="w-full border rounded px-2 py-1"
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
                                    <td className="p-3 border space-y-2">
                                        <button
                                            onClick={() => approveSymbol(symbolRequest.id)}
                                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 w-full"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => categorizeSymbol(symbolRequest.id)}
                                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 w-full"
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
                    <div className="mt-4 flex justify-center space-x-2">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((p) => p - 1)}
                            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
                        >
                            Prev
                        </button>
                        {[...Array(totalPages).keys()].map((num) => (
                            <button
                                key={num + 1}
                                onClick={() => setCurrentPage(num + 1)}
                                className={`px-3 py-1 rounded ${
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
                            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
