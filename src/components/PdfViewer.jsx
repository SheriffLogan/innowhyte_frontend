import React, { useEffect, useState } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";


export default function PDFViewer({ file, currentPage, alreadyOnPage  }) {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [showNotice, setShowNotice] = useState(false);

  const navPluginInstance = pageNavigationPlugin();
  const { jumpToPage } = navPluginInstance;

  useEffect(() => {
    if (!file) {
      setPdfUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPdfUrl(url);
    return () => {
      URL.revokeObjectURL(url);
      setPdfUrl(null);
    };
  }, [file]);

  useEffect(() => {
    if (pdfUrl && currentPage !== null && typeof jumpToPage === "function") {
      jumpToPage(currentPage - 1);
    }
  }, [currentPage, pdfUrl, jumpToPage]);

  useEffect(() => {
    if (alreadyOnPage) {
        setShowNotice(true);
      }
  }, [alreadyOnPage]);
  
  useEffect(() => {
    if (showNotice) {
        const id = setTimeout(() => setShowNotice(false), 1000);
        return () => clearTimeout(id);
      }
  }, [showNotice]);

  if (!pdfUrl) {
    return (
      <div style={{
        color: "white",
        fontSize: "1.5rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}>
        Pdf Viewer
      </div>
    );
  }

  return (
    <div
      style={{
        marginTop: "24px",
        height: "100%",
        border: "1px solid #ccc",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
    {showNotice && (
        <div style={{
          position: "absolute",
          top: "8px",
          right: "8px",
          background: "rgba(0,0,0,0.6)",
          color: "white",
          padding: "4px 8px",
          borderRadius: "4px",
          fontSize: "0.9rem",
          zIndex: 10
        }}>
          Already on page
        </div>
      )}
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <Viewer fileUrl={pdfUrl} plugins={[navPluginInstance]} />
      </Worker>
    </div>
  );
}
