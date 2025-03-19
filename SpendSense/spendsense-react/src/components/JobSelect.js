// src/components/JobSelect.js
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Pensions from "./Pensions";

// Initial Job Choices
const initialJobs = [
  { id: "softwareEngineer", title: "Software Engineer", salary: 60000, pension: "state" },
  { id: "graphicDesigner", title: "Graphic Designer", salary: 45000, pension: "state" },
  { id: "teacher", title: "Teacher", salary: 40000, pension: "state" },
];

// New Job Choices (for second selection)
const newJobs = [
  { id: "doctor", title: "Doctor", salary: 75000, pension: "definedBenefit" },
  { id: "freelancer", title: "Freelancer", salary: 35000, pension: "definedContribution" },
];

function JobSelect() {
  const [firstJob, setFirstJob] = useState(null);
  const [secondJob, setSecondJob] = useState(null);
  const [showSecondJobOptions, setShowSecondJobOptions] = useState(false);
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

  // First Job Selection
  const handleFirstJobSelect = (job) => {
    setFirstJob(job);
    setShowSecondJobOptions(true); // Show second job options after first job is picked
  };

  // Second Job Selection (Pension choice)
  const handleSecondJobSelect = (job) => {
    setSecondJob(job);
  };

  return (
    <div className="section-content job-select-section text-center">
      <h2>Pick Your First Job</h2>
      <div className="row mt-4">
        {initialJobs.map((job) => (
          <div key={job.id} className="col-md-4">
            <div
              ref={addToRefs}
              className="card p-3 shadow-sm job-card"
              onClick={() => handleFirstJobSelect(job)}
              style={{ cursor: "pointer" }}
            >
              <h4>{job.title}</h4>
              <p>
                Salary:{" "}
                {job.salary.toLocaleString("en-UK", {
                  style: "currency",
                  currency: "GBP",
                })}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Second Job Selection - Only shows after first job is selected */}
      {showSecondJobOptions && (
        <div className="mt-5">
          <h2>Time to Switch Things Up?</h2>
          <p>Choose a new job or stay with your current job:</p>
          <div className="row mt-4">
            {/* Stay with first job option */}
            <div className="col-md-4">
              <div
                className="card p-3 shadow-sm job-card"
                onClick={() => handleSecondJobSelect(firstJob)}
                style={{ cursor: "pointer", backgroundColor: "#cce5ff" }}
              >
                <h4>Stick with {firstJob.title}</h4>
                <p>State Pension</p>
              </div>
            </div>

            {/* New job options */}
            {newJobs.map((job) => (
              <div key={job.id} className="col-md-4">
                <div
                  className="card p-3 shadow-sm job-card"
                  onClick={() => handleSecondJobSelect(job)}
                  style={{ cursor: "pointer" }}
                >
                  <h4>{job.title}</h4>
                  <p>{job.pension === "definedBenefit" ? "Defined Benefit Pension" : "Defined Contribution Pension"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pension Info - Only show after selecting second job */}
      {secondJob && <Pensions selectedJob={secondJob} />}
    </div>
  );
}

export { initialJobs };
export default JobSelect;

