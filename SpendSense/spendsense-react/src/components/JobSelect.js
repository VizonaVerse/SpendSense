// src/components/JobSelect.js
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";


// Initial Job Choices
const initialJobs = [
  { id: "Part_Time_Tutor", title: "Part-time Tutor", salary: 10000, pension: "definedContribution" },
  { id: "Family_Business_Waiter", title: "Family Business Waiter", salary: 11000, pension: "definedContribution" },
  { id: "McDonalds_Employee", title: "McDonalds Employee", salary: 15000, pension: "definedContribution" },
];

function JobSelect({ onJobSelect }) {
  const [selectedJob, setSelectedJob] = useState(null);
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

  const handleFirstJobSelect = (job) => {
    setSelectedJob(job);
  };

  const handleContinue = () => {
    if (selectedJob) {
      onJobSelect(selectedJob);
    }
  }

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
    <div className="section-content  text-center">
      <h2>Pick Your First Job</h2>
      <div className="row mt-4 justify-content-center">
        {initialJobs.map((job) => (
          <div key={job.id} className="col-md-4">
            <div
              ref={addToRefs}
              className="card p-3 shadow-sm job-card"
              onClick={() => handleFirstJobSelect(job)}
              onMouseEnter={(e) => handleHover(e.currentTarget)}
              onMouseLeave={(e) => handleHoverOut(e.currentTarget, job)}
              style={{
                cursor: "pointer",
                backgroundColor: selectedJob === job ? "#cce5ff" : "white",
                transition: "background-color 0.3s ease",
              }}
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

      {/* Continue Button */}
      {selectedJob && (
        <div className="mt-4">
          <button
            onClick={handleContinue}
            onMouseEnter={(e) => gsap.to(e.currentTarget, { y: -3, duration: 0.2 })}
            onMouseLeave={(e) => gsap.to(e.currentTarget, { y: 0, duration: 0.2 })}
            className="btn btn-primary"
          >
            Continue to Payslip
          </button>
        </div>
      )}
    </div>
  );
}

export { initialJobs };
export default JobSelect;