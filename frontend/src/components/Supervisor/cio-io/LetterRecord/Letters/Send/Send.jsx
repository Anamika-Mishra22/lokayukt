import React, { useState } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { 
  IoPaperPlaneOutline, 
  IoCheckmarkCircleOutline 
} from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";

// API Setup
const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";
const token = Cookies.get("access_token");

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

const Send = () => {
  const navigate = useNavigate(); // <-- 2. Initialize kiya
  const [page, setPage] = useState(1);

  // --- Data Fetching Logic ---
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['allSentLetters', page],
    queryFn: async () => {
      const response = await api.get(`/supervisor/all-sent-letters?page=${page}`);
      return response.data;
    },
    keepPreviousData: true,
  });

  // Extract Data
  const letters = data?.data?.data || data?.data || [];
  const paginationInfo = data?.data || {};

  return (
    <div className="w-full h-screen flex bg-gray-50 rounded-md overflow-hidden font-sans">
      <div className="w-full bg-white flex flex-col overflow-hidden">
        
        {/* --- Header Section --- */}
        <div className="px-3 sm:px-4 py-3 border-b flex-shrink-0 bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
              <IoPaperPlaneOutline className="text-blue-600" />
              Sent Letters
            </h2>
            <div className="flex flex-wrap gap-1.5 sm:gap-2 text-[10px] sm:text-xs">
              {paginationInfo.total && (
                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full font-medium whitespace-nowrap">
                  Total Sent: {paginationInfo.total}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* --- List Section --- */}
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
              {letters.map((letter) => (
                <div
                  key={letter.id}
                  className="px-3 sm:px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
                    
                    {/* Left Details */}
                    <div className="flex-1 min-w-0 w-full sm:w-auto">
                      <p className="text-sm font-semibold text-gray-900 mb-1">
                        Letter No. {letter.letter_no || "उपलब्ध नहीं"}
                      </p>
                      <p className="text-xs text-gray-700 mb-1">
                        <span className="text-[15px] font-sans">Subject: </span>
                        <span className="kruti-input">
                          {letter.subject || "No Subject"}
                        </span>
                      </p>
                      <div className="text-[10px] text-gray-400">
                        Created at:{" "}
                        {new Date(letter.created_at).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                        {letter.row_no && (
                          <>
                            <span className="mx-1">•</span>
                            Row: {letter.row_no}
                          </>
                        )}
                      </div>
                    </div>

                    {/* Right Side Actions (View Button + Sent Badge) */}
                    <div className="flex flex-col items-start sm:items-end gap-2 flex-shrink-0 w-full sm:w-auto">
                      <div className="flex gap-2 w-full sm:w-auto">
                        
                        {/* <-- 3. View Letter Button --> */}
                        <button
                          onClick={() => navigate(`view/${letter.id}`)}
                          className="flex-1 sm:flex-none px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md transition-colors duration-200 font-medium whitespace-nowrap"
                        >
                          View Letter
                        </button>

                        {/* Status Badge */}
                        <span className="flex-1 sm:flex-none px-2 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-md text-[11px] font-medium whitespace-nowrap flex items-center justify-center gap-1">
                          <IoCheckmarkCircleOutline className="w-3.5 h-3.5" /> Sent
                        </span>
                        
                      </div>
                    </div>
                    
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 text-sm">No sent letters found.</p>
            </div>
          )}
        </div>

        {/* --- Pagination Section (Compact) --- */}
        {paginationInfo.last_page > 1 && (
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
  );
};

export default Send;