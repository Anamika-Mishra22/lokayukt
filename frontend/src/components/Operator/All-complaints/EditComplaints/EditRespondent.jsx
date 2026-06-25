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

const EditRespondent = ({ respondentId, closePopup }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({});

  // 1. Fetch Respondent Data
  const { data, isLoading, error } = useQuery({
    queryKey: ["edit-respondent", respondentId],
    queryFn: async () => {
      const res = await api.get(`/operator/respondent-edit/${respondentId}`);
      return res.data.data;
    },
    enabled: !!respondentId,
  });

  // 2. Fetch District List
  const { data: districtData, isLoading: districtLoading } = useQuery({
    queryKey: ["district-api"],
    queryFn: async () => {
      const res = await api.get("/operator/all-district"); 
      return res.data.data;
    },
  });

  // 3. Fetch Designation List (पदनाम)
  const { data: designationData, isLoading: designationLoading } = useQuery({
    queryKey: ["designation-api"],
    queryFn: async () => {
      const res = await api.get("/operator/designation"); 
      return res.data.data;
    },
  });

  // 4. Fetch Category List (अधिकारी की श्रेणी)
  const { data: categoryData, isLoading: categoryLoading } = useQuery({
    queryKey: ["category-api"],
    queryFn: async () => {
      const res = await api.get("/operator/categories"); 
      return res.data.data;
    },
  });

  // 5. Fetch Department List (विभाग) - Naya add kiya gaya
  const { data: departmentData, isLoading: departmentLoading } = useQuery({
    queryKey: ["department-api"],
    queryFn: async () => {
      const res = await api.get("/operator/department"); 
      return res.data.data;
    },
  });

  useEffect(() => {
    if (data) {
      setFormData({
        respondent_name: data.respondent_name || "",
        designation: data.designation || "",
        department_name: data.department_name || "",
        officer_category: data.officer_category || "",
        current_address: data.current_address || "",
        respondent_district: data.respondent_district || "", // Set default district ID
      });
    }
  }, [data]);

  // 6. Mutation for Updating Data
  const updateMutation = useMutation({
    mutationFn: async (updatedData) => {
      const res = await api.post(
        `/operator/respondent-update/${respondentId}`,
        updatedData
      );
      return res.data;
    },
    onSuccess: (response) => {
      toast.success(response.message || "सफलतापूर्वक अपडेट किया गया!");
      // डेटा को रीफ्रेश करने के लिए
      queryClient.invalidateQueries(["edit-respondent", respondentId]);
      queryClient.invalidateQueries(["complaint-details"]); 
      
      // थोड़ा रुककर पॉपअप बंद करें ताकि टोस्ट दिख सके
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
      
      <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-3">प्रतिवादी का विवरण संपादित करें</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* 1. प्रतिवादी का नाम */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">प्रतिवादी का नाम</label>
          <input
            type="text"
            name="respondent_name" 
            value={formData.respondent_name || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 kruti-input"
          />
        </div>

        {/* 2. पदनाम (Dropdown) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">पदनाम</label>
          <select
            name="designation"
            value={formData.designation || ""}
            onChange={handleChange}
            disabled={designationLoading}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              formData.designation ? " text-[16px]" : "font-sans text-sm text-gray-500"
            }`}
          >
            <option value="" className="font-sans text-sm text-gray-500">Select Designation</option>
            {designationData?.map((desig, i) => (
              <option key={i} value={desig.name} className=" text-[16px] text-black">
                {desig.name} / {desig.name_h}
              </option>
            ))}
          </select>
        </div>

        {/* 3. विभाग (Dropdown) - Updated */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">विभाग</label>
        <select
            name="department_name"
            value={formData.department_name || ""}
            onChange={handleChange}
            disabled={departmentLoading}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              formData.department_name ? "kruti-input text-[16px]" : "font-sans text-sm text-gray-500"
            }`}
          >
            <option value="" className="font-sans text-sm text-gray-500">lhySDV fMikVZesaV</option>
            {departmentData?.map((dept, i) => (
              <option key={i} value={dept.name} className="kruti-input text-[16px] text-black">
                {dept.name} / {dept.name_hindi}
              </option>
            ))}
          </select>
        </div>

        {/* 4. जिला (District Dropdown) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">जिला</label>
          <select
            name="respondent_district" 
            value={formData.respondent_district || ""}
            onChange={handleChange}
            disabled={districtLoading}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              formData.respondent_district ? "kruti-input text-[16px]" : "font-sans text-sm text-gray-500"
            }`}
          >
      <option value="" className="kruti-input text-sm text-gray-500">
 fMfLVªDV pqus
</option>
            {districtData?.map((dist) => (
              <option key={dist.id} value={dist.id} className="kruti-input text-[16px] text-black">
                {dist.dist_new || dist.district_name || dist.name}
              </option>
            ))}
          </select>
        </div>

        {/* 5. अधिकारी की श्रेणी (Dropdown) */}
       <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">अधिकारी की श्रेणी</label>
  <select
    name="officer_category"
    value={formData.officer_category || ""}
    onChange={handleChange}
    disabled={categoryLoading}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${
      formData.officer_category ? "kruti-input text-[20px]" : "font-sans text-sm text-gray-500"
    }`}
  >
    {/* <option value="" className="font-sans text-sm text-gray-500">JsUkh pqusa</option> */}
    {categoryData?.map((cat, i) => (
      <option key={i} value={cat.name} className="kruti-input text-[20px] text-black">
        {cat.name} / {cat.name_h}
      </option>
    ))}
  </select>
</div>
      </div>

      {/* 6. वर्तमान पता */}
      <div className="mt-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">वर्तमान पता</label>
        <textarea
          name="current_address"
          value={formData.current_address || ""}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 kruti-input resize-none"
          rows="3"
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 mt-8 border-t pt-5">
        <button
          onClick={closePopup}
          disabled={updateMutation.isPending}
          className="px-6 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition-colors font-medium"
        >
          बंद करें
        </button>

        <button
          onClick={handleSubmit}
          disabled={updateMutation.isPending}
          className="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-sm"
        >
          {updateMutation.isPending ? "अपडेट हो रहा है..." : "अपडेट करें"}
        </button>
      </div>

    </div>
  );
};

export default EditRespondent;