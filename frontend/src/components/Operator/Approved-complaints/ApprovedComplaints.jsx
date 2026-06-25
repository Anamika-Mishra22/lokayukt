// import React, { useEffect, useState } from "react";
// import { IoSearchOutline } from "react-icons/io5";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import { useQuery } from "@tanstack/react-query";
// import { Toaster, toast } from "react-hot-toast";
// import Cookies from "js-cookie";

// import "react-toastify/dist/ReactToastify.css";
// import { IoMdTime } from "react-icons/io";
// import { krutiToUnicode } from "../../../components/utils/krutiToUnicode";
// import { unicodeToKrutiDev } from "../../../components/utils/unicodeToKruti";

// import Pagination from "../../Pagination";

// const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";
// const token = Cookies.get("access_token");

// const api = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//     ...(token && { Authorization: `Bearer ${token}` }),
//   },
// });

// const AllComplaints = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   // ✅ Data States
//   const [allComplaints, setAllComplaints] = useState([]); // Holds "New" tab data
//   const [oldSearchData, setOldSearchData] = useState([]); // Holds "Old" tab API search data
//   const [filteredComplaints, setFilteredComplaints] = useState([]); // Holds final displayed data

//   const [searchQuery, setSearchQuery] = useState("");
//   const [sortOrder, setSortOrder] = useState("");
//   const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
//   const [complaintToApprove, setComplaintToApprove] = useState(null);
//   const [isApproving, setIsApproving] = useState(false);

//   const [selectedDistrict, setSelectedDistrict] = useState("");
//   const [selectedStatus, setSelectedStatus] = useState("");
//   const [selectedFeeStatus, setSelectedFeeStatus] = useState("");
//   const [selectedCaseType, setSelectedCaseType] = useState("");
//   const [selectedNature, setSelectedNature] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
  
//   const [activeTabType, setActiveTabType] = useState("new"); 

//   // ✅ Old Tab Search states
//   const [searchYear, setSearchYear] = useState("");
//   const [isSearching, setIsSearching] = useState(false);

//   const itemsPerPage = 10;
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;

//   const currentComplaints = filteredComplaints.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);

//   const getAllComplaints = async () => {
//     const res = await api.get("/operator/all-approved-complaints");
//     return res.data;
//   };

//   const { data, isLoading, isError, error, refetch } = useQuery({
//     queryKey: ["all-approved-complaints", location.pathname],
//     queryFn: getAllComplaints,
//   });

//   const stats = {
//     overdue: data?.older7DaysCount ?? 0,
//     receivedToday: data?.todayCount ?? 0,
//   };

//   const getDistrict = async () => {
//     const res = await api.get("/operator/all-district");
//     return res.data.data;
//   };

//   const { data: districtData, isLoading: districtLoading } = useQuery({
//     queryKey: ["district-api"],
//     queryFn: getDistrict,
//   });

//   // ✅ Search Function for OLD Tab (API Call)
//   const handleSearch = async () => {
//     if (!searchQuery && !searchYear) {
//       toast.error("Please enter a Complain No or select a Year to search.");
//       return;
//     }

//     try {
//       setIsSearching(true);
//       const payload = {};
//       if (searchQuery) payload.complain_no = searchQuery;
//       if (searchYear) payload.year = searchYear;

//       const response = await api.get("/operator/search-complaints", { params: payload });
      
//       let searchData = [];
//       if (response.data && Array.isArray(response.data)) {
//         searchData = response.data;
//       } else if (response.data?.data && Array.isArray(response.data.data)) {
//         searchData = response.data.data;
//       } else if (response.data?.data) {
//         searchData = [response.data.data]; 
//       }

//       setOldSearchData(searchData); 
//       if(searchData.length === 0) {
//          toast.info("कोई पुराना रिकॉर्ड नहीं मिला।");
//       }

//     } catch (err) {
//       console.error("Search API Error:", err);
//       toast.error("सर्च करने में विफल");
//       setOldSearchData([]);
//     } finally {
//       setIsSearching(false);
//     }
//   };

//   useEffect(() => {
//     let complaintsList = data?.data || data || [];
//     if (Array.isArray(complaintsList)) {
//       setAllComplaints(complaintsList);
//     }
//   }, [data]);

  
//   // ✅ UNIFIED FRONTEND FILTERING LOGIC (Works on BOTH New and Old Data)
//   useEffect(() => {
//     const baseData = activeTabType === "new" ? allComplaints : oldSearchData;
    
//     if (!baseData) return;

//     let filtered = [...baseData];

//     // Local Text Filtering (Only for 'New' tab, because 'Old' tab uses searchQuery for API call)
//     if (activeTabType === "new" && searchQuery.trim() !== "") {
//       const query = searchQuery.toLowerCase().trim();
//       const queryFromKruti = krutiToUnicode(searchQuery).toLowerCase().trim();
//       const queryToKruti = unicodeToKrutiDev(searchQuery).trim(); 

//       filtered = filtered.filter((complaint) => {
//         const match = (val) => {
//             if (!val) return false;
//             const strVal = String(val).toLowerCase(); 
//             const strValOriginal = String(val); 
//             return (strVal.includes(query) || strVal.includes(queryFromKruti) || strValOriginal.includes(queryToKruti));
//         };
//         return (match(complaint.complainantName) || match(complaint.respondentName) || match(complaint.complain_no));
//       });
//     }

