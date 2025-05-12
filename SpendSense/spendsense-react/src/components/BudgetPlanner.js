import React, { useEffect, useState } from 'react';

function BudgetPlanner({ onClick }) {
  const [budgetPlannerLink, setBudgetPlannerLink] = useState(null);

  useEffect(() => {
    const fetchBudgetPlannerLink = async () => {
      try {
        const response = await fetch(
          'https://www.gov.uk/api/content/algorithmic-transparency-records/money-and-pensions-service-budget-planner'
        );
        const data = await response.json();

        const parser = new DOMParser();
        const doc = parser.parseFromString(data.details.body, 'text/html');
        const websiteUrlHeading = Array.from(doc.querySelectorAll('h3')).find(
          (heading) => heading.textContent.toLowerCase().includes('website url')
        );

        if (websiteUrlHeading) {
          const websiteLink = websiteUrlHeading.nextElementSibling?.querySelector('a');
          if (websiteLink) setBudgetPlannerLink(websiteLink.href);
        }
      } catch (error) {
        console.error('Error fetching Budget Planner link:', error);
      }
    };

    fetchBudgetPlannerLink();
  }, []);

  const warmBrown = '#8f5e35';
  const darkerBrown = '#5e3d1e';

  return (
    <div>
      <div
        style={{
          maxWidth: '1000px',
          margin: '4rem auto',
          background: 'rgba(255, 252, 229, 0.25)',
          border: `2px solid ${warmBrown}`,
          boxShadow: `4px 4px 0 ${warmBrown}`,
          borderRadius: '12px',
          padding: '5rem',
          fontFamily: "'Press Start 2P', cursive",
          color: '#1f1f1f',
          textAlign: 'center',
          backdropFilter: 'blur(5px)',
        }}
      >
        <h2 style={{ color: darkerBrown, fontSize: '1.6rem', marginBottom: '1.5rem' }}>
          Government Budget Planner
        </h2>

        <p style={{ fontSize: '1rem', lineHeight: '1.8' }}>
          The Budget Planner is a free online tool that helps users systematically track and manage their finances.
        </p>

        {budgetPlannerLink ? (
          <a
            href={budgetPlannerLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              margin: '1.5rem 0 1rem',
              fontSize: '1rem',
              color: warmBrown,
              textDecoration: 'underline',
              fontWeight: 'bold',
            }}
          >
            Access Budget Planner
          </a>
        ) : (
          <p style={{ fontSize: '0.9rem', color: '#555' }}>Loading...</p>
        )}

        <p style={{ fontSize: '1rem', color: '#333', marginTop: '1.5rem' }}>
          For further info about the planner, click{' '}
          <a
            href="https://www.gov.uk/algorithmic-transparency-records/money-and-pensions-service-budget-planner#contents"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: warmBrown,
              textDecoration: 'underline',
              fontWeight: 'bold',
            }}
          >
            here
          </a>.
        </p>

        <button
          onClick={onClick}
          style={{
            marginTop: '2rem',
            padding: '10px 18px',
            backgroundColor: '#f7e9cd',
            color: darkerBrown,
            fontFamily: "'Press Start 2P', cursive",
            border: `2px solid ${warmBrown}`,
            borderRadius: '6px',
            boxShadow: `2px 2px 0 ${warmBrown}`,
            cursor: 'pointer',
            fontSize: '1rem',
            transition: 'all 0.2s ease-in-out',
          }}
        >
          Next Section
        </button>
      </div>
    </div>
  );
}

export default BudgetPlanner;
