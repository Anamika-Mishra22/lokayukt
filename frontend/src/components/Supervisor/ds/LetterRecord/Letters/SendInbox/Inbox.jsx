import React, { useState } from "react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  IoMailUnreadOutline, 
  IoCheckmarkCircleOutline, 
} from "react-icons/io5";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";
const token = Cookies.get("access_token");

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

const Inbox = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate(); 
  const [page, setPage] = useState(1);
  
  // Modal States
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [letterToApprove, setLetterToApprove] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  // --- 1. Fetch Data using useQuery ---
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["sentLetters", page],
    queryFn: async () => {
      const response = await api.get(`/supervisor/all-letters?page=${page}`);
      return response.data;
    },
    keepPreviousData: true, 
  });

  // --- 2. Post Data using useMutation ---
  const approveMutation = useMutation({
    mutationFn: async (id) => {
      const response = await api.post(`/supervisor/approved-letter-by-rk/${id}`);
      return response.data;
    },
    onSuccess: (data) => {
      // YEH LINE APNE AAP LIST KO REFRESH KAREGI BINA PAGE RELOAD KIYE
      queryClient.invalidateQueries({ queryKey: ["sentLetters"] });
      toast.success(data?.message || "Letter successfully sent to Secretary!", {
        position: "top-right",
      });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Something went wrong while approving.", {
        position: "top-right",
      });
    },
    onSettled: () => {
      setProcessingId(null);
      setIsConfirmModalOpen(false);
      setLetterToApprove(null);
    }
  });

  // Action Handlers
  const handleApproveClick = (record) => {
    setLetterToApprove(record);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmApproval = () => {
    if (letterToApprove) {
      setProcessingId(letterToApprove.id);
      approveMutation.mutate(letterToApprove.id);
    }
  };

  const handleCancelApproval = () => {
    setIsConfirmModalOpen(false);
    setLetterToApprove(null);
  };

  // --- Extract Data (Updated for New JSON Structure) ---
  // Agar data directly array hai toh usko use karega, warna purane pagination format fallback karega
  const letters = Array.isArray(data?.data) ? data.data : (data?.data?.data || []);
  const paginationInfo = data?.data || {};

  return (
    <>
      <Toaster position="top-right" />

      {/* Main Layout Matching AllComplaints */}
      <div className="w-full h-screen flex bg-gray-50 rounded-md overflow-hidden font-sans">
        <div className="w-full bg-white flex flex-col overflow-hidden">
          
          {/* Header Section */}
          <div className="px-3 sm:px-4 py-3 border-b flex-shrink-0 bg-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                <IoMailUnreadOutline className="text-blue-600" />
                Inbox 
              </h2>
              <div className="flex flex-wrap gap-1.5 sm:gap-2 text-[10px] sm:text-xs">
                {/* Total records bas tabhi dikhayega jab backend bhejega */}
                {paginationInfo?.total && (
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full font-medium whitespace-nowrap">
                    Total Records: {paginationInfo.total}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* List Section */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <h1 className="text-gray-600">Loading...</h1>
              </div>
            ) : isError ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-red-500 text-sm">Error: {error?.message || "Failed to load data."}</p>
              </div>
            ) : letters.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {letters.map((record) => {
                  const isProcessingThis = processingId === record.id;
                  const isAlreadySent = record.approved_rejected_by_rk === 1;

                  return (
                    <div
                      key={record.id}
                      className="px-3 sm:px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
                        
                        {/* Left Details */}
                        <div className="flex-1 min-w-0 w-full sm:w-auto">
                          <p className="text-sm font-semibold text-gray-900 mb-1">
                            Letter No. {record.letter_no}
                          </p>
                          <p className="text-xs text-gray-700 mb-1">
                            <span className="text-[15px]">Subject: </span>
                            <span className="kruti-input">
                              {record.subject || "No subject available"}
                            </span>
                          </p>
                          <div className="text-[10px] text-gray-400">
                            Received:{" "}
                            {new Date(record.created_at).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}{" "}
                            {record.row_no && (
                              <>
                                <span className="mx-1">•</span>
                                Row: {record.row_no}
                              </>
                            )}
                          </div>
                        </div>

                        {/* Right Actions */}
                        <div className="flex flex-col items-start sm:items-end gap-2 flex-shrink-0 w-full sm:w-auto">
                          <div className="flex gap-2 w-full sm:w-auto">
                            
                            {/* View Letter Button */}
                            <button
                              onClick={() => navigate(`view/${record.id}`)}
                              className="flex-1 sm:flex-none px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md transition-colors duration-200 font-medium whitespace-nowrap"
                            >
                              View Letter
                            </button>
{/* {isAlreadySent ? (
                              <span className="flex-1 sm:flex-none px-2 py-1.5 bg-green-100 text-green-700 rounded-md text-[11px] font-medium whitespace-nowrap flex items-center justify-center gap-1">
                                <IoCheckmarkCircleOutline className="w-3 h-3" /> Sent to Sec
                              </span>
                            ) : (
                              <button
                                onClick={() => handleApproveClick(record)}
                                disabled={isProcessingThis}
                                className="flex-1 sm:flex-none px-3 py-1.5 text-green-700 border border-green-700 hover:bg-green-700 hover:text-white rounded-md transition-colors duration-200 text-xs font-medium whitespace-nowrap flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-wait"
                              >
                                {isProcessingThis ? (
                                  <>
                                    <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Sending...
                                  </>
                                ) : (
                                  "Send to Secretary"
                                )}
                              </button>
                            )} */}
                          </div>
                        </div>
                        
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 text-sm">No results found</p>
              </div>
            )}
          </div>

          {/* Pagination Component Structure (Compact) */}
          {paginationInfo?.last_page > 1 && (
            <div className="flex-shrink-0 border-t bg-white px-4 py-3 flex items-center justify-between">
              <button
                onClick={() => setPage((old) => Math.max(old - 1, 1))}
                disabled={page === 1}
                className="px-3 py-1.5 border border-gray-300 rounded text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-xs text-gray-600">
                Page <span className="font-medium">{page}</span> of <span className="font-medium">{paginationInfo.last_page}</span>
              </span>
              <button
                onClick={() => setPage((old) => (!paginationInfo.next_page_url ? old : old + 1))}
                disabled={page === paginationInfo.last_page}
                className="px-3 py-1.5 border border-gray-300 rounded text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Clean Confirm Modal (Like AllComplaints) */}
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
                  <h3 className="text-base sm:text-lg font-medium text-gray-900">
                    Confirm Forwarding
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Are you sure you want to forward this letter to the Secretary?
                  </p>
                  {letterToApprove && (
                    <p className="text-xs text-gray-600 mt-1">
                      Letter No: {letterToApprove.letter_no}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button
                  onClick={handleCancelApproval}
                  disabled={processingId !== null}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmApproval}
                  disabled={processingId !== null}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex justify-center items-center gap-2"
                >
                  {processingId !== null ? "Sending..." : "Yes, Send"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Inbox;