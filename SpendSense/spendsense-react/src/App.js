import React, { useRef, useState } from "react";
import { gsap } from "gsap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Home from "./components/Home";
import JobSelect, {selectedJob} from "./components/JobSelect";
import SamplePayslip from "./components/SamplePayslip";
import Chart from "./components/PieChart.js";
import JobSwitch from "./components/JobSwitch.js";
import PensionWithdrawal from "./components/PensionWithdrawal.js";
import Navbar from "./components/Navbar.js";

function App() {
  const scrollContainerRef = useRef(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [initialJob, setInitialJob] = useState(null);
  const [budgetCompleted, setBudgetCompleted] = useState(false);
  const [selectedPension, setSelectedPension] = useState(null);

  // Define section indices (order: home=0, jobSelect=1, payslip=2, budget=3, jobSwitch1=4)
  const sectionIndices = {
    home: 0,
    jobSelect: 1,
    payslip: 2,
    budget: 3,
    jobSwitch: 4,
    PensionWithdrawal: 5,
  };

  // Animate the container to show the target section
  const goToSection = (sectionIndex) => {
    const yValue = `-${sectionIndex * 100}vh`;
    gsap.to(scrollContainerRef.current, {
      duration: 1,
      y: yValue,
      ease: "power2.out",
      onComplete: () => console.log(`Scrolled to section: ${sectionIndex}`),
    });
  };
  

  const handleStart = () => {
    goToSection(sectionIndices.jobSelect);
  };

  const handleJobSelect = (job) => {
    setSelectedJob(job);
    setInitialJob(job);
    setSelectedPension(job.pension);
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

  const handlePensionSelection = (pensionType) => {
    setSelectedPension(pensionType);
    goToSection(sectionIndices.PensionWithdrawal);
  };

  return (
    <div id="main-wrapper">
      <Navbar />
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
          <Chart onComplete={handleBudgetComplete} />
          <button onClick={handleBudgetComplete} className="btn btn-success mt-3">
            Next
          </button>
        </section>
  
        {budgetCompleted && (
          <section className="section job-switch-section">
            <JobSwitch 
  onJobSelect={(job) => setSelectedJob(job)} 
  onPensionSelect={handlePensionSelection}
  initialJob={initialJob} 
/>

         
          </section>
        )}
  
        {/* Pension withdrawal section: always present, content is conditional */}
        <section className="section pension-withdrawal-section">
          {selectedPension ? (
            <PensionWithdrawal
              selectedPension={selectedPension}
              onContinue={() => console.log("Proceeding to next step...")}
            />
          ) : (
            <div className="d-flex justify-content-center align-items-center h-100">
              <p>Please select a pension option to continue.</p>
            </div>
          )}
        </section>
  
      </div>
    </div>
  );
}  
export default App;