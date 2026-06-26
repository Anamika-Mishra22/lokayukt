import React, { useState } from "react";
import axios from "axios";
import { IoSearchOutline } from "react-icons/io5";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom"; 


import Pagination from "../../../../Pagination"; 

const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";

const token = Cookies.get("access_token");

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

const Letter = () => {
  const navigate = useNavigate();
  
  const [letterNumber, setLetterNumber] = useState("");
  const [selectedYear, setSelectedYear] = useState(""); 
  const [selectedRack, setSelectedRack] = useState("");       
  const [selectedAlmirah, setSelectedAlmirah] = useState(""); 
  const [selectedRow, setSelectedRow] = useState("");         
  const [letterRecords, setLetterRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // एक पेज पर कितने रिकॉर्ड दिखाने हैं

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  const handleSearch = async (e) => {
    e.preventDefault(); 

    if (!letterNumber.trim() && !selectedYear && !selectedRack.trim() && !selectedAlmirah.trim() && !selectedRow.trim()) {
      return; 
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get("/supervisor/search-letter-record", {
        params: { 
          letter_no: letterNumber,
          year: selectedYear,
          rack: selectedRack,
          almirah: selectedAlmirah,
          row: selectedRow
        },
      });

      const records = response.data?.data?.data || [];
      setLetterRecords(records);
      setCurrentPage(1); // नई सर्च पर पेज वापस 1 पर सेट करें
      
    } catch (err) {
      console.error("Error fetching letter records:", err);
      setError(err.response?.data?.message || "Something went wrong while fetching data.");
      setLetterRecords([]);
    } finally {
      setIsLoading(false);
    }
  };

  // --- PAGINATION LOGIC ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = letterRecords.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(letterRecords.length / itemsPerPage);

  return (
    <div className="w-full h-screen flex bg-gray-50 rounded-md overflow-hidden">
      <div className="w-full bg-white flex flex-col overflow-hidden">
        
        {/* --- Header & Search Section --- */}
        <div className="px-3 sm:px-4 py-3 border-b flex-shrink-0 bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              Letter Records
            </h2>
            <div className="flex flex-wrap gap-1.5 sm:gap-2 text-[10px] sm:text-xs">
              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full font-medium whitespace-nowrap">
                Total Records: {letterRecords.length}
              </span>
            </div>
          </div>

          <form onSubmit={handleSearch} className="flex flex-col lg:flex-row lg:items-center flex-wrap gap-2 mb-3">
            {/* Letter Number Input */}
            <div className="relative flex-1 lg:min-w-[200px]">
              <IoSearchOutline className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={letterNumber}
                onChange={(e) => setLetterNumber(e.target.value)}
                className=" w-full border border-gray-300 rounded-md pl-8 pr-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder:!font-sans placeholder:!text-gray-500 placeholder:!text-sm placeholder:!tracking-normal"
                placeholder="Search by Letter No..."
              />
            </div>

            {/* Rack Input */}
            <input
              type="text"
              value={selectedRack}
              onChange={(e) => setSelectedRack(e.target.value)}
              disabled={!!selectedAlmirah}   // 👈 yaha change
              className={`border px-3 py-1.5 rounded-md text-sm font-sans w-full lg:w-28 placeholder:text-gray-500
              focus:outline-none focus:ring-1 focus:ring-blue-500
              ${selectedAlmirah ? "bg-gray-100 cursor-not-allowed opacity-60" : "hover:border-blue-400"}`}
              placeholder="Rack"
            />

            {/* Almirah Input */}
            <input
              type="text"
              value={selectedAlmirah}
              onChange={(e) => setSelectedAlmirah(e.target.value)}
                disabled={!!selectedRack}   // 👈 yaha change
              className={`border px-3 py-1.5 rounded-md text-sm font-sans w-full lg:w-28 placeholder:text-gray-500
              focus:outline-none focus:ring-1 focus:ring-blue-500
              ${selectedRack ? "bg-gray-100 cursor-not-allowed opacity-60" : "hover:border-blue-400"}`}
              placeholder="Almirah"
            />

            {/* Row Input */}
            <input
              type="text"
              value={selectedRow}
              onChange={(e) => setSelectedRow(e.target.value)}
              className="border border-gray-300 px-3 py-1.5 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-sans w-full lg:w-28 placeholder:text-gray-500"
              placeholder="Row"
            />

            {/* Year Dropdown */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="border border-gray-300 px-2 py-1.5 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-sans w-full lg:w-28"
            >
              <option value="">Year: All</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            
            {/* Search Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="lg:ml-auto flex-1 sm:flex-none px-6 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md transition-colors duration-200 font-medium whitespace-nowrap disabled:opacity-50"
            >
              {isLoading ? "Searching..." : "Search"}
            </button>
          </form>
        </div>

        {/* --- Results Section (List View) --- */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <h1 className="text-gray-600">Loading...</h1>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-red-500 text-sm">Error: {error}</p>
            </div>
          ) : currentItems.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {currentItems.map((record) => (
                <div
                  key={record.id}
                  className="px-3 sm:px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
                    
                    {/* Left Side Data */}
                    <div className="flex-1 min-w-0 w-full sm:w-auto">
                      <p className="text-sm font-semibold text-gray-900 mb-1">
                        Letter No. {record.letter_no}
                      </p>
                      <p className="text-xs text-gray-700 mb-1">
                        <span className="text-[15px]">Subject: </span>
                        <span className="kruti-input text-[16px]">
                          {record.subject || "No subject available"}
                        </span>
                      </p>
                      <div className="text-[11px] text-gray-600 mb-1 flex flex-wrap gap-3">
                        {record.rack && (
                          <span>
                            <span className="text-gray-500">Rack:</span>
                            <span className="ml-1 font-medium text-gray-800">{record.rack}</span>
                          </span>
                        )}
                        {record.almirah && (
                          <span>
                            <span className="text-gray-500">Almirah:</span>
                            <span className="ml-1 font-medium text-gray-800">{record.almirah}</span>
                          </span>
                        )}
                        <span>
                          <span className="text-gray-500">Row No:</span>
                          <span className="ml-1 font-medium text-gray-800">{record.row_no || "उपलब्ध नहीं"}</span>
                        </span>
                      </div>
                    </div>

                    {/* Right Side Buttons */}
                    <div className="flex flex-col items-start sm:items-end gap-2 flex-shrink-0 w-full sm:w-auto">
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => navigate(`view/${record.id}`)}
                          className="flex-1 sm:flex-none px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md transition-colors duration-200 font-medium whitespace-nowrap"
                        >
                          View Letter
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <h1 className="text-gray-500 text-sm">No Data Found.</h1>
            </div>
          )}
        </div>

      
        {totalPages > 1 && (
          <div className="flex-shrink-0 border-t bg-white  py-3 flex items-center justify-end">
            {/* 👇 तुम्हारे कम्पोनेंट के Props के हिसाब से इसे सेट कर लेना 👇 */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        )}

      </div>
    </div>
  );
};

export default Letter;