//     // Common Filters (Applies to both New & Old Data)
//     if (selectedDistrict !== "") {
//       filtered = filtered.filter((complaint) => {
//         const dataDistrict = complaint.dist_new || complaint.district_name;
//         if (!dataDistrict) return false;
//         return String(dataDistrict).toLowerCase().trim() === selectedDistrict.toLowerCase().trim();
//       });
//     }

//     if (selectedStatus !== "") {
//       filtered = filtered.filter((complaint) => complaint.status === selectedStatus);
//     }

//     if (selectedFeeStatus !== "") {
//       filtered = filtered.filter((complaint) => complaint.fee_exempted?.toString() === selectedFeeStatus);
//     }

//     if (selectedNature !== "") {
//       filtered = filtered.filter((complaint) =>
//         String(complaint.category || "").toLowerCase().trim() === selectedNature.toLowerCase().trim()
//       );
//     }

//     if (selectedCaseType === "new") {
//       filtered = filtered.filter((complaint) => complaint.case_type == 1);
//     }

//     if (selectedCaseType === "old") {
//       filtered = filtered.filter((complaint) => complaint.case_type == 2);
//     }

//     if (selectedCaseType === "today") {
//       const today = new Date().toDateString();
//       filtered = filtered.filter((complaint) => new Date(complaint.created_at).toDateString() === today);
//     }

//     const sorted = [...filtered].sort((a, b) => {
//       if (!sortOrder) return 0;
//       const dateA = new Date(a.created_at);
//       const dateB = new Date(b.created_at);
//       return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
//     });

//     setFilteredComplaints(sorted);
//     setCurrentPage(1);

//   }, [
//     searchQuery,
//     allComplaints,
//     oldSearchData, 
//     selectedDistrict,
//     selectedStatus,
//     selectedFeeStatus,
//     selectedNature,
//     selectedCaseType,
//     sortOrder,
//     activeTabType 
//   ]);

  
//   const handleViewDetails = (e, complaintId) => {
//     e.stopPropagation();
//     navigate(`view/${complaintId}`);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const handleSortChange = (e) => {
//     setSortOrder(e.target.value);
//   };

//   const handleApproveClick = (e, complaint) => {
//     e.stopPropagation();
//     setComplaintToApprove(complaint);
//     setIsConfirmModalOpen(true);
//   };

//   const handleConfirmApproval = async () => {
//     if (!complaintToApprove) return;
//     setIsApproving(true);
//     try {
//       const response = await api.post(`/operator/approved-by-ro/${complaintToApprove.id}`);
//       if (response.data.success || response.status === 200) {
//         toast.success("Send To Lokayukt Successfully!");
//         refetch();
//       } else {
//         toast.error("Failed to approve complaint");
//       }
//     } catch (error) {
//       console.error("Approval Error:", error);
//       toast.error("Failed to approve complaint");
//     } finally {
//       setIsApproving(false);
//       setIsConfirmModalOpen(false);
//       setComplaintToApprove(null);
//     }
//   };

//   const handleCancelApproval = () => {
//     setIsConfirmModalOpen(false);
//     setComplaintToApprove(null);
//   };

//   function limitTo50Words(text) {
//     const words = text.trim().split(/\s+/);
//     if (words.length <= 30) return text;
//     return words.slice(0, 30).join(" ") + " ...";
//   }

//   const getDaysDifference = (date) => {
//     const created = new Date(date);
//     const today = new Date();
//     const diffTime = today - created; 
//     const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
//     return diffDays;
//   };

//   const currentYear = new Date().getFullYear();
//   const years = Array.from({ length: currentYear - 1997 + 1 }, (_, i) => currentYear - i);

//   return (
//     <>
//       <Toaster position="top-right" />

//       <div className="w-full h-screen flex bg-gray-50 rounded-md overflow-hidden">
//         <div className="w-full bg-white flex flex-col overflow-hidden">
          
//           <div className="px-3 sm:px-4 py-3 border-b flex-shrink-0 bg-white">
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
//               <h2 className="text-base sm:text-lg font-bold text-gray-900">Sent</h2>
              
//               {/* ✅ Inbox Stats: Hamesha dikhega (Dono tabs me) */}
//               <div className="flex flex-wrap gap-1.5 sm:gap-2 text-[10px] sm:text-xs">
//                 <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full font-medium whitespace-nowrap">
//                   Inbox: {allComplaints.length}
//                 </span>
//                 <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded-full font-medium whitespace-nowrap">
//                   Over 7 days: {stats.overdue}
//                 </span>
//                 <span className="px-2 py-0.5 bg-green-50 text-green-600 rounded-full font-medium whitespace-nowrap">
//                   Received today: {stats.receivedToday}
//                 </span>
//               </div>
//             </div>

//             <div className="flex flex-wrap items-center justify-between mb-3 gap-2">
//               <div className="flex gap-2">
//                 {/* ✅ Overdue & Fee Pending Buttons: Hamesha dikhenge (Dono tabs me) */}
//                 <button className="flex items-center gap-1 px-2.5 py-1 bg-red-50 border border-red-200 rounded text-red-600 hover:bg-red-100 transition-colors text-xs font-medium">
//                   <IoMdTime className="text-rose-500 text-sm" />
//                   Overdue &gt; 7 days ({data?.older7DaysDueCount ?? 0})
//                 </button>
//                 <button className="px-2.5 py-1 bg-orange-50 border border-orange-200 rounded text-orange-600 hover:bg-orange-100 transition-colors text-xs font-medium">
//                   ₹ Fee Pending {data?.feePending ?? 0}
//                 </button>
//               </div>

