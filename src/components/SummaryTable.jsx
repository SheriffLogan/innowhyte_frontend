export default function SummaryTable({ sections = [], overallProgress, onSelect }) {

  const showProgressBar = sections?.length > 0 && overallProgress < 100;
  

  return (
    <div>
      {sections?.length === 0 ? (
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
          fontSize: "1.5rem",
          overflow: "hidden",
          color: "white",
        }}> Summary Table</div>
      ) : (
      <>
      {/* Conditional Progress Bar */}
        {showProgressBar && (
          <div style={{ marginBottom: "8px", width: "80%", margin: "0 auto" }}>
            <div style={{
              width: "100%",
              backgroundColor: "#e5e7eb",
              height: "4px",
              borderRadius: "4px"
            }}>
              <div style={{
                backgroundColor: "grey",
                height: "4px",
                borderRadius: "4px",
                width: `${overallProgress}%`,
                transition: "width 0.5s ease-in-out"
              }}></div>
            </div>
          </div>
        )}

      {/* Table of Sections */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "16px" }}>
        <thead style={{ position: "sticky", top: -17, backgroundColor: "grey", }}>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Section Title</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Summary</th>
          </tr>
        </thead>
        <tbody>
          {sections.map((item, i) => (
            <tr key={i}
              onClick={() => onSelect(item.page)}
              style={{
                cursor: "pointer",
                backgroundColor: "#fff",
                transition: "background-color 0.3s"
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#f3f4f6"}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#fff"}>
              <td style={{ border: "1px solid #ddd", padding: "8px", color: "#333" }}>{item.section}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px", color: "#333" }}>{item.summary}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </>
      )}
    </div>
  );
}
