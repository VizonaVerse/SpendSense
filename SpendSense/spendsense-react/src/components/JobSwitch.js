import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Pensions from "./Pensions";

const newJobs = [
  { id: "entrepreneur", title: "Entrepreneur", apiTitle: "Entrepreneur", salary: 50000, pension: "definedContribution" },
  { id: "dataScientist", title: "Data Scientist", apiTitle: "Data Scientist", salary: 70000, pension: "fixedPension" },
];

function JobSwitch({ onJobSelect, initialJob, onPensionSelect }) {
  const [selectedJob, setSelectedJob] = useState(initialJob);
  const [jobs, setJobs] = useState(newJobs); // Use state to update jobs dynamically
  const cardRefs = useRef([]);
  const [hasExplicitlySelected, setHasExplicitlySelected] = useState(false);

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
    async function fetchSalaryData(job) {
      const url = `http://api.adzuna.com/v1/api/jobs/gb/histogram?app_id=edcbb643&app_key=06103ad4ff1dcb50632c176aada6968b&location0=UK&location1=London&what=${encodeURIComponent(
        job.apiTitle
      )}&content-type=application%2Fjson`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        // Extract the salary with the highest frequency
        const histogram = data.histogram;
        const highestFrequencySalary = Object.keys(histogram).reduce((a, b) =>
          histogram[a] > histogram[b] ? a : b
        );

        // Update the salary for the job only if the new salary is higher
        setJobs((prevJobs) =>
          prevJobs.map((j) =>
            j.id === job.id && parseInt(highestFrequencySalary, 10) > j.salary
              ? { ...j, salary: parseInt(highestFrequencySalary, 10) }
              : j
          )
        );
      } catch (error) {
        console.error(`Failed to fetch salary data for ${job.title}:`, error);
      }
    }

    // Fetch salary data for all jobs
    newJobs.forEach((job) => {
      fetchSalaryData(job);
    });
  }, []);

  const handleJobSelect = (job) => {
    setSelectedJob(job);
    setHasExplicitlySelected(true);
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

  const handleContinue = () => {
    if (selectedJob) {
      onPensionSelect(selectedJob);
    }
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
              <p>
                Salary:{" "}
                {initialJob.salary.toLocaleString("en-UK", {
                  style: "currency",
                  currency: "GBP",
                })}
              </p>
              <p>Basic Pension</p>
            </div>
          </div>
        )}

        {/* New job options */}
        {jobs.map((job) => (
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
              <p>
                Salary:{" "}
                {job.salary.toLocaleString("en-UK", {
                  style: "currency",
                  currency: "GBP",
                })}
              </p>
              <p>{job.pension === "fixedPension" ? "Fixed Pension" : "Defined Contribution Pension"}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pension Info - Show after selecting a job */}
      {hasExplicitlySelected && (
        <div className="mt-4">
          <Pensions selectedJob={selectedJob} />
          <div className="d-flex justify-content-center mt-4">
            <button
              onClick={() => {
                handleContinue();
                onPensionSelect(selectedJob.pension);
              }}
              onMouseEnter={(e) => gsap.to(e.currentTarget, { y: -3, duration: 0.2 })}
              onMouseLeave={(e) => gsap.to(e.currentTarget, { y: 0, duration: 0.2 })}
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
