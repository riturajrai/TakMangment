// app/layout.jsx
"use client";

import { Inter } from "next/font/google";
import Navbar from "./componenet/Navbar";
import Footer from "./componenet/Footer";
import "./globals.css";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"], weight: ["400", "600", "700"] });

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Jin routes pe navbar/footer nahi chahiye
  const hideLayoutRoutes = ["/login", "/register", "/reset-password"];
  const shouldHideLayout = hideLayoutRoutes.includes(pathname);

  // Jin routes pe sirf footer nahi chahiye
  const hideFooterRoutes = ["/profile/name" , '/profile/email' , '/profile/other', '/projects'];
  const shouldHideFooter = hideFooterRoutes.includes(pathname);

  return (
    <html lang="en">
      <body className={inter.className}>
        {!shouldHideLayout && <Navbar />}
        {children}
        {!shouldHideLayout && !shouldHideFooter && <Footer />}
      </body>
    </html>
  );
}
