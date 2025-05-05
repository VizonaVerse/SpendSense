import React, { useEffect, useState } from 'react';

function BudgetPlanner({ onClick }) {
  const [budgetPlannerLink, setBudgetPlannerLink] = useState(null);
  
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
  

  return (
    <>
        <div>
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

export default BudgetPlanner;