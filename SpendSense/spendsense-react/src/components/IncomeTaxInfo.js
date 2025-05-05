import React, { useEffect, useState } from 'react';

function IncomeTaxInfo({ onClick}) {
  const [taxYearInfo, setTaxYearInfo] = useState("Loading...");
  const [personalAllowanceInfo, setPersonalAllowanceInfo] = useState("Loading...");
  const [incomeTaxRates, setIncomeTaxRates] = useState("Loading...");
  const [highEarnerInfo, setHighEarnerInfo] = useState("Loading...");
  
  useEffect(() => {
    const fetchPersonalAllowanceInfo = async () => {
      try {
        const response = await fetch('https://www.gov.uk/api/content/income-tax-rates');
        const data = await response.json();
  
        // Extract the body content from part 0 of the details.parts array
        const bodyContent = data.details.parts[0]?.body || "";
  
        // Parse the HTML content
        const parser = new DOMParser();
        const doc = parser.parseFromString(bodyContent, 'text/html');
  
        // Find the <p> tag containing "The standard Personal Allowance is"
        const personalAllowanceParagraph = Array.from(doc.querySelectorAll('p')).find(
          (p) => p.textContent.includes('The standard Personal Allowance is')
        );
  
        if (personalAllowanceParagraph) {
          setPersonalAllowanceInfo(personalAllowanceParagraph.textContent); // Set the personal allowance info
        } else {
          setPersonalAllowanceInfo('Personal allowance information not found.'); // Fallback message
        }
      } catch (error) {
        console.error('Error fetching personal allowance info:', error);
        setPersonalAllowanceInfo('Failed to load personal allowance information.'); // Error message
      }
    };
  
    fetchPersonalAllowanceInfo();
  }, []);

  useEffect(() => {
    const fetchHighEarnerInfo = async () => {
      try {
        const response = await fetch('https://www.gov.uk/api/content/income-tax-rates');
        const data = await response.json();
  
        // Extract the body content from part 0 of the details.parts array
        const bodyContent = data.details.parts[0]?.body || "";
  
        // Parse the HTML content
        const parser = new DOMParser();
        const doc = parser.parseFromString(bodyContent, 'text/html');
  
        // Find the <h3> tag containing "If you earn more than £100,000"
        const highEarnerHeading = Array.from(doc.querySelectorAll('h3')).find(
          (h3) => h3.textContent.includes('If you earn more than £100,000')
        );
  
        if (highEarnerHeading) {
          // Collect all <p> tags immediately following the <h3> tag
          let sibling = highEarnerHeading.nextElementSibling;
          let highEarnerContent = '';
  
          while (sibling && sibling.tagName !== 'H3' && sibling.tagName !== 'H2') {
            if (sibling.tagName === 'P') {
              highEarnerContent += sibling.textContent + ' '; // Collect only the plain text content of <p> tags
            }
            sibling = sibling.nextElementSibling;
          }
  
          if (highEarnerContent.trim()) {
            setHighEarnerInfo(highEarnerContent.trim()); // Set the combined plain text content
          } else {
            setHighEarnerInfo('High earner information not found.'); // Fallback message
          }
        } else {
          setHighEarnerInfo('High earner section not found.'); // Fallback message
        }
      } catch (error) {
        console.error('Error fetching high earner info:', error);
        setHighEarnerInfo('Failed to load high earner information.'); // Error message
      }
    };
  
    fetchHighEarnerInfo();
  }, []);

  useEffect(() => {
    const fetchTaxYearInfo = async () => {
      try {
        const response = await fetch('https://www.gov.uk/api/content/income-tax-rates');
        const data = await response.json();

        // Extract the body content from part 0 of the details.parts array
        const bodyContent = data.details.parts[0]?.body || "";

        // Parse the HTML content
        const parser = new DOMParser();
        const doc = parser.parseFromString(bodyContent, 'text/html');

        // Find the <p> tag containing "The current tax year is from"
        const taxYearParagraph = Array.from(doc.querySelectorAll('p')).find(
          (p) => p.textContent.includes('The current tax year is from')
        );

        if (taxYearParagraph) {
          setTaxYearInfo(taxYearParagraph.textContent); // Set the tax year info
        } else {
          setTaxYearInfo('Tax year information not found.'); // Fallback message
        }
      } catch (error) {
        console.error('Error fetching tax year info:', error);
        setTaxYearInfo('Failed to load tax year information.'); // Error message
      }
    };

    fetchTaxYearInfo();
  }, []);
  
  useEffect(() => {
    const fetchIncomeTaxRates = async () => {
      try {
        const response = await fetch('https://www.gov.uk/api/content/income-tax-rates');
        const data = await response.json();
  
        // Extract the body content from part 0 of the details.parts array
        const bodyContent = data.details.parts[0]?.body || "";
  
        // Parse the HTML content
        const parser = new DOMParser();
        const doc = parser.parseFromString(bodyContent, 'text/html');
  
        // Find the <h2> tag with "Income Tax rates and bands"
        const incomeTaxHeading = Array.from(doc.querySelectorAll('h2')).find(
          (heading) => heading.textContent.includes('Income Tax rates and bands')
        );
  
        if (incomeTaxHeading) {
          // Find the <table> element after the heading
          const incomeTaxTable = incomeTaxHeading.nextElementSibling?.nextElementSibling?.nextElementSibling;
  
          if (incomeTaxTable && incomeTaxTable.tagName === 'TABLE') {
            setIncomeTaxRates(incomeTaxTable.outerHTML); // Store the table's HTML
          } else {
            setIncomeTaxRates('Income tax rates table not found.'); // Fallback message
          }
        } else {
          setIncomeTaxRates('Income Tax rates and bands section not found.'); // Fallback message
        }
      } catch (error) {
        console.error('Error fetching income tax rates:', error);
        setIncomeTaxRates('Failed to load income tax rates.'); // Error message
      }
    };
  
    fetchIncomeTaxRates();
  }, []);


  return (
    <>
        <div>
        <div style={{ marginTop: '20px', overflow: 'hidden' }}>
        <h5 style={{ textAlign: 'center', marginBottom: '10px', color: '#209cee' }}>
            Personal Allowances
          </h5>
          <p style={{ textAlign: 'center', color: 'white' }}>
          How much Income Tax you pay in each tax year depends on:
          </p>
          <ul
            style={{
              color: 'white',
              paddingLeft: '0', // Remove default left padding
              textAlign: 'center', // Center-align the text
              display: 'inline-block', // Make the list behave like an inline element
              listStylePosition: 'inside', // Ensure bullets align with the text
            }}
          >
            <li>how much of your income is above your Personal Allowance</li>
            <li>how much of your income falls within each tax band</li>
          </ul>
          <p style={{ textAlign: 'center', color: 'white' }}>
            {personalAllowanceInfo}
          </p>
          <p style={{ textAlign: 'center', color: 'white' }}>
            {highEarnerInfo}
          </p>
          <p style={{ textAlign: 'center', color: 'white' }}>
            {taxYearInfo}
          </p>
        </div>
        <div style={{ marginTop: '20px', overflow: 'hidden' }}>
          <h5 style={{ textAlign: 'center', marginBottom: '10px', color: '#209cee' }}>
          Income Tax rates and bands
          </h5>
          {incomeTaxRates ? (
            <div style={{ textAlign: 'center' }}>
              <div
                dangerouslySetInnerHTML={{ __html: incomeTaxRates }}
                style={{
                  display: 'inline-block', // Ensures the table is treated as an inline element for centering
                  overflowX: 'auto',
                  maxWidth: '100%',
                  color: 'white',
                }}
              />
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: '#209cee' }}>Loading...</p>
          )}
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

export default IncomeTaxInfo;