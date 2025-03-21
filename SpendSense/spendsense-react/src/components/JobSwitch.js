import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Pensions from "./Pensions";

const newJobs = [
  { id: "dataScientist", title: "Data Scientist", salary: 70000, pension: "fixedPension" },
  { id: "entrepreneur", title: "Entrepreneur", salary: 50000, pension: "definedContribution" },
];

function JobSwitch({ onJobSelect, initialJob }) {
  const [selectedJob, setSelectedJob] = useState(initialJob);
  const cardRefs = useRef([]);

  const addToRefs = (el) => {
    if (el && !cardRefs.current.includes(el)) {
      cardRefs.current.push(el);
    }
  };

  useEffect(() => {
    cardRefs.current.forEach((card) => {
      gsap.fromTo(card, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.5 });
    });
  }, []);

  const handleJobSelect = (job) => {
    setSelectedJob(job);
    setTimeout(() => {
      onJobSelect(job);
    }, 100); 
  };
  
  return (
    <div className="section-content job-select-section text-center">
      <h2>Time to Switch Things Up?</h2>
      <p>Choose a new job or stay with your current job:</p>
      <div className="row mt-4">
        {/* Stay with initial job option */}
        {initialJob && (
          <div className="col-md-4">
            <div
              className="card p-3 shadow-sm job-card"
              onClick={() => handleJobSelect(initialJob)}
              style={{ cursor: "pointer", backgroundColor: "#cce5ff" }}
            >
              <h4>Stay as {initialJob.title}</h4>
              <p>State Pension</p>
            </div>
          </div>
        )}

        {/* New job options */}
        {newJobs.map((job) => (
          <div key={job.id} className="col-md-4">
            <div
              ref={addToRefs}
              className="card p-3 shadow-sm job-card"
              onClick={() => handleJobSelect(job)}
              style={{ cursor: "pointer" }}
            >
              <h4>{job.title}</h4>
              <p>
                {job.pension === "fixedPension"
                ? "Fixed Pension"
                : job.pension === "definedBenefit"
                ? "Defined Benefit Pension"
                : "Defined Contribution Pension"
                }
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Pension Info - Show after selecting a job */}
      {selectedJob && <Pensions selectedJob={selectedJob} />}
    </div>
  );
}

export default JobSwitch;
