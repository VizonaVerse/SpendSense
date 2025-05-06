import React, { useEffect, useState } from 'react';
import './PensionInfo.css';

function PensionInfo({ onClick }) {
  const [pensionInfo, setPensionInfo] = useState("Loading...");
  const [retrievePension, setRetrievePension] = useState("Loading...");

  useEffect(() => {
    const fetchWorkplacePensionInfo = async () => {
      try {
        const response = await fetch('https://www.gov.uk/api/content/workplace-pensions/about-workplace-pensions');
        const data = await response.json();
        const part = data.details.parts.find(p => p.slug === "about-workplace-pensions");
        const doc = new DOMParser().parseFromString(part?.body || "", 'text/html');
        const paragraphs = Array.from(doc.querySelectorAll('p')).map(p => p.textContent);
        setPensionInfo(paragraphs.join('\n\n') || 'No relevant information found.');
      } catch {
        setPensionInfo('Failed to load workplace pension information.');
      }
    };

    const fetchTakingPension = async () => {
      try {
        const response = await fetch('https://www.gov.uk/api/content/workplace-pensions/about-workplace-pensions');
        const data = await response.json();
        const part = data.details.parts[4];
        const doc = new DOMParser().parseFromString(part?.body || "", 'text/html');
        const heading = Array.from(doc.querySelectorAll('h2')).find(h => h.textContent.trim().toLowerCase() === "taking your pension");

        if (heading) {
          const paragraphs = [];
          let sibling = heading.nextElementSibling;
          while (sibling && sibling.tagName !== 'H2') {
            if (sibling.tagName === 'P') paragraphs.push(sibling.textContent);
            sibling = sibling.nextElementSibling;
          }
          setRetrievePension(paragraphs.join('\n\n') || "No relevant information found.");
        } else {
          setRetrievePension("No 'Taking your pension' section found.");
        }
      } catch {
        setRetrievePension("Failed to load 'Taking your pension' information.");
      }
    };

    fetchWorkplacePensionInfo();
    fetchTakingPension();
  }, []);

  return (
    <div className="pension-container">
      <h2 className="pension-title"> Workplace Pensions</h2>
      <p className="pension-text">{pensionInfo}</p>
      <h2 className="pension-title"> Taking Your Pension</h2>
      <p className="pension-text">{retrievePension}</p>
      <p className="pension-text">
        For more info click{' '}
        <a href="https://www.gov.uk/workplace-pensions" target="_blank" rel="noreferrer" className="pension-link">here</a>
      </p>
      <div className="pension-button-wrap">
        <button className="pension-button" onClick={onClick}>Next Section</button>
      </div>
    </div>
  );
}

export default PensionInfo;
