import React, { useRef, useState } from "react";
import { gsap } from "gsap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Home from "./components/Home";
import JobSelect, { initialJobs } from "./components/JobSelect";
import SamplePayslip from "./components/SamplePayslip";
import Chart from "./components/PieChart.js";
import JobSwitch1 from "./components/JobSwitch1";

function App() {
  const scrollContainerRef = useRef(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [initialJob, setInitialJob] = useState(null);
  const [budgetCompleted, setBudgetCompleted] = useState(false);

  // Define section indices (order: home=0, jobSelect=1, payslip=2, budget=3, jobSwitch1=4)
  const sectionIndices = {
    home: 0,
    jobSelect: 1,
    payslip: 2,
    budget: 3,
    jobSwitch1: 4,
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
    setInitialJob(job);
    setTimeout(() => {
     goToSection(sectionIndices.payslip); 
    }, 200);
  };

  const handleGoToBudget = () => {
    goToSection(sectionIndices.budget);
  };

  const handleBudgetComplete = () => {
    setBudgetCompleted(true); 
    goToSection(sectionIndices.jobSwitch1); 
  };

  return (
    <div id="main-wrapper">
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

        <section className="section budgeting-section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
          <Chart onComplete={handleBudgetComplete} />
          <div className="budget-button-wrapper" style={{ marginTop: '20px' }}>
            <button onClick={handleBudgetComplete} className="btn btn-success">
              Next
            </button>
          </div>
        </section>

        {budgetCompleted && (
          <section className="section job-switch-section">
            <JobSwitch1 onJobSelect={setSelectedJob} initialJob={initialJob} />
          </section>
        )}
      </div>
    </div>
  );
}

export default App;
