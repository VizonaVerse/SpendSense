// src/components/JobSelect.js
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const jobs = [
  { title: "Software Engineer", salary: 60000 },
  { title: "Graphic Designer", salary: 45000 },
  { title: "Teacher", salary: 40000 },
];

function JobSelect({ onJobSelect }) {
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

  return (
    <div className="section-content job-select-section text-center">
      <h2>Pick a Job</h2>
      <div className="row mt-4">
        {jobs.map((job, index) => (
          <div key={index} className="col-md-4">
            <div
              ref={addToRefs}
              className="card p-3 shadow-sm job-card"
              onClick={() => onJobSelect(index)}
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

export { JobSelect, jobs };
