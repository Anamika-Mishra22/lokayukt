import React, { useState, useEffect } from "react";
import { FaSpinner, FaCheckCircle, FaTimes, FaSync, FaEye, FaFileExcel } from "react-icons/fa";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Cookies from "js-cookie";
import * as XLSX from "xlsx";

const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";
const token = Cookies.get("access_token");

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

const RequestComplaint = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // 🟢 State for Tabs
  const [activeTab, setActiveTab] = useState("request");

  // Approval Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [approvalStatus, setApprovalStatus] = useState("allow");
  const [remark, setRemark] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // View Remarks Modal States
  const [isRemarkModalOpen, setIsRemarkModalOpen] = useState(false);
  const [selectedRemarks, setSelectedRemarks] = useState([]);

  // 🟢 GET API: Fetch requests
  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/operator/request-complaints-for-approval");
      
      if (response.data.status === "success" || response.data.status === true) {
        setRequests(response.data.data || []);
      } else {
        toast.error("Failed to load requests.");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Error fetching requests.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "उपलब्ध नहीं";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Open Approval Modal
const openApproveModal = (id) => {
  setSelectedRequestId(id);

  // 👇 Active tab ke according default value
  if (activeTab === "request") {
    setApprovalStatus("allow");
  } else if (activeTab === "allow") {
    setApprovalStatus("received");
  }

  setRemark("");
  setIsModalOpen(true);
};

  // Open View Remarks Modal
  const openRemarkModal = (remarksArray) => {
    setSelectedRemarks(remarksArray || []);
    setIsRemarkModalOpen(true);
  };

  // ✉️ POST API: Submit Approval
  const handleApproveSubmit = async () => {
    if (!remark.trim()) {
      toast.error("Please enter a remark!");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post("/operator/request-complaints/approve", {
        request_complaint_id: selectedRequestId,
        status: approvalStatus,
        remark: remark,
      });

      if (response.data.status === true || response.data.status === "success") {
        toast.success(response.data.message || "Action completed successfully!");
        setIsModalOpen(false);
        fetchRequests(); // Refresh table
      } else {
        toast.error(response.data.message || "Failed to process request.");
      }
    } catch (error) {
      console.error("Approve Error:", error);
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🟢 Filter Data based on Active Tab
  const filteredRequests = requests.filter((item) => item.status === activeTab);

  // 📊 EXCEL EXPORT LOGIC
  const exportToExcel = () => {
    if (filteredRequests.length === 0) {
      toast.error(`No data to export for ${activeTab} tab!`);
      return;
    }

    const exportData = filteredRequests.map((item, index) => {
      const allRemarks = item.remark && Array.isArray(item.remark)
        ? item.remark.map((r, i) => `${i + 1}. ${r.remark}`).join("\n") 
        : "उपलब्ध नहीं";

      return {
        "S.No": index + 1,
        "Req ID": `#${item.id}`,
        "Complaint ID": item.complaint_id || "उपलब्ध नहीं",
        "Reason": item.reason || "उपलब्ध नहीं",
        "Current Status": item.status || "Unknown",
        "Request Date": formatDate(item.created_at),
        "Remarks": allRemarks,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    const colWidths = [
      { wch: 8 },   // A: S.No
      { wch: 12 },  // B: Req ID
      { wch: 15 },  // C: Complaint ID
      { wch: 25 },  // D: Reason
      { wch: 15 },  // E: Current Status
      { wch: 20 },  // F: Request Date
      { wch: 60 },  // G: Remarks
    ];
    worksheet["!cols"] = colWidths;

    for (const cellAddress in worksheet) {
      if (cellAddress.startsWith("!")) continue;

      if (cellAddress.startsWith("G") && cellAddress !== "G1") {
        worksheet[cellAddress].s = {
          font: { name: "Kruti Dev 010", sz: 14 },
          alignment: { wrapText: true, vertical: "center" }
        };
      } else {
        worksheet[cellAddress].s = {
          alignment: { wrapText: true, vertical: "center" }
        };
      }
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `${activeTab}_Requests`);
    XLSX.writeFile(workbook, `Complaint_${activeTab}_Requests.xlsx`);
  };

  return (
    <div className="bg-gray-50 min-h-screen relative ">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-sm p-4 sm:p-6">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-xl font-bold text-gray-900">
            Complaint Requests
          </h2>
          <div className="flex items-center gap-3">
            <button 
              onClick={exportToExcel}
              className="flex items-center gap-2 text-sm text-green-700 hover:text-green-900 bg-green-50 px-3 py-1.5 rounded-md transition-colors border border-green-200"
            >
              <FaFileExcel /> Export
            </button>

            <button 
              onClick={fetchRequests}
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-md transition-colors border border-blue-200"
            >
              <FaSync className={isLoading ? "animate-spin" : ""} /> Refresh
            </button>
          </div>
        </div>

        {/* 🟢 Tabs Section (Centered Form/Pill Style) */}
        <div className="flex justify-center mb-6 w-full">
          <div className="bg-gray-100 p-1 rounded-lg inline-flex shadow-sm border border-gray-200">
            <button
              className={`py-2 px-8 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === "request"
                  ? "bg-white text-blue-600 shadow-sm border border-gray-200"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
              }`}
              onClick={() => setActiveTab("request")}
            >
              Pending Requests
            </button>
            <button
              className={`py-2 px-8 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === "allow"
                  ? "bg-white text-green-600 shadow-sm border border-gray-200"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
              }`}
              onClick={() => setActiveTab("allow")}
            >
              Allowed Request
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto rounded-md border border-gray-200">
          <table className="min-w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 border-b">S.No</th>
                <th className="px-6 py-3 border-b">Complaint No</th>
                <th className="px-6 py-3 border-b">Reason</th>
                <th className="px-6 py-3 border-b">Current Status</th>
                <th className="px-6 py-3 border-b">Request Date</th>
                <th className="px-6 py-3 border-b text-center">Remarks</th>
                <th className="px-6 py-3 border-b text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : filteredRequests.length > 0 ? (
                filteredRequests.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4 font-medium text-blue-600">
                      {item.complaint_id || "उपलब्ध नहीं"}
                    </td>
                    <td className="px-6 py-4 text-gray-800">
                      {item.reason || "उपलब्ध नहीं"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium uppercase ${
                        item.status === 'request' ? 'bg-yellow-100 text-yellow-800' :
                        item.status === 'allow' ? 'bg-green-100 text-green-800' :
                        item.status === 'received' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {item.status || "Unknown"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatDate(item.created_at)}
                    </td>
                    
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => openRemarkModal(item.remark)}
                        className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded transition-colors w-full"
                      >
                        <FaEye /> Remarks
                      </button>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => openApproveModal(item.id)}
                        className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors w-full"
                      >
                        <FaCheckCircle /> Action
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                    No records found for "{activeTab}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ View Remarks Modal */}
      {isRemarkModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 animate-slideDown">
            
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                Previous Remarks
              </h2>
              <button 
                onClick={() => setIsRemarkModalOpen(false)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            <div className="overflow-x-auto max-h-[60vh] overflow-y-auto border rounded-lg">
              <table className="min-w-full text-sm text-left text-gray-700">
                <thead className="bg-gray-100 text-xs uppercase text-gray-600">
                  <tr>
                    <th className="px-4 py-2 border">S.No</th>
                    <th className="px-4 py-2 border">Remark By</th>
                    <th className="px-4 py-2 border">Remark</th>
                    <th className="px-4 py-2 border">Updated Date</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedRemarks && selectedRemarks.length > 0 ? (
                    selectedRemarks.map((rm, index) => (
                      <tr key={rm.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 border text-center">
                          {index + 1}
                        </td>
                        <td className="px-4 py-2 border text-[16px]">
                          {rm?.user?.name || "उपलब्ध नहीं"}
                        </td>
                        <td className="px-4 py-2 border kruti-input text-[16px]">
                          {rm.remark || "miyC/k ugha"}
                        </td>
                        <td className="px-4 py-2 border whitespace-nowrap">
                          {formatDate(rm.created_at)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-4 text-gray-500">
                        No remarks found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setIsRemarkModalOpen(false)}
                className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Approve/Action Modal */}
      {isModalOpen && (
  <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
    
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-slideDown">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <FaCheckCircle className="text-blue-600" />
          Process Request #{selectedRequestId}
        </h2>
        <button 
          onClick={() => setIsModalOpen(false)}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <FaTimes />
        </button>
      </div>

      {/* Form */}
      <div className="space-y-4">
        
        {/* Action */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Action (कार्रवाई)
          </label>

          <select
            value={approvalStatus}
            onChange={(e) => setApprovalStatus(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {/* <option value="">Select</option> */}

            {activeTab === "request" && (
              <option value="allow">Allow (अनुमति दें)</option>
            )}

            {activeTab === "allow" && (
              <option value="received">Received (प्राप्त हुआ)</option>
            )}
          </select>
        </div>

        {/* Remark */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Remark (टिप्पणी)
          </label>
          <textarea
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all kruti-input text-[18px]"
            placeholder="fVIi.kh ntZ djsa..."
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Buttons */}
      {/* <div className="mt-6 flex justify-center items-center gap-4 w-full"> */}
      <div className="mt-6 flex justify-end items-center gap-4 w-full">
        
        <button
          onClick={() => setIsModalOpen(false)}
          disabled={isSubmitting}
          className="min-w-[120px] px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          onClick={handleApproveSubmit}
          disabled={isSubmitting}
          className="min-w-[120px] flex items-center justify-center gap-2 px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <FaSpinner className="animate-spin" />
              Processing...
            </>
          ) : (
            "Submit"
          )}
        </button>

      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default RequestComplaint;