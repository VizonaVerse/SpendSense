// src/App.js
import React, { useRef, useState } from "react";
import { gsap } from "gsap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Home from "./components/Home";
import JobSelect, { initialJobs } from "./components/JobSelect";
import SamplePayslip from "./components/SamplePayslip";
import Chart from "./components/PieChart.js";

function App() {
  const scrollContainerRef = useRef(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [budgetCompleted, setBudgetCompleted] = useState(false);

  // Define section indices (order: home=0, jobSelect=1, payslip=2, budget=3), page scrolls down to these sections
  const sectionIndices = {
    home: 0,
    jobSelect: 1,
    payslip: 2,
    budget: 3,
    jobSwitch: 4,
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

  const handleJobSelect = (job) => {
    setSelectedJob(job);

    setTimeout(() => {
     goToSection(sectionIndices.payslip); 
    }, 200);
    
  };

  const handleGoToBudget = () => {
    goToSection(sectionIndices.budget);
  };

  const handleBudgetComplete = () => {
    setBudgetCompleted(true); 
    goToSection(sectionIndices.jobSwitch); 
  };

  return (
    <div id="main-wrapper">

      {/* Inner container that will slide between sections */}
      <div id="scroll-container" ref={scrollContainerRef}>
        <section className="section home-section">
          <Home onStart={handleStart} />
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
          <Chart onComplete={handleBudgetComplete} /> {/* Add the Chart component here */}
        </section>
        {/* "Time to Switch Things Up" - Only Show After Budget */}
        {budgetCompleted && (
          <section className="section job-switch-section">
            <JobSelect showSwitchOptions={true} /> 
          </section>
        )}
      </div>


    </div>
  );
}

export default App;
