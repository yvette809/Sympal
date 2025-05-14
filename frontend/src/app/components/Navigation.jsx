"use client";

import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Link from "next/link";
import useAuthToken from "@/app/hooks/useAuthToken";

const Navigation = () => {
    const [modalType, setModalType] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { user, isLoggedIn, logout, reloadUser } = useAuthToken();
    const router = useRouter();
    const pathname = usePathname();

    const closeModal = () => setModalType(null);

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    const handleLoginSuccess = () => {
        reloadUser();
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

            <nav className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-4 shadow-lg sticky top-0 z-10">
                <div className="flex items-center justify-between max-w-6xl mx-auto">
                    <Link href={"/"}><h1 className="text-2xl font-semibold tracking-tight">Sympal</h1></Link>

                    <button
                        className="md:hidden text-white text-2xl"
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        ☰
                    </button>

                    {/* Desktop Navigation */}
                    <ul className="hidden md:flex gap-8 items-center">
                        {isLoggedIn ? (
                            <>
                                <li className="text-lg">{user?.email}</li>
                                <li
                                    className="cursor-pointer py-2 px-4 rounded-md bg-red-600 hover:bg-red-700 transition duration-300"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </li>
                            </>
                        ) : (
                            <>
                                <li
                                    className="cursor-pointer py-2 px-4 rounded-md bg-blue-600 hover:bg-blue-700 transition duration-300"
                                    onClick={() => setModalType("login")}
                                >
                                    Login
                                </li>
                                <li
                                    className="cursor-pointer py-2 px-4 rounded-md bg-green-600 hover:bg-green-700 transition duration-300"
                                    onClick={() => setModalType("register")}
                                >
                                    Register
                                </li>
                            </>
                        )}
                    </ul>
                </div>

                {/* Mobile Navigation */}
                {mobileOpen && (
                    <ul className="flex flex-col gap-4 mt-4 md:hidden">
                        {isLoggedIn ? (
                            <>
                                <li className="text-lg">{user?.email}</li>
                                <li
                                    className="cursor-pointer py-2 px-4 rounded-md bg-red-600 hover:bg-red-700 transition duration-300"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </li>
                            </>
                        ) : (
                            <>
                                <li
                                    className="cursor-pointer py-2 px-4 rounded-md bg-blue-600 hover:bg-blue-700 transition duration-300"
                                    onClick={() => setModalType("login")}
                                >
                                    Login
                                </li>
                                <li
                                    className="cursor-pointer py-2 px-4 rounded-md bg-green-600 hover:bg-green-700 transition duration-300"
                                    onClick={() => setModalType("register")}
                                >
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
