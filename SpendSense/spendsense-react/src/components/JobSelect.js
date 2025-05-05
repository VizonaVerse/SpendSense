// src/components/JobSelect.js
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";


function JobSelect({ onJobSelect }) {
  const [selectedJob, setSelectedJob] = useState();
  const [jobs, setJobs] = useState([]); // Use state to update jobs dynamically
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


  // Fetch jobs from backend API
  useEffect(() => {
      fetch(`http://localhost:8000/api/job`, {
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
            const stateJobs = data.filter(
              (job) => job.pension === "state" && job.max_salary < 20000
            );
            const contributionJobs = data.filter(
              (job) => job.pension === "contribution" && job.max_salary < 20000
            );
    
            // Randomly select 2 jobs with "state" pension
            const randomStateJobs = stateJobs
              .sort(() => 0.5 - Math.random())
              .slice(0, 2);
    
            // Randomly select 1 job with "contribution" pension
            const randomContributionJob = contributionJobs
              .sort(() => 0.5 - Math.random())
              .slice(0, 1);
    
            // Combine the selected jobs
            setJobs([...randomStateJobs, ...randomContributionJob]);
            console.log(randomStateJobs);
            console.log(randomContributionJob);
    
          } else {
            console.error('Expected an array but got:', data);
          }
          })
        .catch(error => console.error('Error fetching data:', error));
    }, []);

  // Fetch salary data from Adzuna API for each job
  useEffect(() => {
    async function fetchSalaryData(job) {
      const url = `http://api.adzuna.com/v1/api/jobs/gb/histogram?app_id=edcbb643&app_key=06103ad4ff1dcb50632c176aada6968b&location0=UK&location1=London&what=${encodeURIComponent(
        job.api_title
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

  const handleFirstJobSelect = (job) => {
    setSelectedJob(job);
  };

  const handleContinue = () => {
    if (selectedJob) {
      onJobSelect(selectedJob);
    }
  };

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
    <div className="section-content text-center">
      <h2>Pick Your First Job</h2>
      <div className="row mt-4 justify-content-center">
        {jobs
          .slice() // Create a shallow copy to avoid mutating the original state
          .sort((a, b) => a.salary - b.salary) // Sort jobs by salary in ascending order
          .map((job) => (
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
            Continue
          </button>
        </div>
      )}
    </div>
  );
}

export default JobSelect;