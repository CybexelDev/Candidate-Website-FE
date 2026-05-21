import React from "react";

import {
  LayoutDashboard,
  Send,
  Users,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  adminLogoutApi
} from "../../../Api/adminApi";

import { toast }
from "sonner";

const CYBEXEL_THEME = {
  sidebar: "bg-[#111936]",
};

const Sidebar = ({
  activeTab,
  setActiveTab,
  isSidebarOpen,
}) => {

    const navigate=useNavigate()
    const handleLogout =
async () => {

  try {

    await adminLogoutApi();

    localStorage.removeItem(
      "adminToken"
    );

    toast.success(
      "Logged out"
    );

    navigate("/admin/login");

  } catch (error) {

    console.log(error);

    toast.error(
      "Logout failed"
    );
  }
};
  const navItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={18} />,
      path: "/admin/dashboard",
    },
    {
      name: "Upload Links",
      icon: <Send size={18} />,
      path:"/admin/upload-link"
    },
    {
      name: "Candidates",
      icon: <Users size={18} />,
      path:"/admin/candidate"
    },
  ];

  return (
    <aside
      className={`
        fixed z-50
        ${CYBEXEL_THEME.sidebar}

        /* MOBILE + TABLET */
        bottom-4 left-1/2 -translate-x-1/2
        w-[95%] md:w-[90%]
        h-20 rounded-3xl
        border border-white/10
        shadow-2xl

        /* DESKTOP */
        lg:static lg:inset-y-0 lg:left-0
        lg:translate-x-0 lg:bottom-auto
        lg:w-60 lg:h-screen
        lg:rounded-none
        lg:border-r lg:border-white/5
        lg:shadow-none

        transition-all duration-300 ease-in-out

        ${
          isSidebarOpen
            ? "translate-y-0"
            : "translate-y-full lg:translate-y-0"
        }
      `}
    >

      <div className="h-full flex flex-col lg:p-6">

        {/* LOGO */}
        <div className="hidden lg:flex items-center justify-center gap-3 px-2 mb-8">

          <img
            src="/logo.png"
            alt="CYBEXEL Logo"
            className="w-[140px] object-contain"
          />

        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 flex lg:block items-center justify-around lg:justify-start lg:space-y-2 px-2 lg:px-0">

          {navItems.map((item) => (

            <button
              key={item.name}
              onClick={() =>{
                setActiveTab(item.name)
                navigate(item.path)
              }
              }

              className={`flex flex-col lg:flex-row items-center justify-center gap-1 lg:gap-3 px-4 py-2 lg:px-4 lg:py-3.5 rounded-2xl transition-all duration-200 group ${
                activeTab === item.name
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                  : "text-white/50 hover:bg-white/5 hover:text-white"
              }`}
            >

              <span
                className={`${
                  activeTab === item.name
                    ? "text-white"
                    : "text-white/30 group-hover:text-white"
                }`}
              >
                {item.icon}
              </span>

              <span className="text-[11px] lg:text-sm font-medium text-center leading-tight">
                {item.name}
              </span>

            </button>

          ))}

        </nav>

        {/* PROFILE */}
        <div className="hidden lg:block mt-auto pt-6 border-t border-white/5">

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 mb-4">

            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-xs text-white">
              AD
            </div>

            <div className="flex-1 overflow-hidden">

              <p className="text-sm font-semibold truncate text-white">
                Admin
              </p>

              <p className="text-[10px] text-white/40 truncate">
                admin@cybexel.com
              </p>

            </div>

          </div>

          <button className="w-full flex items-center justify-center gap-2 py-3 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all text-sm font-medium"  onClick={handleLogout}
>

            <LogOut size={16} />

            Logout

          </button>

        </div>

      </div>

    </aside>
  );
};

export default Sidebar;