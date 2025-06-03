
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

export async function approveAndCategorizeSymbol(requestId, categoryIds, token) {
    const res = await fetch(`http://localhost:8080/api/admin/approve-and-categorize/${requestId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(categoryIds),
    });

    if (!res.ok) {
        const message = await res.text();
        throw new Error(message || "Failed to approve and categorize symbol");
    }

    return res.text();
}


export async function rejectSymbolRequest(requestId, token) {
    const res = await fetch(`http://localhost:8080/api/admin/reject/${requestId}`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        const message = await res.text();
        throw new Error(message || "Failed to reject symbol request");
    }

    return res.text();
}