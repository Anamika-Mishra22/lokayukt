import React, { useState } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast'; 
import { FaPlus } from "react-icons/fa";

import { MdNoteAdd } from "react-icons/md";

const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";
const token = Cookies.get("access_token");

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

const AddLetter = () => {
  // फॉर्म डेटा स्टोर करने के लिए State
  const [formData, setFormData] = useState({
    row_no: '',
    rack: '',
    row: '',
    record: '',
    almirah: '',
    letter_no: '',
    year: '',
    subject: ''
  });

  // ✅ लोडिंग स्टेट (Submit बटन के लिए)
  const [isLoading, setIsLoading] = useState(false);

  // इनपुट चेंज हैंडलर
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // ✅ फॉर्म सबमिट हैंडलर (API Call और Toaster के साथ)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsLoading(true); // ✅ सबमिट शुरू होते ही लोडिंग चालू करें

    try {
      // /dispatch/add-record पर पूरा formData भेजा जा रहा है
      const response = await api.post('/dispatch/add-record', formData); 
      
      console.log("Success:", response.data);
      toast.success("Record added successfully!"); 
      
      // फॉर्म सबमिट होने के बाद सारे इनपुट खाली कर दें
      setFormData({ 
        row_no: '', 
        rack: '', 
        row: '', 
        record: '', 
        almirah: '', 
        letter_no: '', 
        year: '', 
        subject: '' 
      });

    } catch (error) {
      console.error("Error adding record:", error);
      toast.error(error?.response?.data?.message || "Failed to add record. Please try again."); 
    } finally {
      setIsLoading(false); // ✅ API कॉल (success या error) पूरी होने के बाद लोडिंग बंद करें
    }
  };

  return (
    <div className="mx-auto bg-white p-4 rounded-lg ">
      <Toaster position="top-right" /> 
      
      <h2 className="flex items-center gap-2 text-base sm:text-lg font-bold text-gray-900 mb-4 border-b pb-2">
        <MdNoteAdd className="text-blue-600" />
            Add New Record
        </h2>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Letter No
          </label>
          <input
            type="text"
            name="letter_no"
            value={formData.letter_no}
            onChange={(e) => {
              let value = e.target.value;

              // sirf number + slash allow
              value = value.replace(/[^0-9/]/g, "");

              handleChange({
                target: {
                  name: "letter_no",
                  value: value,
                },
              });
            }}
            inputMode="numeric"
            placeholder="Enter Letter No"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Row No */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Row No
          </label>
          <input
            type="text"
            name="row_no"
            value={formData.row_no}
            onChange={(e) => {
              let value = e.target.value;

              // sirf number + dash allow
              value = value.replace(/[^0-9/-]/g, "");

              handleChange({
                target: {
                  name: "row_no",
                  value: value,
                },
              });
            }}
            inputMode="numeric"
            placeholder="Enter Row No"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Rack */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rack
          </label>
          <input
            type="text"
            name="rack"
            value={formData.rack}
            onChange={(e) => {
              let value = e.target.value;

              // sirf numbers allow
              value = value.replace(/[^0-9]/g, "");

              handleChange({
                target: {
                  name: "rack",
                  value: value,
                },
              });
            }}
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Enter Rack"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Row */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Row
          </label>
          <input
            type="text"
            name="row"
            value={formData.row}
            onChange={(e) => {
              let value = e.target.value;

              // sirf numbers allow
              value = value.replace(/[^0-9]/g, "");

              handleChange({
                target: {
                  name: "row",
                  value: value,
                },
              });
            }}
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Enter Row"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Record */}
        <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Record
  </label>
  <input
    type="text"
    name="record"
    value={formData.record}
    onChange={(e) => {
      let value = e.target.value;

      // ✅ sirf numbers allow
      value = value.replace(/[^0-9]/g, "");

      handleChange({
        target: {
          name: "record",
          value: value,
        },
      });
    }}
    inputMode="numeric"
    pattern="[0-9]*"
    placeholder="Enter Record"
    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>

        {/* Almirah */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Almirah
          </label>
          <input
            type="text"
            name="almirah"
            value={formData.almirah}
            onChange={(e) => {
              let value = e.target.value;

              // sirf numbers allow
              value = value.replace(/[^0-9]/g, "");

              handleChange({
                target: {
                  name: "almirah",
                  value: value,
                },
              });
            }}
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Enter Almirah"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Year */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Year
          </label>
          <input
            type="text"
            name="year"
            value={formData.year}
            onChange={(e) => {
              let value = e.target.value;

              // sirf numbers allow
              value = value.replace(/[^0-9]/g, "");

              // max 4 digit (year ke liye)
              if (value.length > 4) return;

              handleChange({
                target: {
                  name: "year",
                  value: value,
                },
              });
            }}
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Enter Year"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Subject (Full Width & Krutidev Class) */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder='fo"k; ntZ djsa'
            className="kruti-input w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2 mt-4 flex justify-end">
          <button
            type="submit"
            disabled={isLoading} // ✅ लोडिंग के दौरान बटन को डिसेबल करें
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
              
                Submitting...
              </>
            ) : (
              "Submit"
            )}
          </button>
        </div>
        
      </form>
    </div>
  );
}

export default AddLetter;