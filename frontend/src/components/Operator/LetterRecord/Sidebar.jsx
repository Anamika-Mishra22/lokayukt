// components/Sidebar.js
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { TbMail } from "react-icons/tb"; 
import { FaHome, FaTimes } from "react-icons/fa";
import { FiInbox, FiSend, FiFileText, FiBarChart2, FiSearch } from "react-icons/fi";
import { MdNoteAdd } from "react-icons/md";
import Cookies from "js-cookie";

const Sidebar = ({
  isMobileMenuOpen,
  toggleMobileMenu,
  isCollapsed,
  toggleSidebar,
}) => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  const subrole = Cookies.get("subrole") || "letter";

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
    const fullPath = `/letter${href}`;

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
          {/* Logo & Subrole (Commented as per your code) */}
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-6 overflow-y-auto custom-scrollbar">
          {/* Workbox Section */}
          {(isMobile || !isCollapsed) && (
            <p className="text-[13px]  text-gray-800 mb-2 ml-2">Workbox</p>
          )}

          <ul className="space-y-2 mb-6">
            
            {/* Letter Record (Sirf yehi rakha gaya hai) */}
          


              <li>
                          <Link
                            to="/letter/all-letters"
                            onClick={handleLinkClick}
                            className={`flex items-center justify-between text-sm  transition-all duration-200 rounded-lg ${
                              isActive("/all-letters")
                                ? "bg-blue-600 text-white shadow-md"
                                : "text-gray-700 hover:bg-gray-200"
                            } ${!isMobile && isCollapsed ? "justify-center px-2 py-2" : "px-3 py-2"}`}
                            title={!isMobile && isCollapsed ? "Inbox" : ""}
                          >
                            <div className="flex items-center gap-3">
                                <FiInbox size={18} className="w-[18px] h-[18px] flex-shrink-0" />
                              {(isMobile || !isCollapsed) && <span>Inbox</span>}
                            </div>
                            {isActive("/all-letters") && (isMobile) && (
                              <div className="w-10 h-5 bg-blue-400 rounded-full flex items-center justify-end pr-[2px]">
                                <div className="w-4 h-4 bg-white rounded-full"></div>
                              </div>
                            )}
                          </Link>
                        </li>



                       
                   <li>
                                      <Link
                                        to="/letter/all-sent-letters"
                                        onClick={handleLinkClick}
                                        className={`flex items-center justify-between text-sm  transition-all duration-200 rounded-lg ${
                                          isActive("/all-sent-letters")
                                            ? "bg-blue-600 text-white shadow-md"
                                            : "text-gray-700 hover:bg-gray-200"
                                        } ${!isMobile && isCollapsed ? "justify-center px-2 py-2" : "px-3 py-2"}`}
                                        title={!isMobile && isCollapsed ? "Sent" : ""}
                                      >
                                        <div className="flex items-center gap-3">
                                          <FiSend size={18}  className="w-[18px] h-[18px] flex-shrink-0" />
                                          {(isMobile || !isCollapsed) && <span>Sent</span>}
                                        </div>
                                        {isActive("/all-sent-letters") && (isMobile) && (
                                          <div className="w-10 h-5 bg-blue-400 rounded-full flex items-center justify-end pr-[2px]">
                                            <div className="w-4 h-4 bg-white rounded-full"></div>
                                          </div>
                                        )}
                                      </Link>
                                    </li>



                                      <li>
              <Link
                to="/letter/letter-record"
                onClick={handleLinkClick}
                className={`flex items-center justify-between text-sm  transition-all duration-200 rounded-lg ${
                  isActive("/letter-record")
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-200"
                } ${!isMobile && isCollapsed ? "justify-center px-2 py-2" : "px-3 py-2"}`}
                title={!isMobile && isCollapsed ? "Letter Record" : ""}
              >
                <div className="flex items-center gap-3">
                  <TbMail size={18} className="w-[18px] h-[18px] flex-shrink-0" />
                  {(isMobile || !isCollapsed) && <span>Letter Record</span>}
                </div>
                {isActive("/letter-record") && (isMobile) && (
                  <div className="w-10 h-5 bg-blue-400 rounded-full flex items-center justify-end pr-[2px]">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                )}
              </Link>
            </li>

          
            {/* <li>
              <Link
                to="/letter/add-letter-record"
                onClick={handleLinkClick}
                className={`flex items-center justify-between text-sm  transition-all duration-200 rounded-lg ${
                  isActive("/add-letter-record")
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-200"
                } ${!isMobile && isCollapsed ? "justify-center px-2 py-2" : "px-3 py-2"}`}
                title={!isMobile && isCollapsed ? "Add Letter Record" : ""}
              >
                <div className="flex items-center gap-3">
                  <MdNoteAdd size={18} className="w-[18px] h-[18px] flex-shrink-0" />
                  {(isMobile || !isCollapsed) && <span>Add Letter Record</span>}
                </div>
                {isActive("/add-letter-record") && (isMobile) && (
                  <div className="w-10 h-5 bg-blue-400 rounded-full flex items-center justify-end pr-[2px]">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                )}
              </Link>
            </li> */}

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