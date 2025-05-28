import { jwtDecode } from "jwt-decode";

export const fetchTokenFromLocalOrSearchParams = (searchParams) => {
    let token = localStorage.getItem("token");
    if (!token) {
        token = searchParams.get("token");
        if (token) localStorage.setItem("token", token);
    }
    return token;
};

export const decodeToken = (token) => {
    try {
        const { username } = jwtDecode(token);
        return { username };
    } catch (error) {
        console.error("Invalid token", error);
        return null;
    }
};

export const submitSymbolRequest = async (query, token) => {
    const res = await fetch(
        `http://localhost:8080/api/requests?description=${encodeURIComponent(query)}`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return res;
};

export const checkSymbolStatus = async (query, token) => {
    const res = await fetch(
        `http://localhost:8080/api/requests/${encodeURIComponent(query)}/status`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return res;
};


export const getUserHistory = async (token) => {
    try {
        const res = await fetch("http://localhost:8080/api/requests/history", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            throw new Error("Failed to fetch user history");
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching user history:", error);
        throw error;
    }
};

