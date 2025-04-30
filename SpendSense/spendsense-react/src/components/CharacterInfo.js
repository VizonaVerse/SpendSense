import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import JobSelect from './JobSelect';

function CharacterInfo({ 
  characterImage = "images/sprite_base.png", 
  initialMoney = 1000,
  initialProgress = 60,
  onMoneyChange = null,
  onProgressChange = null
}) {
  const [money, setMoney] = useState(initialMoney);
  const [progress, setProgress] = useState(initialProgress);
  const [isOpen, setIsOpen] = useState(false);
  const [budgetPlannerLink, setBudgetPlannerLink] = useState(null);
  const [EmploymentInfo, setEmploymentInfo] = useState("Loading...");
  const [taxYearInfo, setTaxYearInfo] = useState("Loading...");
  const [personalAllowanceInfo, setPersonalAllowanceInfo] = useState("Loading...");
  const [incomeTaxRates, setIncomeTaxRates] = useState("Loading...");
  const [highEarnerInfo, setHighEarnerInfo] = useState("Loading...");
  const [pensionInfo, setPensionInfo] = useState("Loading...");
  const [retrievePension, setRetrievePension] = useState("Loading...");
  const sidebarRef = useRef(null);
  
  // Listen for external updates to money and progress
  useEffect(() => {
    setMoney(initialMoney);
  }, [initialMoney]);
  
  useEffect(() => {
    setProgress(initialProgress);
  }, [initialProgress]);

  // Set up sidebar animation
  useEffect(() => {
    const sidebar = sidebarRef.current;

    // Initial setup - sidebar off-screen
    gsap.set(sidebar, { x: '-100%' });

    // Toggle sidebar based on isOpen state
    if (isOpen) {
      gsap.to(sidebar, {
        x: '0%',
        duration: 0.3,
        ease: 'power1.out'
      });
    } else {
      gsap.to(sidebar, {
        x: '-100%',
        duration: 0.3,
        ease: 'power1.in'
      });
    }
  }, [isOpen]);

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
  
  useEffect(() => {
    const fetchBudgetPlannerLink = async () => {
      try {
        const response = await fetch('https://www.gov.uk/api/content/algorithmic-transparency-records/money-and-pensions-service-budget-planner');
        const data = await response.json();

        // Parse the HTML content
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.details.body, 'text/html');

        // Find the "Website URL" section
        const websiteUrlHeading = Array.from(doc.querySelectorAll('h3')).find(
          (heading) => heading.textContent.toLowerCase().includes('website url')
        );

        if (websiteUrlHeading) {
          // Find the <a> tag containing the link
          const websiteLink = websiteUrlHeading.nextElementSibling?.querySelector('a');
          if (websiteLink) {
            setBudgetPlannerLink(websiteLink.href); // Store the link
          }
        }
      } catch (error) {
        console.error('Error fetching Budget Planner link:', error);
      }
    };

    fetchBudgetPlannerLink();
  }, []);
  
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
  
  // Functions to update money and progress
  const addMoney = (amount) => {
    const newMoney = money + amount;
    setMoney(newMoney);
    if (onMoneyChange) onMoneyChange(newMoney);
  };
  
  const updateProgress = (value) => {
    // Ensure progress stays between 0-100
    const newProgress = Math.max(0, Math.min(100, value));
    setProgress(newProgress);
    if (onProgressChange) onProgressChange(newProgress);
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Handle click outside to close sidebar
  const handleOutsideClick = (e) => {
    if (isOpen && sidebarRef.current && !sidebarRef.current.contains(e.target) && 
        !e.target.closest('.character-portrait')) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    // Add event listener for clicks outside the sidebar
    document.addEventListener('mousedown', handleOutsideClick);
    
    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  return (
    <>
      <div className="character-stats-container" style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        padding: '10px 20px',
        color: 'white',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
      }}>
        {/* Character Picture - now clickable */}
        <div 
          className="character-portrait" 
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            overflow: 'hidden',
            marginRight: '15px',
            cursor: 'pointer' // Add cursor to indicate it's clickable
          }}
          onClick={toggleSidebar}
        >
          <img 
            src={characterImage}
            alt="Character"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              imageRendering: 'pixelated'
            }}
          />
        </div>
        
        {/* Stats wrapper */}
        <div className="stats-wrapper" style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          marginTop: '-10px',
          width: '300px'
        }}>
          {/* Progress Bar */}
          {/* <div className="progress-container" style={{
            width: '100%',
            marginBottom: '10px'
          }}>
            <div className="progress-label" style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '5px',
              fontSize: '14px'
            }}>
              <span style={{ color: 'black'}}>
                  Progress
              </span>
              <span style={{ color: 'black'}}>
                  {progress}%
              </span>
            </div>
            <div className="progress-bar-bg" style={{
              width: '100%',
              height: '12px',
              backgroundColor: 'rgba(15, 15, 15, 0.41)',
              borderRadius: '6px',
              overflow: 'hidden'
            }}>
              <div className="progress-bar-fill" style={{
                height: '100%',
                width: `${progress}%`,
                color: 'black',
                backgroundColor: '#4CAF50',
                borderRadius: '6px',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div> */}
          
          {/* Money Display */}
          {/* <div className="money-display" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            backgroundColor: 'rgba(70, 166, 66, 0.47)',
            padding: '5px 12px',
            borderRadius: '15px',
            border: '3px solid green',
            width: 'fit-content'
          }}>
            <span style={{ 
              fontSize: '16px', 
              fontWeight: 'bold', 
              color: 'black' 
            }}>
              £{money.toLocaleString()}
            </span>
            <img
              src="images/coin.png"
              alt="Coins"
              style={{
                width: '30px',
                height: '30px',
                imageRendering: 'pixelated'
              }}
            />
          </div> */}
        </div>
      </div>

      {/* Sidebar */}
      <div 
        ref={sidebarRef}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          width: '300px',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          zIndex: 1000,
          padding: '20px',
          boxShadow: '0 0 10px rgba(0,0,0,0.5)',
          overflowY: 'scroll', // Enable vertical scrolling
          scrollbarWidth: 'none', // For Firefox
          msOverflowStyle: 'none', // For Internet Explorer and Edge
          maxHeight: '100vh', // Limit the height to the viewport
        }}
      >
        <img 
          src={characterImage} 
          alt="Character" 
          style={{ width: '100%' }} 
        />

        <div>
          <h3>{JobSelect}*display current job</h3>
        </div>
        
        <div style={{ marginTop: '20px', overflow: 'hidden' }}>
          <h5 style={{ textAlign: 'center', marginBottom: '10px', color: '#209cee' }}>
            Employment Information
          </h5>
          <p style={{ textAlign: 'center', color: 'white' }}>
          {EmploymentInfo}
          </p>
        </div>
        <div style={{ marginTop: '20px', overflow: 'hidden' }}>
          <h5 style={{ textAlign: 'center', marginBottom: '10px', color: '#209cee' }}>
            Government Budget Planner
          </h5>
          <p style={{ textAlign: 'center', color: 'white' }}>
            The Budget Planner is a free online tool that helps users systematically track and manage their finances.
          </p>
          {budgetPlannerLink ? (
            <a href={budgetPlannerLink} target="_blank" rel="noopener noreferrer" style={{ color: 'green', textAlign: 'center', display: 'block', textDecoration: 'underline' }}>
              Access Budget Planner
            </a>
          ) : (
            <p style={{ textAlign: 'center', color: 'white' }}>Loading...</p>
          )}
          <p style={{ textAlign: 'center', color: 'white', marginTop: '10px' }}>
            For further information about the planner, click{' '}
            <a
              href="https://www.gov.uk/algorithmic-transparency-records/money-and-pensions-service-budget-planner#contents"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'green', textDecoration: 'underline' }}
            >
              here
            </a>.
          </p>
        </div>
        <div style={{ marginTop: '20px', overflow: 'hidden' }}>
        <h5 style={{ textAlign: 'center', marginBottom: '10px', color: '#209cee' }}>
            Personal Allowances
          </h5>
          <p style={{ textAlign: 'center', color: 'white' }}>
          How much Income Tax you pay in each tax year depends on:
          </p>
          <ul style={{ color: 'white', paddingLeft: '20px' }}>
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
            <div
              dangerouslySetInnerHTML={{ __html: incomeTaxRates }}
              style={{
                overflowX: 'auto',
                maxWidth: '100%',
                fontSize: '10px',
                color: 'white',
                textAlign: 'center',
              }}
            />
          ) : (
            <p style={{ textAlign: 'center', color: '#209cee' }}>Loading...</p>
          )}
          </div>
          <div style={{ marginTop: '20px', overflow: 'hidden' }}>
          <h5 style={{ textAlign: 'center', marginBottom: '10px', color: '#209cee' }}>
            Workplace Pensions
          </h5>
          <p style={{ textAlign: 'center', color: 'white' }}>
            {pensionInfo}
          </p>
          <h5 style={{ textAlign: 'center', marginBottom: '10px', color: '#209cee' }}>
            Taking your pension
          </h5>
          <p style={{ textAlign: 'center', color: 'white' }}>
            {retrievePension}
          </p>
          <p style={{ textAlign: 'center', color: 'white' }}>
            For more information on pensions click{' '}
            <a
              href="https://www.gov.uk/workplace-pensions"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'green', textDecoration: 'underline' }}
              >here</a>
              </p>
            </div>
      </div>
    </>
  );
}

export default CharacterInfo;