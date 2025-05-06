"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const LoginForm = ({ onClose, switchToRegister }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({ username, password }),
            });


            if (!response.ok) {

                throw new Error( "Login failed");
            }

            const data = await response.json();
            console.log("data", data)
            localStorage.setItem("token", data.token);
            router.push("/clientpage");
            onClose();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/google";
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg relative w-[90%] max-w-md p-6">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-3 text-2xl text-red-500 font-bold"
                >
                    ✖
                </button>

                <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

                {error && <div className="text-red-500 mb-3 text-center">{error}</div>}

                <form onSubmit={handleLogin}>
                    <input
                        type="username "
                        placeholder="Email"
                        className="w-full border p-2 mb-3 rounded"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full border p-2 mb-4 rounded"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button
                        type="submit"
                        className="bg-red-500 text-white py-2 px-4 rounded w-full hover:bg-red-600"

                    >
                        Login
                    </button>
                </form>

                <div className="my-4 text-center text-gray-500">OR</div>

                <button
                    onClick={handleGoogleLogin}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                    Login with Google
                </button>

                <div className="text-center mt-4 text-sm text-gray-700">
                    Don't have an account?{" "}
                    <button
                        onClick={switchToRegister}
                        className="text-blue-600 hover:underline"
                    >
                        Register here
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
