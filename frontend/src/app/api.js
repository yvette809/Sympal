
const API_URL = 'http://localhost:8080/api';

const fetchCategories = async () => {
    try {
        const response = await fetch(`${API_URL}/categories`);
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(error.message || 'Something went wrong');
    }
};

const generateSymbol = async (token, prompt) => {
    try {
        const response = await fetch(`${API_URL}/symbols/generate?prompt=${encodeURIComponent(prompt)}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) throw new Error('Failed to generate symbol');
        const url = await response.text();
        return url;
    } catch (error) {
        throw new Error(error.message || 'Failed to generate symbol');
    }
};

const saveSymbol = async (token, symbol) => {
    try {
        const response = await fetch(`${API_URL}/symbols/saveSymbol`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(symbol),
        });

        if (!response.ok) throw new Error('Failed to save symbol');
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(error.message || 'Failed to save symbol');
    }
};

const fetchSymbolsByCategory = async (categoryId) => {
    const res = await fetch(`${API_URL}/categories/${categoryId}/symbols`);
    if (!res.ok) {
        throw new Error("Failed to fetch symbols ");
    }
    return res.json();
};

// speech api
const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
};

export { fetchCategories, generateSymbol, saveSymbol ,fetchSymbolsByCategory,speak};

