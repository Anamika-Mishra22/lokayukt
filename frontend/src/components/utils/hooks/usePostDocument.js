import { useState } from 'react';
import axios from 'axios';
import { toast } from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://127.0.0.1:8000/api";
const token = Cookies.get("access_token");

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

export const usePostDocument = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const submitDocument = async (newDoc, complaintId, onSuccess) => {
    setErrors({});
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      
      // File append karein
      if (newDoc.file) {
        formData.append("file", newDoc.file);
      } else {
        formData.append("file", ""); 
      }

      // Baaki details append karein
      formData.append("type", newDoc.type || ""); 
      formData.append("title", newDoc.title || ""); 
      formData.append("complain_id", complaintId);
      
      // ✅ LocalStorage se ID aur Name nikal kar bhejein
      formData.append("user_id", Cookies.get("id") || "");
      formData.append("user_name", Cookies.get("name") || "");

      const response = await api.post("/supervisor/upload-document", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Document uploaded successfully!");
      if (onSuccess) onSuccess(); // Upload hone ke baad refresh karne ke liye

    } catch (error) {
      console.error("Upload failed", error);
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        const msg = error.response?.data?.message || "Failed to upload document.";
        toast.error(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitDocument, isSubmitting, errors, setErrors };
};