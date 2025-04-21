// src/config/ApiConfig.jsx
import { endpoints } from "./endpoint";
import axios from "axios";

export const handlePdfUpload = {
  uploadPDF: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    // Use the native fetch API to make the API call.
    return await fetch(endpoints.uploadPDF, {
      method: "POST",
      body: formData,
    });
  },

  getAllPDFs: async () => {
    // Use axios for non-streaming API calls.
    const res = await axios.get(endpoints.listPDFs);
    return res.data;
  },
};
