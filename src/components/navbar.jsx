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
          <div className="md:hidden w-10 h-10 rounded-full bg-[#00ADB5] flex items-center justify-center text-white font-bold text-xl border-2 border-[#393E46]">
            {initial}
          </div>
          {/* Desktop: brand name */}
          <h1 className="hidden md:block text-2xl font-bold text-[#00ADB5]">QZIZZ.learn</h1>
        </div>
        {/* Profile bar on right */}
        <Profilebar />
      </div>
    </nav>
  );
}

export default Navbar;
