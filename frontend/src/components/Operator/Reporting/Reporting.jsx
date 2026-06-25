import React, { useState, useMemo } from "react";
import { FaSearch, FaSpinner, FaTimes, FaEye, FaFileAlt, FaDownload, FaFileExcel } from "react-icons/fa";
import axios from "axios";
import * as XLSX from "xlsx-js-style";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Pagination from "../../Pagination"; 
import DataTable from "react-data-table-component";
import Cookies from "js-cookie";

const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";
const token = Cookies.get("access_token");

const APP_URL = BASE_URL.replace("/api", ""); 

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

const Reporting = () => {
  const navigate = useNavigate();

  // --- Tabs State ---
  const [activeTab, setActiveTab] = useState("old"); 

  // Old Tab States
  const [compFile, setCompFile] = useState(""); 
  const [corrResp, setCorrResp] = useState(""); 
  const [OffName, setOffName] = useState(""); 
  const [year, setYear] = useState("");
  const [subject, setSubject] = useState("");

  // New Tab States
  const [complainNo, setComplainNo] = useState("");
  const [complainant, setComplainant] = useState("");
  const [respondant, setRespondant] = useState("");

  // Common States
  const [date, setDate] = useState("");
  const [district, setDistrict] = useState("");
  const [department, setDepartment] = useState("");
  const [enrollmentFromDate, setEnrollmentFromDate] = useState("");
  const [enrollmentToDate, setEnrollmentToDate] = useState("");
  const [complaintDate, setComplaintDate] = useState("");
  const [nature, setNature] = useState("");

  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10); 

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalFileUrl, setModalFileUrl] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [fileLoading, setFileLoading] = useState(false);

  const { data: districtsList, isLoading: loadingDistricts } = useQuery({
    queryKey: ["districts-list"],
    queryFn: async () => {
      const res = await api.get("/operator/all-district");
      return res.data.data || [];
    }
  });

  const { data: departmentsList, isLoading: loadingDepartments } = useQuery({
    queryKey: ["departments-list"],
    queryFn: async () => {
      const res = await api.get("/operator/department");
      return res.data.data || [];
    }
  });

  const handleSearch = async (page = 1) => {
    setIsLoading(true);
    
    try {
      let queryParams = {
        date: date,
        district: district,
        department: department,
        enroll_from: enrollmentFromDate,
        enroll_to: enrollmentToDate,     
        complaint_date: complaintDate,
        nature: nature,
        page: page 
      };

      let endpoint = "/operator/search-by-field";

      if (activeTab === "old") {
        queryParams = {
          ...queryParams,
          OFF_NAME: OffName,
          subject: subject,
          comp_file: compFile,
          comp_resp: corrResp,
          year: year,
        };
      } else {
        endpoint = "/operator/search-by-field-new-complaints";
        queryParams = {
          ...queryParams,
          complain_no: complainNo,
          complainant: complainant,
          respondant: respondant,
        };
      }

      const response = await api.get(endpoint, {
        params: queryParams
      });

      if (response.data.status === true || response.data.status === "success") {
        const paginationData = response.data.data; 
        const fetchedData = paginationData?.data || []; 
        
        setResults(fetchedData);
        
        setCurrentPage(paginationData?.current_page || 1);
        setTotalPages(paginationData?.last_page || 1);
        setTotalItems(paginationData?.total || 0);
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

  const formatDate = (dateString) => {
    if (!dateString) return "उपलब्ध नहीं";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleViewCP = async (id) => {
    setFileLoading(true);
    try {
      const response = await api.get(`/operator/view-cp/${id}`);
      const path = typeof response.data?.data === 'string' ? response.data.data : null; 
      
      if (path) {
        const finalUrl = APP_URL + (path.startsWith('/') ? path : '/' + path);
        setModalFileUrl(finalUrl);
        setModalTitle("View CP File");
        setIsModalOpen(true);
      } else {
        toast.error("CP File path not found in response!");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load CP file");
    } finally {
      setFileLoading(false);
    }
  };

  const handleViewNP = async (id) => {
    setFileLoading(true);
    try {
      const response = await await api.get(`/operator/view-np/${id}`);
      const path = typeof response.data?.data === 'string' ? response.data.data : null;
      
      if (path) {
        const finalUrl = APP_URL + (path.startsWith('/') ? path : '/' + path);
        setModalFileUrl(finalUrl);
        setModalTitle("View NP File");
        setIsModalOpen(true);
      } else {
        toast.error("NP File path not found in response!");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load NP file");
    } finally {
      setFileLoading(false);
    }
  };

  const handleDownloadFile = async (id, fileType) => {
    const toastId = toast.loading("Fetching file for download...");
    try {
      const response = await api.get(`/operator/view-${fileType}/${id}`);
      const path = typeof response.data?.data === 'string' ? response.data.data : null;
      
      if (path) {
        const finalUrl = APP_URL + (path.startsWith('/') ? path : '/' + path);
        
        const link = document.createElement("a");
        link.href = finalUrl;
        link.target = "_blank"; 
        link.download = `${fileType.toUpperCase()}_File_${id}`; 
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success("Download started", { id: toastId });
      } else {
        toast.error("File path not found!", { id: toastId });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to download file", { id: toastId });
    }
  };

  // --- EXCEL EXPORT FUNCTION ---
// --- EXCEL EXPORT FULL DATA (USING PAGINATION LOOP) ---
 // --- EXCEL EXPORT FULL DATA (USING PAGINATION LOOP & STYLING) ---
  const handleExportExcel = async () => {
    if (totalItems === 0) {
      toast.error("No records to export!");
      return;
    }

    const toastId = toast.loading("Starting download... 0%");

    let allFetchedData = [];
    let currentPageFetch = 1;
    let lastPageFetch = 1;
    const itemsPerRequest = 1000; 

    try {
      let endpoint = "/operator/search-by-field";
      let baseParams = {
        date: date, district: district, department: department,
        enroll_from: enrollmentFromDate, enroll_to: enrollmentToDate,
        complaint_date: complaintDate, nature: nature, per_page: itemsPerRequest 
      };

      if (activeTab === "old") {
        baseParams = {
          ...baseParams, OFF_NAME: OffName, subject: subject,
          comp_file: compFile, comp_resp: corrResp, year: year,
        };
      } else {
        endpoint = "/operator/search-by-field-new-complaints";
        baseParams = {
          ...baseParams, complain_no: complainNo, complainant: complainant, respondant: respondant,
        };
      }

      // --- FETCH DATA LOOP ---
      while (true) {
        const response = await api.get(endpoint, { params: { ...baseParams, page: currentPageFetch } });

        if (response.data.status === true || response.data.status === "success") {
          const paginationData = response.data.data;
          allFetchedData = [...allFetchedData, ...(paginationData?.data || [])];
          lastPageFetch = paginationData?.last_page || 1;

          const progress = Math.round((currentPageFetch / lastPageFetch) * 100);
          toast.loading(`Fetching data... ${progress}%`, { id: toastId });

          if (currentPageFetch >= lastPageFetch) break; 
          currentPageFetch++;
        } else {
          throw new Error("Failed to fetch chunk");
        }
      }

      if (allFetchedData.length === 0) {
        toast.error("No data found to export.", { id: toastId });
        return;
      }

      toast.loading("Generating Excel file with Fonts and Gaps...", { id: toastId });

      // --- DATA FORMATTING (Bina convert kiye raw KrutiDev data bhejenge) ---
      const formattedData = allFetchedData.map((row, index) => {
        if (activeTab === "old") {
          return {
            "S.No": index + 1,
            "Comp. No": row.COMP_NO || "",
            "Year": row.YEAR1 || "",
            "Date": formatDate(row.ENROLL_DT || row.COMP_DT || row.cause_date),
            "Complainant": row.COMP_NM || "",
            "Respondent": row.OFF_NAME || "",
            "Designation": row.OFF_DESG || "",
            "District": row.DISTT || "",
            "Department": row.DEPTT || "",
            "Subject": row.SUB1 || "",
            "Address": row.ADD1 || "",
            "Nature": row.NATURE == 1 ? "Complaint" : row.NATURE == 2 ? "Assertion" : row.NATURE || "",
            "Dispose": row.DISPOSE == 1 ? "Disposed" : "Not Disposed"
          };
        } else {
          return {
            "S.No": index + 1,
            "Comp. No": row.complain_no || "",
            "Date": formatDate(row.cause_date || row.COMP_DT),
            "Complainant": row.complainant_name || "",
            "Respondent": row.OFF_NAME || "",
            "District": row.DISTT || "",
            "Department": row.DEPTT || "",
          };
        }
      });

      // Sheet create karna
      const worksheet = XLSX.utils.json_to_sheet(formattedData);

      // --- 1. SET COLUMN WIDTHS (Gaps in Excel) ---
      // 'wch' set karta hai character width
      const colWidthsOld = [
        { wch: 8 },  // A: S.No
        { wch: 15 }, // B: Comp. No
        { wch: 10 }, // C: Year
        { wch: 15 }, // D: Date
        { wch: 30 }, // E: Complainant
        { wch: 30 }, // F: Respondent
        { wch: 25 }, // G: Designation
        { wch: 15 }, // H: District
        { wch: 20 }, // I: Department
        { wch: 40 }, // J: Subject
        { wch: 35 }, // K: Address
        { wch: 15 }, // L: Nature
        { wch: 15 }  // M: Dispose
      ];
      
      const colWidthsNew = [
        { wch: 8 },  // A
        { wch: 15 }, // B
        { wch: 15 }, // C
        { wch: 30 }, // D
        { wch: 30 }, // E
        { wch: 15 }, // F
        { wch: 20 }  // G
      ];

      worksheet['!cols'] = activeTab === "old" ? colWidthsOld : colWidthsNew;

      // --- 2. SET EXCEL CSS / FONT STYLES ---
      // Kaunse columns me Hindi (KrutiDev) hai uska logic:
      const krutiColsOld = ['E', 'F', 'G', 'H', 'I', 'J', 'K']; 
      const krutiColsNew = ['D', 'E', 'F', 'G'];
      const krutiCols = activeTab === "old" ? krutiColsOld : krutiColsNew;

      for (let cellAddress in worksheet) {
        if (cellAddress[0] === '!') continue; // Metadata skip karo

        const colLetter = cellAddress.replace(/[0-9]/g, '');
        const rowNum = parseInt(cellAddress.replace(/[A-Z]/g, ''));

        // Basic styling for all cells (Vertical alignment & Text Wrap)
        let cellStyle = {
          alignment: { vertical: "center", wrapText: true }
        };

        if (rowNum === 1) {
          // Header Row CSS (Bold, Background Color)
          cellStyle.font = { bold: true, color: { rgb: "000000" }, sz: 11 };
          cellStyle.fill = { fgColor: { rgb: "E5E7EB" } }; // Light gray background
        } else {
          // Data Rows CSS (Check agar column kruti wala hai)
          if (krutiCols.includes(colLetter)) {
            cellStyle.font = { name: "Kruti Dev 010", sz: 14 }; // KrutiDev applied
          } else {
            cellStyle.font = { name: "Arial", sz: 10 }; // Normal English text
          }
        }

        worksheet[cellAddress].s = cellStyle; // Style assign kar diya
      }

      // --- WORKBOOK BANAO AUR DOWNLOAD KARO ---
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Complaints_Data");
      
      XLSX.writeFile(workbook, `${activeTab}_all_data.xlsx`);
      
      toast.success("Download Complete!", { id: toastId });

    } catch (error) {
      console.error("Export Error:", error);
      toast.error("Export failed. API might have timed out.", { id: toastId });
    }
  };

  const columns = useMemo(() => {
    const baseCols = [
      {
        name: 'S.No',
        selector: (row, index) => (currentPage - 1) * itemsPerPage + index + 1,
        sortable: false, // <-- REMOVED SORTING FROM S.NO
        width: '80px'
      },
      {
        name: 'Comp. No',
        selector: row => row.COMP_NO || row.complain_no || "",
        sortable: true,
        cell: row => <span className="font-medium  cursor-pointer hover:underline whitespace-nowrap">{row.COMP_NO || row.complain_no || "उपलब्ध नहीं"}</span>,
        minWidth: '120px'
      },
      ...(activeTab === "old" ? [
        {
          name: 'Year',
          selector: row => row.YEAR1 || "",
          sortable: true,
          cell: row => <span>{row.YEAR1 || "उपलब्ध नहीं"}</span>,
          minWidth: '100px'
        }
      ] : []),
      {
        name: 'Date',
        selector: row => row.ENROLL_DT || row.COMP_DT || row.cause_date || "",
        sortable: true,
        cell: row => <span>{formatDate(row.ENROLL_DT || row.COMP_DT || row.cause_date)}</span>,
        minWidth: '120px'
      },
      {
        name: 'Complainant',
        selector: row => row.COMP_NM || row.complainant_name || "",
        sortable: true,
        cell: row => <span className="kruti-input text-[17px]">{row.COMP_NM || row.complainant_name || "miyC/k ugha"}</span>,
        minWidth: '160px'
      },
      {
  name: 'Respondent',
  selector: row =>
    activeTab === "new"
      ? row.respondent_name || ""
      : row.OFF_NAME || "",

  sortable: true,

  cell: row => (
    <span className="kruti-input text-[17px]">
      {activeTab === "new"
        ? (row.respondent_name || "miyC/k ugha")
        : (row.OFF_NAME || "miyC/k ugha")}
    </span>
  ),

  minWidth: '160px'
},
      // {
      //   name: 'Respondent Designation',
      //   selector: row => row.OFF_DESG || "",
      //   sortable: true,
      //   cell: row => <span className="kruti-input text-[17px]">{row.OFF_DESG || "miyC/k ugha"}</span>,
      //   minWidth: '200px'
      // },
      {
        name: 'District',
        selector: row => row.DISTT || "",
        sortable: true,
        cell: row => <span className="text-[17px] kruti-input">{row.DISTT || "miyC/k ugha"}</span>,
        minWidth: '120px'
      },
      {
        name: 'Department',
        selector: row => row.DEPTT || "",
        sortable: true,
        cell: row => <span className="text-[17px] kruti-input">{row.DEPTT || "miyC/k ugha"}</span>,
        minWidth: '160px'
      },
      ...(activeTab === "old" ? [
        {
          name: 'SUBJECT',
          selector: row => row.SUB1 || "",
          sortable: true,
          cell: row => (
            <span className="kruti-input break-words whitespace-normal text-[17px] block leading-6">
              {row?.SUB2 ? `${row?.SUB1} / ${row?.SUB2}` : row?.SUB1}
            </span>
          ),
          minWidth: '220px'
        },
        {
          name: 'Address',
          selector: row => row.ADD1 || "",
          sortable: true,
          cell: row => <span className="kruti-input text-[17px]">{row.ADD1 || "miyC/k ugha"}</span>,
          minWidth: '160px'
        },
        {
          name: 'NATURE',
          selector: row => row.NATURE || "",
          sortable: true,
          cell: row => {
            const isComplaint = row.NATURE == 1;
            const isAssertion = row.NATURE == 2;
            
            return (
              <span className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${isAssertion ? 'bg-gray-100 text-gray-600' : isComplaint ? 'bg-gray-100 text-gray-600' : 'bg-gray-100 text-gray-600'}`}>
                {isComplaint ? "शिकायत" : isAssertion ? "अभिकथन" : row.NATURE || "उपलब्ध नहीं"}
              </span>
            );
          },
          minWidth: '110px'
        },
        {
          name: 'DISPOSE',
          selector: row => row.DISPOSE || "",
          sortable: true,
          cell: row => (
             <span className={`kruti-input text-[17px] ${row.DISPOSE == 1 ? "text-gray-800" : "bg-blue-600 text-white px-2 py-0.5 rounded"}`}>
              {row.DISPOSE == 1 ? "fMiksTM+" : "ukWV fMiksTM+"}
            </span>
          ),
          minWidth: '130px'
        }
      ] : []),
      {
        name: 'ACTION',
        cell: row => (
          <div className="flex flex-col gap-2 w-full py-2">
            {activeTab === "old" ? (
              <>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleViewCP(row.id || row.COMP_NO || row.complain_no)}
                    disabled={fileLoading}
                    className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded hover:bg-blue-100 transition text-xs font-semibold disabled:opacity-50 w-16 justify-center"
                  >
                    <FaEye /> CP
                  </button>
                 
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleViewNP(row.id || row.COMP_NO || row.complain_no)}
                    disabled={fileLoading}
                    className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded hover:bg-green-100 transition text-xs font-semibold disabled:opacity-50 w-16 justify-center"
                  >
                    <FaFileAlt /> NP
                  </button>
                 
                </div>
              </>
            ) : (
              <button
                onClick={() => navigate(`/operator/all-complaints/view/${row.id}`)}
                className="flex items-center gap-2 px-3 py-1.5 w-full justify-center bg-purple-50 text-purple-700 border border-purple-200 rounded hover:bg-purple-100 transition text-sm shadow-sm"
              >
                <FaEye className="text-purple-600" /> View Detail
              </button>
            )}
          </div>
        ),
        minWidth: '130px'
      }
    ];
    return baseCols;
  }, [activeTab, currentPage, itemsPerPage, fileLoading, results]);

  const customTableStyles = {
    headRow: {
      style: {
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        color: '#374151',
        fontSize: '0.75rem',
        fontWeight: 'bold',
        textTransform: 'uppercase',
      },
    },
    headCells: {
      style: {
        paddingLeft: '16px', 
        paddingRight: '16px',
        '&:hover': {
          color: '#2563eb', 
        },
      },
    },
    cells: {
      style: {
        fontSize: '0.875rem',
        color: '#4b5563',
        paddingTop: '12px',
        paddingBottom: '12px',
        paddingLeft: '16px',
        paddingRight: '16px',
      },
    },
    rows: {
      style: {
        '&:not(:last-of-type)': {
          borderBottomStyle: 'solid',
          borderBottomWidth: '1px',
          borderBottomColor: '#f3f4f6',
        },
      },
    },
  };

  return (
    <div className="bg-gray-50 min-h-screen relative">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-sm p-4">
        
        <h2 className="text-base sm:text-lg font-bold mb-4 text-gray-900 whitespace-nowrap">
         Request Complaint File
        </h2>

        {/* --- Tabs UI --- */}
        <div className="flex space-x-4 mb-4 border-b border-gray-200">
          <button
            onClick={() => { setActiveTab("old"); setResults([]); }}
            className={`pb-2 px-1 text-sm font-medium ${
              activeTab === "old"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Old Complain
          </button>
          <button
            onClick={() => { setActiveTab("new"); setResults([]); }}
            className={`pb-2 px-1 text-sm font-medium ${
              activeTab === "new"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            New Complain
          </button>
        </div>
        
        {/* --- Filters Section --- */}
        <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 items-end w-full">

            {activeTab === "old" ? (
              <>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">File No</label>
                  <input
                    type="text"
                    placeholder="शिकायतें, फ़ाइल संख्या"
                    value={compFile}
                    onChange={(e) => {
                      const filtered = e.target.value.replace(/[^0-9/-]/g, "");
                      setCompFile(filtered);
                    }}
                    inputMode="numeric"
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

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Complainant</label>
                  <input
                    type="text"
                    placeholder="शिकायतकर्ता"
                    value={corrResp}
                    onChange={(e) => setCorrResp(e.target.value)}
                    className="w-full px-3 py-1 kruti-input text-lg placeholder:text-sm placeholder:font-sans border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Respondent</label>
                  <input
                    type="text"
                    placeholder="प्रत्यर्थी"
                    value={OffName}
                    onChange={(e) => setOffName(e.target.value)}
                    className="w-full px-3 py-1 kruti-input text-lg placeholder:text-sm placeholder:font-sans border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Subject</label>
                  <input
                    type="text"
                    placeholder="विषय"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-1 kruti-input text-lg placeholder:text-sm placeholder:font-sans border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Complain No</label>
                  <input
                    type="text"
                    placeholder="शिकायत संख्या"
                    value={complainNo}
                    onChange={(e) => setComplainNo(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Complainant</label>
                  <input
                    type="text"
                    placeholder="शिकायतकर्ता"
                    value={complainant}
                    onChange={(e) => setComplainant(e.target.value)}
                    className="w-full px-3 py-1 kruti-input text-lg placeholder:text-sm placeholder:font-sans border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Respondent</label>
                  <input
                    type="text"
                    placeholder="प्रत्यर्थी"
                    value={respondant}
                    onChange={(e) => setRespondant(e.target.value)}
                    className="w-full px-3 py-1 kruti-input text-lg placeholder:text-sm placeholder:font-sans border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">District</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${
                  district ? "kruti-input text-[16px]" : "text-sm font-sans"
                }`}
              >
                <option value="" className="font-sans text-sm">All Districts</option>
                
                {!loadingDistricts && districtsList?.map((d) => (
                  <option key={d.id} value={d.id} className="kruti-input text-[16px]">
                    {d.district_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${
                  department ? "kruti-input text-[16px]" : "text-sm font-sans"
                }`}
              >
                <option value="" className="font-sans text-sm">All Departments</option>
                
                {!loadingDepartments && departmentsList?.map((d) => (
                  <option key={d.id} value={d.id} className="kruti-input text-[16px]">
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Enrollment From Date</label>
              <input
                type="date"
                value={enrollmentFromDate}
                onChange={(e) => setEnrollmentFromDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Enrollment To Date</label>
              <input
                type="date"
                value={enrollmentToDate}
                onChange={(e) => setEnrollmentToDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Complaint Date</label>
              <input
                type="date"
                value={complaintDate}
                onChange={(e) => setComplaintDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Nature</label>
              <select
                value={nature}
                onChange={(e) => setNature(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Select Nature</option>
                <option value="1">Complaint</option>
                <option value="2">Assertion</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 bg-white"
              />
            </div>

           {/* --- Buttons Area (Search + Export) --- */}
            <div className="flex items-center gap-3 w-full">
              <button
                onClick={() => handleSearch(1)}
                disabled={isLoading}
                className={`flex-1 flex items-center justify-center gap-2 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors h-[38px] ${
                  isLoading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 shadow-sm"
                }`}
              >
                {isLoading ? <FaSpinner className="animate-spin" /> : <FaSearch className="text-sm" />}
                {isLoading ? "Searching..." : "Search"}
              </button>

              <button
                onClick={handleExportExcel}
                disabled={results.length === 0}
                className={`flex-1 flex items-center justify-center gap-2 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors h-[38px] shadow-sm ${
                  results.length === 0 
                  ? "bg-green-400 cursor-not-allowed opacity-70" 
                  : "bg-green-600 hover:bg-green-700"
                }`}
              >
                <FaFileExcel className="text-sm" />
                Export 
              </button>
            </div>

          </div>
        </div>

        {/* --- React Data Table Section --- */}
        <div className="rounded-md border border-gray-200 bg-white relative z-0 overflow-hidden">
          <DataTable
            columns={columns}
            data={results}
            progressPending={isLoading}
            progressComponent={
              <div className="px-4 py-8 text-center text-gray-500 w-full">
                Searching records...
              </div>
            }
            noDataComponent={
              <div className="p-8 text-center text-gray-500 w-full">
                No records found. Please enter details and click Search.
              </div>
            }
            customStyles={customTableStyles}
            highlightOnHover
            responsive
          />
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

      {/* --- Popup Modal for Viewing Files --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden animate-slideDown">
            <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <FaEye className="text-blue-600" />
                {modalTitle}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-gray-400 hover:text-red-500 bg-gray-200 hover:bg-red-100 p-2 rounded-full transition-colors"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex-1 w-full h-full bg-gray-100 p-2">
              <iframe
                src={modalFileUrl}
                className="w-full h-full border-0 rounded-md shadow-sm bg-white"
                title={modalTitle}
              ></iframe>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Reporting;