// src/components/SamplePayslip.js
import React, { useEffect } from "react";
import { gsap } from "gsap";
import "../App.css";

export default function SamplePayslip({ job, salary, onAnnualContributionsChange, onNetPayChange }) {
  // Declare variables outside of conditional blocks
  let monthlyGross = 0;
  let pension = 0;
  let monthlyTax = 0;
  let monthlyNI = 0;
  let studentLoan = 0;
  let employerContribution = 0;
  let annualContributions = 0;
  let totalDeductions = 0;
  let netPay = salary;

  if (job) {
    monthlyGross = Math.ceil(salary / 12);
    pension = monthlyGross * 0.05;

    if (monthlyGross > 960) {
      monthlyNI = monthlyGross * 0.08;
      studentLoan = monthlyGross * 0.03;
      monthlyTax = (monthlyGross - (pension + studentLoan + monthlyNI)) * 0.2;
    }

    totalDeductions = monthlyTax + monthlyNI + pension + studentLoan;
    netPay = monthlyGross - totalDeductions;
    employerContribution = monthlyGross * 0.03;
    annualContributions = (employerContribution + pension) * 12;
  }

  // Notify App.js about the annual contributions
  useEffect(() => {
    if (onAnnualContributionsChange) {
      onAnnualContributionsChange(annualContributions);
    }
  }, [annualContributions, onAnnualContributionsChange]);

  useEffect(() => {
    if (onNetPayChange) {
      onNetPayChange(netPay);
    }
  }, [netPay, onNetPayChange]);

  // Animation effect
  useEffect(() => {
    if (job) {
      gsap.fromTo(
        ".payslip-card",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.5 }
      );
    }
  }, [job]);

  if (!job) {
    return (
      <div className="container text-center">
        <h2>Please select a job</h2>
      </div>
    );
  }

  return (
    <div className="payslip-container" style={{outerHeight: "100vh", padding: "50px"}}>
      <div className="card payslip-card p-4 shadow-sm" style={{ marginTop: "80px" }}>
        <h2 className="mb-3">Monthly Payslip</h2>
        <div className="row mb-2">
          <div className="col-6 text-start">
            <div>ACME Corp Ltd.</div>
            <div>Jane Doe</div>
            <div>
              Payroll No: 789012{" "}
              <span className="hover-info">
                (i)
                <div className="info-box">
                  Payroll Number is a unique number allocated to each worker in the payroll system.
                </div>
              </span>
            </div>
          </div>
          <div className="col-6 text-end">
            <div>Pay Month: May</div>
            <div>Pay Day: 31/05/2023</div>
            <div>
              Tax Code: 1257L{" "}
              <span className="hover-info">
                (i)
                <div className="info-box">
                  Tax code indicates your tax bracket
                </div>
              </span>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-6">
            <div className="section-header mb-2">
              <h4>Earnings</h4>
              <div className="info-box">This section shows your monthly earnings.</div>
            </div>
            <table className="table table-sm table-bordered">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Basic Pay</td>
                  <td>
                    {monthlyGross.toLocaleString("en-UK", {
                      style: "currency",
                      currency: "GBP",
                    })}
                  </td>
                </tr>
                <tr>
                  <td>Bonus</td>
                  <td>£0.00</td>
                </tr>
                <tr>
                  <td>
                    <strong>Total Earnings</strong>
                  </td>
                  <td>
                    {monthlyGross.toLocaleString("en-UK", {
                      style: "currency",
                      currency: "GBP",
                    })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="col-6">
            <div className="section-header mb-2">
              <h4>Deductions
                <span className="hover-info">
                  (i)
                  <div className="info-box">
                    You have a personal allowance of £12,570 which is tax free
                  </div>
                </span>
              </h4>
              <div className="info-box">This section lists all your deductions.</div>
            </div>
            <table className="table table-sm table-bordered">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Income Tax</td>
                  <td>
                    {monthlyTax.toLocaleString("en-UK", {
                      style: "currency",
                      currency: "GBP",
                    })}
                  </td>
                </tr>
                <tr>
                  <td>National Insurance</td>
                  <td>
                    {monthlyNI.toLocaleString("en-UK", {
                      style: "currency",
                      currency: "GBP",
                    })}
                  </td>
                </tr>
                <tr>
                  <td>Pension</td>
                  <td>
                    {pension.toLocaleString("en-UK", {
                      style: "currency",
                      currency: "GBP",
                    })}
                  </td>
                </tr>
                <tr>
                  <td>Student Loan</td>
                  <td>
                    {studentLoan.toLocaleString("en-UK", {
                      style: "currency",
                      currency: "GBP",
                    })}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Total Deductions</strong>
                  </td>
                  <td>
                    {totalDeductions.toLocaleString("en-UK", {
                      style: "currency",
                      currency: "GBP",
                    })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="row mt-2">
          <div className="col-12">
            <div className="section-header mb-2">
              <h4>Summary</h4>
              <div className="info-box">Gross Pay, Total Deductions, and Net Pay.</div>
            </div>
            <table className="table table-sm table-bordered">
              <tbody>
                <tr>
                  <td>Gross Pay</td>
                  <td>
                    {monthlyGross.toLocaleString("en-UK", {
                      style: "currency",
                      currency: "GBP",
                    })}
                  </td>
                </tr>
                <tr>
                  <td>Total Deductions</td>
                  <td>
                    {totalDeductions.toLocaleString("en-UK", {
                      style: "currency",
                      currency: "GBP",
                    })}
                  </td>
                </tr>
                <tr>
                  <td>Net Pay</td>
                  <td>
                    {netPay.toLocaleString("en-UK", {
                      style: "currency",
                      currency: "GBP",
                    })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="row mt-2">
          <div className="col-12">
            <div className="section-header mb-2">
              <h4>Employer's Contributions</h4>
              <div className="info-box">Annual salary and employer contributions.</div>
            </div>
            <table className="table table-sm table-bordered">
              <tbody>
                <tr>
                  <td>Annual Salary (before Tax)</td>
                  <td>
                    {salary.toLocaleString("en-UK", {
                      style: "currency",
                      currency: "GBP",
                    })}
                  </td>
                </tr>
                <tr>
                  <td>
                    NI Number{" "}
                    <span className="hover-info">
                      (i)
                      <div className="info-box">
                        National Insurance Number for HMRC Records.
                      </div>
                    </span>
                  </td>
                  <td>AB 12 345 C</td>
                </tr>
                <tr>
                  <td>Amount Paid (Employer)</td>
                  <td>
                    {employerContribution.toLocaleString("en-UK", {
                      style: "currency",
                      currency: "GBP",
                    })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
