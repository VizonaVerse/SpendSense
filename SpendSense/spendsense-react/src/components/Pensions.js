import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const pensionDetails = {
  state: {
    title: "Basic Pension",
    description: "A Company-provided pension upon reaching retirement age.",
    amount: "5% from you (Tax Free) and 3% from your Employer",
  },
  benefit: {
    title: "Defined Benefits Pension",
    description: "A fixed pension amount based on salary and years of service.",
    amount: "This is based off your average salary and years of service",
  },
  contribution: {
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
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        ref={pensionRef}
        className="shadow-sm text-center"
        style={{
          fontSize: "1rem",
          padding: "0.5rem 0.5rem",
          border: "5px solid ",
          borderRadius: "5px",
          maxWidth: "1500px",
          lineHeight: "1.2",
          backgroundColor: "#f9f9f9"
        }}
      >
        <h2 style={{ fontSize: "1.8rem", margin: "0.2rem 0" }}>{pensionType.title}</h2>
        <p style={{ margin: "1.5rem 0" }}>{pensionType.description}</p>
        <strong style={{ fontSize: "1rem" }}>
          Estimated Pension: {pensionType.amount}
        </strong>
      </div>
    </div>
  );
}

export default Pensions;
