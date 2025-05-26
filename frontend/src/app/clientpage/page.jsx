"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import {jwtDecode} from "jwt-decode";

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
        let t = localStorage.getItem("token");
        if (!t) {
            t = searchParams.get("token");
            if (t) localStorage.setItem("token", t);
        }
        if (t) {
            try {
                const decodedToken = jwtDecode(t);
                setUsername(decodedToken.username);
                setToken(t);
            } catch (error) {
                console.error("Invalid token", error);
            }
        }
    }, [searchParams]);

    useEffect(() => {
        return () => {
            Object.values(pollingIntervals.current).forEach(clearInterval);
        };
    }, []);

    const normalize = (query) => query.trim().toLowerCase();

    const startPolling = (query) => {
        if (pollingIntervals.current[query]) return;
        pollingIntervals.current[query] = setInterval(async () => {
            try {
                const res = await fetch(
                    `http://localhost:8080/api/requests/${encodeURIComponent(query)}/status`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                if (!res.ok) throw new Error("Polling failed");

                const data = await res.json();
                console.log("data", data)
                if (data.status === "READY_FOR_APPROVAL" && data.imageUrl) {
                    clearInterval(pollingIntervals.current[query]);
                    delete pollingIntervals.current[query];
                    setStatuses((prev) => ({ ...prev, [query]: "Symbol ready" }));
                    setImages((prev) => ({ ...prev, [query]: data.imageUrl }));
                    setHistory((prev) => [
                        { description: query, imageUrl: data.imageUrl },
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

            const res = await fetch(
                `http://localhost:8080/api/requests?description=${encodeURIComponent(trimmedQuery)}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (res.ok) {
                if (res.status === 200) {
                    const data = await res.json();
                    if (data.imageUrl) {
                        setStatuses((prev) => ({ ...prev, [trimmedQuery]: "Symbol ready" }));
                        setImages((prev) => ({ ...prev, [trimmedQuery]: data.imageUrl }));
                        setHistory((prev) => [
                            { description: trimmedQuery, imageUrl: data.imageUrl },
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
                    console.error(
                        `Unexpected status code ${res.status} for "${trimmedQuery}"`,
                        errorData
                    );
                    setStatuses((prev) => ({
                        ...prev,
                        [trimmedQuery]: `Unexpected response (${res.status})`,
                    }));
                }
            } else {
                const errorData = await res.json();
                console.error(`Failed to submit "${trimmedQuery}":`, errorData);
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
        <div className="p-4 max-w-xl mx-auto">
            {username ? (
                <p className="text-lg mb-4">Welcome, {username}!</p>
            ) : (
                <p className="text-lg mb-4">Please log in to see your username.</p>
            )}

            <div className="flex items-center mb-2">
        <textarea
            className="border p-2 w-full rounded-l-md resize-none"
            placeholder="Type a word or phrase and press Enter or the Generate button"
            value={inputText}
            onKeyDown={handleKeyDown}
            onChange={handleInputChange}
            rows={1}
        />
                <button
                    onClick={handleGenerateClick}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-md"
                >
                    Generate
                </button>
            </div>

            <div className="mb-4 space-y-2">
                {Object.entries(statuses).map(([query, stat]) => (
                    <div key={query} className="text-sm flex items-center gap-2">
                        <span className="font-semibold">{query}:</span>
                        {stat.includes("Submitting") || stat.includes("Waiting") ? (
                            <>
                                <span className="animate-spin inline-block h-4 w-4 border-2 border-t-transparent border-gray-500 rounded-full"></span>
                                <span>{stat}</span>
                            </>
                        ) : (
                            <span>{stat}</span>
                        )}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-3 gap-4">
                {history.map(({ description, imageUrl }) => (
                    <div
                        key={description + imageUrl}
                        className="flex flex-col items-center text-center"
                    >
                        <img
                            src={imageUrl}
                            alt={description}
                            className="w-24 h-24 object-contain border rounded"
                        />
                        <span className="text-xs mt-1 break-words">{description}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Page;
