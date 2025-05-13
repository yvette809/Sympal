import { Geist, Geist_Mono } from "next/font/google";
import Navigation from "@/app/components/Navigation";
import Footer from  "@/app/components/Footer"
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Symbol Generator",
  description: "This is an App to generate Symbols for  verbally challenged persons",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <Navigation/>
        {children}
      <Footer/>
      </body>
    </html>
  );
}
