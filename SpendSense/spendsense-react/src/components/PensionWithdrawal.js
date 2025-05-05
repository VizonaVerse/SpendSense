import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";

function PensionWithdrawal({ selectedPension, onContinue }) {
    const [selectedOption, setSelectedOption] = useState(null);
    const [hoveredTooltipIndex, setHoveredTooltipIndex] = useState(null); 
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
    } else if (selectedPension === "definedContribution" || selectedPension === "state") {
        withdrawalOptions = ["Withdraw via Insurance Company", "Deposit into a Bank"];
    }
    // GSAP Hover Animations
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

    const optionInfo = {
        "Weekly Taxed Payments": "You receive your pension weekly with tax already deducted.",
        "Lump Sum Withdrawal": "Take your entire pension pot at once — may result in a large tax bill.",
        "Withdraw via Insurance Company": "They manage your pension withdrawals over time.",
        "Deposit into a Bank": "You manage the money yourself once deposited.",
    };

    


    return (
        <div ref={withdrawalRef} className="pension-withdrawal-container text-center p-4 shadow-sm">
            <h2>Time to retire! How Do You Want to Take Out Your Pension?</h2>
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
                                position: "relative",
                            }}
                        >
                            <h4 style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                {option}
                                <span
                                    className="hover-info ms-2"
                                    style={{
                                        position: "relative",
                                        cursor: "help",
                                        fontSize: "0.9em",
                                        color: "#007bff",
                                        marginLeft: "8px",
                                    }}
                                    onMouseEnter={() => setHoveredTooltipIndex(index)}
                                    onMouseLeave={() => setHoveredTooltipIndex(null)}
                                >
                                    (i)
                                    {hoveredTooltipIndex === index && (
                                        <div
                                            className="info-box"
                                            style={{
                                                position: "absolute",
                                                top: "100%",
                                                left: "50%",
                                                transform: "translateX(-50%)",
                                                backgroundColor: "#fff",
                                                border: "1px solid #ccc",
                                                borderRadius: "5px",
                                                padding: "8px",
                                                marginTop: "5px",
                                                zIndex: 9999,
                                                whiteSpace: "normal",
                                                width: "220px",
                                                fontSize: "0.85rem",
                                                boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                                                pointerEvents: "auto",
                                                display: "block",
                                                color: "#000",
                                              }}
                                              
                                        >
                                            {optionInfo[option]}
                                        </div>
                                    )}
                                </span>

                            </h4>
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
