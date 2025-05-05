import React, { useEffect, useState } from 'react';

function PensionInfo({ onClick}) {
  const [pensionInfo, setPensionInfo] = useState("Loading...");
  const [retrievePension, setRetrievePension] = useState("Loading...");
  useEffect(() => {
    const fetchWorkplacePensionInfo = async () => {
      try {
        const response = await fetch('https://www.gov.uk/api/content/workplace-pensions/about-workplace-pensions');
        const data = await response.json();
  
        // Extract the body content from the part with the slug "about-workplace-pensions"
        const part = data.details.parts.find((p) => p.slug === "about-workplace-pensions");
        const bodyContent = part?.body || "";
  
        // Parse the HTML content
        const parser = new DOMParser();
        const doc = parser.parseFromString(bodyContent, 'text/html');
  
        // Retrieve all <p> tags
        const paragraphs = Array.from(doc.querySelectorAll('p')).map((p) => p.textContent);
  
        // Combine the content into a single string
        const filteredContent = paragraphs.join('\n\n');
  
        if (filteredContent.trim()) {
          setPensionInfo(filteredContent.trim()); // Set the plain text content
        } else {
          setPensionInfo('No relevant information found under "About workplace pensions".'); // Fallback message
        }
      } catch (error) {
        console.error('Error fetching workplace pension info:', error);
        setPensionInfo('Failed to load workplace pension information.'); // Error message
      }
    };
  
    fetchWorkplacePensionInfo();
  }, []);

  useEffect(() => {
    const fetchTakingPension = async () => {
      try {
        const response = await fetch('https://www.gov.uk/api/content/workplace-pensions/about-workplace-pensions');
        const data = await response.json();
  
        const part = data.details.parts[4];
        const bodyContent = part?.body || "";
  
        // Parse the HTML content
        const parser = new DOMParser();
        const doc = parser.parseFromString(bodyContent, 'text/html');
  
        // Find the <h2> tag with the text "Taking your pension"
        const takingPensionHeading = Array.from(doc.querySelectorAll('h2')).find(
          (heading) => heading.textContent.trim().toLowerCase() === "taking your pension"
        );
  
        if (takingPensionHeading) {
          const paragraphs = [];
          let sibling = takingPensionHeading.nextElementSibling;
  
          // Collect all <p> tags after the "Taking your pension" heading
          while (sibling) {
            if (sibling.tagName === "P") {
              paragraphs.push(sibling.textContent); // Collect plain text from <p> tags
            }
            if (sibling.tagName === "H2") break; // Stop when reaching the next <h2> tag
            sibling = sibling.nextElementSibling;
          }
  
          if (paragraphs.length > 0) {
            setRetrievePension(paragraphs.join("\n\n")); // Set the combined plain text content
          } else {
            setRetrievePension("No relevant information found under 'Taking your pension'.");
          }
        } else {
          setRetrievePension("No 'Taking your pension' section found.");
        }
      } catch (error) {
        console.error("Error fetching 'Taking your pension' info:", error);
        setRetrievePension("Failed to load 'Taking your pension' information.");
      }
    };
  
    fetchTakingPension();
  }, []);

  return (
    <>
        <div>
          <div style={{ marginTop: '20px', overflow: 'hidden' }}>
          <h5 style={{ textAlign: 'center', marginBottom: '10px', color: '#209cee' }}>
            Workplace Pensions
          </h5>
          <p style={{ textAlign: 'center', color: 'black' }}>
            {pensionInfo}
          </p>
          <h5 style={{ textAlign: 'center', marginBottom: '10px', color: '#209cee' }}>
            Taking your pension
          </h5>
          <p style={{ textAlign: 'center', color: 'black' }}>
            {retrievePension}
          </p>
          <p style={{ textAlign: 'center', color: 'black' }}>
            For more information on pensions click{' '}
            <a
              href="https://www.gov.uk/workplace-pensions"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'green', textDecoration: 'underline' }}
              >here</a>
              </p>
            </div>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button 
              onClick={onClick} 
              style={{ padding: '10px 20px', backgroundColor: '#209cee', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            >
              Next Section
            </button>
          </div>
      </div>
    </>
  );
}

export default PensionInfo;