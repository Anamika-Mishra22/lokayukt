import React, { useState } from "react";
import { FaSearch, FaSpinner, FaPaperPlane, FaTimes } from "react-icons/fa";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Pagination from "../Pagination"; 

const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";
const token = Cookies.get("access_token");

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

const RequestComplain = () => {
  const navigate = useNavigate();

  // Filter States
  const [compFile, setCompFile] = useState(""); 
  const [corrResp, setCorrResp] = useState(""); 
  const [year, setYear] = useState("");
  const [district, setDistrict] = useState("");

  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [complainantSearch, setComplainantSearch] = useState("");
const [respondentSearch, setRespondentSearch] = useState("");

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10); 

  // Add Request Modal States
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedCompId, setSelectedCompId] = useState(null);
  const [reason, setReason] = useState("Complainant"); // Default select
  const [remark, setRemark] = useState("");
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);

  // Fetch Districts
  const { data: districtsList, isLoading: loadingDistricts } = useQuery({
    queryKey: ["districts-list"],
    queryFn: async () => {
      const res = await api.get("/aps/all-district");
      return res.data.data || [];
    }
  });

  // 🔍 Search Data (GET API)
  const handleSearch = async (page = 1) => {
    setIsLoading(true);
    
    try {
      // ✅ Payload mapping tumhare naye Laravel Search Function ke hisaab se
      const queryParams = {
        complaint_id: compFile, // Mapped to backend: $request->complaint_id
        district: district,     // Mapped to backend: $request->district
        search: corrResp,       // Mapped to backend: $request->search (Global Search)
        page: page 
      };

      // Nayi Search API Endpoint
      const response = await api.get("/aps/search-request-complaint", {
        params: queryParams
      });

      if (response.data.status === true || response.data.status === "success") {
        const paginationData = response.data.data; 
        const fetchedData = paginationData?.data || paginationData || []; 

        setResults(fetchedData);
        setCurrentPage(paginationData?.current_page || 1);
        setTotalPages(paginationData?.last_page || 1);
        setTotalItems(paginationData?.total || fetchedData.length || 0);
        setItemsPerPage(paginationData?.per_page || 10);
        
        if (fetchedData.length === 0 && page === 1) {
          toast.success("No records found for this search.");
        }
      } else {
        setResults([]);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Search Error:", error);
      toast.error("Failed to fetch search results");
      setResults([]);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  };


  const filteredResults = results.filter((item) => {
  const complainant = item.complainant_name?.toLowerCase() || "";
  const respondent = item.respondent_name?.toLowerCase() || "";

  const compSearch = complainantSearch.toLowerCase();
  const respSearch = respondentSearch.toLowerCase();

  return (
    complainant.includes(compSearch) &&
    respondent.includes(respSearch)
  );
});


  const formatDate = (dateString) => {
    if (!dateString) return "उपलब्ध नहीं";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const openRequestModal = (id) => {
    setSelectedCompId(id);
    setReason("Complainant"); // Reset reason
    setRemark("");            // Reset remark
    setIsRequestModalOpen(true);
  };

  // ✉️ Add Request Submit (POST API)
  const handleRequestSubmit = async () => {
    if (!remark.trim()) {
      toast.error("Please enter a remark!");
      return;
    }

    setIsSubmittingRequest(true);
    try {
      // API me Auth token jaa raha hai, par agar backend user_id maang raha hai
      // toh localStorage se id nikal kar yaha pass karni padegi.
      // const currentUserId = Cookies.get("user_id") || 1; 

      // ✅ Nayi Add Request API Endpoint
      const response = await api.post("/aps/add-request-complaint", {
        // user_id: currentUserId,       // Backend Validation: required|integer
        complaint_id: selectedCompId, // Backend Validation: required|integer
        reason: reason,               // Backend Validation: required
        remark: remark,               // Backend Validation: required|string
      });

      if (response.data.status === true || response.data.status === 'success' || response.status === 200) {
        toast.success(response.data.message || "Request created successfully!");
        setIsRequestModalOpen(false);
        setRemark("");
        setReason("Complainant");
        setSelectedCompId(null);
      } else {
        toast.error(response.data.message || "Failed to submit request.");
      }
    } catch (error) {
      console.error("Submit Error:", error);
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen relative">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-sm p-4">
        
        <h2 className="text-base sm:text-lg font-bold mb-4 text-gray-900 whitespace-nowrap">
         Request Complaint File
        </h2>
        
        {/* Filters Section */}
        <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 items-end w-full">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Complaint ID / File No</label>
              <input
                type="text"
                placeholder="ID या फ़ाइल संख्या"
                value={compFile}
                onChange={(e) => setCompFile(e.target.value.replace(/[^0-9/-]/g, ""))}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Year</label>
              <input
                type="number"
                placeholder="YYYY"
                min="1990"
                max="2099"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Global Search</label>
              <input
                type="text"
                placeholder="नाम से खोजें"
                value={corrResp}
                onChange={(e) => setCorrResp(e.target.value)}
                className="w-full px-3 py-1 kruti-input text-lg placeholder:text-sm placeholder:font-sans border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div> */}

            <div>
  <label className="block text-xs font-medium text-gray-600 mb-1">
    Complainant Search
  </label>
  <input
    type="text"
    placeholder="f'kdk;rdrkZ ls [kkstsa"
    value={complainantSearch}
    onChange={(e) => setComplainantSearch(e.target.value)}
    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 kruti-input"
  />
</div>

<div>
  <label className="block text-xs font-medium text-gray-600 mb-1">
    Respondent Search
  </label>
  <input
    type="text"
    placeholder="izfroknh ls [kkstsa"
    value={respondentSearch}
    onChange={(e) => setRespondentSearch(e.target.value)}
    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 kruti-input"
  />
</div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">District</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${district ? "kruti-input text-[16px]" : "text-sm font-sans"}`}
              >
                <option value="" className="font-sans text-sm">All Districts</option>
                {!loadingDistricts && districtsList?.map((d) => (
                  <option key={d.district_code || d.id} value={d.district_code || d.id} className="kruti-input text-[16px]">
                    {d.district_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <button
                onClick={() => handleSearch(1)}
                disabled={isLoading}
                className={`w-full flex items-center justify-center gap-2 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors h-[38px] ${isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-sm"}`}
              >
                {isLoading ? <FaSpinner className="animate-spin" /> : <FaSearch className="text-sm" />}
                {isLoading ? "Searching..." : "Search"}
              </button>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto rounded-md border border-gray-200">
          <table className="min-w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 border-b">S.No</th>
                <th className="px-6 py-3 border-b">Comp. No / ID</th>
                <th className="px-6 py-3 border-b">Date</th>
                <th className="px-6 py-3 border-b">Complainant</th>
                <th className="px-6 py-3 border-b">Respondent</th>
                <th className="px-6 py-3 border-b">District</th>
                {/* <th className="px-6 py-3 border-b">Status</th> */}
                <th className="px-6 py-3 border-b text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                    Searching records...
                  </td>
                </tr>
              ) : filteredResults.length > 0 ? (
                filteredResults.map((item, index) => {
                  const serialNumber = (currentPage - 1) * itemsPerPage + index + 1;
                  
                  return (
                    <tr key={item.id || index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">{serialNumber}</td>
                      
                      {/* Backend c.* return kar raha hai, ya toh id hogi ya complain_no */}
                      <td className="px-6 py-4 font-medium text-blue-600 whitespace-nowrap">
                        {item.complain_no || item.id || "उपलब्ध नहीं"}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {formatDate(item.created_at)}
                      </td>

                      <td className="px-6 py-4 font-medium text-gray-800">
                        <span className="kruti-input text-[17px]">{item.complainant_name || item.name || "उपलब्ध नहीं"}</span>
                      </td>

                      <td className="px-6 py-4 font-medium text-gray-800">
                        <span className="kruti-input text-[17px]">{item.respondent_name || "miyC/k ugha"}</span>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                        <span className="kruti-input text-[17px]">{item.complainant_district || "miyC/k ugha"}</span>
                      </td>

                      {/* <td className="px-6 py-4 whitespace-nowrap">
                         <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">{item.status || "Pending"}</span>
                      </td> */}

                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => openRequestModal(item.id)}
                          className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded transition-colors w-full"
                        >
                          <FaPaperPlane />
                          Request
                        </button>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                    No records found. Please enter details and click Search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {results.length > 0 && totalPages > 1 && (
          <div className="mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => handleSearch(page)} 
              totalItems={totalItems}
              itemsPerPage={itemsPerPage} 
            />
          </div>
        )}
      </div>

      {/* ✅ Add Request Modal */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-slideDown">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FaPaperPlane className="text-green-600" />
                Add Request
              </h2>
              <button 
                onClick={() => setIsRequestModalOpen(false)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Reason Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason (कारण)
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
                  disabled={isSubmittingRequest}
                >
                  <option value="complainant">Complainant (शिकायतकर्ता)</option>
                  <option value="respondant">Respondent (प्रतिवादी)</option>
                  <option value="other">Other (अन्य)</option>
                </select>
              </div>

              {/* Remark Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Remark (टिप्पणी)
                </label>
                <textarea
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all kruti-input text-[18px]"
                  placeholder=""
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  disabled={isSubmittingRequest}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsRequestModalOpen(false)}
                disabled={isSubmittingRequest}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestSubmit}
                disabled={isSubmittingRequest}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-70"
              >
                {isSubmittingRequest ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestComplain;