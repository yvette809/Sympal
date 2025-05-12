"use client";

import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Link from "next/link";
import useAuthToken from "@/app/hooks/useAuthToken";  // Import the useAuth hook

const Navigation = () => {
    const [modalType, setModalType] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { user, isLoggedIn, logout, reloadUser } = useAuthToken();  // Use the hook
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

            <nav className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-4">
                <div className="flex items-center justify-between">
                    <Link href={"/"}><h1 className="text-xl font-bold">Sympal</h1></Link>

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
