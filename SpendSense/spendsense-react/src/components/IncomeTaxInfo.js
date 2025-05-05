import React, { useEffect, useState } from 'react';

function IncomeTaxInfo({ onClick }) {
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


  const cardStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    border: '2px solid #a0c4ff',
    borderRadius: '16px',
    backdropFilter: 'blur(12px)',
    padding: '2rem',
    margin: '2rem auto',
    maxWidth: '800px',
    boxShadow: '0 0 25px rgba(58, 134, 255, 0.2)',
    fontFamily: "'Press Start 2P', cursive",
    color: '#1f3556',
    textAlign: 'center',
  };
  
  const headingStyle = {
    fontSize: '1rem',
    color: '#91273f', 
    marginBottom: '1.5rem',
  };
  const paragraphStyle = {
    fontSize: '0.75rem',
    lineHeight: '1.6',
    color: '#333',
    marginBottom: '1rem',
  };
  
  const buttonStyle = {
    marginTop: '2rem',
    padding: '12px 28px',
    backgroundColor: '#bbe8ed', 
    color: '#91273f',          
    fontWeight: 'bold',
    fontFamily: "'Press Start 2P', cursive",
    border: '2px solid #a0c4ff',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
  };
  
  const buttonHoverStyle = {
    backgroundColor: '#d8f3dc', 
    transform: 'scale(1.05)',
    boxShadow: '0 0 10px rgba(255, 153, 200, 0.4)',
  };
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '1rem',
      maxWidth: '1400px',
      margin: '0 auto',
      paddingTop: '5rem',
      paddingBottom: '0rem',
      position: 'relative',
    }}>

      {/* Main content */}
      <div style={{ width: '900px', marginLeft: '17rem' }}>

        {/* Card 1 */}
        <div style={{ ...cardStyle, width: '100%', maxWidth: '1000px' }}>
          <h2 style={headingStyle}>Personal Allowances</h2>
          <p style={paragraphStyle}>How much Income Tax you pay depends on:</p>
          <ul style={{
            ...paragraphStyle,
            listStyleType: 'disc',
            paddingLeft: '2rem',
            textAlign: 'left',
          }}>
            <li>how much of your income is above your Personal Allowance</li>
            <li>how much of your income falls within each tax band</li>
          </ul>
          <p style={paragraphStyle}>{personalAllowanceInfo}</p>
          <p style={paragraphStyle}>{highEarnerInfo}</p>
          <p style={paragraphStyle}>{taxYearInfo}</p>
        </div>

        {/* Card 2 */}
        <div style={{ ...cardStyle, width: '100%', maxWidth: '1000px' }}>
          <h2 style={headingStyle}>Income Tax Rates & Bands</h2>
          <div
            style={{
              overflowX: 'auto',
              display: 'block',
              maxWidth: '100%',
              textAlign: 'center',
              color: '#1f3556',
            }}
            dangerouslySetInnerHTML={{ __html: incomeTaxRates }}
          />
        </div>
      </div>

      {/* Button */}
      <div style={{ alignSelf: 'flex-start', marginTop: '17rem' }}>
        <button onClick={onClick} style={buttonStyle}>
          Next<br />Section
        </button>
      </div>
    </div>
  );

}

export default IncomeTaxInfo;