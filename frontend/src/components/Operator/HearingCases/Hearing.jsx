import React, { useState, useEffect, useCallback, useMemo } from "react";
import { FaEye, FaSpinner, FaSearch, FaTimes } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import Pagination from "../../Pagination";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import Cookies from "js-cookie";
const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";
const token = Cookies.get("access_token");

// --- API INSTANCE WITH AUTH ---
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

const Hearing = () => {
  const navigate = useNavigate();
  const [openViewPopup, setOpenViewPopup] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [recordToUpdate, setRecordToUpdate] = useState(null);
  const [showReUpdateConfirm, setShowReUpdateConfirm] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [hearingUpdateDateTime, setHearingUpdateDateTime] = useState("");

  // Search Fields
  const [tempComplainId, setTempComplainId] = useState("");
  const [tempDate, setTempDate] = useState("");

  // Main Data State
  const [hearingList, setHearingList] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // --- 1. FETCH & SEARCH API (GET) ---
  const fetchHearings = useCallback(async (isSearch = false) => {
    setIsLoading(true);
    try {
      const pageNum = isSearch ? 1 : currentPage;
      
      // GET Request with Query Params
      const response = await api.get(`/operator/cause-list`, {
        params: {
          page: pageNum,
          complain_id: tempComplainId || undefined,
          date: tempDate || undefined,
        }
      });
      
      if (response.data.status) {
        // Response Structure: response.data.data.data
        setHearingList(response.data.data.data || []);
        setTotalItems(response.data.data.total || 0);
        if (isSearch) setCurrentPage(1);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Data fetch karne mein dikkat aayi");
    } finally {
      setIsLoading(false);
    }
  }, [tempComplainId, tempDate, currentPage]);

  useEffect(() => {
    fetchHearings();
  }, [currentPage, fetchHearings]);

  const handleSearchClick = () => {
    fetchHearings(true);
  };

  const handleClearFilters = () => {
    setTempComplainId("");
    setTempDate("");
    setCurrentPage(1);
    // State reset hone ke baad trigger
    setTimeout(() => fetchHearings(true), 10);
  };

  // --- 2. UPDATE HEARING DATE API (PUT) ---
  const handleUpdateRecord = async () => {
    if (!hearingUpdateDateTime) {
      toast.error("Kripya Date aur Time select karein");
      return;
    }

    setIsUpdating(true);
    try {
      // API pattern: /operator/update-hearing-date/id
      const response = await api.post(`/operator/update-hearing-date/${recordToUpdate.id}`, {
        hearing_date: hearingUpdateDateTime 
      });

      if (response.data.status) {
        toast.success("Hearing Date updated successfully!");
        setShowUpdateModal(false);
        setRecordToUpdate(null);
        setHearingUpdateDateTime("");
        fetchHearings(); // Refresh list
      }
    } catch (error) {
      console.error("Update Error:", error);
      toast.error(error.response?.data?.message || "Update fail ho gaya");
    } finally {
      setIsUpdating(false);
    }
  };

  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;

  // --- 3. DATATABLE COLUMNS ---
  const columns = useMemo(() => [
    {
      name: 'S.No',
      selector: (row, index) => indexOfFirstItem + index + 1,
      sortable: false,
      width: '80px',
    },
    {
      name: 'Complaint No',
      selector: row => row.complain_no || "",
      sortable: true,
      cell: row => <span className="font-bold text-gray-700">{row.complain_no}</span>,
      minWidth: '150px',
    },
    {
      name: 'Bench',
      selector: row => row.deal_by || "",
      sortable: true,
      cell: row => (
        <span className="px-2 py-1 bg-gray-100 rounded text-[10px] font-bold text-gray-600 uppercase">
          {row.deal_by || "उपलब्ध नहीं"} ({row.bench_person_name || "उपलब्ध नहीं"})
        </span>
      ),
      minWidth: '200px',
    },
    {
      name: 'Cause Date',
      selector: row => row.next_hearing_date || "",
      sortable: true,
      cell: row => (
        <span className="text-gray-600">
          {row?.next_hearing_date ? row.next_hearing_date : "उपलब्ध नहीं"}
        </span>
      ),
      minWidth: '180px',
    },
    {
      name: 'Action',
      cell: row => (
        <div className="flex items-center gap-3 py-2">
          {row?.next_hearing_date ? (
  <button
   onClick={() => {
  setRecordToUpdate(row);

  const formattedDate = row.next_hearing_date
    ? row.next_hearing_date.replace(" ", "T").substring(0, 16)
    : "";

  setHearingUpdateDateTime(formattedDate);

  setShowReUpdateConfirm(true);
}}
    className="px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-md hover:bg-green-600 hover:text-white transition text-xs font-bold"
  >
    Re Update
  </button>
) : (
  <button
    onClick={() => {
      setRecordToUpdate(row);
      setShowUpdateModal(true);
    }}
    className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-md hover:bg-blue-600 hover:text-white transition text-xs font-bold"
  >
    Update
  </button>
)}
          <button
            onClick={() => navigate(`view/${row.id}`)}
            className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-md hover:bg-blue-600 hover:text-white transition text-xs font-bold flex items-center gap-1"
          >
            <FaEye /> View
          </button>
        </div>
      ),
      minWidth: '180px',
    }
  ], [currentPage, itemsPerPage, indexOfFirstItem, navigate]);

  // --- DATATABLE STYLES ---
  const customTableStyles = {
    headRow: {
      style: {
        backgroundColor: '#f9fafb',
        borderBottom: '1px solid #e5e7eb',
        color: '#4b5563', 
        fontSize: '11px',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      },
    },
    headCells: {
      style: {
        paddingLeft: '24px',
        paddingRight: '24px',
        paddingTop: '16px',
        paddingBottom: '16px',
      },
    },
    cells: {
      style: {
        fontSize: '0.875rem', 
        paddingLeft: '24px',
        paddingRight: '24px',
        paddingTop: '16px',
        paddingBottom: '16px',
      },
    },
    rows: {
      style: {
        '&:hover': {
          backgroundColor: 'rgba(239, 246, 255, 0.3)', 
        },
        '&:not(:last-of-type)': {
          borderBottomStyle: 'solid',
          borderBottomWidth: '1px',
          borderBottomColor: '#f3f4f6', 
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm p-4">
        
        {/* HEADER & FILTERS */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-xl font-bold text-gray-800">Cause List</h2>
          
          <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full md:w-auto items-center">
            <input
              type="text"
              placeholder="Complaint ID..."
              value={tempComplainId}
              onChange={(e) => setTempComplainId(e.target.value)}
              className="w-full sm:w-44 px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
            
            <input
              type="date"
              value={tempDate}
              onChange={(e) => setTempDate(e.target.value)}
              className="w-full sm:w-36 px-2 py-2 border border-gray-300 rounded text-sm text-gray-600 outline-none"
            />

            <button 
              onClick={handleSearchClick}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2 rounded text-sm hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isLoading ? <FaSpinner className="animate-spin" /> : <FaSearch />} Search
            </button>

            {(tempComplainId || tempDate) && (
              <button onClick={handleClearFilters} className="text-red-500 hover:bg-red-50 p-2 rounded transition">
                <FaTimes />
              </button>
            )}
          </div>
        </div>

        {/* DATA TABLE */}
        <div className="rounded-lg border border-gray-200 relative z-0 overflow-hidden min-h-[300px]">
          {/* ORIGINAL LOADING OVERLAY BACK IN ACTION */}
          {isLoading && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10 backdrop-blur-[1px]">
              {/* <FaSpinner className="text-blue-600 animate-spin text-4xl" /> */}
               <h1 className="text-gray-600">Loading...</h1>
            </div>
          )}

          <DataTable
            columns={columns}
            data={hearingList}
            noDataComponent={
              !isLoading && (
                <div className="px-6 py-20 text-center text-gray-400 w-full">
                  No records found matching your criteria.
                </div>
              )
            }
            customStyles={customTableStyles}
            responsive
          />
        </div>

        {/* PAGINATION */}
        <div className="mt-4">
          {hearingList.length > 0 && totalItems > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(totalItems / itemsPerPage)}
              onPageChange={setCurrentPage}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
            />
          )}
        </div>


{/* RE UPDATE CONFIRM POPUP */}
{showReUpdateConfirm && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[80] p-4">
    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm">
      <h2 className="text-lg font-bold text-gray-800 mb-3">
        Confirmation
      </h2>

      <p className="text-sm text-gray-600 mb-6">
        Are you sure you want to Re Update this hearing date?
      </p>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => setShowReUpdateConfirm(false)}
          className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100"
        >
          No
        </button>

        <button
          onClick={() => {
            setShowReUpdateConfirm(false);
            setShowUpdateModal(true);
          }}
          className="px-4 py-2 text-sm rounded-md bg-green-600 text-white hover:bg-green-700"
        >
          Yes, Re Update
        </button>
      </div>
    </div>
  </div>
)}

        {/* UPDATE MODAL */}
        {showUpdateModal && (
          <div className="fixed inset-0 bg-gray-900/60 flex items-center justify-center z-[70] p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Schedule Next Hearing</h3>
              <p className="text-xs text-gray-500 mb-6">Complaint No: {recordToUpdate?.complain_no}</p>
              
              <div className="mb-6">
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Hearing Date & Time</label>
                <input
  type="date"
  min={new Date().toISOString().split("T")[0]}
  value={hearingUpdateDateTime}
  onChange={(e) => setHearingUpdateDateTime(e.target.value)}
  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
/>
              </div>

              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setShowUpdateModal(false)} 
                  disabled={isUpdating} 
                  className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpdateRecord} 
                  disabled={isUpdating || !hearingUpdateDateTime} 
                  className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 transition flex items-center gap-2 shadow-lg shadow-green-200"
                >
                  {isUpdating ? <FaSpinner className="animate-spin" /> : "Confirm Update"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW MODAL */}
        {openViewPopup && selectedLog && (
          <div className="fixed inset-0 bg-gray-900/60 flex items-center justify-center z-[70] p-4 backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex justify-between items-center bg-gray-50 px-6 py-4 border-b">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 tracking-tight">Details: {selectedLog.complain_no}</h3>
                  <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">Case Information</p>
                </div>
                <button onClick={() => setOpenViewPopup(false)} className="bg-white p-2 rounded-full shadow-sm text-gray-400 hover:text-red-500 transition border"><IoCloseSharp size={20} /></button>
              </div>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Description</span>
                  <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">{selectedLog.complaint_description || "No description provided."}</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Status</span>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${selectedLog.status === 'In Progress' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                      {selectedLog.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Correspondence Name</span>
                    <p className="text-sm font-semibold text-gray-800 italic uppercase underline decoration-blue-200">{selectedLog.correspondence_name || "उपलब्ध नहीं"}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-6 py-4 flex justify-end">
                <button onClick={() => setOpenViewPopup(false)} className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-100 transition shadow-sm">Close Window</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hearing;