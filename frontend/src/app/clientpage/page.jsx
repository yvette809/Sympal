"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import {speak} from "@/app/api";
import {
    fetchTokenFromLocalOrSearchParams,
    decodeToken,
    submitSymbolRequest,
    checkSymbolStatus,
    getUserHistory,
} from "@/app/api/clientSymbolApi";

const Page = () => {
    const [username, setUsername] = useState("");
    const [inputText, setInputText] = useState("");
    const [statuses, setStatuses] = useState({});
    const [images, setImages] = useState({});
    const [history, setHistory] = useState([]);
    const pollingIntervals = useRef({});
    const searchParams = useSearchParams();
    const [token, setToken] = useState(null);

    useEffect(() => {
        const t = fetchTokenFromLocalOrSearchParams(searchParams);
        if (t) {
            const decoded = decodeToken(t);
            if (decoded) {
                setUsername(decoded.username);
                setToken(t);
            }
        }
    }, [searchParams]);

    useEffect(() => {
        if (!token) return;

        const fetchHistory = async () => {
            try {
                const userHistory = await getUserHistory(token);
                setHistory(userHistory.reverse());
            } catch (error) {
                console.error("Failed to load user history:", error);
            }
        };

        fetchHistory();
        return () => {
            Object.values(pollingIntervals.current).forEach(clearInterval);
        };
    }, [token]);

    const normalize = (query) => query.trim().toLowerCase();

    const startPolling = (query) => {
        if (pollingIntervals.current[query]) return;
        pollingIntervals.current[query] = setInterval(async () => {
            try {
                const res = await checkSymbolStatus(query, token);
                if (!res.ok) throw new Error("Polling failed");
                const data = await res.json();

                if (data.status === "READY_FOR_APPROVAL" && data.imageUrl) {
                    clearInterval(pollingIntervals.current[query]);
                    delete pollingIntervals.current[query];
                    setStatuses((prev) => ({ ...prev, [query]: "Symbol ready" }));
                    setImages((prev) => ({ ...prev, [query]: data.imageUrl }));
                    setHistory((prev) => [
                        { description: query, tempImageUrl: data.imageUrl },
                        ...prev,
                    ]);
                } else if (data.status === "FAILED") {
                    clearInterval(pollingIntervals.current[query]);
                    delete pollingIntervals.current[query];
                    setStatuses((prev) => ({ ...prev, [query]: "Symbol generation failed" }));
                } else {
                    setStatuses((prev) => ({
                        ...prev,
                        [query]: `Waiting for symbol... (${data.status})`,
                    }));
                }
            } catch (err) {
                console.error(`Polling error for "${query}":`, err);
                setStatuses((prev) => ({ ...prev, [query]: "Polling error" }));
                clearInterval(pollingIntervals.current[query]);
                delete pollingIntervals.current[query];
            }
        }, 3000);
    };

    const generateSymbolForQuery = async (query) => {
        if (!query.trim()) return;
        const trimmedQuery = query.trim();
        try {
            setStatuses((prev) => ({ ...prev, [trimmedQuery]: "Submitting..." }));
            const res = await submitSymbolRequest(trimmedQuery, token);

            if (res.ok) {
                if (res.status === 200) {
                    const data = await res.json();
                    if (data.imageUrl) {
                        setStatuses((prev) => ({ ...prev, [trimmedQuery]: "Symbol ready" }));
                        setImages((prev) => ({ ...prev, [trimmedQuery]: data.imageUrl }));
                        setHistory((prev) => [
                            { description: trimmedQuery, tempImageUrl: data.imageUrl },
                            ...prev,
                        ]);
                    } else {
                        setStatuses((prev) => ({ ...prev, [trimmedQuery]: "No symbol found" }));
                    }
                } else if (res.status === 202 || res.status === 409) {
                    startPolling(trimmedQuery);
                    setStatuses((prev) => ({ ...prev, [trimmedQuery]: "Submitting..." }));
                } else {
                    const errorData = await res.json();
                    console.error(`Unexpected status code ${res.status}`, errorData);
                    setStatuses((prev) => ({
                        ...prev,
                        [trimmedQuery]: `Unexpected response (${res.status})`,
                    }));
                }
            } else {
                const errorData = await res.json();
                console.error(`Failed to submit:`, errorData);
                setStatuses((prev) => ({
                    ...prev,
                    [trimmedQuery]: `Failed to submit (${res.status})`,
                }));
            }
        } catch (error) {
            setStatuses((prev) => ({ ...prev, [trimmedQuery]: "Submission error" }));
            console.error(`Submission error for "${trimmedQuery}":`, error);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleGenerateClick();
        }
    };

    const handleInputChange = (e) => {
        setInputText(e.target.value);
    };

    const handleGenerateClick = () => {
        const query = inputText.trim();
        if (!query) return;

        const normalized = normalize(query);
        const status = statuses[normalized];

        if (!status || status.startsWith("Waiting") || status === "Submitting...") {
            generateSymbolForQuery(normalized);
        }

        setInputText("");
    };

    return (
        <div className="px-4 py-8 max-w-3xl mx-auto">
            <h1 className="text-2xl font-semibold mb-4">AI Symbol Generator</h1>
            {username ? (
                <p className="text-md mb-4 text-gray-700">Welcome, {username}!</p>
            ) : (
                <p className="text-md mb-4 text-gray-500">Please log in to see your username.</p>
            )}

            <div className="flex flex-col sm:flex-row mb-4 gap-2">
        <textarea
            className="border border-gray-300 p-3 w-full rounded-md resize-none text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type a word or phrase and press Enter or the Generate button"
            value={inputText}
            onKeyDown={handleKeyDown}
            onChange={handleInputChange}
            rows={1}
        />
                <button
                    onClick={handleGenerateClick}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition"
                >
                    Generate
                </button>
            </div>

            {Object.entries(statuses).length > 0 && (
                <div className="mb-6 space-y-2">
                    {Object.entries(statuses).map(([query, stat]) => (
                        <div key={query} className="text-sm flex items-center gap-2">
                            <span className="font-medium">{query}:</span>
                            {stat.includes("Submitting") || stat.includes("Waiting") ? (
                                <>
                                    <span className="animate-spin h-4 w-4 border-2 border-t-transparent border-blue-600 rounded-full"></span>
                                    <span>{stat}</span>
                                </>
                            ) : (
                                <span>{stat}</span>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <div>
                <h2 className="text-lg font-semibold mb-3">Previously Generated Symbols</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {history.map(({ description, tempImageUrl }) => (
                        <div
                            key={description + tempImageUrl}
                            className="relative group"
                            onClick={() => speak(description)}
                        >
                            <img
                                src={tempImageUrl}
                                alt={description}
                                className="w-full h-24 object-contain border border-gray-300 rounded-lg shadow-sm"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-60 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg p-2 text-center">
                                {description}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Page;
