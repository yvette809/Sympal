"use client";

import React, { useState } from "react";

const ConfirmationModal = ({
                               imageUrl,
                               onConfirm,
                               onReject,
                               onCancel,
                               loading,
                               categories = [],
                               selectedCategories = [],
                               toggleCategory,
                               onCreateCategory
                           }) => {
    const [newCategoryName, setNewCategoryName] = useState("");

    const handleCreateCategory = () => {
        if (newCategoryName.trim()) {
            onCreateCategory(newCategoryName.trim());
            setNewCategoryName("");
        }
    };

    return (
        <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Är du nöjd med symbolen?
            </h2>

            {onCancel && (
                <button
                    onClick={onCancel}
                    className="absolute top-4 left-4 text-sm text-gray-500 hover:text-gray-800"
                >
                    ← Tillbaka
                </button>
            )}

            {loading || !imageUrl ? (
                <div className="flex flex-col items-center justify-center mb-6">
                    <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    <p className="mt-2 text-gray-600">Genererar symbol...</p>
                </div>
            ) : (
                <>
                    <img
                        src={imageUrl}
                        alt="Förhandsvisning"
                        className="max-h-80 object-contain rounded-xl shadow-md mb-6"
                    />

                    <div className="w-full max-w-md mb-6">
                        <h4 className="text-lg font-semibold text-gray-700 mb-2">Välj kategori(er):</h4>
                        <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => toggleCategory(cat)}
                                    className={`px-3 py-1 rounded-full border transition ${
                                        selectedCategories.some((c) => c.id === cat.id)
                                            ? "bg-indigo-500 text-white"
                                            : "bg-gray-100 text-gray-700"
                                    }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>

                        <div className="mt-4 flex gap-2">
                            <input
                                type="text"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                placeholder="Ny kategori..."
                                className="flex-1 px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                            <button
                                onClick={handleCreateCategory}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700"
                            >
                                Lägg till
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-6">
                        <button
                            onClick={onConfirm}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl text-lg font-semibold"
                        >
                            Ja, spara symbolen
                        </button>

                        <button
                            onClick={onReject}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-xl text-lg font-semibold"
                        >
                            Nej, generera ny
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ConfirmationModal;
