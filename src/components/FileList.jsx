// src/components/FileList.jsx
import { useState, useEffect, useRef  } from "react";
import { handlePdfUpload } from "../config/ApiConfig";
import toast from "react-hot-toast";

export default function FileList() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    async function fetchFiles() {
      try {
        const data = await handlePdfUpload.getAllPDFs();
        setFiles(data);
      } catch (error) {
        console.error(error);
        toast.error("Error fetching files");
      }
    }
    fetchFiles();
  }, []);

  return (
    <div
      style={{
        height: "205px",
        padding: "0",
        backgroundColor: "#111",
        borderRadius: "8px",
        border: "1px solid #ccc",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column"
      }}
    >
      {/* Fixed Header */}
      <div
        style={{
          padding: "12px",
          textAlign: "center",
          backgroundColor: "#111",
          color: "white",
          fontWeight: "bold",
          fontSize: "1.1rem",
          borderBottom: "1px solid #444",
          position: "sticky",
          top: 0,
          zIndex: 1
        }}
      >
        Existing Files
      </div>
  
      {/* Scrollable List */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "8px",
          display: "flex",
          flexDirection: "column",
          gap: "12px"
        }}
      >
        {files.map((file) => (
          <div
            key={file.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "12px",
              backgroundColor: "#222",
              transition: "transform 0.3s ease",
              cursor: "pointer",
              color: "white",
              fontWeight: "bold"
            }}
          >
            {file.name}
          </div>
        ))}
      </div>
    </div>
  );
  
}

