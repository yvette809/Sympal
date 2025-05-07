"use client";

import React from "react";

const ConfirmationModal = ({ imageUrl, onConfirm, onReject, onCancel, loading }) => {
    return (
        <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Är du nöjd med symbolen?
            </h2>

            {onCancel && (
                <button
                    onClick={onCancel}
                    className="absolute top-4 left-4 text-sm text-gray-500 hover:text-gray-800"
                >
                    ← Tillbaka
                </button>
            )}

            {imageUrl ? (
                <img
                    src={imageUrl}
                    alt="Förhandsvisning"
                    className="max-h-80 object-contain rounded-xl shadow-md mb-6"
                />
            ) : (
                <div className="flex flex-col items-center justify-center mb-6">
                    <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    <p className="mt-2 text-gray-600">Genererar symbol...</p>
                </div>
            )}

            {imageUrl && !loading &&(
            <div className="flex gap-6">
                <button
                    onClick={onConfirm}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl text-lg font-semibold"
                >
                    Ja, spara symbolen
                </button>

                <button
                    onClick={onReject}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-xl text-lg font-semibold"
                >
                    Nej, generera ny
                </button>
            </div>
                )}
        </div>
    );
};

export default ConfirmationModal;
