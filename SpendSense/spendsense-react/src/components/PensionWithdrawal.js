import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";

function PensionWithdrawal({ selectedPension, onContinue }) {
    const [selectedOption, setSelectedOption] = useState(null);
    const withdrawalRef = useRef(null);
    const cardRefs = useRef([]);

    useEffect(() => {
        if (withdrawalRef.current) {
            gsap.fromTo(
                withdrawalRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
            );
        }
    }, [selectedPension]);

    if (!selectedPension) {
        return <h2>Time to retire! How would you like to take out your pension?</h2>;
    }

    let withdrawalOptions = [];

    if (selectedPension === "fixedPension") {
        withdrawalOptions = ["Weekly Taxed Payments", "Lump Sum Withdrawal"];
    } else if (selectedPension === "definedContribution") {
        withdrawalOptions = ["Withdraw via Insurance Company", "Deposit into a Bank"];
    } else if (selectedPension === "state") {
        withdrawalOptions = ["Govt pay into bank/Building society", "Paid in weekly multiples"];
    }

    // 🔹 GSAP Hover Animations
    const handleHover = (element) => {
        gsap.to(element, {
            backgroundColor: "#cce5ff",
            y: -3,
            duration: 0.3,
            ease: "power2.out",
        });
    };

    const handleHoverOut = (element, option) => {
        gsap.to(element, {
            backgroundColor: selectedOption === option ? "#cce5ff" : "white",
            y: 0,
            duration: 0.3,
            ease: "power2.out",
        });
    };

    return (
        <div ref={withdrawalRef} className="pension-withdrawal-container text-center p-4 shadow-sm">
            <h2>How Do You Want to Take Out Your Pension?</h2>
            <div className="row mt-4 justify-content-center">
                {withdrawalOptions.map((option, index) => (
                    <div key={index} className="col-md-5 mb-3">
                        <div
                            ref={(el) => (cardRefs.current[index] = el)}
                            className="card p-3 shadow-sm withdrawal-card"
                            onMouseEnter={(e) => handleHover(e.currentTarget)}
                            onMouseLeave={(e) => handleHoverOut(e.currentTarget, option)}
                            onClick={() => setSelectedOption(option)}
                            style={{
                                cursor: "pointer",
                                backgroundColor: selectedOption === option ? "#cce5ff" : "white",
                                transition: "background-color 0.3s ease",
                            }}
                        >
                            <h4>{option}</h4>
                        </div>
                    </div>
                ))}
            </div>

            {selectedOption && (
                <div className="mt-5">
                    <button
                        className="btn btn-primary btn-lg"
                        onMouseEnter={(e) => gsap.to(e.currentTarget, { y: -3, duration: 0.2 })}
                        onMouseLeave={(e) => gsap.to(e.currentTarget, { y: 0, duration: 0.2 })}
                        onClick={() => onContinue(selectedOption)}
                    >
                        Continue
                    </button>
                </div>
            )}
        </div>
    );
}

export default PensionWithdrawal;
