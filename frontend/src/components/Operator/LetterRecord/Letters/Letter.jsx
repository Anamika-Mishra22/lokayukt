import React, { useState } from "react";
import axios from "axios";
import { IoSearchOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom"; 
import { FaFolderOpen } from "react-icons/fa";
import { TbMail } from "react-icons/tb"; 
import Cookies from "js-cookie";

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
  const [selectedRack, setSelectedRack] = useState("");       // Rack State
  const [selectedAlmirah, setSelectedAlmirah] = useState(""); // Almirah State (New)
  const [selectedRow, setSelectedRow] = useState("");         // Row State
  const [letterRecords, setLetterRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // पिछले 50 सालों का डेटा जनरेट करने के लिए (Year Dropdown के लिए)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  // सर्च करने का फंक्शन
  const handleSearch = async (e) => {
    e.preventDefault(); 

    // अगर सभी फील्ड खाली हैं, तो सर्च मत करो
    if (!letterNumber.trim() && !selectedYear && !selectedRack.trim() && !selectedAlmirah.trim() && !selectedRow.trim()) {
      return; 
    }

    setIsLoading(true);
    setError(null);

    try {
      // API request with letter_no, year, rack, almirah and row
      const response = await api.get("/operator/search-letter-record", {
          params: { 
          letter_no: letterNumber,
          year: selectedYear,
          rack: selectedRack,
          almirah: selectedAlmirah,
          row: selectedRow
        },
      });

      // API Response से डेटा निकालना
      const records = response.data?.data?.data || [];
      setLetterRecords(records);
      
    } catch (err) {
      console.error("Error fetching letter records:", err);
      setError(err.response?.data?.message || "Something went wrong while fetching data.");
      setLetterRecords([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex bg-gray-50 rounded-md overflow-hidden">
      <div className="w-full bg-white flex flex-col overflow-hidden">
        
        {/* --- Header & Search Section --- */}
        <div className="px-3 sm:px-4 py-3 border-b flex-shrink-0 bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
           <h2 className="flex items-center gap-2 text-base sm:text-lg font-bold text-gray-900">
            <TbMail className="text-blue-600" />
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
              disabled={!!selectedAlmirah}
              className={`border px-3 py-1.5 rounded-md text-sm font-sans w-full lg:w-28 placeholder:text-gray-500
              focus:outline-none focus:ring-1 focus:ring-blue-500
              ${selectedAlmirah ? "bg-gray-100 cursor-not-allowed opacity-60" : "hover:border-blue-400"}`}
              placeholder="Rack"
            />

            {/* Almirah Input (New) */}
            <input
              type="text"
              value={selectedAlmirah}
              onChange={(e) => setSelectedAlmirah(e.target.value)}
              disabled={!!selectedRack}   
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
          ) : letterRecords.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {letterRecords.map((record) => (
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
                        {/* Kruti Dev font class for Hindi subject */}
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

      </div>
    </div>
  );
};

export default Letter;