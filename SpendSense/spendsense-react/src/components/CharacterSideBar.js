import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';

function CharacterSidebar() {
  const sidebarRef = useRef(null);
  const hoverAreaRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [currentRates, setCurrentRates] = useState(null); // State to store "Current Rates" text
  const [wageRates, setWageRates] = useState([]); // State to store the actual wage rates

  useEffect(() => {
    const sidebar = sidebarRef.current;
    const hoverArea = hoverAreaRef.current;

    // Initial setup - sidebar off-screen
    gsap.set(sidebar, { x: '-100%' });

    const handleMouseEnter = () => {
      if (!isOpen) {
        gsap.to(sidebar, {
          x: '0%',
          duration: 0.3,
          ease: 'power1.out'
        });
        setIsOpen(true);
      }
    };

    const handleMouseLeave = (e) => {
      // Only close if mouse is not over sidebar
      if (!sidebar.contains(e.relatedTarget)) {
        gsap.to(sidebar, {
          x: '-100%',
          duration: 0.3,
          ease: 'power1.in'
        });
        setIsOpen(false);
      }
    };

    // Hover area for triggering sidebar
    hoverArea.addEventListener('mouseenter', handleMouseEnter);
    sidebar.addEventListener('mouseleave', handleMouseLeave);

    // Cleanup
    return () => {
      hoverArea.removeEventListener('mouseenter', handleMouseEnter);
      sidebar.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isOpen]);

  useEffect(() => {
    const fetchMinimumWageRates = async () => {
      try {
        const response = await fetch('https://www.gov.uk/api/content/national-minimum-wage-rates');
        const data = await response.json();

        // Parse the HTML content
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.details.body, 'text/html');

        // Find the "Current rates" section
        const currentRatesHeading = Array.from(doc.querySelectorAll('h2')).find(
          (heading) => heading.textContent.toLowerCase().includes('current rates')
        );

        if (currentRatesHeading) {
          // Skip the <p> tag and directly target the <table> element
          const currentRatesTable = currentRatesHeading.nextElementSibling?.nextElementSibling;

          if (currentRatesTable && currentRatesTable.tagName === 'TABLE') {
            setCurrentRates(currentRatesTable.outerHTML); // Store the table's HTML
          }
        }
      } catch (error) {
        console.error('Error fetching minimum wage rates:', error);
      }
    };

    fetchMinimumWageRates();
  }, []);

  return (
    <>
      {/* Invisible hover area */}
      <div 
        ref={hoverAreaRef}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          width: '20px',
          zIndex: 1000
        }}
      />

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
          boxShadow: '0 0 10px rgba(0,0,0,0.5)'
        }}
      >
        <img 
            src="images/sprite_base.png" 
            alt="Character" 
            style={{ width: '100%' }} 
        />

        <div>
          <h3>Wealth</h3>
          <div style={{
            width: '100%',
            height: '20px',
            backgroundColor: '#FFF',
            borderRadius: '10px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: '75%',
              height: '100%',
              backgroundColor: 'green'
            }} />
          </div>
        </div>

        {/* Display Current Rates Table */}
        <div style={{ marginTop: '20px', overflow: 'hidden' }}>
          <h5 style={{ textAlign: 'center', marginBottom: '10px' }}>
            Current national minimum wage rates
          </h5>
          {currentRates ? (
            <div
              dangerouslySetInnerHTML={{ __html: currentRates }}
              style={{
                overflowX: 'auto', // Allow horizontal scrolling if the table is too wide
                maxWidth: '100%', // Ensure the table fits within the sidebar
                fontSize: '14px', // Adjust font size for readability
                color: 'white', // Ensure text is visible on the dark background
                textAlign: 'center', // Center-align the table content
              }}
            />
          ) : (
            <p style={{ textAlign: 'center', color: 'white' }}>Loading...</p>
          )}
        </div>
      </div>
    </>
  );
}

export default CharacterSidebar;