"use client";

import React, { useState, useEffect } from 'react';
import ConfirmationModal from "@/app/components/ConfirmationModal";
import useAuthToken from "@/app/hooks/useAuthToken";
import { fetchCategories, generateSymbol, saveSymbol } from "@/app/api"; // Import API functions


const SymbolGenerator = () => {
    const [prompt, setPrompt] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [imageUrl, setImageUrl] = useState(null);
    const [savedSymbol, setSavedSymbol] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);

    const { token } = useAuthToken();

    const handleCancel = () => {
        setShowPopup(false);
        setImageUrl(null);
        setSavedSymbol(null);
        setPrompt('');
        setCategory(categories.length > 0 ? categories[0].name : '');
        setSelectedCategories([]);
    };

    const toggleCategory = (name) => {
        setSelectedCategories((prevSelected) =>
            prevSelected.includes(name)
                ? prevSelected.filter((cat) => cat !== name)
                : [...prevSelected, name]
        );
    };

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await fetchCategories();
                if (data.length > 0) {
                    setCategories(data);
                    setCategory(data[0].name);
                } else {
                    setError('No categories available');
                }
            } catch (err) {
                setError('Failed to fetch categories');
            }
        };

        loadCategories();
    }, []);

    const handleCreateCategory = async (name) => {
        try {
            const response = await fetch('http://localhost:8080/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name }),
            });

            if (!response.ok) throw new Error("Misslyckades att skapa kategori");

            const newCategory = await response.json();
            setCategories((prev) => [...prev, newCategory]);
        } catch (error) {
            console.error("Fel vid skapande av kategori:", error);
        }
    };

    const handleGenerate = async () => {
        setShowPopup(true);
        setLoading(true);
        setError('');
        setImageUrl(null);
        setSavedSymbol(null);

        if (!token) {
            setError("User unauthorized. Please log in.");
            setLoading(false);
            return;
        }

        try {
            const url = await generateSymbol(token, prompt);
            setImageUrl(url);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setError('');

        if (!token) {
            setError("User unauthorized. Please log in as Admin.");
            setLoading(false);
            return;
        }

        try {
            const symbol = {
                prompt,
                imageUrl,
                categories: selectedCategories.map(name => ({ name }))
            };

            const data = await saveSymbol(token, symbol);
            setSavedSymbol(data);
            return data;

        } catch (err) {
            setError('Failed to save symbol');
        } finally {
            setSaving(false);
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f0f4f8] to-[#d9e2ec] p-6">
            <div className="w-full max-w-lg p-8 bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl">
                <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">🎨 Symbol Generator</h2>

                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Describe your symbol..."
                        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                    />
                </div>



                <button
                    onClick={handleGenerate}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-xl text-lg font-semibold hover:from-indigo-600 hover:to-purple-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                >
                    {loading ? 'Generating...' : 'Generate Symbol'}
                </button>

                {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

                {imageUrl && (
                    <div className="mt-8 text-center">
                        <p className="font-semibold text-lg mb-4 text-gray-700">{prompt}</p>
                        <img
                            src={imageUrl}
                            alt={prompt}
                            className="mx-auto rounded-xl shadow-md max-h-64 object-contain"
                        />

                        <div className="flex justify-center gap-4 mt-4">
                            <button
                                onClick={handleSave}
                                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-xl font-semibold transition disabled:opacity-50"
                                disabled={saving}
                            >
                                {saving ? 'Sparar...' : 'Spara symbol'}
                            </button>

                            <button
                                onClick={handleGenerate}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-xl font-semibold transition"
                                disabled={loading}
                            >
                                {loading ? 'Laddar...' : 'Testa igen'}
                            </button>
                        </div>
                    </div>
                )}

                {savedSymbol && (
                    <p className="mt-4 text-green-600 font-semibold text-center">
                        ✅ Symbolen sparades!
                    </p>
                )}

                {showPopup && (
                    <ConfirmationModal
                        imageUrl={imageUrl}
                        categories={categories}
                        loading={loading}
                        selectedCategories={selectedCategories}
                        setSelectedCategories={setSelectedCategories}
                        onCreateCategory={handleCreateCategory}
                        onConfirm={async () => {
                            await handleSave();
                            setShowPopup(false);
                            window.location.href = "/";
                        }}
                        onReject={handleGenerate}
                        onCancel={handleCancel}
                        toggleCategory={toggleCategory}
                    />
                )}
            </div>
        </div>
    );
};

export default SymbolGenerator;
