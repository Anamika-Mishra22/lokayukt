// components/Sidebar.js
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import {
  FaHome,
  FaFileAlt,
  FaChartBar,
  FaSearch,
  FaUsers,
  FaDatabase,
  FaTimes,
  FaChevronDown, 
  FaChevronRight 
} from "react-icons/fa";
import { IoFileTray } from "react-icons/io5";
import { FaUserGroup, FaUserTie, FaClipboardUser } from "react-icons/fa6";
import { MdContactPage } from "react-icons/md";

const Sidebar = ({ isMobileMenuOpen, toggleMobileMenu, isCollapsed }) => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  // --- 1. STRICT ACTIVE CHECKERS ---
  const isActive = (path) => {
    // Exact match ya phir uske aage ka sub-route (e.g., /path/add)
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const isPersonalFileActive = () => {
    return (
      location.pathname === "/administrative/all-personal-file" ||
      location.pathname.startsWith("/administrative/all-personal-file/") ||
      location.pathname === "/administrative/add-personal-file" ||
      location.pathname.startsWith("/administrative/add-personal-file/")
    );
  };

  const isEmployeeDropdownActive = () => {
    return (
      isActive("/administrative/employment-management") ||
      isPersonalFileActive() ||
      isActive("/administrative/all-leaves-files") ||
      isActive("/administrative/file-administrator")
    );
  };

  // --- 2. STATE FOR DROPDOWN ---
  // Default state check karegi ki kya user already dropdown ke kisi page par hai
  const [isEmployeeMenuOpen, setIsEmployeeMenuOpen] = useState(isEmployeeDropdownActive());

  // Jab bhi URL change ho, agar dropdown ka koi page active hai toh dropdown khula rakho
  useEffect(() => {
    if (isEmployeeDropdownActive()) {
      setIsEmployeeMenuOpen(true);
    }
  }, [location.pathname]);

  // Responsive Check
  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < 768);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleLinkClick = () => {
    if (isMobile && isMobileMenuOpen) toggleMobileMenu();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={toggleMobileMenu}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed left-0 top-16 bottom-0 bg-[#E7ECF5] border-r shadow-xl transition-all duration-300 z-50 flex flex-col
          ${isMobile
            ? `w-64 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`
            : isCollapsed
              ? "w-16"
              : "w-64"
          }`}
      >
        {/* Mobile Close */}
        {isMobile && (
          <button
            onClick={toggleMobileMenu}
            className="absolute top-4 right-4 p-2 rounded-md hover:bg-gray-200"
          >
            <FaTimes />
          </button>
        )}

        {/* NAV */}
        <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-2 custom-scrollbar">

          {/* User Management */}
          <Link
            to="/administrative/user-management"
            onClick={handleLinkClick}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition
              ${isActive("/administrative/user-management")
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-200"
              }
              ${isCollapsed && !isMobile ? "justify-center" : ""}
            `}
          >
            <FaUsers className="w-[18px] h-[18px] flex-shrink-0" />
            {(!isCollapsed || isMobile) && "User Management"}
          </Link>
          
          {/* --- EMPLOYEE MANAGEMENT DROPDOWN START --- */}
          <div>
            <button
              onClick={() => setIsEmployeeMenuOpen(!isEmployeeMenuOpen)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition
                ${isEmployeeDropdownActive() 
                  ? "bg-blue-100 text-blue-800" // Parent highlighted rahega agar child active hai
                  : "text-gray-700 hover:bg-gray-200"
                }
                ${isCollapsed && !isMobile ? "justify-center" : ""}
              `}
            >
              <div className="flex items-center gap-3">
                <FaUserGroup className="w-[18px] h-[18px] flex-shrink-0" />
                {(!isCollapsed || isMobile) && "Employee Management"}
              </div>
              {(!isCollapsed || isMobile) && (
                isEmployeeMenuOpen ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />
              )}
            </button>

            {/* Dropdown Items */}
            {isEmployeeMenuOpen && (!isCollapsed || isMobile) && (
              <div className="mt-1 ml-4 space-y-1 border-l-2 border-gray-300 pl-2">
                
                {/* All Employees */}
                <Link
                  to="/administrative/employment-management"
                  onClick={handleLinkClick}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition
                    ${isActive("/administrative/employment-management")
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }
                  `}
                >
                  <span className="text-xs">
                    <FaUserTie/>
                  </span> 
                  All Employees
                </Link>

                {/* All Personal Files */}
                <Link
                  to="/administrative/all-personal-file"
                  onClick={handleLinkClick}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition
                   ${isPersonalFileActive()
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }
                  `}
                >
                  <span className="text-xs">
                    <FaClipboardUser/>
                  </span> 
                  All Personal File
                </Link>

                {/* All Leaves */}
                 <Link
                  to="/administrative/all-leaves-files"
                  onClick={handleLinkClick}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition
                    ${isActive("/administrative/all-leaves-files")
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }
                  `}
                >
                  <span className="text-xs">
                    <MdContactPage/>
                  </span> 
                  All Leaves
                </Link>

                {/* Managed File */}
                <Link
                  to="/administrative/file-administrator"
                  onClick={handleLinkClick}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition
                    ${isActive("/administrative/file-administrator")
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }
                  `}
                >
                  <IoFileTray className="text-xs" />
                  Managed File Type
                </Link>
              </div>
            )}
          </div>
          {/* --- EMPLOYEE MANAGEMENT DROPDOWN END --- */}

          {/* Master Data */}
          {/* <Link
            to="/administrative/master-data"
            onClick={handleLinkClick}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition
              ${isActive("/administrative/master-data")
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-200"
              }
              ${isCollapsed && !isMobile ? "justify-center" : ""}
            `}
          >
            <FaDatabase className="w-[18px] h-[18px] flex-shrink-0" />
            {(!isCollapsed || isMobile) && "Master Data"}
          </Link> */}

        </nav>

        {/* 👇 MAIN DASHBOARD BUTTON (Sabse Niche Chipkaya Hua) 👇 */}
        <div className="p-4 border-t border-gray-300 w-full bg-[#E7ECF5] mt-auto shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <Link
            to="/main-dashboard"
            onClick={handleLinkClick}
            className={`flex items-center gap-3 text-sm font-medium transition-all duration-200 rounded-lg ${
              location.pathname === "/main-dashboard"
                ? "bg-green-600 text-white shadow-md"
                : "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
            } ${isCollapsed && !isMobile ? "justify-center px-2 py-2" : "px-4 py-3"}`}
            title={isCollapsed && !isMobile ? "Main Dashboard" : ""}
          >
            <FaHome className="w-[18px] h-[18px] flex-shrink-0" />
            {(!isCollapsed || isMobile) && <span>Main Dashboard</span>}
          </Link>
        </div>

      </aside>
    </>
  );
};

export default Sidebar;