
"use client";

import { useEffect, useState } from "react";
import {  useSearchParams } from "next/navigation";
import {jwtDecode } from "jwt-decode";

const Page = () => {
    const [username, setUsername] = useState("");
    const searchParams = useSearchParams();

    useEffect(() => {
        // First check for the token in localStorage
        let token = localStorage.getItem("token");

        // If token is not found in localStorage, check for it in the searchParams (URL)
        if (!token) {
            token = searchParams.get("token");
        }

        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                console.log("Decoded Token:", decodedToken);
                const user = decodedToken.sub;
                setUsername(user);
            } catch (error) {
                console.error("Invalid token", error);
            }
        }
    }, [searchParams]);
    return (
        <div>
            {username ? (
                <p>Welcome, {username}!</p>
            ) : (
                <p>Please log in to see your username.</p>
            )}
        </div>
    );
};

export default Page;
