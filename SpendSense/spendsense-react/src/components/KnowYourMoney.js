import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './knowYourMoney.css';
import '../App.css';
import coin1 from './coin1.png';
import coin2 from './coin2.png';

const KnowYourMoney = () => {

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
        <p className="learn-text">
          Budgeting helps you decide how to split your income so you can cover essentials, enjoy life, and still save for the future.
          One of the simplest and most effective methods is the <strong>50/30/20 rule</strong>:
          <ul>
            <li><strong>50%</strong> on <em>needs</em> like rent, bills, and groceries</li>
            <li><strong>30%</strong> on <em>wants</em> like shopping, games, or takeaways</li>
            <li><strong>20%</strong> on <em>savings</em>, investments, or paying off debt</li>
          </ul>

          <br />

          But remember — this all depends on your salary. Some jobs make it easier to save and spend comfortably, while others may mean your income mostly covers your essentials, with very little left over.

          <br /><br />

          In <strong>Spend Sense</strong>, your budget decisions directly affect your character's savings and health over time. Choosing to spend more on wants may boost happiness short term, but could leave you in trouble later. Try experimenting with different budget setups to see how they impact your long-term success in the game!

          <br /><br />

          📌 Tip: If you're unsure how to split your income, start with the 50/30/20 rule — then adjust based on your job, lifestyle, and goals.
        </p>

        <div className="learn-chart-wrapper">
          <img
            src={require('./pieChart.jpg')}
            alt="Budgeting Pie Chart"
            className="budget-chart"
          />
        </div>

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