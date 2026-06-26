import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; 
import { FaArrowUpLong, FaFilePdf } from "react-icons/fa6";
import { FaTimes, FaEye } from "react-icons/fa";
import { FiUpload } from "react-icons/fi";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import Pagination from "../../../../../Pagination"; 
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

const uploadApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

const Documents = () => {
  const navigate = useNavigate()
  const { id } = useParams(); 

  const [correspondenceType, setCorrespondenceType] = useState("Letter");
  const [title, setTitle] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [documents, setDocuments] = useState([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);
  const [pdfViewUrl, setPdfViewUrl] = useState(null);

  const indexOfLastDoc = currentPage * itemsPerPage;
  const indexOfFirstDoc = indexOfLastDoc - itemsPerPage;

  const safeDocuments = Array.isArray(documents) ? documents : [];
  const currentDocuments = safeDocuments.slice(
    indexOfFirstDoc,
    indexOfLastDoc
  );

  const totalPages = Math.ceil(safeDocuments.length / itemsPerPage);

  // --- 1. FETCH DOCUMENTS API ---
  const fetchDocuments = async () => {
    if (!id) return; 
    setIsLoadingDocs(true);
    try {
      const res = await api.get(`/supervisor/get-letter-record/${id}`);
      if (res.data.status) {
        // Backend ab array of objects bhej raha hai: [{file_name: "...", url: "..."}]
        setDocuments(res.data.data || []);
        setCurrentPage(1);
      } else {
         setDocuments([]);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
      setDocuments([]);
    } finally {
      setIsLoadingDocs(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [id]); 

  // --- 2. UPLOAD LOGIC ---
  const handleFileUpload = (e) => {
    setFieldErrors((prev) => ({ ...prev, file: undefined }));

    const files = Array.from(e.target.files);
    const pdfFiles = files.filter((file) => file.type === "application/pdf");

    if (pdfFiles.length !== files.length) {
      toast.error("Only PDF files are allowed!");
      return;
    }

    setUploadedFiles((prevFiles) => {
      let updatedFiles = [...prevFiles];

      pdfFiles.forEach((file) => {
        const existingIndex = updatedFiles.findIndex(
          (f) => f.name === file.name
        );

        const newFileObj = {
          id: Date.now() + Math.random(),
          file,
          name: file.name,
          size: (file.size / 1024).toFixed(2),
          uploadDate: new Date().toLocaleDateString(),
        };

        if (existingIndex !== -1) {
          updatedFiles[existingIndex] = newFileObj;
        } else {
          updatedFiles.push(newFileObj);
        }
      });

      return updatedFiles;
    });

    e.target.value = null;
  };

  const handleRemoveFile = (fileId) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  const uploadDocument = async () => {
    setFieldErrors({});

    if (!id) return; 

    setIsUploading(true);

    try {
      const formData = new FormData();

      uploadedFiles.forEach((fileData, index) => {
        formData.append(`file[${index}]`, fileData.file);
      });
      formData.append("type", correspondenceType);
      formData.append("title", title);
      formData.append("id", id); 

      await uploadApi.post("/supervisor/upload-letter-record", formData);

      toast.success("Uploaded document successfully!"); 
      
      setTimeout(()=>{
        navigate("/letter/all-letters")
      }, 2000)
      setUploadedFiles([]);
      setTitle("");
      fetchDocuments();
    } catch (error) {
      console.error("Upload API Error:", error);
      
      const res = error.response?.data;
      if (res?.errors) {
        const newErrors = { ...res.errors };
        if (res.errors["file.0"]) {
          newErrors.file = res.errors["file.0"];
        }
        setFieldErrors(newErrors);
      } else {
        toast.error("Upload failed!");
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <div className="space-y-6 w-full">
        
        {/* --- DOCUMENT LIST --- */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-3">Existing Documents</h2>
          
          {isLoadingDocs ? (
            <div className="text-center py-4 text-gray-500">Loading documents...</div>
          ) : safeDocuments.length > 0 ? (
            <div className="grid gap-3">
              {currentDocuments.map((doc, index) => (
                <div 
                  key={index} 
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 overflow-hidden w-full sm:w-auto">
                    <div className="bg-red-50 p-2 rounded-lg flex-shrink-0">
                      <FaFilePdf className="text-red-500 text-xl" />
                    </div>
                    <div className="min-w-0 flex-1">
                      {/* Yahan doc.file_name use kiya hai backend ke hisaab se */}
                       <p className="text-sm kruti-input font-semibold text-gray-800 truncate">
                        {doc.file_name || "Untitled Document"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        PDF Document
                      </p>
                    </div>
                  </div>

                  <button
                    // Yahan doc.url use kiya hai view karne ke liye
                    onClick={() => setPdfViewUrl(doc.url)}
                    className="flex items-center justify-center gap-2 px-4 py-2 sm:px-3 sm:py-1.5 text-sm sm:text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors w-full sm:w-auto flex-shrink-0 mt-1 sm:mt-0"
                  >
                    <FaEye /> View
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 bg-gray-50 border border-dashed border-gray-300 rounded-xl text-center text-gray-500 text-sm">
              No documents found for this file.
            </div>
          )}
        </div>

        {safeDocuments.length > itemsPerPage && (
          <div className="overflow-x-auto">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={safeDocuments.length}
              itemsPerPage={itemsPerPage}
            />
          </div>
        )}

        {/* --- UPLOAD BOX --- */}
        <div className="p-4 sm:p-5 bg-blue-50 border border-blue-200 rounded-xl shadow-sm">
          <h2 className="text-[16px] sm:text-[18px] text-blue-900 font-semibold mb-2">
            Attach New Incoming Correspondence
          </h2>

          <p className="text-xs sm:text-sm text-blue-800 mb-4">
            Attach letters, reminders, RTI replies received after file movement.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                दस्तावेज़ का शीर्षक
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setFieldErrors((prev) => ({ ...prev, title: undefined }));
                }}
                placeholder="Add Title"
                className={`kruti-input text-[16px] border px-3 py-1 rounded-lg w-full bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder:!font-sans placeholder:!text-gray-500 placeholder:!text-sm placeholder:!tracking-normal ${
                  fieldErrors.title ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                पत्राचार का प्रकार
              </label>
              <select
                value={correspondenceType}
                onChange={(e) => {
                  setCorrespondenceType(e.target.value);
                  setFieldErrors((prev) => ({ ...prev, type: undefined }));
                }}
                className={`kruti-input text-[16px] border px-3 py-2 rounded-lg w-full bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                  fieldErrors.type ? "border-red-500" : "border-gray-300"
                }`}
              >
                {/* Kruti Dev mapping: 'kklu i= (शासन पत्र), vU; i= (अन्य पत्र) */}
                <option value="Shasan">'kklu i=</option>
                <option value="Other Letter">vU; i=</option>
              </select>
            </div>
          </div>

          <div className="mb-1">
            <label
              htmlFor="pdfUpload"
              className={`cursor-pointer w-full border-2 border-dashed rounded-xl p-5 sm:p-6 flex flex-col items-center justify-center text-center hover:bg-blue-100/50 transition ${
                fieldErrors.file
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 bg-white"
              }`}
            >
              <FaArrowUpLong className="text-2xl sm:text-3xl text-gray-400 mb-2" />
              <p className="font-medium text-gray-700 text-sm sm:text-base">
                Click to upload PDF(s)
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Only .pdf files are allowed
              </p>

              <input
                id="pdfUpload"
                type="file"
                accept="application/pdf"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Uploaded File List */}
        {uploadedFiles.length > 0 && (
          <div className="p-4 sm:p-5 bg-white border border-gray-200 rounded-xl shadow-sm">
            <h3 className="text-[15px] sm:text-[16px] font-semibold mb-3 sm:mb-4 text-gray-800">
              Selected Documents ({uploadedFiles.length})
            </h3>

            <div className="space-y-3">
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between gap-3 p-3 sm:p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    <FaFilePdf className="text-red-600 text-xl sm:text-2xl flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm sm:text-base text-gray-800 truncate">
                        {file.name}
                      </p>
                      <div className="flex flex-wrap gap-2 text-[11px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">
                        <span>{file.size} KB</span>
                        <span className="hidden sm:inline">•</span>
                        <span>{file.uploadDate}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveFile(file.id)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors flex-shrink-0"
                    aria-label="Remove file"
                  >
                    <FaTimes size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- BUTTONS SECTION --- */}
        <div className="flex flex-col items-end pt-2 gap-3">
          <button
            onClick={uploadDocument}
            disabled={isUploading}
            className="px-5 py-3 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed w-full sm:w-auto font-medium"
          >
            <FiUpload className="text-lg" />
            {isUploading ? "Uploading..." : "Upload Document"}
          </button>
        </div>

      </div>

      <Toaster position="top-right" />

      {/* --- PDF View Modal --- */}
      {pdfViewUrl && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-2 sm:p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl w-full max-w-5xl h-[95vh] sm:h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-3 sm:p-4 border-b bg-gray-50">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate pr-4">
                Document Viewer
              </h3>
              <button
                onClick={() => setPdfViewUrl(null)}
                className="p-1.5 sm:p-2 bg-gray-200 hover:bg-red-100 hover:text-red-600 rounded-full transition-colors text-gray-600 flex-shrink-0"
              >
                <FaTimes className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
            
            <div className="flex-1 w-full bg-gray-100 overflow-hidden relative">
              <iframe
                src={`${pdfViewUrl}#zoom=page-width`}
                className="absolute inset-0 w-full h-full border-0"
                title="PDF Viewer"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Documents;