import React from "react";
import Profilebar from "./profilebar";

/**
 * Modern, responsive navbar.
 * - On mobile: only shows round initial (from email in localStorage)
 * - On desktop: shows brand name
 * - Always pinned to top
 */
function Navbar() {
  // Get user email from localStorage for initial
  const mail = localStorage.getItem("mail") || "";
  const initial = mail ? mail[0].toUpperCase() : "Q";

  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-white">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo/Brand */}
        <div className="flex items-center">
          {/* Mobile: only round initial */}
          <div className="md:hidden w-10 h-10 rounded-full flex items-center justify-center text-black font-bold text-xl border-2">
            {initial}
          </div>
          {/* Desktop: brand name */}
          <h1 className="hidden md:block text-2xl font-bold text-black">QZIZZ.learn</h1>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
