"use client"

import React, { useState, useEffect } from 'react';
const SymbolGenerator = () => {
    const [prompt, setPrompt] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [symbol, setSymbol] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/categories');
                console.log("categories response:", response);
                if (!response.ok) throw new Error('Failed to fetch categories');
                const data = await response.json();
                console.log("categories fetched:", data);

                if (data.length > 0) {
                    setCategories(data);
                    setCategory(data[0].name);  // Set the first category as the default
                } else {
                    setError('No categories available');
                }
            } catch (err) {
                setError('Failed to fetch categories ');
            }
        };

        fetchCategories();
    }, []);

    const handleGenerate = async () => {
        console.log("Category:", category);
        setLoading(true);
        setError('');
        try {
            const response = await fetch('http://localhost:8080/api/symbols/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, category: category }),
            });

            if (!response.ok) throw new Error('Failed to generate symbol');

            const data = await response.json();
            console.log("data", data)
            setSymbol(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-4 shadow-lg rounded-xl bg-white">
            <h2 className="text-xl font-bold mb-4">Generate a Symbol</h2>

            <input
                type="text"
                placeholder="Enter description"
                className="border p-2 w-full mb-2"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
            />

            <select
                className="border p-2 w-full mb-4"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
            >
                {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                        {cat.name}
                    </option>
                ))}
            </select>

            <button
                onClick={handleGenerate}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                disabled={loading}
            >
                {loading ? 'Generating...' : 'Generate Symbol'}
            </button>

            {error && <p className="text-red-500 mt-2">{error}</p>}

            {symbol && (
                <div className="mt-6 text-center">
                    <p className="font-semibold">{symbol.description}</p>
                    <img src={symbol.imageUrl} alt={symbol.description} className="mt-2 max-h-48 mx-auto" />
                </div>
            )}
        </div>
    );
};

export default SymbolGenerator;
