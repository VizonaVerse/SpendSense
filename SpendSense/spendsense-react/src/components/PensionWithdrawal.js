//
import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";

function PensionWithdrawal({ selectedPension, onContinue }){
    const [selectedOption, setSelectedOption] = useState(null);
    const withdrawalRef = useRef(null);

    useEffect (() => {
        if (withdrawalRef.current){
            gsap.fromTo(
                withdrawalRef.current,
                { opacity: 0, y: 50 },  
                { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" } 
            );
        }
    }, [selectedPension]);
    if (!selectedPension){
        return <h2>Time to retire! How would you like to take out your pension?</h2>
    }

    let withdrawalOptions = [];

    if (selectedPension === "fixedPension"){
        withdrawalOptions = ["Weekly Taxed Payments", "Lump SUm Withdrawal"];
    } else if (selectedPension === "definedContribution"){
        withdrawalOptions = ["Withdraw via Insurance Company", "Deposit into a Bank"];    
    } else if (selectedPension == "state") {
        withdrawalOptions = ["Govt pay into bank/Building society", "Paid in weekly multiples"];
    }

    return (
        <div ref={withdrawalRef} className="pension-withdrawal-container text-center p-4 shadow-sm">
          <h2>How Do You Want to Take Out Your Pension?</h2>
          <div className="row mt-4">
            {withdrawalOptions.map((option, index) => (
              <div key={index} className="col-md-6">
                <div
                  className="card p-3 shadow-sm withdrawal-card"
                  onClick={() => setSelectedOption(option)}
                  style={{ cursor: "pointer", backgroundColor: selectedOption === option ? "#cce5ff" : "white" }}
                >
                  <h4>{option}</h4>
                </div>
              </div>
            ))}
          </div>
    
          {selectedOption && (
            <button className="btn btn-primary mt-4" onClick={() => onContinue(selectedOption)}>
              Continue
            </button>
          )}
        </div>
      );
    }
    
    export default PensionWithdrawal;