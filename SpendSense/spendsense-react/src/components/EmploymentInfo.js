import React, { useEffect, useState } from 'react';


function EmploymentInfo({ onClick }) {
  const [infoText, setInfoText] = useState("Loading...");
  const hatPixel = process.env.PUBLIC_URL + '/images/hatPixel.png';


  useEffect(() => {
    const fetchEmploymentInfo = async () => {
      try {
        const response = await fetch("https://www.gov.uk/api/content/child-employment");
        const data = await response.json();

        const bodyContent = data.details.parts[0]?.body || "";
        const parser = new DOMParser();
        const doc = parser.parseFromString(bodyContent, "text/html");

        const fullTimeWorkHeading = Array.from(doc.querySelectorAll("h2")).find(
          (heading) => heading.textContent.trim().toLowerCase() === "full-time work"
        );

        if (fullTimeWorkHeading) {
          const paragraphs = [];
          let sibling = fullTimeWorkHeading.nextElementSibling;

          while (sibling && sibling.tagName === "P") {
            paragraphs.push(sibling.textContent);
            sibling = sibling.nextElementSibling;
          }

          setInfoText(paragraphs.length ? paragraphs.join(" ") : "No relevant information found.");
        } else {
          setInfoText("No Full-time work section found.");
        }
      } catch (error) {
        console.error("Error fetching employment info:", error);
        setInfoText("Failed to load information.");
      }
    };

    fetchEmploymentInfo();
  }, []);

  return (
    <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
      {/* Hat */}
      <img
  src="/images/hatPixel.png"
  alt="Hat Pixel"
  style={{
    position: 'absolute',
    right: '-250px',     
    top: '100px',       
    width: '180px',     
    height: 'auto',
    zIndex: 1,
    animation: 'floatHat 3s ease-in-out infinite'
  }}
/>


      <div style={{
        maxWidth: '800px',
        margin: '40px auto',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(8px)',
        border: '2px solid rgba(255, 255, 255, 0.3)',
        padding: '2rem',
        borderRadius: '12px',
        textAlign: 'center',
        fontFamily: "'Press Start 2P', cursive",
        color: '#000',
        boxShadow: '0 0 20px rgba(0,0,0,0.3)'
      }}>
        <h2 style={{
          color: '#2c4a7a',
          marginBottom: '1.5rem',
          fontSize: '1.5rem'
        }}>
          Employment Information
        </h2>

        <p style={{
          fontSize: '0.85rem',
          lineHeight: '1.8',
          color: '#2c4a7a',
          textAlign: 'justify',
          whiteSpace: 'pre-wrap'
        }}>
          {infoText}
        </p>

        <button
          onClick={onClick}
          style={{
            marginTop: '2rem',
            padding: '10px 24px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            border: '2px solid #2c4a7a',
            color: '#2c4a7a',
            fontWeight: 'bold',
            fontFamily: "'Press Start 2P', cursive",
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Continue to Payslip
        </button>
      </div>
    </div>
  );

}

export default EmploymentInfo;