//               {/* Toggle Buttons */}
//               <div className="flex bg-gray-100 p-1 rounded-md">
//                 <button
//                   onClick={() => {
//                     setActiveTabType("new"); 
//                     setSearchQuery(""); 
//                     setSearchYear("");
//                   }}
//                   className={`px-4 py-1 text-xs font-semibold rounded-md transition-all duration-200 ${
//                     activeTabType === "new"
//                       ? "bg-white text-blue-600 shadow-sm"
//                       : "text-gray-500 hover:text-gray-700"
//                   }`}
//                 >
//                   New
//                 </button>
//                 <button
//                   onClick={() => {
//                     setActiveTabType("old"); 
//                     setSearchQuery(""); 
//                     setSearchYear("");
//                   }}
//                   className={`px-4 py-1 text-xs font-semibold rounded-md transition-all duration-200 ${
//                     activeTabType === "old"
//                       ? "bg-white text-blue-600 shadow-sm"
//                       : "text-gray-500 hover:text-gray-700"
//                   }`}
//                 >
//                   Old
//                 </button>
//               </div>
//             </div>

//             {/* SEARCH ROW (Changes based on Tab) */}
//             <div className="flex flex-wrap gap-2 mb-3">
//               {activeTabType === "new" ? (
//                 <div className="relative flex-1 min-w-[200px]">
//                   <IoSearchOutline className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
//                   <input
//                     type="text"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className="kruti-input w-full border border-gray-300 rounded-md pl-8 pr-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder:!font-sans placeholder:!text-gray-500 placeholder:!text-sm"
//                     placeholder="Search current data..."
//                   />
//                 </div>
//               ) : (
//                 <>
//                   <div className="relative flex-1 min-w-[200px]">
//                     <IoSearchOutline className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
//                     <input
//                       type="text"
//                       value={searchQuery}
//                       onChange={(e) => setSearchQuery(e.target.value)}
//                       className="kruti-input w-full border border-gray-300 rounded-md pl-8 pr-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder:!font-sans placeholder:!text-gray-500 placeholder:!text-sm"
//                       placeholder="Enter File No."
//                     />
//                   </div>
//                   <select
//                     className="border border-gray-300 px-3 py-1.5 rounded-md text-sm outline-none focus:ring-1 focus:ring-blue-500"
//                     value={searchYear}
//                     onChange={(e) => setSearchYear(e.target.value)}
//                   >
//                     <option value="">Year</option>
//                     {years.map(year => (
//                       <option key={year} value={year}>{year}</option>
//                     ))}
//                   </select>
//                   <button
//                     onClick={handleSearch}
//                     disabled={isSearching}
//                     className="bg-blue-600 text-white px-5 py-1.5 rounded-md text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
//                   >
//                     {isSearching ? "Searching..." : "Search"}
//                   </button>
//                 </>
//               )}
//             </div>

//             {/* ✅ DROPDOWNS ROW (Always Visible for both Tabs) */}
//             <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 text-xs">
//               <div className="grid grid-cols-2 sm:grid-cols-2 lg:flex lg:flex-row gap-2">
//                 <select
//                   className="border border-gray-300 px-2 py-1 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
//                   value={selectedStatus}
//                   onChange={(e) => setSelectedStatus(e.target.value)}>
//                   <option value="">Status: All</option>
//                   <option value="In Progress">In Progress</option>
//                   <option value="Disposed Accepted">Disposed Accepted</option>
//                   <option value="Rejected">Rejected</option>
//                   <option value="Under Investigation">Under Investigation</option>
//                 </select>

//                 <select
//                   disabled={districtLoading}
//                   value={selectedDistrict}
//                   onChange={(e) => setSelectedDistrict(e.target.value)}
//                   className={`border border-gray-300 px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${
//                     selectedDistrict ? "kruti-input text-[16px]" : "text-xs font-sans"
//                   }`}
//                 >
//                   <option value="" className="font-sans text-xs">District: All</option>
//                   {districtData?.map((item) => (
//                     <option key={item.id} value={item.dist_new || item.district_name || item.name} className="kruti-input text-[16px]">
//                       {item.dist_new || item.district_name || item.name}
//                     </option>
//                   ))}
//                 </select>

//                 <select 
//                   className="border border-gray-300 px-2 py-1 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
//                   value={selectedFeeStatus}
//                   onChange={(e) => setSelectedFeeStatus(e.target.value)}
//                 >
//                   <option value="">Fee Status: All</option>
//                   <option value="0">Pending</option>
//                   <option value="2">Partial</option>
//                   <option value="1">Paid</option>
//                   <option value="3">Exempted</option>
//                 </select>

//                 <select
//                   className="border border-gray-300 px-2 py-1 rounded-md text-xs"
//                   value={selectedNature}
//                   onChange={(e) => setSelectedNature(e.target.value)}
//                 >
//                   <option value="">Nature: All</option>
//                   <option value="complaint">Complaint</option>
//                   <option value="assertion">Assertion</option>
//                 </select>

