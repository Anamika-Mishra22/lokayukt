import React, { useState } from 'react';
import { FaUserTie } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { TbReport } from "react-icons/tb";
import axios from 'axios';

// API Configuration
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
  const navigate = useNavigate();

  // NEW STATES FOR THE PASSWORD POPUP
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // NEW HANDLER FOR PASSWORD SUBMIT
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsLoginLoading(true);
    setLoginError('');

    try {
      const response = await api.post('/st/employement-management-login', { 
        password: password 
      });

      if (response.status === 200) {
        setIsModalOpen(false);
        setPassword('');
        navigate('/employee/view-files'); // ❌ Navigation location NOT changed
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 font-sans p-4 relative">
      
      {/* Container */}
      <div className="flex flex-col sm:flex-row gap-8">
        
        {/* Complaint Management */}
        <div 
          onClick={() => {
            setActiveBox('user');
            navigate('/steno/dashboard');
          }}
          className={`w-[360px] h-[300px] flex flex-col items-center justify-center p-8 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
            activeBox === 'user'
              ? 'bg-blue-50 border-blue-600 scale-105 shadow-md'
              : 'bg-white border-transparent hover:shadow-md hover:-translate-y-1'
          }`}
        >
          <TbReport
            className={`text-[80px] mb-10 ${
              activeBox === 'user' ? 'text-blue-600' : 'text-[#8ea2b4]'
            }`}
          />

          <div
            className={`text-2xl font-bold whitespace-nowrap text-center ${
              activeBox === 'user' ? 'text-blue-600' : 'text-[#475569]'
            }`}
          >
            Complaint Management
          </div>
        </div>

        {/* Employee Management (UPDATED TO OPEN MODAL) */}
        <div 
          onClick={() => {
            setActiveBox('employee');
            setIsModalOpen(true); // Open modal instead of direct navigation
          }}
          className={`w-[360px] h-[300px] flex flex-col items-center justify-center p-8 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
            activeBox === 'employee'
              ? 'bg-blue-50 border-blue-600 scale-105 shadow-md'
              : 'bg-white border-transparent hover:shadow-md hover:-translate-y-1'
          }`}
        >
          <FaUserTie
            className={`text-[80px] mb-10 ${
              activeBox === 'employee' ? 'text-blue-600' : 'text-[#8ea2b4]'
            }`}
          />

          <div
            className={`text-2xl font-bold whitespace-nowrap text-center ${
              activeBox === 'employee' ? 'text-blue-600' : 'text-[#475569]'
            }`}
          >
            Employee Management
          </div>
        </div>

      </div>

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
  );
};

export default EmployeeUserDashboard;