import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Pensions from "./Pensions";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

function JobSwitch({ onJobSelect, initialJob, onPensionSelect }) {
  const [selectedJob, setSelectedJob] = useState();
  const [jobs, setJobs] = useState([]);
  const cardRefs = useRef([]);
  const [hasExplicitlySelected, setHasExplicitlySelected] = useState(false);
  const hasFetchedSalaries = useRef(false);

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

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/job/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: process.env.REACT_APP_API_TOKEN,
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          data = data.map((job) => ({
            ...job,
            salary: job.min_salary + job.max_salary / 2,
          }));

          const benefitJobs = data.filter((j) => j.pension === "benefit" && j.min_salary > 20000);
          const contributionJobs = data.filter((j) => j.pension === "contribution" && j.min_salary > 20000);

          const randomBenefitJobs = benefitJobs.sort(() => 0.5 - Math.random()).slice(0, 1);
          const randomContributionJob = contributionJobs.sort(() => 0.5 - Math.random()).slice(0, 1);

          setJobs([...randomBenefitJobs, ...randomContributionJob]);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    if (hasFetchedSalaries.current || jobs.length === 0) return;

    async function fetchSalaryData(job) {
      const url = `http://api.adzuna.com/v1/api/jobs/gb/histogram?...`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        const histogram = data.histogram;
        const highestFrequencySalary = Object.keys(histogram).reduce((a, b) =>
          histogram[a] > histogram[b] ? a : b
        );

        setJobs((prevJobs) =>
          prevJobs.map((j) =>
            j.title === job.title ? {
              ...j,
              salary: (highestFrequencySalary > j.min_salary && highestFrequencySalary < j.max_salary)
                ? highestFrequencySalary
                : (j.min_salary + j.max_salary) / 2,
            } : j
          )
        );
      } catch {
        setJobs((prevJobs) =>
          prevJobs.map((j) =>
            j.title === job.title ? {
              ...j,
              salary: (j.min_salary + j.max_salary) / 2,
            } : j
          )
        );
      }
    }

    jobs.forEach(fetchSalaryData);
    hasFetchedSalaries.current = true;
  }, [jobs]);

    const handleJobSelect = (job) => {
      setSelectedJob(job);
      setHasExplicitlySelected(true);
      onJobSelect(job);
    
      const allJobs = [initialJob, ...jobs];
    
      allJobs.forEach((j, i) => {
        const card = cardRefs.current[i];
        if (card) {
          if (j.id === job.id) {
            card.classList.add("job-card-selected");
            gsap.fromTo(card, { scale: 1 }, { scale: 1.05, duration: 0.2, yoyo: true, repeat: 1 });
          } else {
            card.classList.remove("job-card-selected");
          }
        }
      });
    };
    
  
  return (
    <div className="section-content job-select-section2 text-center">
      <h2>Time to Switch Things Up?</h2>
      <p>The government provides a basic £220 weekly pension</p>
      <p>Want to look for something better?:</p>
      <div className="row mt-4 justify-content-center">
        {[initialJob, ...jobs].map((job, i) => (
          <div key={job.id} className="col-md-4">
            <div
              ref={addToRefs}
              className="card p-3 shadow-sm job-card"
              onMouseEnter={(e) => gsap.to(e.currentTarget, { y: -5 })}
              onMouseLeave={(e) => gsap.to(e.currentTarget, { y: 0 })}
              onClick={() => handleJobSelect(job)}
              style={{
                cursor: "pointer",
                transition: "all 0.3s ease",
                position: "relative",
              }}
            >
              <h4>{i === 0 ? `Stay as ${job.title}` : job.title}</h4>
              <p>Salary: {job.salary.toLocaleString("en-UK", { style: "currency", currency: "GBP" })}</p>
              <p>
                {i === 0
                  ? "Basic Pension"
                  : job.pension === "benefit"
                  ? "Fixed Pension"
                  : "Defined Contribution Pension"}
              </p>
              {selectedJob?.id === job.id && (
                <div
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    backgroundColor: "green",
                    color: "white",
                    borderRadius: "50%",
                    width: "24px",
                    height: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: "14px",
                  }}
                >
                  ✓
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {hasExplicitlySelected && (
        <div className="mt-4">
          <Pensions selectedJob={selectedJob} />
          <div className="d-flex justify-content-center mt-4">
            <button
              onClick={() => {
                handleJobSelect(selectedJob);
                onPensionSelect(selectedJob.pension);
              }}
              onMouseEnter={(e) => gsap.to(e.currentTarget, { y: -3 })}
              onMouseLeave={(e) => gsap.to(e.currentTarget, { y: 0 })}
              className="pixel-button"
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
