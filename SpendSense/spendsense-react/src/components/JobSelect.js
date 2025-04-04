// src/components/JobSelect.js
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";


// Initial Job Choices
const initialJobs = [
  { id: "Part_Time_Tutor", title: "Part-time Tutor", salary: 10000, pension: "state" },
  { id: "Family_Business_Waiter", title: "Family Business Waiter", salary: 11000, pension: "state" },
  { id: "McDonalds_Employee", title: "McDonalds Employee", salary: 15000, pension: "state" },
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

  // First Job Selection
  const handleFirstJobSelect = (job) => {
    setSelectedJob(job);
    onJobSelect(job);
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
    </div>
  );
}
export {initialJobs};
export default JobSelect;