"use client";
import SymbolGenerator from "@/app/components/SymbolGenerator";
import AdminComponent from "@/app/components/AdminComponent";

export default function AdminPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f0f4f8] to-[#d9e2ec] p-4 md:p-10">
            <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">Admin Dashboard</h1>

            <div className="flex flex-col lg:flex-row gap-6 items-start">
                <div className="w-full lg:w-1/2">
                    <SymbolGenerator/>
                </div>
                <div className="w-full lg:w-1/2">
                    <AdminComponent/>
                </div>
            </div>
        </div>
    );
}
