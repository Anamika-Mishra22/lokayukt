// components/Sidebar.js
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";
import { FiInbox, FiSend, FiFileText, FiBarChart2, FiSearch, FiClipboard } from "react-icons/fi";
import { IoIosDocument } from "react-icons/io";
import { TiDocumentText } from "react-icons/ti";
import { TbReportSearch } from "react-icons/tb";
import { LuPcCase } from "react-icons/lu";
import { FaFileShield } from "react-icons/fa6";
import { FaFileSignature } from "react-icons/fa";
import axios from "axios";
import Cookies from "js-cookie";

import {
  FaHome,
  FaFileAlt,
  FaChartBar,
  FaSearch,
  FaBell,
  FaTimes,
  FaSave,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";
const token = Cookies.get("access_token");

// Create axios instance with token if it exists
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

const Sidebar = ({
  isMobileMenuOpen,
  toggleMobileMenu,
  isCollapsed,
  toggleSidebar,
}) => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  // States for Sidebar Dropdown and Badge Counts
  const [isReqDropdownOpen, setIsReqDropdownOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [newBadgeCount, setNewBadgeCount] = useState(0);

  const subrole = Cookies.get("subrole") || "Operator";

  // 👇 Yahan Teeno (3) APIs har 10 sec par call hongi 👇
  const fetchBadgeCounts = async () => {
    try {
      // 1. Fetch Pending Count
      const pendingRes = await api.get("/operator/request-complaints-pending");
      const pCount = pendingRes.data?.count ?? pendingRes.data?.data ?? pendingRes.data ?? 0;
      setPendingCount(Number(pCount));

      // 2. Fetch New Badge Count
      const badgeRes = await api.get("/operator/request-complaints-badge");
      const bCount = badgeRes.data?.count ?? badgeRes.data?.data ?? badgeRes.data ?? 0;
      setNewBadgeCount(Number(bCount));

      // 3. Reset Badge API (10 sec baad ye bhi call ho jayegi jaisa aapne bola)
      await api.get("/operator/request-complaints-badges-reset");
      
    } catch (error) {
      console.error("Error fetching or resetting badge counts:", error);
    }
  };

  useEffect(() => {
    fetchBadgeCounts();

    const intervalId = setInterval(() => {
      fetchBadgeCounts();
    }, 1800000); 

    return () => clearInterval(intervalId); 
  }, []);

  const handleNewClick = async () => {
  handleLinkClick(); 

  try {
    // 🔥 1. Pending API call
    const pendingRes = await api.get("/operator/request-complaints-pending");
    const pCount = pendingRes.data?.count ?? pendingRes.data ?? 0;
    setPendingCount(Number(pCount));

    // 🔥 2. Reset badge
    await api.get("/operator/request-complaints-badges-reset");
    setNewBadgeCount(0); 

  } catch (error) {
    console.error("Error:", error);
  }
};
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  const isActive = (href) => {
    const fullPath = `/operator${href}`;

    if (href === "/dashboard") {
      return location.pathname === fullPath;
    }
    return location.pathname.startsWith(fullPath);
  };

  const handleLinkClick = () => {
    if (isMobile && isMobileMenuOpen) {
      toggleMobileMenu();
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollbarStyles = `
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background-color: #cbd5e1;
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background-color: #94a3b8;
    }
    .custom-scrollbar {
      scrollbar-width: thin;
      scrollbar-color: #cbd5e1 transparent;
    }
  `;

  return (
    <>
      <style>{scrollbarStyles}</style>

      {/* Mobile Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar - Now starts below header */}
      <div
        className={`fixed left-0 bg-[#E7ECF5] text-gray-700 shadow-xl transition-all duration-300 flex flex-col ${
          isMobile
            ? `w-64 z-50 top-0 bottom-0 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`
            : `${isCollapsed ? "w-16" : "w-64"} z-30 top-16 bottom-0`
        }`}
      >
        {/* Mobile Close Button */}
        {isMobile && isMobileMenuOpen && (
          <button
            onClick={toggleMobileMenu}
            className="absolute top-4 right-4 p-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors z-50"
            aria-label="Close menu"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        )}

        {/* Header Section */}
        <div className={`px-6 py-6 flex-shrink-0 ${!isMobile && isCollapsed ? "px-3" : ""}`}>
          {/* Logo & Subrole */}
        </div>

        {/* Navigation Menu with Sections */}
        <nav className="flex-1 px-6 overflow-y-auto custom-scrollbar">
          {/* Workbox Section */}
          {(isMobile || !isCollapsed) && (
            <p className="text-[13px] text-gray-800 mb-2 ml-2">Workbox</p>
          )}

          <ul className="space-y-2 mb-6">
            {/* Dashboard */}
            <li>
              <Link
                to="/operator/dashboard"
                onClick={handleLinkClick}
                className={`flex items-center justify-between text-sm transition-all duration-200 rounded-lg ${
                  isActive("/dashboard")
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-200"
                } ${!isMobile && isCollapsed ? "justify-center px-2 py-2" : "px-3 py-2"}`}
                title={!isMobile && isCollapsed ? "Dashboard" : ""}
              >
                <div className="flex items-center gap-3">
                  <AiOutlineHome className="w-[18px] h-[18px] flex-shrink-0" />
                  {(isMobile || !isCollapsed) && <span>Dashboard</span>}
                </div>
                {isActive("/dashboard") && isMobile && (
                  <div className="w-10 h-5 bg-blue-400 rounded-full flex items-center justify-end pr-[2px]">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                )}
              </Link>
            </li>

            {/* New Complaints */}
            <li>
              <Link
                to="/operator/complaints"
                onClick={handleLinkClick}
                className={`flex items-center justify-between text-sm transition-all duration-200 rounded-lg ${
                  isActive("/complaints")
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-200"
                } ${!isMobile && isCollapsed ? "justify-center px-2 py-2" : "px-3 py-2"}`}
                title={!isMobile && isCollapsed ? "New Complaints" : ""}
              >
                <div className="flex items-center gap-3">
                  <FiFileText size={20} className="w-[18px] h-[18px] flex-shrink-0" />
                  {(isMobile || !isCollapsed) && <span>New Complaints</span>}
                </div>
                {isActive("/complaints") && isMobile && (
                  <div className="w-10 h-5 bg-blue-400 rounded-full flex items-center justify-end pr-[2px]">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                )}
              </Link>
            </li>

            {/* Inbox */}
            <li>
              <Link
                to="/operator/all-complaints"
                onClick={handleLinkClick}
                className={`flex items-center justify-between text-sm transition-all duration-200 rounded-lg ${
                  isActive("/all-complaints")
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-200"
                } ${!isMobile && isCollapsed ? "justify-center px-2 py-2" : "px-3 py-2"}`}
                title={!isMobile && isCollapsed ? "Inbox" : ""}
              >
                <div className="flex items-center gap-3">
                  <FiInbox size={18} className="w-[18px] h-[18px] flex-shrink-0" />
                  {(isMobile || !isCollapsed) && <span>Inbox</span>}
                </div>
                {isActive("/all-complaints") && isMobile && (
                  <div className="w-10 h-5 bg-blue-400 rounded-full flex items-center justify-end pr-[2px]">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                )}
              </Link>
            </li>

            {/* Sent */}
            <li>
              <Link
                to="/operator/approved-complaints"
                onClick={handleLinkClick}
                className={`flex items-center justify-between text-sm transition-all duration-200 rounded-lg ${
                  isActive("/approved-complaints")
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-200"
                } ${!isMobile && isCollapsed ? "justify-center px-2 py-2" : "px-3 py-2"}`}
                title={!isMobile && isCollapsed ? "Sent" : ""}
              >
                <div className="flex items-center gap-3">
                  <FiSend size={18} className="w-[18px] h-[18px] flex-shrink-0" />
                  {(isMobile || !isCollapsed) && <span>Sent</span>}
                </div>
                {isActive("/approved-complaints") && isMobile && (
                  <div className="w-10 h-5 bg-blue-400 rounded-full flex items-center justify-end pr-[2px]">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                )}
              </Link>
            </li>

            {/* Drafts */}
            <li>
              <Link
                to="/operator/draft"
                onClick={handleLinkClick}
                className={`flex items-center justify-between text-sm transition-all duration-200 rounded-lg ${
                  isActive("/draft")
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-200"
                } ${!isMobile && isCollapsed ? "justify-center px-2 py-2" : "px-3 py-2"}`}
                title={!isMobile && isCollapsed ? "Drafts" : ""}
              >
                <div className="flex items-center gap-3">
                  <FiFileText size={18} className="w-[18px] h-[18px] flex-shrink-0" />
                  {(isMobile || !isCollapsed) && <span>Drafts</span>}
                </div>
                {isActive("/draft") && isMobile && (
                  <div className="w-10 h-5 bg-blue-400 rounded-full flex items-center justify-end pr-[2px]">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                )}
              </Link>
            </li>

            {/* RC Log */}
            <li>
              <Link
                to="/operator/rc-log"
                onClick={handleLinkClick}
                className={`flex items-center justify-between text-sm transition-all duration-200 rounded-lg ${
                  isActive("/rc-log")
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-200"
                } ${!isMobile && isCollapsed ? "justify-center px-2 py-2" : "px-3 py-2"}`}
                title={!isMobile && isCollapsed ? "rc-log" : ""}
              >
                <div className="flex items-center gap-3">
                  <TiDocumentText size={18} className="w-[18px] h-[18px] flex-shrink-0" />
                  {(isMobile || !isCollapsed) && <span>RC Log</span>}
                </div>
                {isActive("/rc-log") && isMobile && (
                  <div className="w-10 h-5 bg-blue-400 rounded-full flex items-center justify-end pr-[2px]">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                )}
              </Link>
            </li>

            {/* Reporting */}
            <li>
              <Link
                to="/operator/reporting"
                onClick={handleLinkClick}
                className={`flex items-center justify-between text-sm transition-all duration-200 rounded-lg ${
                  isActive("/reporting")
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-200"
                } ${!isMobile && isCollapsed ? "justify-center px-2 py-2" : "px-3 py-2"}`}
                title={!isMobile && isCollapsed ? "reporting" : ""}
              >
                <div className="flex items-center gap-3">
                  <TbReportSearch size={18} className="w-[18px] h-[18px] flex-shrink-0" />
                  {(isMobile || !isCollapsed) && <span>Reporting</span>}
                </div>
                {isActive("/reporting") && isMobile && (
                  <div className="w-10 h-5 bg-blue-400 rounded-full flex items-center justify-end pr-[2px]">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                )}
              </Link>
            </li>

            {/* Hearing Cases */}
            <li>
              <Link
                to="/operator/hearing-case"
                onClick={handleLinkClick}
                className={`flex items-center justify-between text-sm transition-all duration-200 rounded-lg ${
                  isActive("/hearing-case")
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-200"
                } ${!isMobile && isCollapsed ? "justify-center px-2 py-2" : "px-3 py-2"}`}
                title={!isMobile && isCollapsed ? "hearing-case" : ""}
              >
                <div className="flex items-center gap-3">
                  <LuPcCase size={18} className="w-[18px] h-[18px] flex-shrink-0" />
                  {(isMobile || !isCollapsed) && <span>Cause List</span>}
                </div>
                {isActive("/hearing-case") && isMobile && (
                  <div className="w-10 h-5 bg-blue-400 rounded-full flex items-center justify-end pr-[2px]">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                )}
              </Link>
            </li>

            {/* Personal File */}
            <li>
              <Link
                to="/operator/all-personal-file"
                onClick={handleLinkClick}
                className={`flex items-center justify-between text-sm transition-all duration-200 rounded-lg ${
                  location.pathname.includes("personal-file")
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-200"
                } ${!isMobile && isCollapsed ? "justify-center px-2 py-2" : "px-3 py-2"}`}
                title={!isMobile && isCollapsed ? "all-personal-file" : ""}
              >
                <div className="flex items-center gap-3">
                  <FaFileShield size={18} className="w-[18px] h-[18px] flex-shrink-0" />
                  {(isMobile || !isCollapsed) && <span>Personal Files</span>}
                </div>
                {isActive("/all-personal-file") && isMobile && (
                  <div className="w-10 h-5 bg-blue-400 rounded-full flex items-center justify-end pr-[2px]">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                )}
              </Link>
            </li>


             <li>
              <Link
                to="/operator/all-rti-file"
                onClick={handleLinkClick}
                className={`flex items-center justify-between text-sm transition-all duration-200 rounded-lg ${
                  location.pathname.includes("all-rti-file")
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-200"
                } ${!isMobile && isCollapsed ? "justify-center px-2 py-2" : "px-3 py-2"}`}
                title={!isMobile && isCollapsed ? "all-rti-file" : ""}
              >
                <div className="flex items-center gap-3">
                  <FaFileSignature size={18} className="w-[18px] h-[18px] flex-shrink-0" />
                   {(isMobile || !isCollapsed) && <span>Appeal And RTI Files</span>}
                </div>
                {isActive("/all-rti-file") && isMobile && (
                  <div className="w-10 h-5 bg-blue-400 rounded-full flex items-center justify-end pr-[2px]">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                )}
              </Link>
            </li>

            {/* Request Complaint File - Dropdown Ke Sath */}
            <li className="flex flex-col gap-1">
              <div
                onClick={() => setIsReqDropdownOpen(!isReqDropdownOpen)}
                className={`flex items-center justify-between text-sm transition-all duration-200 rounded-lg cursor-pointer select-none ${
                  location.pathname.includes("/operator/request-complaints")
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-200"
                } ${!isMobile && isCollapsed ? "justify-center px-2 py-2" : "px-3 py-2"}`}
                title={!isMobile && isCollapsed ? "Request Complaint" : ""}
              >
                {/* Main Link */}
                <Link
                  to="/operator/request-complaints"
                  onClick={(e) => {
                    handleLinkClick();
                  }}
                  className="flex items-center gap-3 flex-1"
                >
                  <FiClipboard size={18} className="w-[18px] h-[18px] flex-shrink-0" />
                  
                 {(isMobile || !isCollapsed) && (
  <span
    className={`flex items-center gap-2 transition-all duration-200 ${
      newBadgeCount > 0
        ? "animate-pulse text-green-500 font-bold hover:text-white"
        : "text-black hover:text-white"
    }`}
  >
    Complaint Requests
  </span>
)}
                </Link>

                {/* Dropdown Arrow Indicator */}
                {(isMobile || !isCollapsed) && (
                  <div className="ml-2 text-gray-400">
                    {isReqDropdownOpen ? "▲" : "▼"}
                  </div>
                )}
              </div>

              {/* Dropdown Menu - Ek hi row mein 2 hisse (Pending & New) */}
              {isReqDropdownOpen && (isMobile || !isCollapsed) && (
                <div className="flex w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden animate-slideDown">
                  
                  {/* Pending (Left Side - 50%) */}
                  <Link
                    to="/operator/request-complaints"
                    onClick={handleLinkClick}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-center text-xs font-semibold text-yellow-600 hover:bg-yellow-50 border-r border-gray-200 transition-colors relative"
                  >
                    Pending
                
                      <span className="bg-yellow-100 text-yellow-800  py-0.5 rounded-full text-[10px] leading-none">
                        ({pendingCount})
                      </span>
       
                  </Link>

                  {/* New (Right Side - 50%) */}
                  <Link
                    to="/operator/request-complaints"
                    onClick={handleNewClick}  
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-center text-xs font-semibold text-blue-600 hover:bg-blue-50 transition-colors relative"
                  >
                    New
                  
                      <span className="bg-blue-100 text-blue-800  py-0.5 rounded-full text-[10px] leading-none">
                        ({newBadgeCount})
                      </span>
                    
                  </Link>
                  
                </div>
              )}
            </li>
          </ul>

          <ul className="space-y-2">
            {/* Progress Register & Search Reports Commented */}
          </ul>
        </nav>

        {/* 👇 MAIN DASHBOARD BUTTON 👇 */}
        <div className="p-4 border-t border-gray-300 bg-[#E7ECF5]">
          <Link
            to="/main-dashboard"
            onClick={handleLinkClick}
            className={`flex items-center gap-3 text-sm font-medium transition-all duration-200 rounded-lg ${
              isActive("/main-dashboard")
                ? "bg-green-600 text-white shadow-md"
                : "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
            } ${!isMobile && isCollapsed ? "justify-center px-2 py-2" : "px-4 py-3"}`}
            title={!isMobile && isCollapsed ? "Main Dashboard" : ""}
          >
            <FaHome className="w-[18px] h-[18px] flex-shrink-0" />
            {(isMobile || !isCollapsed) && <span>Main Dashboard</span>}
          </Link>
        </div>
      </div>
    </>
  );
};

export default Sidebar;