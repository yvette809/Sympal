const Footer = () => {
    return (
        <footer className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-6 text-center">
            <div className="max-w-6xl mx-auto">
                <p className="text-sm">
                    <a href="/about" className="mx-4 hover:underline transition duration-300">About</a>
                    <span>|</span>
                    <a href="/privacy" className="mx-4 hover:underline transition duration-300">Privacy</a>
                    <span>|</span>
                    <a href="/terms" className="mx-4 hover:underline transition duration-300">Terms</a>
                </p>
                <p className="mt-4 text-sm opacity-75">© 2025 SymPal. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;
