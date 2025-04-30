import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Pensions from "./Pensions";

const newJobs = [
  { id: "entrepreneur", title: "Entrepreneur", salary: 50000, pension: "definedContribution" },
  { id: "doctor", title: "Doctor", salary: 70000, pension: "fixedPension" },
  
];

function JobSwitch({ onJobSelect, initialJob, onPensionSelect }) {
  let [selectedJob, setSelectedJob] = useState(initialJob);
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
    onJobSelect(job);
  };
  
  // GSAP Hover Animations
  const handleHover = (element) => {
    gsap.to(element, {
      backgroundColor: "#cce5ff",
      y: -5,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleHoverOut = (element, job) => {
    gsap.to(element, {
      backgroundColor: selectedJob === job ? "#cce5ff" : "white",
      y: 0,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  return (
    <div className="section-content job-select-section2 text-center">
      <h2>Time to Switch Things Up?</h2>
      <p>The government provides a basic £220 weekly pension</p>
      <p>Want to look for something better?:</p>
      <div className="row mt-4 justify-content-center">
        {/* Stay with initial job option */}
        {initialJob && (
          <div className="col-md-4">
            <div
              ref={addToRefs}
              className="card p-3 shadow-sm job-card"
              onMouseEnter={(e) => handleHover(e.currentTarget)}
              onMouseLeave={(e) => handleHoverOut(e.currentTarget, selectedJob === initialJob)}
              onClick={() => handleJobSelect(initialJob)}
              style={{
                cursor: "pointer",
                backgroundColor: selectedJob === initialJob ? "#cce5ff" : "white",
                transition: "background-color 0.3s ease",
              }}
            >
              <h4>Stay as {initialJob.title}</h4>
              <p>Basic Pension</p>
            </div>
          </div>
        )}

        {/* New job options */}
        {newJobs.map((job) => (
          <div key={job.id} className="col-md-4">
            <div
              ref={addToRefs}
              className="card p-3 shadow-sm job-card"
              onMouseEnter={(e) => handleHover(e.currentTarget)}
              onMouseLeave={(e) => handleHoverOut(e.currentTarget, selectedJob === job)}
              onClick={() => handleJobSelect(job)}
              style={{
                cursor: "pointer",
                backgroundColor: selectedJob === job ? "#cce5ff" : "white",
                transition: "background-color 0.3s ease",
              }}
            >
              <h4>{job.title}</h4>
              <p>{job.pension === "fixedPension" ? "Fixed Pension" : "Defined Contribution Pension"}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pension Info - Show after selecting a job */}
      {selectedJob && (
        <div className="mt-4">
          <Pensions selectedJob={selectedJob} />
          <div className="d-flex justify-content-center mt-4">
            <button
              onMouseEnter={(e) => gsap.to(e.currentTarget, { y: -3, duration: 0.2 })}
              onMouseLeave={(e) => gsap.to(e.currentTarget, { y: 0, duration: 0.2 })}
              onClick={() => onPensionSelect(selectedJob.pension)}
              className="btn btn-primary mt-3"
            >
              Continue to Pension Withdrawal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default JobSwitch;
