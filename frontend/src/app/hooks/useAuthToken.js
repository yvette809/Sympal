import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const useAuthToken = () => {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState(null); // Store the token

    const loadUserFromToken = () => {
        if (typeof window !== "undefined") {
            const storedToken = localStorage.getItem("token");

            if (storedToken) {
                setToken(storedToken);
                try {
                    const decoded = jwtDecode(storedToken);
                    setUser(decoded);
                    setIsLoggedIn(true);
                } catch (err) {
                    console.error("Invalid token");
                    localStorage.removeItem("token");
                    setUser(null);
                    setIsLoggedIn(false);
                    setToken(null);
                }
            }
        }
    };

    const logout = () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("token");
        }
        setUser(null);
        setIsLoggedIn(false);
        setToken(null);
    };


    useEffect(() => {
        loadUserFromToken();
    }, []);

    return { token, user, isLoggedIn, logout, reloadUser: loadUserFromToken };
};

export default useAuthToken;
