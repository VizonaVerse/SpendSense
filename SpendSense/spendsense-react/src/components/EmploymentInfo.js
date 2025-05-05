import React, { useEffect, useState } from 'react';

function EmploymentInfo({ onClick}) {
  const [EmploymentInfo, setEmploymentInfo] = useState("Loading...");

  useEffect(() => {
      const fetchEmploymentInfo = async () => {
        try {
          const response = await fetch("https://www.gov.uk/api/content/child-employment");
          const data = await response.json();
  
          // Extract the body content from part 0 of the details.parts array
          const bodyContent = data.details.parts[0]?.body || "";
  
          // Parse the HTML content
          const parser = new DOMParser();
          const doc = parser.parseFromString(bodyContent, "text/html");
  
          // Find the <h2> tag with the text "Full-time work"
          const fullTimeWorkHeading = Array.from(doc.querySelectorAll("h2")).find(
            (heading) => heading.textContent.trim().toLowerCase() === "full-time work"
          );
  
          if (fullTimeWorkHeading) {
            const paragraphs = [];
            let sibling = fullTimeWorkHeading.nextElementSibling;
  
            // Collect all <p> tags after the <h2> tag
            while (sibling) {
              if (sibling.tagName === "P") {
                paragraphs.push(sibling.textContent);
              }
              sibling = sibling.nextElementSibling;
            }
  
            if (paragraphs.length > 0) {
              setEmploymentInfo(paragraphs.join(" "));
            } else {
              setEmploymentInfo("No relevant information found");
            }
          } else {
            setEmploymentInfo("No Full-time work section found.");
          }
        } catch (error) {
          console.error("Error fetching employment info:", error);
          setEmploymentInfo("Failed to load information.");
        }
      };
  
      fetchEmploymentInfo();
    }, []);
  return (
    <>
        <div>
        <div style={{ marginTop: '20px', overflow: 'hidden' }}>
          <h5 style={{ textAlign: 'center', marginBottom: '10px', color: '#209cee' }}>
            Employment Information
          </h5>
          <p style={{ textAlign: 'center', color: 'white' }}>
          {EmploymentInfo}
          </p>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button 
              onClick={onClick} 
              style={{ padding: '10px 20px', backgroundColor: '#209cee', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            >
              Continue to Payslip
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default EmploymentInfo;