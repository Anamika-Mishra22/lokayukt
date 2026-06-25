// components/Sidebar.js
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaFileAlt,
  FaChartBar,
  FaSearch,
  FaUsers,
  FaDatabase,
  FaTimes
} from "react-icons/fa";
import { IoFileTray } from "react-icons/io5";
import { FaFileSignature } from "react-icons/fa6";
import { RiFileSearchLine } from "react-icons/ri";
import { RiQrScanFill } from "react-icons/ri";


const Sidebar = ({ isMobileMenuOpen, toggleMobileMenu, isCollapsed }) => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < 768);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const isActive = (href) => {
    const fullPath = `/employee${href}`;
    if (href === "/dashboard") return location.pathname === fullPath;
    return location.pathname.startsWith(fullPath);
  };

  const isFilesActive = () => {
    return (
      location.pathname.startsWith("/employee/view-files") ||
      location.pathname.startsWith("/employee/add-files")
    );
  };

  const handleLinkClick = () => {
    if (isMobile && isMobileMenuOpen) toggleMobileMenu();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Mobile Overlay */}
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
        <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-2">

          {/* Dashboard */}
          {/* <Link
            to="/employee/dashboard"
            onClick={handleLinkClick}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition
              ${isActive("/dashboard")
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-200"
              }
              ${isCollapsed && !isMobile ? "justify-center" : ""}
            `}
          >
            <FaHome />
            {(!isCollapsed || isMobile) && "Dashboard"}
          </Link> */}

          {/* Complaints */}
          {/* <Link
            to="/admin/complaints"
            onClick={handleLinkClick}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition
              ${isActive("/complaints")
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-200"
              }
              ${isCollapsed && !isMobile ? "justify-center" : ""}
            `}
          >
            <FaFileAlt />
            {(!isCollapsed || isMobile) && "Complaints"}
          </Link> */}

          {/* Progress Register */}
          {/* <Link
            to="/admin/progress-register"
            onClick={handleLinkClick}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition
              ${isActive("/progress-register")
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-200"
              }
              ${isCollapsed && !isMobile ? "justify-center" : ""}
            `}
          >
            <FaChartBar />
            {(!isCollapsed || isMobile) && "Progress Register"}
          </Link> */}

          {/* Search & Reports */}
          {/* <Link
            to="/admin/search-reports"
            onClick={handleLinkClick}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition
              ${isActive("/search-reports")
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-200"
              }
              ${isCollapsed && !isMobile ? "justify-center" : ""}
            `}
          >
            <FaSearch />
            {(!isCollapsed || isMobile) && "Search & Reports"}
          </Link> */}

          {/* User Management */}
          {/* <Link
            to="/employee/user-management"
            onClick={handleLinkClick}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition
              ${isActive("/user-management")
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-200"
              }
              ${isCollapsed && !isMobile ? "justify-center" : ""}
            `}
          >
            <FaUsers />
            {(!isCollapsed || isMobile) && "User Management"}
          </Link> */}

           <Link
            to="/employee/view-files"
            onClick={handleLinkClick}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition
             ${isFilesActive()
              ? "bg-blue-600 text-white shadow-md"
              : "text-gray-700 hover:bg-gray-200"
            }
              ${isCollapsed && !isMobile ? "justify-center" : ""}
            `}
          >
            <RiFileSearchLine />
            {(!isCollapsed || isMobile) && "Leave Files"}
          </Link>

           <Link
            to="/employee/view-pending-files"
            onClick={handleLinkClick}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition
             ${isActive("/view-pending-files") // <--- Yahan fix kiya hai
              ? "bg-blue-600 text-white shadow-md"
              : "text-gray-700 hover:bg-gray-200"
            }
              ${isCollapsed && !isMobile ? "justify-center" : ""}
            `}
          >
            <RiFileSearchLine />
            {(!isCollapsed || isMobile) && "Pending Personal Files"}
          </Link>

          
           <Link
            to="/employee/scan-letter"
            onClick={handleLinkClick}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition
             ${isActive("/scan-letter") // <--- Yahan fix kiya hai
              ? "bg-blue-600 text-white shadow-md"
              : "text-gray-700 hover:bg-gray-200"
            }
              ${isCollapsed && !isMobile ? "justify-center" : ""}
            `}
          >
            <RiQrScanFill />
            {(!isCollapsed || isMobile) && "Personal Files Scan "}
          </Link>
          
          {/* <Link
            to="/employee/add-files"
            onClick={handleLinkClick}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition
              ${isActive("/add-files")
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-200"
              }
              ${isCollapsed && !isMobile ? "justify-center" : ""}
            `}
          >
            <FaFileSignature />
            {(!isCollapsed || isMobile) && "Add Files"}
          </Link> */}

          {/* Master Data */}
          {/* <Link
            to="/admin/master-data"
            onClick={handleLinkClick}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition
              ${isActive("/master-data")
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-200"
              }
              ${isCollapsed && !isMobile ? "justify-center" : ""}
            `}
          >
            <FaDatabase />
            {(!isCollapsed || isMobile) && "Master Data"}
          </Link> */}

           {/* File Administrator */}
          {/* <Link
            to="/admin/file-administrator"
            onClick={handleLinkClick}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition
              ${isActive("/file-administrator")
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-200"
              }
              ${isCollapsed && !isMobile ? "justify-center" : ""}
            `}
          >
            <IoFileTray />
            {(!isCollapsed || isMobile) && "File Administrator"}
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