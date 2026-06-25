import React, { useState, useEffect } from 'react';
import { FaUserTie } from 'react-icons/fa';
import { TbReport, TbMail } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { HiOutlineShieldCheck } from "react-icons/hi";
import { toast, Toaster } from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";
const token = Cookies.get("access_token");

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

const EmployeeUserDashboard = () => {
  const [activeBox, setActiveBox] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [permissions, setPermissions] = useState({
    employee: false,
    complaint: false,
    administrative: false,
    pio: false
  });
  
  // NEW STATES FOR THE PASSWORD POPUP
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const navigate = useNavigate();

  // EXISTING PERMISSION API (Untouched)
  useEffect(() => {
    const fetchPermissions = async () => {
      const currentToken = Cookies.get("access_token");
      const currentUserId = Cookies.get("id");

      if (!currentUserId || !currentToken) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.get(`/supervisor/get-permission/${currentUserId}`, {
          headers: {
            Authorization: `Bearer ${currentToken}`
          }
        });

        if (response.data.status === true) {
          const data = response.data.data;
          const isTrue = (val) => val === 1 || val === '1' || val === true;
          
          setPermissions({
            employee: isTrue(data?.["1"]?.can_view),
            complaint: isTrue(data?.["2"]?.can_view),
            administrative: isTrue(data?.["3"]?.can_view),
            pio: isTrue(data?.["5"]?.can_view),
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  // EXISTING LOGOUT API (Untouched)
  const handleLogout = async () => {
    toast.success("Logout Successfully!");

    try {
      const currentToken = Cookies.get("access_token");
      if (currentToken) {
        await api.post('/logout', {}, {
          headers: {
            Authorization: `Bearer ${currentToken}`
          }
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        Cookies.clear();
        window.open("/login", "_self");
      }, 2000);
    }
  };

  // NEW HANDLER FOR PASSWORD SUBMIT
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsLoginLoading(true);
    setLoginError('');

    try {
      const response = await api.post('/supervisor/employement-management-login', { 
        password: password 
      });

      if (response.status === 200) {
        setIsModalOpen(false);
        setPassword('');
        navigate('/employee/view-files');
      }
    } catch (err) {
      console.error("Login Error:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setLoginError(err.response.data.message);
      } else {
        setLoginError('Incorrect password or server error. Please try again.');
      }
    } finally {
      setIsLoginLoading(false);
    }
  };

  // SKELETON LOADER WITH CSS FIXED (Grid Layout)
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 font-sans p-4 sm:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 w-full max-w-[1400px] mx-auto">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="w-full h-[260px] sm:h-[300px] flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl bg-white border-2 border-gray-100 shadow-sm">
              <div className="w-20 h-20 bg-gray-200 rounded-full animate-pulse mb-6 sm:mb-10"></div>
              <div className="w-40 h-8 bg-gray-200 rounded-md animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const hasNoPermissions = !permissions.complaint && !permissions.employee && !permissions.administrative && !permissions.pio;

  // DYNAMIC GRID LOGIC: Calculate how many permissions are true
  const activeCount = [
    permissions.complaint, 
    permissions.employee, 
    permissions.administrative, 
    permissions.pio
  ].filter(Boolean).length;

  // Set grid columns and max-width based on the count to keep items centered
  const getGridLayoutClass = () => {
    if (activeCount === 1) return "grid-cols-1 max-w-sm";
    if (activeCount === 2) return "grid-cols-1 sm:grid-cols-2 max-w-3xl";
    if (activeCount === 3) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl";
    return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-[1400px]";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 font-sans p-4 sm:p-8 relative">
      
      <Toaster position="top-right" reverseOrder={false} />

      {hasNoPermissions ? (
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border-2 border-red-100 flex flex-col items-center w-full max-w-md mx-auto">
          <FaUserTie className="text-6xl text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700">No Access</h2>
          <p className="text-gray-500 mt-2 mb-6 text-center">
            You do not have permission to view any modules.<br/>
            Please login with an authorized account.
          </p>
          <button 
            onClick={handleLogout}
            className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-all duration-300 active:scale-95"
          >
            Logout 
          </button>
        </div>
      ) : (
        /* RESPONSIVE GRID LAYOUT DYNAMICALLY CENTERED */
        <div className={`grid gap-6 lg:gap-8 w-full mx-auto ${getGridLayoutClass()}`}>
          
          {/* Complaint Management */}
          {permissions.complaint && (
            <div 
              onClick={() => {
                setActiveBox('complaint');
                navigate('/supervisor/dashboard');
              }}
              className={`w-full h-[260px] sm:h-[300px] flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
                activeBox === 'complaint'
                  ? 'bg-blue-50 border-blue-600 scale-105 shadow-md'
                  : 'bg-white border-transparent hover:shadow-md hover:-translate-y-1'
              }`}
            >
              <TbReport className={`text-[60px] sm:text-[80px] mb-6 sm:mb-10 transition-colors ${activeBox === 'complaint' ? 'text-blue-600' : 'text-[#8ea2b4]'}`} />
              <div className={`text-xl sm:text-2xl font-bold whitespace-nowrap text-center ${
                activeBox === 'complaint' ? 'text-blue-600' : 'text-[#475569]'
              }`}>
                Complaint<br/>Management
              </div>
            </div>
          )}

          {/* Employee Management */}
          {permissions.employee && (
            <div 
              onClick={() => {
                setActiveBox('employee');
                setIsModalOpen(true); 
              }}
              className={`w-full h-[260px] sm:h-[300px] flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
                activeBox === 'employee'
                  ? 'bg-blue-50 border-blue-600 scale-105 shadow-md'
                  : 'bg-white border-transparent hover:shadow-md hover:-translate-y-1'
              }`}
            >
              <FaUserTie className={`text-[60px] sm:text-[80px] mb-6 sm:mb-10 transition-colors ${activeBox === 'employee' ? 'text-blue-600' : 'text-[#8ea2b4]'}`} />
              <div className={`text-xl sm:text-2xl font-bold whitespace-nowrap text-center ${
                activeBox === 'employee' ? 'text-blue-600' : 'text-[#475569]'
              }`}>
                Employee<br/>Management
              </div>
            </div>
          )}

          {/* Administrative Record */}
          {permissions.administrative && (
            <div 
              onClick={() => {
                setActiveBox('administrative');
                navigate('/letter/all-letters');
              }}
              className={`w-full h-[260px] sm:h-[300px] flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
                activeBox === 'administrative'
                  ? 'bg-blue-50 border-blue-600 scale-105 shadow-md'
                  : 'bg-white border-transparent hover:shadow-md hover:-translate-y-1'
              }`}
            >
              <TbMail className={`text-[60px] sm:text-[80px] mb-6 sm:mb-10 transition-colors ${activeBox === 'administrative' ? 'text-blue-600' : 'text-[#8ea2b4]'}`} />
              <div className={`text-xl sm:text-2xl font-bold whitespace-nowrap text-center ${
                activeBox === 'administrative' ? 'text-blue-600' : 'text-[#475569]'
              }`}>
                Administrative<br/>Record
              </div>
            </div>
          )}

          {/* PIO Files */}
          {permissions.pio && (
            <div 
              onClick={() => {
                setActiveBox('pio');
                navigate('/pio/all-rti-file');
              }}
              className={`w-full h-[260px] sm:h-[300px] flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
                activeBox === 'pio'
                  ? 'bg-blue-50 border-blue-600 scale-105 shadow-md'
                  : 'bg-white border-transparent hover:shadow-md hover:-translate-y-1'
              }`}
            >
              <HiOutlineShieldCheck className={`text-[60px] sm:text-[80px] mb-6 sm:mb-10 transition-colors ${activeBox === 'pio' ? 'text-blue-600' : 'text-[#8ea2b4]'}`} />
              <div className={`text-xl sm:text-2xl font-bold whitespace-nowrap text-center ${
                activeBox === 'pio' ? 'text-blue-600' : 'text-[#475569]'
              }`}>
                PIO Files
              </div>
            </div>
          )}

        </div>
      )}

      {/* NEW PASSWORD POPUP MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 sm:p-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Authentication Required</h2>
            <p className="text-gray-500 mb-6 text-sm">Please enter your password to access Employee Management.</p>
            
            <form onSubmit={handlePasswordSubmit}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                required
              />
              
              {loginError && <p className="text-red-500 text-sm mb-4">{loginError}</p>}
              
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setPassword('');
                    setLoginError('');
                  }}
                  className="px-5 py-2.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoginLoading}
                  className="px-5 py-2.5 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors disabled:opacity-70 flex items-center"
                >
                  {isLoginLoading ? 'Verifying...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  ) 
};

export default EmployeeUserDashboard;