//                 <select
//                   value={selectedCaseType}
//                   onChange={(e) => setSelectedCaseType(e.target.value)}
//                   className="border border-gray-300 px-2 py-1 rounded-md text-xs"
//                 >
//                   <option value="">Case Type: All</option>
//                   <option value="new">New Case</option>
//                   <option value="old">Old Case</option>
// <option value="today">Today's Case</option>
//                 </select>
//               </div>

//               <div className="flex items-center gap-2">
//                 <span className="text-gray-600 text-xs whitespace-nowrap">Sort by:</span>
//                 <select
//                   className="border border-gray-300 px-2 py-1 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
//                   value={sortOrder}
//                   onChange={handleSortChange}
//                 >
//                    {/* <option value="">Received Date</option> */}
//                   <option value="asc">Ascending Order</option>
//                   <option value="desc">Decending Order</option>
//                 </select>
//               </div>
//             </div>
//           </div>

//           {/* LIST AREA WITH UNIFIED UI RENDERING */}
//           <div className="flex-1 overflow-y-auto">
//             {isLoading || isSearching ? (
//               <div className="flex items-center justify-center h-full">
//                 <h1 className="text-gray-600">{isSearching ? "Searching Old Records..." : "Loading..."}</h1>
//               </div>
//             ) : filteredComplaints?.length === 0 ? (
//               <div className="flex flex-col items-center justify-center h-full">
//                 {activeTabType === "old" && oldSearchData.length === 0 ? (
//                    <h1 className="text-gray-500 ">No Data found.</h1>
//                 ) : (
//                    <h1 className="text-gray-600">No Data Found.</h1>
//                 )}
//               </div>
//             ) : isError ? (
//               <div className="flex items-center justify-center h-full">
//                 <p className="text-red-500 text-sm">Error: {error?.message}</p>
//               </div>
//             ) : (
//               <div className="divide-y divide-gray-200">
//                 {currentComplaints.map((complaint) => (
//                   <div
//                     key={complaint.id}
//                     className="px-3 sm:px-4 py-3 hover:bg-gray-50 transition-colors"
//                   >
//                     <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
//                       <div className="flex-1 min-w-0 w-full sm:w-auto">
//                         <p className="text-sm font-semibold text-gray-900 mb-1">
//                           File No. {complaint.complain_no}
//                         </p>
//                         <p className="text-xs text-gray-700 mb-1">
//                           <span className="text-[15px]">Description: </span>
//                           <span className="kruti-input">
//                                {limitTo50Words(complaint.complaint_description) ||"miyC/k ugha"}
//                           </span>
//                         </p>
//                         <div className="text-[11px] text-gray-600 mb-1">
//                           <span className="text-gray-500">Cause Date:</span>
//                           <span className="ml-1">{complaint.cause_date || "उपलब्ध नहीं"}</span>
//                           <span className="mx-1 text-gray-400">•</span>
//                           <span className="text-gray-500">Category:</span>
//                           <span className="ml-1">{complaint.category || "उपलब्ध नहीं"}</span>
//                         </div>
//                         <div className="text-[10px] text-gray-400">
//                           Received: {new Date(complaint.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} • 
//                           Last action: {new Date(complaint.updated_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
//                         </div>
//                       </div>

//                       <div className="flex flex-col items-start sm:items-end gap-2 flex-shrink-0 w-full sm:w-auto">
//                         <div className="flex gap-1.5">
//                           <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[11px] font-medium whitespace-nowrap">
//                               {complaint.case_type == 1 ? "New Case" : complaint.case_type == 2 ? "Old Case" : "New Case"}
//                           </span>
//                           <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-[11px] font-medium whitespace-nowrap">
//                              {complaint.approved_rejected_by_rk === 0 && complaint.approved_rejected_by_lokayukt === 0 ? "Record Section"
//                                : complaint.approved_rejected_by_rk === 1 && complaint.approved_rejected_by_lokayukt != 1 ? "With Lokayukta"
//                                : complaint.approved_rejected_by_rk === 1 && complaint.approved_rejected_by_lokayukt === 1 ? "With UpLokayukta"
//                                : "Record Section"} 
//                           </span>
//                         </div>
//                         <div className="flex gap-1.5">
//                           <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded text-[11px] font-medium">
//                             {getDaysDifference(complaint.created_at)}d
//                           </span>
//                           <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${complaint.fee_exempted === 0 ? "bg-green-50 text-blue-600" : complaint.fee_exempted === 1 ? "bg-orange-50 text-orange-600" : "bg-blue-50 text-orange-400"}`}>
//                             {complaint.fee_exempted === 3 ? "Exempted" : complaint.fee_exempted === 1 ? "Paid" : complaint.fee_exempted === 2 ? "Partial" : "Pending"}
//                           </span>
//                         </div>
//                         <div className="flex gap-2 w-full sm:w-auto">
//                           <button onClick={(e) => handleViewDetails(e, complaint.id)} className="flex-1 sm:flex-none px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md font-medium whitespace-nowrap">
//                             View Details
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <Pagination
//         currentPage={currentPage}
//         totalPages={totalPages}
//         onPageChange={setCurrentPage}
//         totalItems={filteredComplaints.length}
//         itemsPerPage={itemsPerPage}
//       />

