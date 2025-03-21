// src/App.js
import React, { useRef, useState } from "react";
import { gsap } from "gsap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Home from "./components/Home";
import { JobSelect, jobs } from "./components/JobSelect";
import SamplePayslip from "./components/SamplePayslip";
import Chart from "./components/PieChart.js";

function App() {
  const scrollContainerRef = useRef(null);
  const [selectedJob, setSelectedJob] = useState(null);

  // Define section indices (order: home=0, jobSelect=1, payslip=2, budget=3), page scrolls down to these sections
  const sectionIndices = {
    home: 0,
    jobSelect: 1,
    payslip: 2,
    budget: 3,
  };

  // Animate the container to show the target section
  const goToSection = (sectionIndex) => {
    const yValue = `-${sectionIndex * 100}vh`;
    gsap.to(scrollContainerRef.current, {
      duration: 1,
      y: yValue,
      ease: "power2.out",
    });
  };

  const handleStart = () => {
    goToSection(sectionIndices.jobSelect);
  };

  const handleJobSelect = (index) => {
    setSelectedJob(jobs[index]);
    goToSection(sectionIndices.payslip);
  };

  const handleGoToBudget = () => {
    goToSection(sectionIndices.budget);
  };


  return (
    <div id="main-wrapper">

      {/* Inner container that will slide between sections */}
      <div id="scroll-container" ref={scrollContainerRef}>
        <section className="section home-section">
          <Chart onStart={handleStart} />
        </section>

        <section className="section job-select-section">
          <JobSelect onJobSelect={handleJobSelect} />
        </section>

        <section className="section payslip-section">
          <div className="payslip-wrapper">
            <div className="payslip-content">
              <SamplePayslip job={selectedJob} />
            </div>
            {selectedJob && (
              <div className="payslip-button-wrapper">
                <button onClick={handleGoToBudget} className="btn btn-primary">
                  Go to Budgeting Game
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="section budgeting-section">
          <Chart /> {/* Add the Chart component here */}
        </section>
      </div>


    </div>
  );
}

export default App;
