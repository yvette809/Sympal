"use client";

import { useParams } from "next/navigation";
import {fetchSymbolsByCategory,speak} from "@/app/api";
import { useEffect, useState } from "react";

const Page = () => {
   const {id} = useParams()
    const [symbols, setSymbols] = useState([]);
    const [category, setCategory] = useState(null);

    useEffect(() => {
        const loadSymbolsByCategory = async () => {
            if (!id) return;
            try {
                const getSymbols = await fetchSymbolsByCategory(id);
                setSymbols(getSymbols);
            } catch (error) {
                console.error("Error loading symbols:", error);
            }
        };

        loadSymbolsByCategory();
    }, [id]);


    return (
        <div className="min-h-screen bg-white p-6">
            <div className="max-w-5xl mx-auto">
                {category && (
                    <div className="mb-10 text-center">
                        <h2 className="text-4xl font-bold mb-2">{category.name}</h2>
                        <div className="text-6xl mb-4">{category.icon}</div>
                        <p className="text-gray-600">Click a symbol to hear it spoken aloud.</p>
                    </div>
                )}

                {symbols.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                        {symbols.map((symbol) => (
                            <div
                                key={symbol.id}
                                onClick={() => speak(symbol.description)}
                                className="cursor-pointer bg-blue-50 p-4 rounded-xl shadow hover:shadow-lg transition duration-200 text-center"
                            >
                                <img
                                    src={symbol.imageUrl}
                                    alt={symbol.description}
                                    className="w-full h-32 object-contain mb-3"
                                />
                                <p className="text-lg font-medium">{symbol.description}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500">No symbols found for this category.</p>
                )}
            </div>
        </div>
    );
};

export default Page;
