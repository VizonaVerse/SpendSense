import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './knowYourMoney.css';
import '../App.css';

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
      <img
        src="/images/spendsense_logo.gif"
        alt="SpendSense Logo"
        className="floating-logo"
      />

      <div className="learn-title-container">
        <img src="/images/coinSpin1.gif" alt="spinning coin left" className="title-coin left" />
        <h1 className="learn-title"> Know Your Money</h1>
        <img src="/images/coinSpin2.gif" alt="spinning coin right" className="title-coin right" />
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

          In <strong>SpendSense</strong>, your budget decisions directly affect your character's savings and health over time. Choosing to spend more on wants may boost happiness short term, but could leave you in trouble later. Try experimenting with different budget setups to see how they impact your long-term success in the game!

          <br /><br />

          📌 <em> Pro Tip:</em> If you're unsure how to split your income, start with the 50/30/20 rule — then adjust based on your job, lifestyle, and goals.
        </p>

        <div className="learn-chart-wrapper">
          <img
            src='/images/pieChart.jpg'
            alt="Budgeting Pie Chart"
            className="budget-chart"
          />
        </div>

      </section>


      {/* Section: Payslips */}
      <section className="learn-section">
        <h2 className="learn-heading"> Payslips</h2>
        <p className="learn-text">
          A payslip is a breakdown of your earnings and deductions — it shows exactly how your salary is calculated and where some of your money is going. Here’s what you’ll usually see:
          <ul>
            <li><strong>Gross Pay</strong> – your total earnings before any deductions</li>
            <li><strong>Income Tax</strong> – a percentage of your earnings paid to the government</li>
            <li><strong>National Insurance (NI)</strong> – contributions that go towards your state pension and benefits</li>
            <li><strong>Pension Contributions</strong> – money set aside for your retirement</li>
            <li><strong>Net Pay</strong> – the final amount you receive in your bank account</li>
          </ul>

          <br /><br />
          Once you receive a payslip, don’t just ignore it — take a moment to go through the key sections and check:

          <ul>
            <li>Are your <strong>hours worked</strong> and <strong>pay rate</strong> correct?</li>
            <li>Does your <strong>tax code</strong> look right? (If it's wrong, you could be paying too much!)</li>
            <li>Do your <strong>National Insurance</strong> and <strong>pension contributions</strong> make sense based on what you expected?</li>
          </ul>

          <br />

          If something doesn’t look right, speak to your employer or HR team — mistakes happen more often than you think! Keeping track of your payslips also helps when applying for loans, renting a flat, or understanding how your income changes over time.

          <br /><br />
          📁 <em>Pro Tip:</em> Save your payslips somewhere secure — digital copies work great. They can be useful for proving your income or correcting tax errors later.

        </p>

        <div className="learn-chart-wrapper">
          <img
            src='/images/learnPayslip.jpg'
            alt="Payslip Breakdown Diagram"
            className="payslip-chart"
          />
        </div>

      </section>

      {/* Section: Pensions */}
      <section className="learn-section">
        <h2 className="learn-heading"> Pensions</h2>
        <p className="learn-text">
          A pension is money you save up during your working life to support yourself when you retire. In the UK, most people start receiving a pension around age 66, but the earlier you begin saving, the better off you’ll be later.

          <br /><br />

          In <strong>SpendSense</strong>, your pension choices affect your future financial security — it’s a long-term reward for how well you manage your money over time. There are three types of pensions in the game, based on real systems:

          <ul>
            <li>
              <strong>Basic Pension</strong> – This represents the UK government’s <em>State Pension</em>. It’s a fixed weekly amount you get if you’ve paid enough National Insurance through your working years. It’s not usually enough to live on alone, but it gives you a financial safety net.
            </li>

            <li>
              <strong>Defined Contribution Pension</strong> – You and your employer both pay into a pension pot that is invested over time. What you get out depends on how much you’ve paid in and how the investments perform. It’s the most common type for modern jobs in the UK.
            </li>

            <li>
              <strong>Fixed Pension (Defined Benefit)</strong> – This type gives you a guaranteed amount of money when you retire, often based on your salary and how long you’ve worked. It’s rare nowadays and usually offered in public sector or very traditional companies.
            </li>
          </ul>

          <br />

          You can check your pension contributions on your payslip. Even though it feels far away, putting money into your pension early makes a big difference later — thanks to compound growth.

          <br /><br />

          📌 <em>Pro Tip:</em> In the game and in real life, pensions are like slow power-ups — you won’t feel the benefit immediately, but they matter a lot in the long run. The better your pension plan, the more relaxed your retirement will be.
        </p>

        <div className="learn-chart-wrapper">
          <img
            src='/images/learnPension.jpg'
            alt="Pension Timeline Diagram"
            className="pension-chart"
          />
        </div>

      </section>
    </div>
  );
};

export default KnowYourMoney;