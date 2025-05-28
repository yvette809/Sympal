
export const fetchSymbols = async (token) => {
    const res = await fetch("http://localhost:8080/api/admin/symbols", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch symbols.");
    }

    return res.json();
};

export const approveSymbol = async (symbolId, token) => {
    const res = await fetch(`http://localhost:8080/api/admin/approve/${symbolId}`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error("Approval failed.");
    }
};

export const categorizeSymbol = async (requestId, categoryIds, token) => {
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
        throw new Error(errMsg || "Categorization failed.");
    }
};
