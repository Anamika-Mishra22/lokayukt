import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaExclamationTriangle, FaTimes, FaSpinner } from "react-icons/fa";
import { IoMdArrowBack } from "react-icons/io";
import { FiSend } from "react-icons/fi";
import { toast, Toaster } from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";

import Documents from "./SubModule/Documents"; 
import Notes from "./SubModule/Notes";
import MovementHistory from "../SubModule/MovementHistory";

const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";
const token = Cookies.get("access_token");

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

const ViewSend = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("documents");
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  
  const [selectedForwardTo, setSelectedForwardTo] = useState("");

const getUserLabel = (option) => {
  if (!option) return "";

  const name =
    option.name ||
    option.user_name ||
    `User ${option.id}`;

  const role =
    option.role_name?.toLowerCase() ||
    option.role?.name?.toLowerCase();

  let label = "";

  // ✅ Supervisor → sub_role
  if (role === "supervisor" && option.sub_role?.label) {
    label = option.sub_role.label;
  }

  // ✅ PS
  else if (role === "ps" && !option.sub_role) {
    label = "Private Secretary";
  }

  // ✅ APS
  else if (role === "aps" && !option.sub_role) {
    label = "Additional Private Secretary";
  }

  // ✅ fallback sub_role
  else if (option.sub_role?.label) {
    label = option.sub_role.label;
  }

  // ✅ normal role
  else if (option.role?.label) {
    label = option.role.label;
  }

  return label ? `${name} (${label})` : name;
};

  // --- FETCH LETTER DETAILS ---
  // (यहाँ मैंने '/supervisor/view-letter-record' लगाया है, अगर आपकी API का नाम अलग है तो बदल लेना)
  const { data: letterData, isLoading, isError, error } = useQuery({
    queryKey: ["letter-details", id],
    queryFn: async () => {
      const res = await api.get(`/supervisor/view-letter-record/${id}`);
      // API के रिस्पॉन्स के आधार पर data.data या सिर्फ data सेट करें
      return res.data.data || res.data; 
    },
    enabled: !!id,
    retry: 1,
  });

  // --- FETCH USERS FOR DROPDOWN ---
   const { data: forwardOptionsData, isLoading: isLoadingOptions } = useQuery({
    queryKey: ["supervisor-options"],
    queryFn: async () => {
      const res = await api.get("/supervisor/get-users-letter");
      let raw = [];

if (Array.isArray(res.data)) raw = res.data;
else if (res.data && Array.isArray(res.data.data)) raw = res.data.data;
else if (res.data && typeof res.data.data === "object") raw = Object.values(res.data.data);

return raw.flat(); // ⭐ जरूरी
    },
    enabled: isSendModalOpen,
  });

  // --- FORWARD MUTATION ---
   const forwardMutation = useMutation({
     mutationFn: async ({ recordId, forwardTo }) => {
       // 🟢 URL mein recordId bhej rahe hain, aur body mein aage forward karne wale user ki id.
       const res = await api.post(`/supervisor/forward-letter-by-sec/${recordId}`, {
         forward_to: forwardTo, 
       });
       return res.data;
     },
    onSuccess: (data) => {
      toast.success(data.message || "Record forwarded successfully!");
      queryClient.invalidateQueries({ queryKey: ["letter-details", id] });
      setIsSendModalOpen(false);
      setSelectedForwardTo("");
      setTimeout(()=>{
        navigate("/letter/all-sent-letters")
      }, 2000)
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to forward record");
    },
  });

  const handleConfirmSend = () => {
    if (!selectedForwardTo) {
      toast.error("Please select a department/user to forward.");
      return;
    }
    forwardMutation.mutate({
      recordId: id, // URL वाली ID
      forwardTo: selectedForwardTo,
    });
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <h1 className="text-gray-600 font-medium">Loading...</h1>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center">
        <FaExclamationTriangle className="w-16 h-16 text-red-500 mb-4" />
        <p className="text-red-600 font-medium mb-4">
          {error?.response?.data?.message || "Error loading letter data"}
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to Letters
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <div className="w-full bg-white flex flex-col min-h-screen">
        
        {/* --- HEADER SECTION --- */}
        <div className="p-4 md:p-6 border-b">
          <div className="flex justify-between items-start mb-3">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
               Letter No. <span className="text-gray-700">{letterData?.letter_no || "उपलब्ध नहीं"}</span>
            </h2>
            <button
              onClick={() => navigate(-1)}
              className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center gap-1 text-sm font-medium"
            >
              <IoMdArrowBack className="w-4 h-4" /> Back
            </button>
          </div>

          {/* --- DETAILS GRID --- */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-4">
            <p className="text-[14px] text-black font-semibold mb-3">
              विषय (Subject):{" "}
              <span className="kruti-input text-gray-700 text-[16px] font-normal ml-1">
                {letterData?.subject || "dksbZ fo'k; miyC/k ugha gS"}
              </span>
            </p>
            
            {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200">
              <div>
                <p className="text-[12px] text-gray-500 uppercase font-bold mb-1">Rack</p>
                <p className="text-sm font-medium text-gray-800">{letterData?.rack || "उपलब्ध नहीं"}</p>
              </div>
              <div>
                <p className="text-[12px] text-gray-500 uppercase font-bold mb-1">Almirah</p>
                <p className="text-sm font-medium text-gray-800">{letterData?.almirah || "उपलब्ध नहीं"}</p>
              </div>
              <div>
                <p className="text-[12px] text-gray-500 uppercase font-bold mb-1">Row No</p>
                <p className="text-sm font-medium text-gray-800">{letterData?.row_no || "उपलब्ध नहीं"}</p>
              </div>
              <div>
                <p className="text-[12px] text-gray-500 uppercase font-bold mb-1">Date</p>
                <p className="text-sm font-medium text-gray-800">
                  {letterData?.date ? new Date(letterData.date).toLocaleDateString() : "उपलब्ध नहीं"}
                </p>
              </div>
            </div> */}
          </div>
        </div>

        {/* --- TABS --- */}
        <div className="flex border-b px-6 gap-6 bg-white">
          <button
            onClick={() => setActiveTab("documents")}
            className={`pb-3 pt-4 text-sm font-bold transition-colors relative ${
              activeTab === "documents" ? "text-blue-700" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Documents
            {activeTab === "documents" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-700"></div>
            )}
          </button>
            <button
              onClick={() => setActiveTab("noting")}
              className={`pb-3 pt-4 text-sm font-bold transition-colors relative ${
                activeTab === "noting" ? "text-blue-700" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Noting
              {activeTab === "noting" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-700"></div>
              )}
            </button>


            <button
              onClick={() => setActiveTab("movement")}
              className={`pb-3 pt-4 text-sm font-bold transition-colors relative whitespace-nowrap ${
                activeTab === "movement" ? "text-blue-700" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Movement History
              {activeTab === "movement" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-700"></div>
              )}
            </button>

        </div>

        {/* --- TAB CONTENT AREA --- */}
         <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-gray-50/50">
          {activeTab === "documents" && (
            <Documents recordId={id} /> 
          )}

          {activeTab === "noting" && (
            <Notes recordId={id} /> 
          )}

          {activeTab === "movement" && (
            <MovementHistory complaint={letterData} /> 
          )}
          
        </div>

        {/* --- FOOTER BUTTONS (ONLY SEND) --- */}
        {/* <div className="border-t p-4 bg-white flex justify-end">
          <button
            onClick={() => setIsSendModalOpen(true)}
            className="px-6 py-2.5 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium flex items-center gap-2 shadow-sm transition-colors"
          >
            <FiSend /> Send Record
          </button>
        </div> */}
      </div>

      {/* --- SEND / FORWARD MODAL --- */}
      {isSendModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
            
            <div className="flex justify-between items-center border-b pb-3 mb-5">
              <h3 className="text-lg font-bold text-gray-900">Forward Letter Record</h3>
              <button
                onClick={() => setIsSendModalOpen(false)}
                disabled={forwardMutation.isPending}
                className="text-gray-400 hover:text-red-500 p-1 rounded-full transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Forward To <span className="text-red-500">*</span>
              </label>

              {isLoadingOptions ? (
                <div className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-500 bg-gray-50 text-sm">
                  Loading departments...
                </div>
              ) : (
                <select
                  value={selectedForwardTo}
                  onChange={(e) => setSelectedForwardTo(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="">-- Select User / Department --</option>
                  {forwardOptionsData?.map((option) => (
                    <option key={option.id} value={option.id}>
                      {getUserLabel(option)}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsSendModalOpen(false)}
                disabled={forwardMutation.isPending}
                className="px-5 py-2.5 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSend}
                disabled={forwardMutation.isPending || !selectedForwardTo}
                className="px-5 py-2.5 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {forwardMutation.isPending ? <FaSpinner className="animate-spin" /> : <FiSend />}
                {forwardMutation.isPending ? "Sending..." : "Send"}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ViewSend;