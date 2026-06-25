import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaExclamationTriangle } from "react-icons/fa";
import { IoMdArrowBack } from "react-icons/io";
import { toast, Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import Notes from "./SubModule/Notes";
import Documents from "./SubModule/Documents";
import MovementHistory from "./SubModule/MovementHistory";

const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";
const token = Cookies.get("access_token");

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

const ViewOldComplaints = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [activeTab, setActiveTab] = useState("documents");

  // API Call to fetch Old Complaint Data
  const { data: complaintData, isLoading, isError, error } = useQuery({
    queryKey: ["old-complaint-details", id],
    queryFn: async () => {
      // Is API endpoint ko apne actual endpoint se replace kar lena
      const res = await api.get(`/operator/view-old-complaint/${id}`);
      
      // Kyunki data array format me hai { data: [{...}] }
     // Naya Code - Array aur Object dono ko handle karega
      if (res.data && res.data.data) {
        // Agar data array hai, toh pehla item return karo
        if (Array.isArray(res.data.data) && res.data.data.length > 0) {
          return res.data.data[0];
        } 
        // Agar data direct object hai (jaise naye JSON me), toh wahi return karo
        else if (typeof res.data.data === 'object' && !Array.isArray(res.data.data)) {
          return res.data.data;
        }
      }
      return null;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

  const getStatusColor = (status) => {
    // 0 = Pending, 1 = Disposed (Based on your old data structure)
    if (status === 1) {
      return "bg-green-100 text-green-800 border-green-200";
    }
    return "bg-blue-100 text-blue-800 border-blue-200";
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-gray-600">Loading Old Record...</h1>
        </div>
      </div>
    );
  }

  if (isError || !complaintData) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-medium">
            {error?.response?.data?.message || error?.message || "Error loading old complaint data"}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Complaints
          </button>
        </div>
      </div>
    );
  }

  // Combine subject lines
  const fullSubject = `${complaintData.SUB1 || ""} ${complaintData.SUB2 || ""} ${complaintData.SUB3 || ""}`.trim();
  // Combine Address lines
  const fullAddress = `${complaintData.ADD1 || ""} ${complaintData.ADD2 || ""} ${complaintData.ADD3 || ""}`.trim();

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <div className="w-full bg-white flex flex-col min-h-screen">
        <div className="p-4 md:p-6 border-b">
          
          {/* Mobile Header */}
          <div className="md:hidden mb-4">
            <div className="flex justify-between items-center mb-3">
              <button
                onClick={() => navigate(-1)}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center gap-1"
              >
                <IoMdArrowBack className="w-4 h-4" /> Back
              </button>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              File No. {complaintData.COMP_NO} {complaintData.YEAR1 ? `(${complaintData.YEAR1})` : ""}
              <span className="ml-2 text-blue-600 text-sm align-middle">(OLD CASE)</span>
            </h2>
            <div className="mt-2 mb-3">
              <span className={`px-3 py-1.5 text-xs rounded-full border ${getStatusColor(complaintData.DISPOSE)}`}>
                {complaintData.DISPOSE === 1 ? "Disposed" : "Pending"}
              </span>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden md:block">
            <div className="flex justify-between items-start mb-3">
              <h2 className="text-xl font-semibold text-gray-800">
                File No. {complaintData.COMP_NO} {complaintData.YEAR1 ? `(${complaintData.YEAR1})` : ""}
                <span className="ml-2 text-blue-600 text-sm align-middle">(OLD CASE)</span>
              </h2>

              <div className="flex gap-2 items-center">
                <span className={`px-3 py-1 rounded text-sm font-medium border ${getStatusColor(complaintData.DISPOSE)}`}>
                  {complaintData.DISPOSE === 1 ? "Disposed" : "Pending"}
                </span>

                <button
                  onClick={() => navigate(-1)}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center gap-1"
                >
                  <IoMdArrowBack className="w-4 h-4" /> Back
                </button>
              </div>
            </div>
          </div>

          {/* Subject / Description */}
          <div className="my-4 bg-gray-50 p-3 rounded-md border border-gray-100">
             <p className="text-[14px] text-black font-semibold">
                विषय / विवरण:{" "}
                <span className="text-gray-600 font-normal kruti-input text-lg ml-1">
                  {fullSubject || "miyC/k ugha."}
                </span>
              </p>
          </div>

          {/* ===== DETAILS GRID ===== */}
          <div className="space-y-6 mb-2 mt-4">
            
            {/* ----------------- मुख्य परिवादी का विवरण (Complainant) ----------------- */}
            <div>
              <h3 className="text-gray-900 text-[15px] font-bold mb-3 border-b pb-1">
                परिवादी का विवरण (Complainant Details)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <div>
                  <p className="text-[12px] text-gray-500 font-semibold uppercase mb-1">नाम (Name)</p>
                  <p className="kruti-input text-gray-800 text-lg">
                    {complaintData.COMP_NM || "miyC/k ugha"}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-[12px] text-gray-500 font-semibold uppercase mb-1">पता (Address)</p>
                  <p className="kruti-input text-gray-800 text-lg">
                    {fullAddress || "miyC/k ugha"}
                  </p>
                </div>
              </div>
            </div>

            {/* ----------------- मुख्य प्रतिवादी का विवरण (Respondent) ----------------- */}
            <div>
              <h3 className="text-gray-900 text-[15px] font-bold mb-3 border-b pb-1">
                प्रतिवादी का विवरण (Respondent Details)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <div>
                  <p className="text-[12px] text-gray-500 font-semibold uppercase mb-1">नाम (Name)</p>
                  <p className="kruti-input text-gray-800 text-lg">
                    {complaintData.OFF_NAME || "miyC/k ugha"}
                  </p>
                </div>
                <div>
                  <p className="text-[12px] text-gray-500 font-semibold uppercase mb-1">पद (Designation)</p>
                  <p className="kruti-input text-gray-800 text-lg">
                    {complaintData.OFF_DESG || "miyC/k ugha"}
                  </p>
                </div>
                <div>
                  <p className="text-[12px] text-gray-500 font-semibold uppercase mb-1">विभाग (Department ID)</p>
                  <p className=" kruti-input text-gray-800 text-sm font-medium">
                    {complaintData.department_name ||  "miyC/k ugha"}
                  </p>
                </div>
              </div>
            </div>

            {/* ----------------- अन्य विवरण (Other Details) ----------------- */}
            <div>
              <h3 className="text-gray-900 text-[15px] font-bold mb-3 border-b pb-1">
                अन्य विवरण (Other Details)
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                <div>
                  <p className="text-[12px] text-gray-500 font-semibold uppercase mb-1">शिकायत तिथि (Complaint Date)</p>
                  <p className="text-gray-800 text-sm font-medium">
                    {complaintData.COMP_DT ? new Date(complaintData.COMP_DT).toLocaleDateString("en-GB") : "उपलब्ध नहीं"}
                  </p>
                </div>
                <div>
                  <p className="text-[12px] text-gray-500 font-semibold uppercase mb-1">पंजीकरण तिथि (Enrollment Date)</p>
                  <p className="text-gray-800 text-sm font-medium">
                    {complaintData.ENROLL_DT ? new Date(complaintData.ENROLL_DT).toLocaleDateString("en-GB") : "उपलब्ध नहीं"}
                  </p>
                </div>
                <div>
                  <p className="text-[12px] text-gray-500 font-semibold uppercase mb-1">प्रकृति (Nature ID)</p>
                  <p className="text-gray-800 text-sm font-medium">
                    {complaintData.NATURE == 1 ? "अभिकथन": complaintData.NATURE == 2 ? "शिकायत"  : "उपलब्ध नहीं"}
                  </p>
                </div>
                <div>
                  <p className="text-[12px] text-gray-500 font-semibold uppercase mb-1">शुल्क (Security Amount)</p>
                  <p className="text-gray-800 text-sm font-medium">
                    ₹ {complaintData.SEC_AMT !== undefined ? complaintData.SEC_AMT : "0"}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ================= TABS NAVIGATION ================= */}
        
        {/* Mobile Tab Navigation */}
        <div className="md:hidden border-b bg-white">
          <div className="flex flex-col">
            {["documents", "notings", "movement"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-4 text-left text-sm font-medium ${
                  activeTab === tab
                    ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {tab === "documents" && "Documents"}
                {tab === "notings" && "Notes / Notings"}
                {tab === "movement" && "Movement History"}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop Tab Navigation */}
        <div className="hidden md:flex border-b px-6 bg-white">
          <div className="flex gap-6 overflow-x-auto">
            {["documents", "notings", "movement"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 pt-4 text-sm font-medium transition-colors relative whitespace-nowrap ${
                  activeTab === tab
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                {tab === "documents" && "Documents"}
                {tab === "notings" && "Notes / Notings"}
                {tab === "movement" && "Movement History"}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-gray-50">
          {activeTab === "documents" && (
            <Documents complaint={complaintData} />
          )}
          {activeTab === "notings" && (
             <Notes complaint={complaintData} />
          )}
          {activeTab === "movement" && (
            <MovementHistory complaint={complaintData} />
          )}
        </div>

      </div>
    </div>
  );
};

export default ViewOldComplaints;