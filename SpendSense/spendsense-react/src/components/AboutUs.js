import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './knowYourMoney.css';
import '../App.css';

const AboutUs = () => {

  useEffect(() => {
    document.body.style.overflow = 'auto';
    return () => {
      document.body.style.overflow = 'hidden';
    };
  }, []);

  const navigate = useNavigate();

  return (
    <div style={{ maxHeight: '100vh', overflowY: 'auto' }}>
      <div className="learn-page">
        <button className="back-button" onClick={() => navigate("/")}>
          ← Back to Game
        </button>
        <img
          src="/images/spendsense_logo.gif"
          alt="SpendSense Logo"
          className="floating-logo"
        />
  
        <div className="learn-title-container">
          <img src="/images/coinSpin1.gif" alt="spinning coin left" className="title-coin left" />
          <h1 className="learn-title"> About Us</h1>
          <img src="/images/coinSpin2.gif" alt="spinning coin right" className="title-coin right" />
        </div>
  
        <p className="learn-intro">Our mission: to make financial literacy fun, engaging, and game-based.</p>
  
        <section className="learn-section">
          <h2 className="learn-heading"> What is SpendSense?</h2>
          <p className="learn-text">
            <strong>SpendSense</strong> is an interactive web-based game designed to teach young adults how to make smart financial decisions through real-time budgeting and planning scenarios. Rather than passively learning about taxes, budgeting or pensions, players make real-time decisions and see their outcomes unfold in a simulated financial world.
            <br /><br />
            From handling payslips and building a budget to planning for long-term goals like retirement, SpendSense allows players to experiment with financial strategies in a safe and visual environment – equipping them with necessary skills to manage their real-world money with confidence.
          </p>
        </section>
  
        <section className="learn-section">
          <h2 className="learn-heading"> Why We Built SpendSense</h2>
          <p className="learn-text">
            Most young adults enter adulthood without ever being taught how to interpret payslips, plan for pensions and manage personal budgets. This gap can lead to poor long-term financial decisions, increased debt, and missed opportunities for financial stability.
            <br /><br />
            We created <strong>SpendSense</strong> to:
          </p>
          <ul className="learn-text">
            <li>Introduce players to key financial concepts through gameplay</li>
            <li>Encourage smart decision making by simulating real-life trade-offs</li>
            <li>Provide a safe space to experiment with different money strategies</li>
          </ul>
          <p className="learn-text">
            <br />
            We believe that by turning financial education into a game, learners will not only enjoy the process – but also leave better equipped for the real world.
          </p>
        </section>
  
        <section className="learn-section">
          <h2 className="learn-heading"> Who is behind SpendSense?</h2>
          <p className="learn-text">
            <strong>SpendSense</strong> was developed by second-year Computer Science students at the University of Surrey. It combines front-end interactivity (React) with powerful back-end logic (Django) and real-world data integration to deliver a modern, meaningful learning experience for players aged 18–25.
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
