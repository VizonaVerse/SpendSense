import React, { useRef, useState, useEffect } from "react";
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
import EndShop from "./components/EndShop.js"; // ✅ NEW
import EndScreen from "./components/EndScreen.js";
import CharacterSidebar from "./components/CharacterSideBar.js";
import Information from "./components/Information.js";
import UserDataForm from "./components/UserDataForm.js";

function App() {
  const scrollContainerRef = useRef(null);

  const [selectedJob, setSelectedJob] = useState(null);
  const [initialJob, setInitialJob] = useState(null);
  const [selectedJobSalary, setSelectedJobSalary] = useState(null); // ✅ Add state for job salary
  const [budgetCompleted, setBudgetCompleted] = useState(false);
  const [selectedPension, setSelectedPension] = useState(null);
  const [showEndScreen, setShowEndScreen] = useState(false);
  const [showEndShop, setShowEndShop] = useState(false);
  const [annualContributions, setAnnualContributions] = useState(null);
  const [budgetData, setBudgetData] = useState(null);
  const [processedBudgetData, setProcessedBudgetData] = useState(null); // Finalized data for EndShop
  const [currentSection, setCurrentSection] = useState("home"); // Track the current section

  // Define section indices
  const sectionIndices = {
    home: 0,
    form: 1,
    jobSelect: 2,
    payslip: 3,
    budget: 4,
    jobSwitch: 5,
    PensionWithdrawal: 6,
    endShop: 7, // ✅ NEW
    end: 8,
  };

  // Animate scroll to a section
  const goToSection = (sectionIndex) => {
    const yValue = `-${sectionIndex * 100}vh`;
    const sectionNames = Object.keys(sectionIndices); // Get section names
    const sectionName = sectionNames.find(
      (key) => sectionIndices[key] === sectionIndex
    ); // Find the section name by index

    setCurrentSection(sectionName); // Update the current section state

    gsap.to(scrollContainerRef.current, {
      duration: 1,
      y: yValue,
      ease: "power2.out",
      onComplete: () => console.log(`Scrolled to section: ${sectionName}`),
    });
  };

  // Section handlers
  const handleStart = () => {
    goToSection(sectionIndices.form);
  };

  const handleFormSubmit = () => {
    console.log("Navigating to jobSelect section after form submission");
    goToSection(sectionIndices.jobSelect);
  };

  const handleSkipForm = () => {
    console.log("Form skipped, navigating to jobSelect section");
    goToSection(sectionIndices.jobSelect); // Navigate to the jobSelect section
  };

  const handleJobSelect = (job) => {
    setSelectedJob(job);
    setInitialJob(job);
    setSelectedJobSalary(job.salary); // ✅ Save the selected job's salary
    setSelectedPension(job.pension);
    setTimeout(() => {
      goToSection(sectionIndices.payslip);
    }, 200);
  };

  const handleGoToBudget = (annualContributions) => {
    setAnnualContributions(annualContributions); // Set the annual contributions
    goToSection(sectionIndices.budget); // Navigate to the budget section
  };

  const handleBudgetComplete = (data) => {
    setBudgetData(data); // ✅ Save PieChart data
    setBudgetCompleted(true);

    // Process and finalize the budget data
    const exactPercentages = Object.entries(data).map(([key, value]) => ({
      key,
      value: value,
      floored: Math.floor(value),
      remainder: value - Math.floor(value),
    }));

    // Calculate the total floored percentage
    const totalFloored = exactPercentages.reduce((sum, item) => sum + item.floored, 0);

    // Calculate how many percentage points need to be distributed
    const pointsToDistribute = 100 - totalFloored;

    // Sort by remainder in descending order
    exactPercentages.sort((a, b) => b.remainder - a.remainder);

    // Distribute remaining points to the items with the largest remainders
    const adjustedPercentages = exactPercentages.map((item, index) => ({
      key: item.key,
      value: item.floored + (index < pointsToDistribute ? 1 : 0),
    }));

    // Convert back to an object
    const finalBudgetData = adjustedPercentages.reduce((acc, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {});

    setProcessedBudgetData(finalBudgetData); // ✅ Save finalized data
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
    setShowEndScreen(true);
    goToSection(sectionIndices.end);
  };

  return (
    <div id="main-wrapper">
      <Information />
      <CharacterSidebar characterData={selectedJob} currentSection={currentSection} />
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
                />
              </div>
              {selectedJob && (
                <div className="payslip-button-wrapper">
                  <button
                    onClick={() => handleGoToBudget(annualContributions)}
                    className="btn btn-primary"
                  >
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
                onContinue={handleGoToEndShop} // ✅ Go to EndShop now
              />
            ) : (
              <div className="d-flex justify-content-center align-items-center h-100">
                <p>Please select a pension option to continue.</p>
              </div>
            )}
          </section>

          {/* ✅ Retirement Shop Section */}
          {showEndShop && (
            <section className="section end-shop-section">
              <EndShop budgetData={processedBudgetData} handleGoToEndScreen={handleShowEndScreen} /> {/* Pass finalized data */}
            </section>
          )}

          {/* ✅ End Screen Section */}
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
