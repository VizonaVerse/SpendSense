// src/components/Pensions.js
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const pensionDetails = {
  state: {
    title: "State Pension",
    description: "A government-provided pension upon reaching retirement age.",
    amount: "£203.85 per week (as of 2025)", 
  },
  definedBenefit: {
    title: "Defined Benefit Pension",
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

  //animation when a new job is selected
  useEffect(() => {
    if (selectedJob) {
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

  let pensionType;
  if (selectedJob.pension === "state") {
    pensionType = pensionDetails.state;
  } else if (selectedJob.pension === "definedBenefit") {
    pensionType = pensionDetails.definedBenefit;
  } else if (selectedJob.pension === "definedContribution") {
    pensionType = pensionDetails.definedContribution;
  } else {
    return <h2>No pension information available.</h2>;
  }

  return (
    <div ref={pensionRef} className="pension-container">
      <h2>{pensionType.title}</h2>
      <p>{pensionType.description}</p>
      <strong>Estimated Pension: {pensionType.amount}</strong>
    </div>
  );
}

export default Pensions;
