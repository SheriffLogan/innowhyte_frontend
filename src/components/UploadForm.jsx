// src/components/UploadForm.jsx
import { useState } from "react";
import { handlePdfUpload } from "../config/ApiConfig";
import toast from "react-hot-toast";

// Simple spinner component using CSS animation
function Spinner() {
  return (
    <div style={{
      border: "3px solid #f3f3f3",
      borderTop: "3px solid #3b82f6",
      borderRadius: "50%",
      width: "16px",
      height: "16px",
      animation: "spin 1s linear infinite",
      margin: "0 auto"
    }} />
  );
}

// Keyframes for spinner animation
const spinnerStyles = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

export default function UploadForm({ onStream, setPdfFile, setIsLoading, resetSections  }) {
  const [file, setFile] = useState(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  const handleFileSelect = (selected) => {
    if (!selected) return;
    // Check MIME type and extension
    const isPdf = selected.type === "application/pdf" || selected.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      toast.error("Only PDF files are allowed!");
      return;
    }
    setFile(selected);
  };

  const handleUpload = async () => {
    if (!file) return toast.error("Please select a PDF file!");

    resetSections(); // ✅ clear previous summaries

    setPdfFile(file);
    setIsLoading(true);
    setIsSummarizing(true);
    toast.dismiss(); // Remove previous toasts if any
    const uploading = toast.loading("Summarizing");

    try {
      const response = await handlePdfUpload.uploadPDF(file);
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        for (let i = 0; i < parts.length - 1; i++) {
          let line = parts[i];
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.replace("data: ", ""));
              if (data.type && data.type === "error") {
                toast.error(data.message || "An error occurred.");
              } else {
                onStream(data);
              }
            } catch (e) {
              console.error("Error parsing SSE line:", line, e);
            }
          }
        }
        buffer = parts[parts.length - 1];
      }
      toast.success("Summarization complete!", { id: uploading });
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Something went wrong!", { id: uploading });
    } finally {
      setIsLoading(false);
      setIsSummarizing(false);
    }
  };

  return (
    <>
      <style>{spinnerStyles}</style>
      <div style={{
        border: "2px dashed #ccc",
        padding: "16px",
        borderRadius: "8px",
        textAlign: "center",
        marginBottom: "16px",
        minHeight: "150px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
      }}>
        <input
          id="file-upload"
          type="file"
          accept=".pdf,application/pdf"
          onChange={(e) => handleFileSelect(e.target.files[0])}
          style={{ display: "none" }}
        />
        <label htmlFor="file-upload" style={{
          cursor: "pointer",
          color: "#ccc",
          marginBottom: "25px",
          display: "block",
          margin: "0 auto"
        }}>
          &#128194; Select file
        </label>
        {file && (
          <div style={{
            marginTop: "8px",
            padding: "8px",
            backgroundColor: "#333",
            borderRadius: "4px",
            display: "inline-flex",
            width: "fit-content",
            margin: "0 auto"
          }}>
            <span style={{ color: "white", marginRight: "8px" }}>
              {file.name}
            </span>
            <button
              type="button"
              onClick={() => setFile(null)}
              title="Remove"
              style={{
                background: "transparent",
                border: "none",
                color: "#ccc",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "1rem",
                lineHeight: 1
              }}
              onMouseOver={(e) => e.currentTarget.style.color = "white"}
              onMouseOut={(e) => e.currentTarget.style.color = "#ccc"}
            >
              &times;
            </button>
          
          </div>
        )}
      </div>
      <button
        style={{
          backgroundColor: "white",
          color: "#333",
          padding: "8px 16px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          cursor: isSummarizing ? "not-allowed" : "pointer",
          transition: "all 0.3s ease",
          display: "block",
          margin: "0 auto"
        }}
        onClick={handleUpload}
        disabled={isSummarizing}
        onMouseOver={(e) => {
          if (!isSummarizing) {
            e.currentTarget.style.backgroundColor = "grey";
            e.currentTarget.style.color = "black";
          }
        }}
        onMouseOut={(e) => {
          if (!isSummarizing) {
            e.currentTarget.style.backgroundColor = "white";
            e.currentTarget.style.color = "#333";
          }
        }}
      >
        {isSummarizing ? <Spinner /> : "Summarize"}
      </button>
    </>
  );
}
