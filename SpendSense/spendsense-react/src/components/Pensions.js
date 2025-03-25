import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const pensionDetails = {
  state: {
    title: "State Pension",
    description: "A government-provided pension upon reaching retirement age.",
    amount: "£203.85 per week (as of 2025)",
  },
  fixedPension: {
    title: "Fixed Pension",
    description: "A fixed pension amount based on salary and years of service.",
    amount: "£20,000 per year (example estimate)",
  },
  definedContribution: {
    title: "Defined Contribution Pension",
    description: "Pension amount depends on contributions and market performance.",
    amount: "Varies based on contributions and returns.",
  },
};

function Pensions({ selectedJob }) {
  const pensionRef = useRef(null);

  useEffect(() => {
    if (selectedJob && pensionRef.current) {
      gsap.fromTo(
        pensionRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5 }
      );
    }
  }, [selectedJob]);

  if (!selectedJob) {
    return <h2>Please select a job to see pension details.</h2>;
  }

  const pensionType = pensionDetails[selectedJob.pension] || {
    title: "No Pension Information",
    description: "No pension details available for this job.",
    amount: "N/A",
  };

  return (
    <div ref={pensionRef} className="pension-container text-center p-4 shadow-sm">
      <h2>{pensionType.title}</h2>
      <p>{pensionType.description}</p>
      <strong>Estimated Pension: {pensionType.amount}</strong>
    </div>
  );
}

export default Pensions;
