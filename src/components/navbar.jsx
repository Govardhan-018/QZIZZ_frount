import React from "react";

/**
 * Brand-colored, always-visible navbar pinned to the very top-left.
 *  – fixed:   removes it from normal flow and keeps it on-screen
 *  – inset-0: stretches full width
 *  – bg-white/ shadow: visual separation from page
 *  – z-50: guarantees it stays above the rest of the UI
 */
function Navbar() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center">
        <h1 className="text-2xl font-bold text-black">QZIZZ.learn</h1>
      </div>
    </nav>
  );
}

export default Navbar;
