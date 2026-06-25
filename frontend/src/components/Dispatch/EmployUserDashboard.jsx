


// import React, { useEffect, useState } from 'react';
// import { FaUserTie } from 'react-icons/fa';
// import { TbReport, TbMail } from "react-icons/tb";
// import { HiOutlineShieldCheck } from "react-icons/hi";
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// // --- Axios Instance Setup with Interceptor ---
// const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";

// const api = axios.create({
//   baseURL: BASE_URL,
// });

// // Interceptor ensures the latest token is ALWAYS used, even after re-logins
// api.interceptors.request.use((config) => {
//   const currentToken = Cookies.get("access_token");
//   if (currentToken) {
//     config.headers.Authorization = `Bearer ${currentToken}`;
//   }
//   return config;
// });

// const EmployeeUserDashboard = () => {
//   const [activeBox, setActiveBox] = useState('');
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [password, setPassword] = useState('');
  
//   // State for loaders
//   const [isSubmitLoading, setIsSubmitLoading] = useState(false);
//   const [isPageLoading, setIsPageLoading] = useState(true); 
  
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const [permissions, setPermissions] = useState({
//     employee: false,
//     complaint: false,
//     administrative: false,
//     pio: false
//   });

//   // --- GET API: Fetch Permissions ---
//   useEffect(() => {
//     const fetchPermissions = async () => {
//       const currentUserId = Cookies.get("id");
//       const currentToken = Cookies.get("access_token");

//       if (!currentUserId || !currentToken) {
//         setIsPageLoading(false);
//         return;
//       }

//       try {
//         const response = await api.get(`/dispatch/get-permission/${currentUserId}`);

//         if (response.data.status === true) {
//           const data = response.data.data;
//           const isTrue = (val) => String(val) === "1" || val === true;

//           setPermissions({
//             employee: isTrue(data?.["1"]?.can_view),
//             complaint: isTrue(data?.["2"]?.can_view),
//             administrative: isTrue(data?.["3"]?.can_view),
//             pio: isTrue(data?.["5"]?.can_view),
//           });
//         }
//       } catch (error) {
//         console.error("Error fetching permissions:", error);
//       } finally {
//         setIsPageLoading(false);
//       }
//     };

//     fetchPermissions();
//   }, []);

//   // --- POST API: Handle password submission ---
//   const handlePasswordSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitLoading(true);
//     setError('');

//     try {
//       const response = await api.post('/dispatch/employement-management-login', { 
//         password: password 
//       });

//       if (response.status === 200) {
//         setIsModalOpen(false);
//         setPassword('');
//         navigate('/employee/view-files');
//       }
//     } catch (err) {
//       console.error("Login Error:", err);
//       if (err.response && err.response.data && err.response.data.message) {
//         setError(err.response.data.message);
//       } else {
//         setError('Incorrect password or server error. Please try again.');
//       }
//     } finally {
//       setIsSubmitLoading(false);
//     }
//   };

//   // --- CLEAN SPINNER LOADER ---
//   if (isPageLoading) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 font-sans p-4 sm:p-8">
//         <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
//         <p className="mt-4 text-lg text-gray-600 font-medium animate-pulse">Loading Dashboard...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 font-sans p-4 sm:p-8 relative">
      
//       {/* Responsive Grid Container - 4 Columns Desktop */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 w-full max-w-[1400px] mx-auto animate-fade-in">
        
//         {/* Complaint Management */}
//         {permissions.complaint && (
//           <div 
//             onClick={() => {
//               setActiveBox('complaint');
//               navigate('/dispatch/dashboard');
//             }}
//             className={`w-full h-[260px] sm:h-[300px] flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
//               activeBox === 'complaint'
//                 ? 'bg-blue-50 border-blue-600 scale-105 shadow-md'
//                 : 'bg-white border-transparent hover:shadow-md hover:-translate-y-1'
//             }`}
//           >
//             <TbReport className={`text-[60px] sm:text-[80px] mb-6 sm:mb-10 transition-colors ${activeBox === 'complaint' ? 'text-blue-600' : 'text-[#8ea2b4]'}`} />
            
//             <div className={`text-xl sm:text-2xl font-bold whitespace-nowrap text-center ${
//               activeBox === 'complaint' ? 'text-blue-600' : 'text-[#475569]'
//             }`}>
//               Complaint<br/>Management
//             </div>
//           </div>
//         )}

//         {/* Employee Management */}
//         {permissions.employee && (
//           <div 
//             onClick={() => {
//               setActiveBox('employee');
//               setIsModalOpen(true);
//             }}
//             className={`w-full h-[260px] sm:h-[300px] flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
//               activeBox === 'employee'
//                 ? 'bg-blue-50 border-blue-600 scale-105 shadow-md'
//                 : 'bg-white border-transparent hover:shadow-md hover:-translate-y-1'
//             }`}
//           >
//             <FaUserTie className={`text-[60px] sm:text-[80px] mb-6 sm:mb-10 transition-colors ${activeBox === 'employee' ? 'text-blue-600' : 'text-[#8ea2b4]'}`} />
            
//             <div className={`text-xl sm:text-2xl font-bold whitespace-nowrap text-center ${
//               activeBox === 'employee' ? 'text-blue-600' : 'text-[#475569]'
//             }`}>
//               Employee<br/>Management
//             </div>
//           </div>
//         )}

//         {/* Letter / Administrative Record */}
//         {permissions.administrative && (
//           <div 
//             onClick={() => {
//               setActiveBox('letter'); 
//               navigate('/letter/all-letters'); 
//             }}
//             className={`w-full h-[260px] sm:h-[300px] flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
//               activeBox === 'letter' 
//                 ? 'bg-blue-50 border-blue-600 scale-105 shadow-md'
//                 : 'bg-white border-transparent hover:shadow-md hover:-translate-y-1'
//             }`}
//           >
//             <TbMail className={`text-[60px] sm:text-[80px] mb-6 sm:mb-10 transition-colors ${activeBox === 'letter' ? 'text-blue-600' : 'text-[#8ea2b4]'}`} /> 
            
//             <div className={`text-xl sm:text-2xl font-bold whitespace-nowrap text-center ${
//               activeBox === 'letter' ? 'text-blue-600' : 'text-[#475569]' 
//             }`}>
//                Administrative<br/>Record
//             </div>
//           </div>
//         )}

//         {/* PIO Files */}
//         {permissions.pio && (
//           <div 
//             onClick={() => {
//               setActiveBox('pio'); 
//               navigate('/pio/all-rti-file'); 
//             }}
//             className={`w-full h-[260px] sm:h-[300px] flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
//               activeBox === 'pio' 
//                 ? 'bg-blue-50 border-blue-600 scale-105 shadow-md'
//                 : 'bg-white border-transparent hover:shadow-md hover:-translate-y-1'
//             }`}
//           >
//             <HiOutlineShieldCheck className={`text-[60px] sm:text-[80px] mb-6 sm:mb-10 transition-colors ${activeBox === 'pio' ? 'text-blue-600' : 'text-[#8ea2b4]'}`} /> 
            
//             <div className={`text-xl sm:text-2xl font-bold whitespace-nowrap text-center ${
//               activeBox === 'pio' ? 'text-blue-600' : 'text-[#475569]' 
//             }`}>
//               PIO Files
//             </div>
//           </div> 
//         )}

//       </div>

//       {/* Password Popup Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 sm:p-8 animate-fade-in">
//             <h2 className="text-2xl font-bold text-gray-800 mb-2">Authentication Required</h2>
//             <p className="text-gray-500 mb-6 text-sm">Please enter your password to access Employee Management.</p>
            
//             <form onSubmit={handlePasswordSubmit}>
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Enter password"
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
//                 required
//               />
              
//               {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              
//               <div className="flex justify-end gap-3">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setIsModalOpen(false);
//                     setPassword('');
//                     setError('');
//                   }}
//                   className="px-5 py-2.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={isSubmitLoading}
//                   className="px-5 py-2.5 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors flex items-center disabled:opacity-70"
//                 >
//                   {isSubmitLoading ? 'Verifying...' : 'Submit'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// };

// export default EmployeeUserDashboard;

import React, { useState } from 'react';
import { FaUserTie } from 'react-icons/fa';
import { TbReport, TbMail } from "react-icons/tb";
import { HiOutlineShieldCheck } from "react-icons/hi";
import { useNavigate } from 'react-router-dom';

const EmployeeUserDashboard = () => {
  const [activeBox, setActiveBox] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Handle password submission without API
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setIsModalOpen(false);
    setPassword('');
    // Navigating directly since API verification is removed
    navigate('/employee/view-files');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 font-sans p-4 sm:p-8 relative">
      
      {/* Responsive Grid Container - Desktop Focused */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 w-full max-w-[1400px] mx-auto">
        
        {/* Complaint Management */}
        <div 
          onClick={() => {
            setActiveBox('complaint');
            navigate('/dispatch/dashboard');
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

        {/* Employee Management */}
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

        {/* Letter / Administrative Record */}
        <div 
          onClick={() => {
            setActiveBox('letter'); 
            navigate('/letter/all-letters'); 
          }}
          className={`w-full h-[260px] sm:h-[300px] flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
            activeBox === 'letter' 
              ? 'bg-blue-50 border-blue-600 scale-105 shadow-md'
              : 'bg-white border-transparent hover:shadow-md hover:-translate-y-1'
          }`}
        >
          <TbMail className={`text-[60px] sm:text-[80px] mb-6 sm:mb-10 transition-colors ${activeBox === 'letter' ? 'text-blue-600' : 'text-[#8ea2b4]'}`} /> 
          
          <div className={`text-xl sm:text-2xl font-bold whitespace-nowrap text-center ${
            activeBox === 'letter' ? 'text-blue-600' : 'text-[#475569]' 
          }`}>
             Administrative<br/>Record
          </div>
        </div>

        {/* PIO Files */}
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
            RTI Files
          </div>
        </div> 

      </div>

      {/* Password Popup Modal */}
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
              
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setPassword('');
                  }}
                  className="px-5 py-2.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors flex items-center"
                >
                  Submit
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


// import React, { useState } from 'react';
// import { FaUserTie } from 'react-icons/fa';
// import { TbReport, TbMail } from "react-icons/tb";
// import { HiOutlineShieldCheck } from "react-icons/hi";
// import { useNavigate } from 'react-router-dom';

// const EmployeeUserDashboard = () => {
//   const [activeBox, setActiveBox] = useState('');
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();

//   // Handle password submission without API
//   const handlePasswordSubmit = (e) => {
//     e.preventDefault();
//     setIsModalOpen(false);
//     setPassword('');
//     // Navigating directly since API verification is removed
//     navigate('/employee/view-files');
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 font-sans p-4 sm:p-8 relative">
      
//       {/* Responsive Grid Container */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 w-full max-w-[1400px] mx-auto">
        
//         {/* Complaint Management */}
//         <div 
//           onClick={() => {
//             setActiveBox('complaint');
//             navigate('/dispatch/dashboard');
//           }}
//           className={`w-full h-[260px] sm:h-[300px] flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
//             activeBox === 'complaint'
//               ? 'bg-blue-50 border-blue-600 scale-105 shadow-md'
//               : 'bg-white border-transparent hover:shadow-md hover:-translate-y-1'
//           }`}
//         >
//           <TbReport className={`text-[60px] sm:text-[80px] mb-6 sm:mb-10 transition-colors ${activeBox === 'complaint' ? 'text-blue-600' : 'text-[#8ea2b4]'}`} />
          
//           <div className={`text-xl sm:text-2xl font-bold whitespace-nowrap text-center ${
//             activeBox === 'complaint' ? 'text-blue-600' : 'text-[#475569]'
//           }`}>
//             Complaint<br/>Management
//           </div>
//         </div>

//         {/* Employee Management */}
//         <div 
//           onClick={() => {
//             setActiveBox('employee');
//             setIsModalOpen(true);
//           }}
//           className={`w-full h-[260px] sm:h-[300px] flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
//             activeBox === 'employee'
//               ? 'bg-blue-50 border-blue-600 scale-105 shadow-md'
//               : 'bg-white border-transparent hover:shadow-md hover:-translate-y-1'
//           }`}
//         >
//           <FaUserTie className={`text-[60px] sm:text-[80px] mb-6 sm:mb-10 transition-colors ${activeBox === 'employee' ? 'text-blue-600' : 'text-[#8ea2b4]'}`} />
          
//           <div className={`text-xl sm:text-2xl font-bold whitespace-nowrap text-center ${
//             activeBox === 'employee' ? 'text-blue-600' : 'text-[#475569]'
//           }`}>
//             Employee<br/>Management
//           </div>
//         </div>

//         {/* Letter / Administrative Record */}
//         <div 
//           onClick={() => {
//             setActiveBox('letter'); 
//             navigate('/letter/all-letters'); 
//           }}
//           className={`w-full h-[260px] sm:h-[300px] flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
//             activeBox === 'letter' 
//               ? 'bg-blue-50 border-blue-600 scale-105 shadow-md'
//               : 'bg-white border-transparent hover:shadow-md hover:-translate-y-1'
//           }`}
//         >
//           <TbMail className={`text-[60px] sm:text-[80px] mb-6 sm:mb-10 transition-colors ${activeBox === 'letter' ? 'text-blue-600' : 'text-[#8ea2b4]'}`} /> 
          
//           <div className={`text-xl sm:text-2xl font-bold whitespace-nowrap text-center ${
//             activeBox === 'letter' ? 'text-blue-600' : 'text-[#475569]' 
//           }`}>
//              Administrative<br/>Record
//           </div>
//         </div>

//         {/* PIO Files */}
//         <div 
//           onClick={() => {
//             setActiveBox('pio'); 
//             navigate('/pio/all-rti-file'); 
//           }}
//           className={`w-full h-[260px] sm:h-[300px] flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
//             activeBox === 'pio' 
//               ? 'bg-blue-50 border-blue-600 scale-105 shadow-md'
//               : 'bg-white border-transparent hover:shadow-md hover:-translate-y-1'
//           }`}
//         >
//           <HiOutlineShieldCheck className={`text-[60px] sm:text-[80px] mb-6 sm:mb-10 transition-colors ${activeBox === 'pio' ? 'text-blue-600' : 'text-[#8ea2b4]'}`} /> 
          
//           <div className={`text-xl sm:text-2xl font-bold whitespace-nowrap text-center ${
//             activeBox === 'pio' ? 'text-blue-600' : 'text-[#475569]' 
//           }`}>
//             PIO Files
//           </div>
//         </div> 

//       </div>

//       {/* Password Popup Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 sm:p-8 animate-fade-in">
//             <h2 className="text-2xl font-bold text-gray-800 mb-2">Authentication Required</h2>
//             <p className="text-gray-500 mb-6 text-sm">Please enter your password to access Employee Management.</p>
            
//             <form onSubmit={handlePasswordSubmit}>
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Enter password"
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
//                 required
//               />
              
//               <div className="flex justify-end gap-3">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setIsModalOpen(false);
//                     setPassword('');
//                   }}
//                   className="px-5 py-2.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-5 py-2.5 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors flex items-center"
//                 >
//                   Submit
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// };

// export default EmployeeUserDashboard;