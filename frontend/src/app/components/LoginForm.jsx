"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {FcGoogle} from "react-icons/fc";


const LoginForm = ({ onClose, onLoginSuccess, switchToRegister }) => {
    const [email, setEmail] = useState("");
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
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error("Login failed");
            }

            const data = await response.json()
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role); // Store role if needed

            onLoginSuccess();

            // Redirect based on role
            if (data.role === "ROLE_ADMIN") {
                router.push("/adminpage");
            } else if (data.role === "ROLE_USER") {
                router.push("/clientpage");
            } else {
                router.push("/"); // default
            }
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
                        type="email"
                        placeholder="Email"
                        className="w-full border p-2 mb-3 rounded"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                        className="bg-purple-500 text-white py-2 px-4 rounded w-full hover:bg-purple-400"
                    >
                        Login
                    </button>
                </form>

                <div className="my-4 text-center text-gray-500">OR</div>

                <button
                    onClick={handleGoogleLogin}
                    className="w-full bg-white text-black border border-gray-300 py-2 px-4 rounded flex items-center justify-center gap-2 hover:bg-gray-100 shadow-sm"
                >
                    <FcGoogle size={22}/>
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
