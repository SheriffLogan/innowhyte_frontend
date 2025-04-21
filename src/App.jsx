// src/App.jsx
import { useState } from "react";
import UploadForm from "./components/UploadForm";
import SummaryTable from "./components/SummaryTable";
import PDFViewer from "./components/PdfViewer";
import FileList from "./components/FileList";

export default function App() {
  const [sections, setSections] = useState([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const [pdfFile, setPdfFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(null);  // null until clicked
  const [alreadyOnPage, setAlreadyOnPage] = useState(false);
  const [refreshFiles, setRefreshFiles] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleStream = (data) => {
    if (data.type === "section") {
      // Update or add a section uniquely by its title.
      setSections(prev => {
        const index = prev.findIndex(item => item.section === data.section);
        if (index !== -1) {
          const updated = [...prev];
          updated[index] = { section: data.section, summary: data.summary, page: data.page || 1 };
          console.log("Updated section:", updated[index]);
          return updated;
        } else {
          return [...prev, { section: data.section, summary: data.summary, page: data.page || 1 }];
        }
      });
    } else if (data.type === "progress") {
      setOverallProgress(data.progress);
    }
  };

  const handleSelectSection = (page) => {
    if (page === currentPage) {
      // Trying to re-open same page
      setAlreadyOnPage(true);
      setTimeout(() => setAlreadyOnPage(false), 1000);
    } else {
      setAlreadyOnPage(false);
      setCurrentPage(page);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "black",
        minHeight: "100vh",
        padding: "16px",
        color: "white",
        boxSizing: "border-box",
      }}
    >
      
      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        marginBottom: "24px"
      }}>
        <div
          style={{
            display: "inline-block",
            padding: "16px",
            backgroundColor: "grey",
            borderRadius: "8px",
            marginBottom: "24px",
          }}
        >
          <h1
            style={{
              color: "black",
              textAlign: "center",
              fontSize: "2rem",
              fontWeight: "bold",
              margin: 0,
            }}
          >
            Document Analyzer
          </h1>
        </div>
      </div>
  
      {/* First Row: Uploader and FileList */}
      <div
        style={{
          display: "flex",
          gap: "36px",
          marginBottom: "24px",
          height: "250px",
          flexWrap: "wrap",

        }}
      >

  
        {/* File List */}
        <div
          style={{
            flex: "1 1 50%",
            backgroundColor: "#1f1f1f",
            padding: "16px",
            borderRadius: "8px",
            overflowY: "hidden",
            boxSizing: "border-box",
            

          }}
        >
          <FileList refresh={refreshFiles}/>
        </div>

        {/* Uploader */}
        <div
          style={{
            flex: "1 1 40%",
            backgroundColor: "#1f1f1f",
            padding: "16px",
            borderRadius: "8px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            boxSizing: "border-box",
          }}
        >
          <UploadForm
            onStream={handleStream}
            setPdfFile={setPdfFile}
            setIsLoading={setIsLoading}
            resetSections={() => setSections([])}
            onComplete={() => setRefreshFiles((c) => c + 1)}

          />
        </div>
      </div>
  
      {/* Second Row: Summary Table and PDF Viewer */}
      <div
        style={{
          display: "flex",
          gap: "36px",
          flexWrap: "wrap",
          // minHeight: "500px",
        }}
      >
        {/* Summary Table */}
        <div
          style={{
            flex: "1 1 50%",
            backgroundColor: "#1f1f1f",
            borderRadius: "8px",
            padding: "16px",
            maxHeight: "75vh",
            minHeight: "300px",
            boxSizing: "border-box",
            overflowY: "auto",
          }}
        >
          <SummaryTable
            sections={sections}
            overallProgress={overallProgress}
            onSelect={handleSelectSection}
          />
        </div>
  
        {/* PDF Viewer */}
        <div
          style={{
            flex: "1 1 40%",
            backgroundColor: "#1f1f1f",
            borderRadius: "8px",
            padding: "16px",
            maxHeight: "75vh",
            minHeight: "300px",
            boxSizing: "border-box",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <PDFViewer file={pdfFile} currentPage={currentPage} alreadyOnPage={alreadyOnPage}/>
        </div>
      </div>
    </div>
  );
}