//       {isConfirmModalOpen && (
//         <div className="fixed inset-0 z-50 overflow-auto bg-black/50 flex justify-center items-center p-4">
//           <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
//             <div className="p-4 sm:p-6">
//               <div className="flex items-center mb-4">
//                 <div className="flex-shrink-0">
//                   <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
//                     <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                     </svg>
//                   </div>
//                 </div>
//                 <div className="ml-4">
//                   <h3 className="text-base sm:text-lg font-medium text-gray-900">Confirm Approval</h3>
//                   <p className="text-xs sm:text-sm text-gray-500">Are you sure you want to approve this complaint?</p>
//                 </div>
//               </div>
//               <div className="flex gap-3">
//                 <button onClick={handleCancelApproval} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm">Cancel</button>
//                 <button onClick={handleConfirmApproval} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
//                    {isApproving ? "Approving..." : "Yes, Approve"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default AllComplaints;












import React, { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Toaster, toast } from "react-hot-toast";
import Cookies from "js-cookie";

import "react-toastify/dist/ReactToastify.css";
import { IoMdTime } from "react-icons/io";
import { krutiToUnicode } from "../../../components/utils/krutiToUnicode";
import { unicodeToKrutiDev } from "../../../components/utils/unicodeToKruti";

import Pagination from "../../Pagination";

const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";
const token = Cookies.get("access_token");

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

