import axios from 'axios';
import React, { useState } from 'react';
import { FiSearch, FiUploadCloud, FiLink, FiFileText } from 'react-icons/fi';

const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";
const token = Cookies.get("access_token");

// Create axios instance with authorization
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

const SendFile = () => {
  const [uploadType, setUploadType] = useState('file'); // 'file' or 'path'
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePath, setFilePath] = useState('');
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

const handleSearch = async () => {
  setLoading(true);
  setErrorMsg('');
  setTableData([]);

  try {
    let response;

    if (uploadType === 'file') {
      // ✅ FILE → POST
      const formData = new FormData();
      formData.append('file', selectedFile);

      response = await api.post(
        '/supervisor/get-file-pages-count',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

    } else {
      // ✅ PATH → GET
      response = await api.post(
        '/supervisor/get-file-pages-count',
      {path: filePath}
            
         
      );
    }

    const result = response.data;

    // ✅ tera existing mapping logic same rahega
    if (result.status) {
      if (result.type === 'single_file') {
        setTableData([
          {
            id: 1,
            file_name: result.data.file_name,
            total_pages: result.data.total_pages
          }
        ]);
      } else if (result.type === 'folder_scan') {
        const mappedData = result.data.map((item, index) => ({
          id: index + 1,
          file_name: item.file_name,
          total_pages: item.total_pages
        }));
        setTableData(mappedData);
      }
    }

  } catch (error) {
    console.error(error);
    setErrorMsg(error.response?.data?.message || 'Error');
  } finally {
    setLoading(false);
  }
};
  // 🔸 Safe calculation to ignore 'Error reading PDF' strings
  const totalPagesSum = tableData.reduce((sum, item) => {
    const pages = parseInt(item.total_pages);
    return sum + (isNaN(pages) ? 0 : pages);
  }, 0);

  return (
    <div className="min-h-screen  bg-gray-50 flex flex-col items-center">
      
      <div className="w-full  bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800">
          <FiFileText className="text-blue-600 text-2xl" />
          Send File
        </h2>

        <div className="flex items-center gap-6 mb-6 p-3 bg-gray-50 rounded-md border border-gray-100">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="uploadType"
              value="file"
              checked={uploadType === 'file'}
              onChange={() => {
                setUploadType('file');
                setTableData([]);
                setErrorMsg('');
              }}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="text-gray-700 font-medium">Upload PDF File</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="uploadType"
              value="path"
              checked={uploadType === 'path'}
              onChange={() => {
                setUploadType('path');
                setTableData([]);
                setErrorMsg('');
              }}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="text-gray-700 font-medium">Scan Folder Path</span>
          </label>
        </div>

        <div className="mb-6">
          {uploadType === 'file' ? (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-600">Select PDF from Device</label>
              <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-md bg-white">
                <FiUploadCloud className="text-gray-400 text-xl" />
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-600">Enter Server Folder Path</label>
              <div className="flex items-center gap-3 p-1 border border-gray-200 rounded-md bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
                <div className="pl-3">
                  <FiLink className="text-gray-400 text-xl" />
                </div>
                <input
                  type="text"
                  value={filePath}
                  onChange={(e) => setFilePath(e.target.value)}
                  placeholder="e.g., C:/xampp/htdocs/pdfs or /var/www/pdfs"
                  className="w-full py-2 pr-3 outline-none bg-transparent text-gray-700"
                />
              </div>
            </div>
          )}
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-md text-sm">
            {errorMsg}
          </div>
        )}

        <div className="flex justify-end mt-4 border-t border-gray-100 pt-4">
          <button
            onClick={handleSearch}
            disabled={loading || (uploadType === 'file' && !selectedFile) || (uploadType === 'path' && !filePath)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-md font-medium transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed shadow-sm"
          >
            {loading ? (
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
            ) : (
              <FiSearch className="text-lg" />
            )}
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {tableData.length > 0 && (
        <div className="w-full  mt-6 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Scan Results</h2>
            <span className="text-sm text-gray-500">{tableData.length} file(s) processed</span>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-white">
                <tr className="text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200 shadow-sm">
                  <th className="px-6 py-4 font-medium">S.No</th>
                  <th className="px-6 py-4 font-medium">File Name</th>
                  <th className="px-6 py-4 font-medium text-right">Pages</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tableData.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-500">{row.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-800 font-medium">{row.file_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 text-right">
                      {isNaN(row.total_pages) ? (
                        <span className="text-red-500 text-xs">{row.total_pages}</span>
                      ) : (
                        row.total_pages
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="bg-blue-50 border-t-2 border-blue-100 flex justify-between items-center px-6 py-5">
            <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Total:
            </span>
            <span className="text-lg font-bold text-blue-700">
              {totalPagesSum}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SendFile;