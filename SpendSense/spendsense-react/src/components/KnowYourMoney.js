import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './knowYourMoney.css';
import '../App.css';
import coin1 from './coin1.png';
import coin2 from './coin2.png';

const KnowYourMoney = () => {
  useEffect(() => {
    document.body.style.overflow = 'auto'; 
  
    return () => {
      document.body.style.overflow = 'hidden';
    };
  }, []);
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate("/");
    }
    return (
        <div className="learn-page">
          <button className="back-button" onClick={() => navigate("/")}>
            ← Back to Game
          </button>
    
          <div className="learn-title-container">
          <img src={coin1} alt="coin left" className="title-coin left" />
          <h1 className="learn-title">Know Your Money</h1>
          <img src={coin2} alt="coin right" className="title-coin right" />
        </div>

          <p className="learn-intro">Welcome to your guide for understanding your finances.</p>
    
          {/* Section: Budgeting */}
          <section className="learn-section">
            <h2 className="learn-heading"> Budgeting</h2>
            <p className="learn-text">How to split your income between needs, wants, and savings.</p>
            <div className="learn-placeholder">[Diagram Placeholder for Budgeting Pie Chart]</div>
          </section>
    
          {/* Section: Payslips */}
          <section className="learn-section">
            <h2 className="learn-heading"> Payslips</h2>
            <p className="learn-text">Understand the different components in your payslip.</p>
            <div className="learn-placeholder">[Image Placeholder for Payslip Breakdown]</div>
          </section>
    
          {/* Section: Pensions */}
          <section className="learn-section">
            <h2 className="learn-heading"> Pensions</h2>
            <p className="learn-text">Plan for retirement — what's a pension, and how does it work?</p>
            <div className="learn-placeholder">[Diagram Placeholder for Pension Timeline]</div>
          </section>
        </div>
      );
    };    

export default KnowYourMoney;