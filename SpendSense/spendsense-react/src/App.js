import React, { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

// Components
import Home from "./components/Home";
import JobSelect from "./components/JobSelect";
import SamplePayslip from "./components/SamplePayslip";
import Chart from "./components/PieChart.js";
import JobSwitch from "./components/JobSwitch.js";
import PensionWithdrawal from "./components/PensionWithdrawal.js";
import EndShop from "./components/EndShop.js";
import EndScreen from "./components/EndScreen.js";
import Information from "./components/Information.js";
import UserDataForm from "./components/UserDataForm.js";
import Stats from "./components/Stats.js";
import CharacterInfo from "./components/CharacterInfo.js";
import KnowYourMoney from "./components/KnowYourMoney.js";
import BudgetPlanner from "./components/BudgetPlanner.js";
import EmploymentInfo from "./components/EmploymentInfo.js";
import IncomeTaxInfo from "./components/IncomeTaxInfo.js";
import PensionInfo from "./components/PensionInfo.js";
import AboutUs from "./components/AboutUs.js";

function App() {
  const scrollContainerRef = useRef(null);
  const [selectedJobSalary, setSelectedJobSalary] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [initialJob, setInitialJob] = useState(null);
  const [budgetCompleted, setBudgetCompleted] = useState(false);
  const [selectedPension, setSelectedPension] = useState(null);
  const [showEndScreen, setShowEndScreen] = useState(false);
  const [showEndShop, setShowEndShop] = useState(false);
  const [annualContributions, setAnnualContributions] = useState(null);
  const [netPay, setNetPay] = useState(null);
  const [netPay2, setNetPay2] = useState(null);
  const [budgetData, setBudgetData] = useState(null);
  const [processedBudgetData, setProcessedBudgetData] = useState(null);
  const [currentSection, setCurrentSection] = useState("home");
  const [showStats, setShowStats] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [money, setMoney] = useState(0);
  const [progress, setProgress] = useState(0);
  const [lifeExpectancy, setLifeExpectancy] = useState(75);
  const [pension1, setPension1] = useState(0);
  const [pension2, setPension2] = useState(0);
  const [Savings1, setSavings1] = useState(0);
  const [Savings2, setSavings2] = useState(0);
  const [finalMoney, setFinalMoney] = useState(0);
  const [budgetSavings, setBudgetSavings] = useState(0);
  const [budgetWants, setBudgetWants] = useState(0);
  const [budgetNeeds, setBudgetNeeds] = useState(0);

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    age: '',
    location: '',
    full_time_education: false,
  });

  // Define section indices
  const sectionIndices = {
    home: 0,
    form: 1,
    jobSelect: 2,
    employmentInfo: 3,
    payslip: 4,
    incomeInfo: 5,
    budget: 6,
    budgetPlanner: 7,
    jobSwitch: 8,
    pensionWithdrawal: 9,
    pensionInfo: 10,
    endShop: 11,
    end: 12,
    knowYourMoney: 13,
  };

  // Update current section based on scroll position
  useEffect(() => {
    // Prevent manual scrolling by disabling scroll
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  let scrollMultiplier = 100; // Adjust this value to control scroll distance
  // Animate scroll to a section with improved transition handling
  const goToSection = (sectionName) => {
    if (isTransitioning) return; // Prevent multiple transitions

    setIsTransitioning(true);
    setCurrentSection(sectionName);
    const sectionIndex = sectionIndices[sectionName];
    const yValue = `-${sectionIndex * scrollMultiplier}vh`;

    gsap.to(scrollContainerRef.current, {
      duration: 1,
      y: yValue,
      ease: "power2.out",
      onComplete: () => {
        console.log(`Scrolled to section: ${sectionName}`);
        setIsTransitioning(false);
      },
    });
  };

  // Section handlers
  const handleStart = () => {
    goToSection("form");
  };

  const handleFormSubmit = (data) => {
    setFormData(data);
    console.log("Form data saved:", data);
    setShowStats(true);
    goToSection("jobSelect");
  };

  const handleSkipForm = () => {
    console.log("Form skipped, navigating to jobSelect section");
    setShowStats(true);
    goToSection("jobSelect");
  };

  const handleJobSelect = (job) => {
    setSelectedJob(job);
    setInitialJob(job);
    setSelectedJobSalary(job.salary);
    setSelectedPension(job.pension);
    setMoney(netPay);
    setTimeout(() => {
      goToSection("employmentInfo");
    }, 200);

    addProgress(10);
  };

  const handleGoToPayslip = () => {
    goToSection("payslip");
    addProgress(10);
  };

  const handleGoToIncomeInfo = () => {
    goToSection("incomeInfo");
    addProgress(10);
  };

  const handleGoToBudget = () => {
    goToSection("budget");
    addProgress(10);
  };

  const handleBudgetComplete = (data) => {
    setBudgetSavings(data.Savings);
    setBudgetWants(data.Wants);
    setBudgetNeeds(data.Needs);
    setBudgetData(data);
    setBudgetCompleted(true);
    const savings1 = (netPay * (data.Savings / 100) + pension1) * 10;
    setMoney(savings1); // Update money state
    setSavings1(savings1);
    addProgress(10);
    const numericalSavings = parseFloat(data.Savings) / 100;
    if (Math.abs(numericalSavings - 0.2) <= (0.3)) {
      const newLifeExpectancy = 100 - (Math.abs(numericalSavings - 0.2) * 150);
      setLifeExpectancy(Math.round(newLifeExpectancy));
    } else {
      setLifeExpectancy(55);
    }
    goToSection("budgetPlanner");
  };

  const handleGoToJobSwitch = () => {
    goToSection("jobSwitch");
    addProgress(10);
  };

  const handlePensionSelection = (pensionType) => {
    setSelectedPension(pensionType);
    let pension2 = (0.05 * selectedJobSalary) + (0.03 * selectedJobSalary);
    if (selectedPension === "contribution") {
      pension2 = (0.05 * selectedJobSalary) + (0.05 * selectedJobSalary);
    }
    const netPay2 = (0.8 * ((selectedJobSalary * 0.95) - 12570) + 12570);
    const savings2 = (netPay2 * (budgetData.Savings / 100) + pension2) * 30;
    setSavings2(savings2);
    setPension2(pension2);
    setNetPay2(netPay2);
    goToSection("pensionWithdrawal");
    addProgress(10);
  };

  const handleGoToPensionInfo = (selectedOption) => {
    setMoney(money + Savings2);
    const lifeMultiplier = lifeExpectancy - 58;
    let totalMoney = 0;

    if (lifeExpectancy >= 58) {
      if (selectedPension === "contribution") {
        if (selectedOption === "Withdraw via Insurance Company") {
          totalMoney = 1.85 * (Savings1 + Savings2);
        } else if (selectedOption === "Deposit into a Bank") {
          totalMoney = (Savings1 + Savings2) * Math.pow(1.03, lifeMultiplier);
        }
      } else if (selectedPension === "benefit") {
        if (selectedOption === "Weekly Taxed Payments") {
          totalMoney = 0.5 * netPay2 * lifeMultiplier + Savings1 + Savings2;
        } else if (selectedOption === "Lump Sum Withdrawal") {
          totalMoney = 18.75 * netPay2 + Savings1 + Savings2;
        }
      }
      totalMoney += lifeMultiplier * 11440;
      setMoney(Math.round(totalMoney));
    } 
    setFinalMoney(money);
    goToSection("pensionInfo");
    addProgress(10);
  };

  const handleBadEndOrEndShop = () => {
    if (lifeExpectancy < 58) {
      // Meant to show the bad ending screen
      // setShowStats(false);
      // goToSection("");
    } // else {
    setShowEndShop(true);
    goToSection("endShop");
    addProgress(10);
    // }
  };

  const handleShowEndScreen = () => {
    setShowStats(false);
    setShowEndScreen(true);
    goToSection("end");
  };

  const handleMoneyChange = (newMoney) => {
    setMoney(newMoney); // Update money state
  };

  const addProgress = (amount) => {
    // Make sure progress stays between 0-100
    setProgress(prevProgress => Math.min(100, Math.max(0, prevProgress + amount)));
  };

  return (
    <Routes>
      {/* Route for the learning page */}
      <Route path="/learn" element={<KnowYourMoney />} />

      {/* Route for the About Us page */}
      <Route path="/about-us" element={<AboutUs />} />

      {/* Route for the main scrolling game */}
      <Route path="/" element={
        <>
          <div id="main-wrapper">
            <Information goToSection={goToSection} />

            {showStats && (
              <>
                <Stats
                  characterData={selectedJob}
                  currentSection={currentSection}
                  characterMoney={money}
                  characterProgress={progress}
                  characterLifeExpectancy={lifeExpectancy}
                  onProgressChange={(newProgress) => setProgress(newProgress)}
                />
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
                  <h2 className="text-center">Enter your details</h2>
                  <div className="form-content">
                    <UserDataForm onSubmit={handleFormSubmit} onSkip={handleSkipForm} />
                  </div>
                </div>
              </section>

              {/* Job Selection Section */}
              <section className="section job-select-section">
                <JobSelect onJobSelect={handleJobSelect} />
              </section>

              {/* Employment Info Section */}
              <section className="section employment-info-section">
                <EmploymentInfo onClick={handleGoToPayslip} />
              </section>

              {/* Payslip Section */}
              <section className="section payslip-section">
                <div className="payslip-wrapper">
                  <div className="payslip-content">
                    <div className="payslip-card">
                      <SamplePayslip
                        job={selectedJob}
                        salary={selectedJobSalary}
                        onAnnualContributionsChange={setAnnualContributions}
                        onNetPayChange={(netPay) => {
                          if (currentSection === "payslip") {
                            setNetPay(netPay * 12);
                            setMoney(netPay * 12);
                          }
                        }}
                        onPensionChange={(pension) => setPension1(pension)}
                        name={formData.name}
                      />
                    </div>
                  </div>
                  {selectedJob && (
                    <div className="payslip-button-wrapper">
                      <button onClick={handleGoToIncomeInfo} className="btn btn-primary">
                        Go to Income Info
                      </button>
                    </div>
                  )}
                </div>
              </section>

              {/* Income Tax Info Section */}
              <section className="section income-tax-info-section">
                <IncomeTaxInfo onClick={handleGoToBudget} />
              </section>

              {/* Budget Section */}
              <section className="section budgeting-section">
                <div className="d-flex flex-column align-items-center">
                  <Chart onComplete={handleBudgetComplete} />
                </div>
              </section>

              {/* Budget Planner Section */}
              <section className="section budget-planner-section">
                <BudgetPlanner onClick={handleGoToJobSwitch} />
              </section>

              {/* Job Switch Section */}
              <section className="section job-switch-section">
                {budgetCompleted && (
                  <JobSwitch
                    onJobSelect={(job) => {
                      setSelectedJob(job);
                      setSelectedJobSalary(job.salary);
                    }}
                    onPensionSelect={handlePensionSelection}
                    initialJob={initialJob}
                  />
                )}
              </section>

              {/* Pension Withdrawal Section */}
              <section className="section pension-withdrawal-section">
                {selectedPension ? (
                  <PensionWithdrawal
                    selectedPension={selectedPension}
                    onContinue={(selectedOption) => handleGoToPensionInfo(selectedOption)}
                  />
                ) : (
                  <div className="d-flex justify-content-center align-items-center h-100">
                    <p>Please select a pension option to continue.</p>
                  </div>
                )}
              </section>

              {/* Pension Info Section */}
              <section className="section pension-info-section">
                <PensionInfo onClick={handleBadEndOrEndShop} />
              </section>

              {/* End Shop Section */}
              {showEndShop && (
                <section className="section end-shop-section">
                  <EndShop
                    username={formData.username}
                    formData={formData}
                    // netPay={netPay * 12}
                    // netPay2={selectedJobSalary}
                    annualContributions={annualContributions}
                    budgetData={budgetData}
                    finalMoney={money}
                    handleGoToEndScreen={handleShowEndScreen}
                    onMoneyChange={handleMoneyChange}
                  />
                </section>
              )}

              {/* End Screen Section */}
              <section className="section end-screen-section">
                <EndScreen
                  isVisible={showEndScreen}
                  lifeExpectancy={lifeExpectancy}
                  finalWealth={finalMoney}
                  savings={budgetSavings}
                  wants={budgetWants}
                  needs={budgetNeeds}
                  onEndScreen={(endingType) => {
                    console.log("Ending selected:", endingType);
                  }}
                />
              </section>
            </div>
          </div>
        </>
      } />
    </Routes>
  );
}

export default App;