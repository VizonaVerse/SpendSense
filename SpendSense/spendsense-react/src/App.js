import React, { useRef, useState } from "react";
import { gsap } from "gsap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

// Components
import Home from "./components/Home";
import JobSelect from "./components/JobSelect";
import SamplePayslip from "./components/SamplePayslip";
import Chart from "./components/PieChart.js";
import JobSwitch from "./components/JobSwitch.js";
import PensionWithdrawal from "./components/PensionWithdrawal.js";
import EndShop from "./components/EndShop.js"; // 
import EndScreen from "./components/EndScreen.js";
import Information from "./components/Information.js";
import UserDataForm from "./components/UserDataForm.js";
import Stats from "./components/Stats.js";
import CharacterInfo from "./components/CharacterInfo.js";

function App() {
  const scrollContainerRef = useRef(null);
  const [selectedJobSalary, setSelectedJobSalary] = useState(null); // 
  const [selectedJob, setSelectedJob] = useState(null);
  const [initialJob, setInitialJob] = useState(null);
  const [budgetCompleted, setBudgetCompleted] = useState(false);
  const [selectedPension, setSelectedPension] = useState(null);
  const [showEndScreen, setShowEndScreen] = useState(false);
  const [showEndShop, setShowEndShop] = useState(false);
  const [annualContributions, setAnnualContributions] = useState(null);
  const [netPay, setNetPay] = useState(null);
  const [budgetData, setBudgetData] = useState(null);
  const [processedBudgetData, setProcessedBudgetData] = useState(null); // Finalized data for EndShop
  const [currentSection, setCurrentSection] = useState("home"); // Track the current section
  const [showStats, setShowStats] = useState(false);

  // Define section indices
  const sectionIndices = {
    home: 0,
    form: 1,
    jobSelect: 2,
    payslip: 3,
    budget: 4,
    jobSwitch: 5,
    PensionWithdrawal: 6,
    endShop: 7, 
    end: 8,
  };

  // Animate scroll to a section
  const goToSection = (sectionIndex) => {
    const yValue = `-${sectionIndex * 100}vh`;
    gsap.to(scrollContainerRef.current, {
      duration: 1,
      y: yValue,
      ease: "power2.out",
      onComplete: () => console.log(`Scrolled to section: ${sectionIndex}`),
    });
  };

  // Section handlers
  const handleStart = () => {
    goToSection(sectionIndices.form);
  };

  const handleFormSubmit = () => {
    console.log("Navigating to jobSelect section after form submission");
    setShowStats(true); // Show Stats after form submission
    goToSection(sectionIndices.jobSelect);
  };

  const handleSkipForm = () => {
    console.log("Form skipped, navigating to jobSelect section");
    setShowStats(true); // Show Stats after form is skipped
    goToSection(sectionIndices.jobSelect); // Navigate to the jobSelect section
  };

  const handleJobSelect = (job) => {
    setSelectedJob(job);
    setInitialJob(job);
    setSelectedJobSalary(job.salary); 
    setSelectedPension(job.pension);
    setTimeout(() => {
      goToSection(sectionIndices.payslip);
    }, 200);
  };

  const handleGoToBudget = () => {
    goToSection(sectionIndices.budget);
  };

  const handleBudgetComplete = (data) => {
    setBudgetData(data); // 
    setBudgetCompleted(true);
    goToSection(sectionIndices.jobSwitch);
  };

  const handlePensionSelection = (pensionType) => {
    setSelectedPension(pensionType);
    goToSection(sectionIndices.PensionWithdrawal);
  };

  const handleGoToEndShop = () => {
    setShowEndShop(true);
    goToSection(sectionIndices.endShop);
  };

  const handleShowEndScreen = () => {
    setShowStats(false); // Hide Stats before showing EndScreen
    setShowEndScreen(true);
    goToSection(sectionIndices.end);
  };

  return (
    <div id="main-wrapper">
      <Information />
      {showStats && (
        <>
          <Stats />
          <CharacterInfo characterData={selectedJob} currentSection={currentSection} />
        </>
      )}
        <div id="scroll-container" ref={scrollContainerRef}>
          {/* Home Section */}
          <section className="section home-section">
            <Home onStart={handleStart} />
          </section>
        

        {/* User Data Form Section */}
        <section className="section form-section">
          <div className="form-wrapper">
            <h2 className="text-center">User Data Form</h2>
            <div className="form-content">
              <UserDataForm onSubmit={handleFormSubmit} onSkip={handleSkipForm} />
            </div>
          </div>
        </section>
        
        {/* Job Selection */}

        <section className="section job-select-section">
          <JobSelect onJobSelect={handleJobSelect} />
        </section>

        {/* Payslip Section */}
        <section className="section payslip-section">
          <div className="payslip-wrapper">
            <div className="payslip-content">
                <SamplePayslip
                  job={selectedJob}
                  salary={selectedJobSalary}
                  onAnnualContributionsChange={setAnnualContributions} // Pass callback
                  onNetPayChange={setNetPay} // Pass callback
                />
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

{/* Budget Section */}
<section className="section budgeting-section">
          <div className="d-flex flex-column align-items-center">
            <Chart onComplete={handleBudgetComplete} /> {/* Pass callback */}
            <button 
              onClick={() => handleBudgetComplete({ exampleData: 123 })} 
              className="btn btn-success mt-4"
            >
              Next
            </button>
          </div>
        </section>

        {/* Job Switch Section */}
        {budgetCompleted && (
          <section className="section job-switch-section">
            <JobSwitch
              onJobSelect={(job) => setSelectedJob(job)}
              onPensionSelect={handlePensionSelection}
              initialJob={initialJob}
            />
          </section>
        )}

        {/* Pension Withdrawal Section */}
        <section className="section pension-withdrawal-section">
          {selectedPension ? (
            <PensionWithdrawal
              selectedPension={selectedPension}
              onContinue={handleGoToEndShop} 
            />
          ) : (
            <div className="d-flex justify-content-center align-items-center h-100">
              <p>Please select a pension option to continue.</p>
            </div>
          )}
        </section>

        {/* Retirement Shop Section */}
        {showEndShop && (
          <section className="section end-shop-section">
            <EndShop
            netPay={netPay*12} // Pass the annual salary 
            netPay2 = {selectedJobSalary}//{(0.8 * selectedJobSalary) + (12570 * 0.2)}
            annualContributions={annualContributions} // Pass the annual contributions
            budgetData={budgetData} 
            handleGoToEndScreen={handleShowEndScreen} /> {/* Pass data */}
          </section>
        )}

        {/* End Screen Section */}
        <section className="section end-screen-section">
          <EndScreen
            isVisible={showEndScreen}
            onEndScreen={(endingType) => {
              console.log("Ending selected:", endingType);
            }}
          />
        </section>
      </div>
    </div>
  );
}

export default App;
