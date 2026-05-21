import React from "react";

import {
  Search,
  Bell,
  Menu,
} from "lucide-react";
import {
  LogOut,
  ChevronDown
} from "lucide-react";

import {
  useNavigate
} from "react-router-dom";

import { toast }
from "sonner";

import {
  useState
} from "react";
const CYBEXEL_THEME = {
  bg: "bg-[#0B1240]",
  input: "bg-[#2A3260]",
};

const Navbar = ({
  activeTab,
  isSidebarOpen,
  setSidebarOpen,
}) => {
const [isProfileOpen,
setIsProfileOpen] =
useState(false);

const navigate =
useNavigate();
const handleLogout = () => {

  localStorage.removeItem(
    "adminToken"
  );

  toast.success(
    "Logged out successfully"
  );

  navigate("/admin/login");
};
  return (
    <header
      className={`sticky top-0 z-40 ${CYBEXEL_THEME.bg}/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between`}
    >

      {/* LEFT */}
      <div className="flex items-center gap-4">

        <button
          onClick={() =>
            setSidebarOpen(!isSidebarOpen)
          }

          className="lg:hidden text-white/60 hover:text-white"
        >

          <Menu size={24} />

        </button>

        <h2 className="text-lg font-semibold hidden md:block">
          {activeTab}
        </h2>

      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-6">

        {/* SEARCH */}
      

        {/* NOTIFICATION */}
        <button className="relative p-2 text-white/40 hover:text-white transition-colors">

          <Bell size={20} />

          <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#0B1240]" />

        </button>

        {/* PROFILE */}
        <div className="relative">

  {/* PROFILE BUTTON */}
  <button

    onClick={() =>
      setIsProfileOpen(
        !isProfileOpen
      )
    }

    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/5 transition-all"
  >

    <div className="w-8 h-8 rounded-full border border-white/10 overflow-hidden">

      <img
        src="https://ui-avatars.com/api/?name=Admin&background=2563EB&color=fff"
        alt="Profile"
      />

    </div>

    <ChevronDown
      size={16}
      className={`text-white/40 transition-transform ${
        isProfileOpen
          ? "rotate-180"
          : ""
      }`}
    />

  </button>

  {/* DROPDOWN */}
  {

    isProfileOpen && (

      <div className="absolute right-0 top-14 w-52 bg-[#1C2452] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">

        <div className="p-4 border-b border-white/5">

          <p className="text-sm font-semibold">

            Admin

          </p>

          <p className="text-xs text-white/40">

            admin@cybexel.com

          </p>

        </div>

        <button

          onClick={handleLogout}

          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-all"
        >

          <LogOut size={16} />

          Logout

        </button>

      </div>
    )
  }

</div>

      </div>

    </header>
  );
};

export default Navbar;