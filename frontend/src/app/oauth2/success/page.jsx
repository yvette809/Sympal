"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const OAuth2SuccessPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const token = searchParams.get("token");
        const email = searchParams.get("email");

        if (token) {
            localStorage.setItem("token", token);
            localStorage.setItem("email", email);
            router.push("/clientpage");
        } else {
            router.push("/login");
        }
    }, [searchParams, router]);

    return <p>Logging you in...</p>;
};

export default OAuth2SuccessPage;