const AllComplaints = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Data States
  const [allComplaints, setAllComplaints] = useState([]); // Holds "New" tab data
  const [oldSearchData, setOldSearchData] = useState([]); // Holds "Old" tab API search data
  const [filteredComplaints, setFilteredComplaints] = useState([]); // Holds final displayed data

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [complaintToApprove, setComplaintToApprove] = useState(null);
  const [isApproving, setIsApproving] = useState(false);

  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedFeeStatus, setSelectedFeeStatus] = useState("");
  const [selectedCaseType, setSelectedCaseType] = useState("");
  const [selectedNature, setSelectedNature] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  const [activeTabType, setActiveTabType] = useState("new"); 

  // ✅ Old Tab Search states
  const [searchYear, setSearchYear] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentComplaints = filteredComplaints.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);

  const getAllComplaints = async () => {
    const res = await api.get("/operator/all-approved-complaints");
    return res.data;
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["all-approved-complaints", location.pathname],
    queryFn: getAllComplaints,
  });

  const stats = {
    overdue: data?.older7DaysCount ?? 0,
    receivedToday: data?.todayCount ?? 0,
  };

  const getDistrict = async () => {
    const res = await api.get("/operator/all-district");
    return res.data.data;
  };

  const { data: districtData, isLoading: districtLoading } = useQuery({
    queryKey: ["district-api"],
    queryFn: getDistrict,
  });

  // ✅ Search Function for OLD Tab (API Call)
  const handleSearch = async () => {
    if (!searchQuery && !searchYear) {
      toast.error("Please enter a Complain No or select a Year to search.");
      return;
    }

    try {
      setIsSearching(true);
      const payload = {};
      if (searchQuery) payload.complain_no = searchQuery;
      if (searchYear) payload.year = searchYear;

      const response = await api.get("/operator/search-complaints", { params: payload });
      
      let searchData = [];
      if (response.data && Array.isArray(response.data)) {
        searchData = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        searchData = response.data.data;
      } else if (response.data?.data) {
        searchData = [response.data.data]; 
      }

      setOldSearchData(searchData); 
      if(searchData.length === 0) {
         toast.info("कोई पुराना रिकॉर्ड नहीं मिला।");
      }

    } catch (err) {
      console.error("Search API Error:", err);
      toast.error("सर्च करने में विफल");
      setOldSearchData([]);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    let complaintsList = data?.data || data || [];
    if (Array.isArray(complaintsList)) {
      setAllComplaints(complaintsList);
    }
  }, [data]);

  
  // ✅ UNIFIED FRONTEND FILTERING LOGIC (Works on BOTH New and Old Data)
  useEffect(() => {
    const baseData = activeTabType === "new" ? allComplaints : oldSearchData;
    
    if (!baseData) return;

    let filtered = [...baseData];

    // Local Text Filtering (Only for 'New' tab, because 'Old' tab uses searchQuery for API call)
    if (activeTabType === "new" && searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim();
      const queryFromKruti = krutiToUnicode(searchQuery).toLowerCase().trim();
      const queryToKruti = unicodeToKrutiDev(searchQuery).trim(); 

      filtered = filtered.filter((complaint) => {
        const match = (val) => {
            if (!val) return false;
            const strVal = String(val).toLowerCase(); 
            const strValOriginal = String(val); 
            return (strVal.includes(query) || strVal.includes(queryFromKruti) || strValOriginal.includes(queryToKruti));
        };
        return (match(complaint.complainantName) || match(complaint.respondentName) || match(complaint.complain_no));
      });
    }

    // Common Filters (Applies to both New & Old Data)
    if (selectedDistrict !== "") {
      filtered = filtered.filter((complaint) => {
        const dataDistrict = complaint.dist_new || complaint.district_name || complaint.DISTT;
        if (!dataDistrict) return false;
        return String(dataDistrict).toLowerCase().trim() === selectedDistrict.toLowerCase().trim();
      });
    }

    if (selectedStatus !== "") {
      filtered = filtered.filter((complaint) => complaint.status === selectedStatus);
    }

    if (selectedFeeStatus !== "") {
      filtered = filtered.filter((complaint) => complaint.fee_exempted?.toString() === selectedFeeStatus);
    }

    if (selectedNature !== "") {
      filtered = filtered.filter((complaint) =>
        String(complaint.category || complaint.NATURE || "").toLowerCase().trim() === selectedNature.toLowerCase().trim()
      );
    }

    if (selectedCaseType === "new") {
      filtered = filtered.filter((complaint) => complaint.case_type == 1);
    }

    if (selectedCaseType === "old") {
      filtered = filtered.filter((complaint) => complaint.case_type == 2);
    }

    if (selectedCaseType === "today") {
      const today = new Date().toDateString();
      filtered = filtered.filter((complaint) => new Date(complaint.created_at || complaint.ENROLL_DT).toDateString() === today);
    }

    const sorted = [...filtered].sort((a, b) => {
      if (!sortOrder) return 0;
      const dateA = new Date(a.created_at || a.ENROLL_DT || 0);
      const dateB = new Date(b.created_at || b.ENROLL_DT || 0);
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

    setFilteredComplaints(sorted);
    setCurrentPage(1);

  }, [
    searchQuery,
    allComplaints,
    oldSearchData, 
    selectedDistrict,
    selectedStatus,
    selectedFeeStatus,
    selectedNature,
    selectedCaseType,
    sortOrder,
    activeTabType 
  ]);

  
  const handleViewDetails = (e, complaintId) => {
    e.stopPropagation();
    navigate(`view/${complaintId}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handleApproveClick = (e, complaint) => {
    e.stopPropagation();
    setComplaintToApprove(complaint);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmApproval = async () => {
    if (!complaintToApprove) return;
    setIsApproving(true);
    try {
      const response = await api.post(`/operator/approved-by-ro/${complaintToApprove.id}`);
      if (response.data.success || response.status === 200) {
        toast.success("Send To Lokayukt Successfully!");
        refetch();
      } else {
        toast.error("Failed to approve complaint");
      }
    } catch (error) {
      console.error("Approval Error:", error);
      toast.error("Failed to approve complaint");
    } finally {
      setIsApproving(false);
      setIsConfirmModalOpen(false);
      setComplaintToApprove(null);
    }
  };

  const handleCancelApproval = () => {
    setIsConfirmModalOpen(false);
    setComplaintToApprove(null);
  };

 function limitTo50Letters(text) {
    if (!text) return "";
    
    // Agar text 50 letters se chota ya barabar hai, toh waise hi return kar do
    if (text.length <= 50) {
      return text;
    }
    
    // Sirf 50 letters cut karke return karega (dots hum JSX me alag se lagayenge)
    return text.substring(0, 50);
  }

  const getDaysDifference = (date) => {
    if (!date) return 0;
    const created = new Date(date);
    const today = new Date();
    const diffTime = today - created; 
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1997 + 1 }, (_, i) => currentYear - i);

  return (
    <>
      <Toaster position="top-right" />

      <div className="w-full h-screen flex bg-gray-50 rounded-md overflow-hidden">
        <div className="w-full bg-white flex flex-col overflow-hidden">
          
          <div className="px-3 sm:px-4 py-3 border-b flex-shrink-0 bg-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
              <h2 className="text-base sm:text-lg font-bold text-gray-900">Sent</h2>
              
              {/* ✅ Inbox Stats: Hamesha dikhega (Dono tabs me) */}
              {/* <div className="flex flex-wrap gap-1.5 sm:gap-2 text-[10px] sm:text-xs">
                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full font-medium whitespace-nowrap">
                  Inbox: {allComplaints.length}
                </span>
                <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded-full font-medium whitespace-nowrap">
                  Over 7 days: {stats.overdue}
                </span>
                <span className="px-2 py-0.5 bg-green-50 text-green-600 rounded-full font-medium whitespace-nowrap">
                  Received today: {stats.receivedToday}
                </span>
              </div> */}
            </div>

            <div className="flex flex-wrap items-center justify-between mb-3 gap-2">
              <div className="flex gap-2">
                {/* ✅ Overdue & Fee Pending Buttons: Hamesha dikhenge (Dono tabs me) */}
                <button className="flex items-center gap-1 px-2.5 py-1 bg-red-50 border border-red-200 rounded text-red-600 hover:bg-red-100 transition-colors text-xs font-medium">
                  <IoMdTime className="text-rose-500 text-sm" />
                  Overdue &gt; 7 days ({data?.older7DaysDueCount ?? 0})
                </button>
                <button className="px-2.5 py-1 bg-orange-50 border border-orange-200 rounded text-orange-600 hover:bg-orange-100 transition-colors text-xs font-medium">
                  ₹ Fee Pending {data?.feePending ?? 0}
                </button>
              </div>

              {/* Toggle Buttons */}
              <div className="flex bg-gray-100 p-1 rounded-md">
                <button
                  onClick={() => {
                    setActiveTabType("new"); 
                    setSearchQuery(""); 
                    setSearchYear("");
                  }}
                  className={`px-4 py-1 text-xs font-semibold rounded-md transition-all duration-200 ${
                    activeTabType === "new"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  New
                </button>
                <button
                  onClick={() => {
                    setActiveTabType("old"); 
                    setSearchQuery(""); 
                    setSearchYear("");
                  }}
                  className={`px-4 py-1 text-xs font-semibold rounded-md transition-all duration-200 ${
                    activeTabType === "old"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Old
                </button>
              </div>
            </div>

            {/* SEARCH ROW (Changes based on Tab) */}
            <div className="flex flex-wrap gap-2 mb-3">
              {activeTabType === "new" ? (
                <div className="relative flex-1 min-w-[200px]">
                  <IoSearchOutline className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="kruti-input w-full border border-gray-300 rounded-md pl-8 pr-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder:!font-sans placeholder:!text-gray-500 placeholder:!text-sm"
                    placeholder="Search current data..."
                  />
                </div>
              ) : (
                <>
                  <div className="relative flex-1 min-w-[200px]">
                    <IoSearchOutline className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="kruti-input w-full border border-gray-300 rounded-md pl-8 pr-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder:!font-sans placeholder:!text-gray-500 placeholder:!text-sm"
                      placeholder="Enter File No."
                    />
                  </div>
                  <select
                    className="border border-gray-300 px-3 py-1.5 rounded-md text-sm outline-none focus:ring-1 focus:ring-blue-500"
                    value={searchYear}
                    onChange={(e) => setSearchYear(e.target.value)}
                  >
                    <option value="">Year</option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="bg-blue-600 text-white px-5 py-1.5 rounded-md text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isSearching ? "Searching..." : "Search"}
                  </button>
                </>
              )}
            </div>

            {/* ✅ DROPDOWNS ROW (Always Visible for both Tabs) */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:flex lg:flex-row gap-2">
                <select
                  className="border border-gray-300 px-2 py-1 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}>
                  <option value="">Status: All</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Disposed Accepted">Disposed Accepted</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Under Investigation">Under Investigation</option>
                </select>

                <select
                  disabled={districtLoading}
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className={`border border-gray-300 px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${
                    selectedDistrict ? "kruti-input text-[16px]" : "text-xs font-sans"
                  }`}
                >
                  <option value="" className="font-sans text-xs">District: All</option>
                  {districtData?.map((item) => (
                    <option key={item.id} value={item.dist_new || item.district_name || item.name} className="kruti-input text-[16px]">
                      {item.dist_new || item.district_name || item.name}
                    </option>
                  ))}
                </select>

                {/* <select 
                  className="border border-gray-300 px-2 py-1 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                  value={selectedFeeStatus}
                  onChange={(e) => setSelectedFeeStatus(e.target.value)}
                >
                  <option value="">Fee Status: All</option>
                  <option value="0">Pending</option>
                  <option value="2">Partial</option>
                  <option value="1">Paid</option>
                  <option value="3">Exempted</option>
                </select> */}

                <select
                  className="border border-gray-300 px-2 py-1 rounded-md text-xs"
                  value={selectedNature}
                  onChange={(e) => setSelectedNature(e.target.value)}
                >
                   <option value="">Nature: All</option>
                 <option value="complaint">शिकायत</option>
                  <option value="assertion">अभिकथन</option>
                </select>

                <select
                  value={selectedCaseType}
                  onChange={(e) => setSelectedCaseType(e.target.value)}
                  className="border border-gray-300 px-2 py-1 rounded-md text-xs"
                >
                  <option value="">Case Type: All</option>
                  <option value="new">New Case</option>
                  <option value="old">Old Case</option>
<option value="today">Today's Case</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-gray-600 text-xs whitespace-nowrap">Sort by:</span>
                <select
                  className="border border-gray-300 px-2 py-1 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                  value={sortOrder}
                  onChange={handleSortChange}
                >
                   {/* <option value="">Received Date</option> */}
                <option value="desc">Newest First</option>
<option value="asc">Oldest First</option>
                </select>
              </div>
            </div>
          </div>

          {/* LIST AREA WITH UNIFIED UI RENDERING */}
          <div className="flex-1 overflow-y-auto">
            {isLoading || isSearching ? (
              <div className="flex items-center justify-center h-full">
                <h1 className="text-gray-600">{isSearching ? "Searching Old Records..." : "Loading..."}</h1>
              </div>
            ) : filteredComplaints?.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full">
                {activeTabType === "old" && oldSearchData.length === 0 ? (
                   <h1 className="text-gray-500 ">No Data found.</h1>
                ) : (
                   <h1 className="text-gray-600">No Data Found.</h1>
                )}
              </div>
            ) : isError ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-red-500 text-sm">Error: {error?.message}</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {currentComplaints.map((complaint) => (
                  <div
                    key={complaint.id}
                    className="px-3 sm:px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    {/* 👇 CONDITION: SIRF OLD DATA KA VIEW BADLA HAI, NEW WALA AS IT IS HAI */}
                    {activeTabType === "new" ? (
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
                        <div className="flex-1 min-w-0 w-full sm:w-auto">
                          <p className="text-sm font-semibold text-gray-900 mb-1">
                            File No. {complaint.complain_no}
                          </p>
                          <p className="text-xs text-gray-700 mb-1">
                          <span className="text-[15px]">Description: </span>
                          <span className="kruti-input">
                            {limitTo50Letters(complaint.complaint_description) ||"miyC/k ugha"}
                          </span>
                          {/* Ye condition check karegi ki agar text 50 se bada hai, tabhi aage normal font me ... lagaye */}
                          {complaint.complaint_description && complaint.complaint_description.length > 50 && (
                            <span className="font-sans font-bold tracking-widest text-gray-700">...</span>
                          )}
                        </p>
                          <div className="text-[11px] text-gray-600 mb-1">
                            <span className="text-gray-500">Cause Date:</span>
                            <span className="ml-1">{complaint.cause_date || "उपलब्ध नहीं"}</span>
                            <span className="mx-1 text-gray-400">•</span>
                            <span className="text-gray-500">Category:</span>
                            <span className="ml-1">{complaint.category || "उपलब्ध नहीं"}</span>
                          </div>
                          <div className="text-[10px] text-gray-400">
                            Received: {new Date(complaint.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} • 
                            Last action: {new Date(complaint.updated_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                          </div>
                        </div>

                        <div className="flex flex-col items-start sm:items-end gap-2 flex-shrink-0 w-full sm:w-auto">
                          <div className="flex gap-1.5">
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[11px] font-medium whitespace-nowrap">
                                {complaint.case_type == 1 ? "New Case" : complaint.case_type == 2 ? "Old Case" : "New Case"}
                            </span>
                            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-[11px] font-medium whitespace-nowrap">
                               {complaint.approved_rejected_by_rk === 0 && complaint.approved_rejected_by_lokayukt === 0 ? "Record Section"
                                 : complaint.approved_rejected_by_rk === 1 && complaint.approved_rejected_by_lokayukt != 1 ? "With Lokayukta"
                                 : complaint.approved_rejected_by_rk === 1 && complaint.approved_rejected_by_lokayukt === 1 ? "With UpLokayukta"
                                 : "Record Section"} 
                            </span>
                          </div>
                          <div className="flex gap-1.5">
                            <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded text-[11px] font-medium">
                              {getDaysDifference(complaint.created_at)}d
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${complaint.fee_exempted === 0 ? "bg-green-50 text-blue-600" : complaint.fee_exempted === 1 ? "bg-orange-50 text-orange-600" : "bg-blue-50 text-orange-400"}`}>
                              {complaint.fee_exempted === 3 ? "Exempted" : complaint.fee_exempted === 1 ? "Paid" : complaint.fee_exempted === 2 ? "Partial" : "Pending"}
                            </span>
                          </div>
                          <div className="flex gap-2 w-full sm:w-auto">
                            <button onClick={(e) => handleViewDetails(e, complaint.id)} className="flex-1 sm:flex-none px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md font-medium whitespace-nowrap">
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // 👇 OLD TAB WALA DATA BINDING YAHA HAI (New tab safe hai)
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
                        <div className="flex-1 min-w-0 w-full sm:w-auto">
                          <p className="text-sm font-semibold text-gray-900 mb-1">
                            File No. {complaint.COMP_NO} {complaint.YEAR1 ? `(${complaint.YEAR1})` : ""}
                          </p>
                          <p className="text-xs text-gray-700 mb-1">
                            <span className="text-[15px]">Subject: </span>
                            <span className="kruti-input">
                                 {limitTo50Letters(`${complaint.SUB1 || ""} ${complaint.SUB2 || ""} ${complaint.SUB3 || ""}`) ||"miyC/k ugha"}
                            </span>
                          </p>
                          <div className="text-[11px] text-gray-600 mb-1">
                            <span className="text-gray-500">Complainant:</span>
                            <span className="ml-1 kruti-input">{complaint.COMP_NM || "उपलब्ध नहीं"}</span>
                            <span className="mx-1 text-gray-400">•</span>
                            <span className="text-gray-500">Complaint Date:</span>
                            <span className="ml-1">{complaint.COMP_DT ? new Date(complaint.COMP_DT).toLocaleDateString("en-GB") : "उपलब्ध नहीं"}</span>
                          </div>
                          <div className="text-[10px] text-gray-400">
                            Enrolled: {complaint.ENROLL_DT ? new Date(complaint.ENROLL_DT).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "उपलब्ध नहीं"}
                          </div>
                        </div>

                        <div className="flex flex-col items-start sm:items-end gap-2 flex-shrink-0 w-full sm:w-auto">
                          <div className="flex gap-1.5">
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[11px] font-medium whitespace-nowrap">
                                Old Case
                            </span>
                            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-[11px] font-medium whitespace-nowrap">
                                {complaint.DISPOSE === 1 ? "Disposed" : "Pending"}
                            </span>
                          </div>
                          <div className="flex gap-1.5">
                            <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded text-[11px] font-medium">
                              {complaint.ENROLL_DT ? getDaysDifference(complaint.ENROLL_DT) : 0}d
                            </span>
                          </div>
                          <div className="flex gap-2 w-full sm:w-auto">
                             <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`view-old-complaint/${complaint.id}`);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }} 
                          className="flex-1 sm:flex-none px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md font-medium whitespace-nowrap"
                        >
                          View Details
                        </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filteredComplaints.length}
        itemsPerPage={itemsPerPage}
      />

      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black/50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-4 sm:p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-base sm:text-lg font-medium text-gray-900">Confirm Approval</h3>
                  <p className="text-xs sm:text-sm text-gray-500">Are you sure you want to approve this complaint?</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={handleCancelApproval} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm">Cancel</button>
                <button onClick={handleConfirmApproval} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                   {isApproving ? "Approving..." : "Yes, Approve"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AllComplaints;