// src/components/JobSelect.js
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

function JobSelect({ onJobSelect }) {
  const [selectedJob, setSelectedJob] = useState();
  const [jobs, setJobs] = useState([]); // Use state to update jobs dynamically
  const cardRefs = useRef([]);
  const hasFetchedJobs = useRef(false);
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
    // Prevent repeated fetching of jobs
    if (hasFetchedJobs.current) return;

    fetch(`http://localhost:8000/api/job/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'token': process.env.REACT_APP_API_TOKEN,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Fetched data:', data);

        if (Array.isArray(data)) {
          data = data.map((job) => ({
            ...job,
            salary: job.min_salary +job.max_salary / 2,
          }));

          const stateJobs = data.filter(
            (job) => job.pension === 'state' && job.max_salary < 20000
          );
          const contributionJobs = data.filter(
            (job) => job.pension === 'contribution' && job.max_salary < 20000
          );

          const randomStateJobs = stateJobs
            .sort(() => 0.5 - Math.random())
            .slice(0, 2);
          const randomContributionJob = contributionJobs
            .sort(() => 0.5 - Math.random())
            .slice(0, 1);

          setJobs([...randomStateJobs, ...randomContributionJob]);
          console.log(randomStateJobs);
          console.log(randomContributionJob);
        } else {
          console.error('Expected an array but got:', data);
        }

        // Mark jobs as fetched
        hasFetchedJobs.current = true;
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []); // Dependency array ensures this runs only once

  useEffect(() => {
    // Prevent repeated fetching of salary data
    if (hasFetchedSalaries.current || jobs.length === 0) return;

    async function fetchSalaryData(job) {
      const url = `http://api.adzuna.com/v1/api/jobs/gb/histogram?app_id=edcbb643&app_key=06103ad4ff1dcb50632c176aada6968b&location0=UK&location1=London&what=${encodeURIComponent(
        job.api_title
      )}&content-type=application%2Fjson`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        const histogram = data.histogram;
        const highestFrequencySalary = Object.keys(histogram).reduce((a, b) =>
          histogram[a] > histogram[b] ? a : b
        );

        setJobs((prevJobs) =>
          prevJobs.map((j) =>
            j.title === job.title
              ? {
                  ...j,
                  salary:
                    highestFrequencySalary > j.min_salary &&
                    highestFrequencySalary < j.max_salary
                      ? highestFrequencySalary
                      : (j.min_salary + j.max_salary) / 2,
                }
              : j
          )
        );
      } catch (error) {
        console.error(`Failed to fetch salary data for ${job.title}:`, error);

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

    // Mark salaries as fetched
    hasFetchedSalaries.current = true;
  }, [jobs]); // Only runs when `jobs` changes

  const handleFirstJobSelect = (job) => {
    setSelectedJob(job);
  
    cardRefs.current.forEach((card, index) => {
      const jobAtIndex = jobs[index];
      gsap.set(card, {
        backgroundColor:
          jobAtIndex.id === job.id
            ? "rgba(255, 239, 170, 0.9)" 
            : "rgba(255, 255, 255, 0.8)", 
      });
    });
  
    const selectedIndex = jobs.findIndex((j) => j.id === job.id);
    const selectedCard = cardRefs.current[selectedIndex];
  
    gsap.fromTo(
      selectedCard,
      { scale: 1 },
      { scale: 1.05, duration: 0.2, yoyo: true, repeat: 1, ease: "power2.out" }
    );
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
    backgroundColor:
      selectedJob?.id === job.id
        ? "rgba(255, 239, 170, 0.9)" // soft pixel-style yellow
        : "rgba(255, 255, 255, 0.8)",
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
          .slice()
          .sort((a, b) => a.salary - b.salary)
          .map((job) => (
            <div key={job.id} className="col-md-4">
              <div
                ref={addToRefs}
                className={`card p-3 shadow-sm job-card ${selectedJob?.id === job.id ? "job-card-selected" : ""}`}
                onClick={() => handleFirstJobSelect(job)}
                onMouseEnter={(e) => handleHover(e.currentTarget)}
                onMouseLeave={(e) => handleHoverOut(e.currentTarget, job)}
                style={{
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  position: "relative",
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
  
      {selectedJob && (
        <div className="mt-4">
          <button
            onClick={handleContinue}
            onMouseEnter={(e) => gsap.to(e.currentTarget, { y: -3, duration: 0.2 })}
            onMouseLeave={(e) => gsap.to(e.currentTarget, { y: 0, duration: 0.2 })}
            className="pixel-button"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
  
}

export default JobSelect;