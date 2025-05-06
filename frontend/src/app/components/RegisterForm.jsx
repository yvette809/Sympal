"use client";
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const RegisterForm = ({ onClose, switchToLogin }) => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Registration failed");
            }

            setSuccess("Registration successful! Redirecting...");
            setTimeout(() => switchToLogin(), 2000);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-3 text-2xl text-red-500 font-bold"
                >
                    ✖
                </button>

                <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

                {error && <div className="text-red-500 mb-3 text-center">{error}</div>}
                {success && <div className="text-green-500 mb-3 text-center">{success}</div>}

                <form onSubmit={handleRegister}>
                    <input
                        type="username"
                        placeholder="username"
                        className="w-full border p-2 mb-3 rounded"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full border p-2 mb-3 rounded"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Confirm Password"
                        className="w-full border p-2 mb-4 rounded"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />

                    <button
                        type="submit"
                        className="bg-green-600 text-white py-2 px-4 rounded w-full hover:bg-green-700"
                    >
                        Register
                    </button>
                </form>

                <div className="text-center mt-4 text-sm text-gray-700">
                    Already have an account?{" "}
                    <button
                        onClick={switchToLogin}
                        className="text-blue-600 hover:underline"
                    >
                        Login here
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;
