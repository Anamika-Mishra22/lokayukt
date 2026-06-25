// components/Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { FiBell, FiHelpCircle, FiChevronDown, FiLayers, FiLock } from "react-icons/fi";
import { FaBars, FaSignOutAlt, FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";

const subRoleLable = Cookies.get("subrole_lable");

const Header = ({ toggleMobileMenu }) => {
  const navigate = useNavigate();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [isMobile, setIsMobile] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const timeoutRef = useRef(null);

  // States for Change Password Modal
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const getApiInstance = () => {
    const token = Cookies.get("access_token");
    return axios.create({
      baseURL: BASE_URL,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
  };

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    if (showProfileDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileDropdown]);

  const formatDateTime = () => {
    const now = currentDateTime;
    const day = now.getDate();
    const month = now.toLocaleDateString('en-US', { month: 'short' });
    const year = now.getFullYear();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    
    return `${day} ${month} ${year}, ${hours}:${minutesStr} ${ampm}`;
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    
    try {
      const api = getApiInstance();
      const response = await api.post('/logout');

      if (response.data.status === 'success') {
        toast.success('Logout Successfully');
        
        timeoutRef.current = setTimeout(() => {
          Cookies.remove('access_token');
          Cookies.remove('user');
          Cookies.remove('role'); 
          Cookies.remove('subrole'); 
          window.open("/login", "_self");
        }, 1500);
       
      } else {
        toast.error('Logout failed. Please try again.');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Network error during logout. Please try again.');
      }
    } finally {
      timeoutRef.current = setTimeout(() => {
        setIsLoggingOut(false);
      }, 1500);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const getUserData = () => {
    try {
      const userData = Cookies.get('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.warn('Error parsing user data:', error);
      return null;
    }
  };

  const getUserRole = () => {
    try {
      const role = Cookies.get('role');
      return role || 'lokayukt';
    } catch (error) {
      return 'lokayukt';
    }
  };

  const user = getUserData();
  const userRole = getUserRole();

  const getUserInitials = () => {
    if (user?.name) {
      const nameParts = user.name.split(' ');
      if (nameParts.length >= 2) {
        return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
      }
      return user.name.substring(0, 2).toUpperCase();
    }
    return 'LK';
  };

  // API handler for Change Password
  const handleChangePasswordSubmit = async () => {
    setFieldErrors({});
    setIsChangingPassword(true);

    try {
      const api = getApiInstance();
      const response = await api.post('/operator/change-password', {
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword
      });

      if (response.status === 200 || response.data.status === 'success' || response.data.status === true) {
        toast.success(response.data.message || "Password changed successfully!");
        
        setIsChangePasswordOpen(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setFieldErrors({});
      } else {
        toast.error(response.data.message || "Failed to change password.");
      }
    } catch (error) {
      if (error.response?.data) {
        const { message, errors } = error.response.data;
        
        const validationErrors = typeof message === 'object' ? message : errors;

        if (validationErrors && typeof validationErrors === 'object') {
          setFieldErrors(validationErrors);
        } else if (typeof message === 'string') {
          toast.error(message);
        } else {
          toast.error('Server error. Please try again later.');
        }
      } else if (error.request) {
        toast.error('Network error. Please check your connection.');
      } else {
        toast.error('An unexpected error occurred.');
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />

      {/* ✅ FIXED Header - stays at top */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-50 h-16">
        <div className="w-full h-full flex items-center justify-between px-4 md:px-6">
          
          {/* LEFT SECTION - Logo + Title */}
          <div className="flex items-center gap-3">
            {isMobile && (
              <button
                onClick={toggleMobileMenu}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors md:hidden"
                aria-label="Toggle mobile menu"
              >
                <FaBars className="w-5 h-5" />
              </button>
            )}

            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
              <FiLayers size={26} className="text-white" />
            </div>

            {!isMobile && (
              <div>
                <h1 className="text-lg font-semibold text-gray-800">
                  Lokayukta Case Management
                </h1>
                <p className="text-xs text-gray-500">
                  {formatDateTime()}
                </p>
              </div>
            )}
          </div>

          {/* RIGHT SECTION - Notifications + Profile */}
          <div className="flex items-center gap-5">
            
            <div className="relative cursor-pointer" aria-label="Notifications">
              <FiBell size={20} className="text-gray-700" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500"></span>
            </div>

            {!isMobile && (
              <FiHelpCircle 
                size={20} 
                className="text-gray-700 cursor-pointer" 
                aria-label="Help"
              />
            )}

            <div className="relative" ref={dropdownRef}>
              <div 
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              >
                <div className="w-9 h-9 rounded-full bg-yellow-500 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {getUserInitials()}
                  </span>
                </div>

                {!isMobile && (
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-700">
                        {user?.name || 'User Name'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {subRoleLable}
                      </span>
                    </div>
                    <FiChevronDown className="text-gray-600" />
                  </div>
                )}

                {isMobile && (
                  <FiChevronDown className="text-gray-600" />
                )}
              </div>

              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-[60]">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-800">{user?.name || 'User Name'}</p>
                    <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
                        {/* <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
                      {userRole === "lok-ayukt" ? "Cio" : "Cio"}
                    </span> */} 
                  </div>

                  {/* Change Password Button inside Dropdown */}
                  <button
                    onClick={() => {
                      setIsChangePasswordOpen(true);
                      setShowProfileDropdown(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-green-600 hover:bg-green-50 transition-colors"
                  >
                    <FiLock />
                    <span>Change Password</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors ${
                      isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <FaSignOutAlt className={`w-4 h-4 ${isLoggingOut ? 'animate-pulse' : ''}`} />
                    <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ✅ Change Password Popup Modal */}
      {isChangePasswordOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-fade-in-up">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FiLock className="text-blue-600" />
              Change Password
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none transition-all ${
                    fieldErrors.current_password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    if (fieldErrors.current_password) {
                      setFieldErrors(prev => ({ ...prev, current_password: null }));
                    }
                  }}
                  disabled={isChangingPassword}
                />
                {fieldErrors.current_password && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.current_password[0]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none transition-all ${
                    fieldErrors.new_password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (fieldErrors.new_password) {
                      setFieldErrors(prev => ({ ...prev, new_password: null }));
                    }
                  }}
                  disabled={isChangingPassword}
                />
                {fieldErrors.new_password && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.new_password[0]}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none transition-all ${
                    fieldErrors.confirm_password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (fieldErrors.confirm_password) {
                      setFieldErrors(prev => ({ ...prev, confirm_password: null }));
                    }
                  }}
                  disabled={isChangingPassword}
                />
                {fieldErrors.confirm_password && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.confirm_password[0]}</p>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsChangePasswordOpen(false);
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                  setFieldErrors({});
                }}
                disabled={isChangingPassword}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePasswordSubmit}
                disabled={isChangingPassword}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isChangingPassword ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Submit'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;