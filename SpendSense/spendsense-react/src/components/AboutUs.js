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
          <strong>SpendSense</strong> is an interactive web-based game designed to teach young adults how to make smart financial decisions through real-time budgeting and planning scenarios. We believe that learning about money shouldn't be boring — it should be hands-on, visual, and even a little fun.
          <br /><br />
          The game simulates real-life financial events, such as receiving payslips, managing a monthly budget, planning for retirement, and balancing needs vs. wants. As players make choices, they can instantly see the impact on their character’s savings, health, and long-term financial well-being.
        </p>
      </section>

      <section className="learn-section">
        <h2 className="learn-heading"> Why We Built It</h2>
        <p className="learn-text">
          Many young adults leave school without a solid understanding of how taxes, pensions, or budgeting work. We wanted to close that gap by providing an educational experience that doesn’t just explain finance — it immerses players in it.
          <br /><br />
          <strong>SpendSense</strong> was created to:
          <ul>
            <li>Introduce players to key financial concepts through gameplay</li>
            <li>Encourage better decision-making with realistic trade-offs</li>
            <li>Provide a safe space to experiment with different money strategies</li>
            <li>Raise awareness about long-term financial planning (like pensions!)</li>
          </ul>
          <br />
          We hope that by playing, users will leave not just with a high score — but with more confidence to handle real-world finances.
        </p>
      </section>

      <section className="learn-section">
        <h2 className="learn-heading"> Who Made This?</h2>
        <p className="learn-text">
          <strong>SpendSense</strong> was developed as part of a Computer Science second year Software Engineering project at the University of Surrey. Built using React and Django, the platform integrates real-world APIs and data to create a responsive, educational experience for players aged 18–25.
          <br /><br />
          Special thanks to all contributors, testers, and everyone who gave feedback along the way!
        </p>
      </section>
    </div>
  );
};

export default AboutUs;
