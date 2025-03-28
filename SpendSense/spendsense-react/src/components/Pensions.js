import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const pensionDetails = {
  state: {
    title: "Basic Pension",
    description: "A Company-provided pension upon reaching retirement age.",
    amount: "5% from you (Tax Free) and 3% from your Employer",
  },
  fixedPension: {
    title: "Defined Benefits Pension",
    description: "A fixed pension amount based on salary and years of service.",
    amount: "This is based off your average salary and years of service",
  },
  definedContribution: {
    title: "Defined Contribution Pension",
    description: "A Company-provided pension upon reaching retirement age.",
    amount: "5% from you (Tax Free) and 5% from your Employer",
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
