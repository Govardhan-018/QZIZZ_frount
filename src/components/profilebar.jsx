import React from "react";
import { useNavigate } from "react-router-dom";

function Profilebar() {
  const navigate = useNavigate();
  const mail = localStorage.getItem("mail") || "";
  const userInitial = mail ? mail[0].toUpperCase() : "U";
  const displayName = mail || "User";

  return (
    <div className="absolute top-3 right-6 flex items-center gap-2 z-70">
      <button
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#00ADB5] text-[#EEEEEE] font-semibold shadow hover:bg-[#393E46] transition cursor-pointer"
        onClick={() => navigate("/profile")}
      >
        <div className="w-8 h-8 rounded-full bg-[#393E46] flex items-center justify-center text-[#EEEEEE] font-bold border-2 border-[#00ADB5]">
          {userInitial}
        </div>
        {/* Hide name on mobile, show on md+ */}
        <span className="hidden md:inline">{displayName}</span>
      </button>
    </div>
  );
}

export default Profilebar;
