import axios from "axios";
import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
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

const EditSikayte = ({ complaintId, closePopup }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({});

  // 1. Fetch Complainant Data
  const { data, isLoading, error } = useQuery({
    queryKey: ["edit-complaint", complaintId],
    queryFn: async () => {
      const res = await api.get(`/operator/complainant-edit/${complaintId}`);
      return res.data.data;
    },
    enabled: !!complaintId,
  });

  // 2. Fetch District List (To show names in dropdown)
  const { data: districtData, isLoading: districtLoading } = useQuery({
    queryKey: ["district-api"],
    queryFn: async () => {
      const res = await api.get("/operator/all-district"); // Adjust this endpoint if needed
      return res.data.data;
    },
  });

  useEffect(() => {
    if (data) {
      setFormData({
        complainant_name: data.complainant_name || "",
        father_name: data.father_name || "",
        occupation: data.occupation || "",
        is_public_servant: data.is_public_servant || "",
        permanent_place: data.permanent_place || "",
        permanent_district: data.permanent_district || "", // Set default district ID
      });
    }
  }, [data]);

  // 3. Mutation for Updating Data
  const updateMutation = useMutation({
    mutationFn: async (updatedData) => {
      const res = await api.post(
        `/operator/complainant-update/${complaintId}`,
        updatedData
      );
      return res.data;
    },
    onSuccess: (response) => {
      toast.success(response.message || "सफलतापूर्वक अपडेट किया गया!");
      
      queryClient.invalidateQueries(["edit-complaint", complaintId]);
      queryClient.invalidateQueries(["complaint-details"]); 
      
      setTimeout(() => {
        closePopup();
      }, 2000);
    },
    onError: (err) => {
      console.error("Update Error:", err);
      toast.error(err.response?.data?.message || "अपडेट करने में विफल।");
    },
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    // Make sure we are sending the district ID
    updateMutation.mutate(formData);
  };

  // Centered Loading State
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <p className="text-gray-600  text-lg">Loading...</p>
      </div>
    );
  }

  // Centered Error State
  if (error) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <p className="text-red-500 font-medium text-lg">Error loading data.</p>
      </div>
    );
  }

  return (
    <div className="p-6 overflow-y-auto h-full relative">
      <Toaster position="top-right" />
      
      <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">शिकायतकर्ता का विवरण संपादित करें</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* 1. नाम */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">नाम</label>
          <input
            type="text"
            name="complainant_name" 
            value={formData.complainant_name || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 kruti-input"
          />
        </div>

        {/* 2. पिता का नाम */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 ">पिता का नाम</label>
          <input
            type="text"
            name="father_name"
            value={formData.father_name || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 kruti-input"
          />
        </div>

        {/* 3. जिला */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">जिला</label>
          <select
            name="permanent_district" 
            value={formData.permanent_district || ""}
            onChange={handleChange}
            disabled={districtLoading}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              formData.permanent_district ? "kruti-input text-[16px]" : "font-sans text-sm text-gray-500"
            }`}
          >
            <option value="" className="font-sans text-sm text-gray-500">fMfLVªDV pqus</option>
            {districtData?.map((dist) => (
              <option key={dist.id} value={dist.id} className="kruti-input text-[16px] text-black">
                {dist.dist_new || dist.district_name || dist.name}
              </option>
            ))}
          </select>
        </div>

        {/* 4. व्यवसाय */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 ">व्यवसाय</label>
          <input
            type="text"
            name="occupation"
            value={formData.occupation || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 kruti-input"
          />
        </div>

        {/* 5. लोक सेवक? (Dropdown) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 ">लोक सेवक</label>
          <select
            name="is_public_servant"
            value={formData.is_public_servant || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">चयन करें</option>
            <option value="yes">हाँ (Yes)</option>
            <option value="no">नहीं (No)</option>
          </select>
        </div>
      </div>

      {/* 6. पूरा पता */}
      <div className="mt-5">
        <label className="block text-sm font-medium text-gray-700 mb-1 ">पूरा पता</label>
        <textarea
          name="permanent_place"
          value={formData.permanent_place || ""}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 kruti-input resize-none"
          rows="3"
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 mt-8 border-t pt-4">
        <button
          onClick={closePopup}
          disabled={updateMutation.isPending}
          className="px-5 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition-colors"
        >
          बंद करें
        </button>

        <button
          onClick={handleSubmit}
          disabled={updateMutation.isPending}
          className="px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {updateMutation.isPending ? "अपडेट हो रहा है..." : "अपडेट करें"}
        </button>
      </div>

    </div>
  );
};

export default EditSikayte;