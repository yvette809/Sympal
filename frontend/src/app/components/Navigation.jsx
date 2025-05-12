"use client";

import { useState, useEffect } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import {jwtDecode} from "jwt-decode";
import {useRouter} from "next/navigation"
import { usePathname } from "next/navigation";

const Navigation = () => {
    const [modalType, setModalType] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser(decoded);
                setIsLoggedIn(true);
            } catch (e) {
                console.error("Invalid token");
                localStorage.removeItem("token");
                setIsLoggedIn(false);
                setUser(null);
            }
        }
    }, [pathname]);

    const closeModal = () => setModalType(null);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setUser(null);
        router.push("/")
    };

    const handleLoginSuccess = () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser(decoded);
                setIsLoggedIn(true);
            } catch (e) {
                console.error("Invalid token after login");
            }
        }
        closeModal();
    };

    return (
        <>
            {modalType === "login" && (
                <LoginForm
                    onClose={closeModal}
                    onLoginSuccess={handleLoginSuccess}
                    switchToRegister={() => setModalType("register")}
                />
            )}
            {modalType === "register" && (
                <RegisterForm
                    onClose={closeModal}
                    switchToLogin={() => setModalType("login")}
                />
            )}

            <nav className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold">Sympal</h1>

                    <button
                        className="md:hidden text-white text-2xl"
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        ☰
                    </button>

                    <ul className="hidden md:flex gap-6">
                        {isLoggedIn ? (
                            <>
                                <li>{user?.email}</li>
                                <li className="cursor-pointer" onClick={handleLogout}>
                                    Logout
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="cursor-pointer" onClick={() => setModalType("login")}>
                                    Login
                                </li>
                                <li className="cursor-pointer" onClick={() => setModalType("register")}>
                                    Register
                                </li>
                            </>
                        )}
                    </ul>
                </div>

                {mobileOpen && (
                    <ul className="flex flex-col gap-2 mt-4 md:hidden">
                        {isLoggedIn ? (
                            <>
                                <li>{user?.email}</li>
                                <li className="cursor-pointer" onClick={handleLogout}>
                                    Logout
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="cursor-pointer" onClick={() => setModalType("login")}>
                                    Login
                                </li>
                                <li className="cursor-pointer" onClick={() => setModalType("register")}>
                                    Register
                                </li>
                            </>
                        )}
                    </ul>
                )}
            </nav>
        </>
    );
};

export default Navigation;
