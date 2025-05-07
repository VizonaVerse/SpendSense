import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Pensions from "./Pensions";


function JobSwitch({ onJobSelect, initialJob, onPensionSelect }) {
  const [selectedJob, setSelectedJob] = useState();
  const [jobs, setJobs] = useState([]); // Use state to update jobs dynamically
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

  // Fetch jobs from backend API
    useEffect(() => {
        fetch(`http://localhost:8000/api/job/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'token': process.env.REACT_APP_API_TOKEN,
          },
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            console.log('Fetched data:', data);
    
            // Ensure `data` is an array before setting it
            if (Array.isArray(data)) {
  
              data = data.map((job) => ({
                ...job,
                salary: 0,
              }));
              // Filter jobs to meet the criteria
              const benefitJobs = data.filter(
                (job) => job.pension === "benefit" && job.min_salary > 20000
              );
              const contributionJobs = data.filter(
                (job) => job.pension === "contribution" && job.min_salary > 20000
              );
      
              // Randomly select 2 jobs with "state" pension
              const randomBenefitJobs = benefitJobs
                .sort(() => 0.5 - Math.random())
                .slice(0, 1);
      
              // Randomly select 1 job with "contribution" pension
              const randomContributionJob = contributionJobs
                .sort(() => 0.5 - Math.random())
                .slice(0, 1);
      
              // Combine the selected jobs
              setJobs([...randomBenefitJobs, ...randomContributionJob]);
              console.log(randomBenefitJobs);
              console.log(randomContributionJob);
      
            } else {
              console.error('Expected an array but got:', data);
            }
            })
          .catch(error => console.error('Error fetching data:', error));
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

        // Update the salary for the job
        setJobs((prevJobs) =>
          prevJobs.map((j) =>
            j.title === job.title
              ? {
                  ...j,
                  salary:
                    highestFrequencySalary > j.min_salary && highestFrequencySalary < j.max_salary
                      ? highestFrequencySalary
                      : (j.min_salary + j.max_salary) / 2, // Set to midpoint if out of range
                }
              : j
          )
        );
      } catch (error) {
        console.error(`Failed to fetch salary data for ${job.title}:`, error);

        // If API fails, set salary to midpoint
        setJobs((prevJobs) =>
          prevJobs.map((j) =>
            j.title === job.title
              ? {
                  ...j,
                  salary: (j.min_salary + j.max_salary) / 2,
                }
              : j
          )
        );
      }
    }

    // Fetch salary data for all jobs
    jobs.forEach((job) => {
      fetchSalaryData(job);
    });
  }, [jobs]);

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

        {/* New job options sorted by salary */}
        {jobs
          .slice()
          .sort((a, b) => a.salary - b.salary) // Sort jobs by salary in ascending order
          .map((job) => (
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
                <p>
                  {job.pension === "benefit"
                    ? "Fixed Pension"
                    : "Defined Contribution Pension"}
                </p>
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
