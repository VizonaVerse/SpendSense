// src/components/SamplePayslip.js
import React, { useEffect } from "react";
import { gsap } from "gsap";
import "../App.css"; 

export default function SamplePayslip({ job }) {
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

  // Calculate monthly values based on the selected job's annual salary. Placeholder calculations
  const monthlyGross = Math.ceil(job.salary / 12);
  let pension = monthlyGross * 0.05; // 5% Pension Contribution

  let monthlyTax = 0; // 0% Income Tax
  let monthlyNI = monthlyGross * 0.0; // 0% National Insurance
  let studentLoan = monthlyGross * 0.00; // 0% Student Loan Repayment

  if (monthlyGross > 960){
    let monthlyNI = monthlyGross * 0.08; // 8% National Insurance
    let studentLoan = monthlyGross * 0.03; // 3% Student Loan Repayment
    let monthlyTax = (monthlyGross - (pension + studentLoan + monthlyNI)) * 0.2; // 20% Income Tax
  }
  

  let totalDeductions = monthlyTax + monthlyNI + pension + studentLoan;
  let netPay = monthlyGross - totalDeductions;
  let employerContribution = monthlyGross * 0.03; // 3% Employer Contribution

  return (
    <div className="payslip-container">
      <div className="card payslip-card p-3 shadow-sm">
        <h2 className="mb-3">Monthly Payslip</h2>
        {/* Company & Employee Details */}
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
                  Tax code indicates how much you can earn before tax.
                </div>
              </span>
            </div>
          </div>
        </div>

        {/* Earnings & Deductions */}
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
              <h4>Deductions</h4>
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

        {/* Summary */}
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

        {/* Employer Contributions */}
        <div className="row mt-2">
          <div className="col-12">
            <div className="section-header mb-2">
              <h4>Employer's Contributions</h4>
              <div className="info-box">Annual salary and employer contributions.</div>
            </div>
            <table className="table table-sm table-bordered">
              <tbody>
                <tr>
                  <td>Annual Salary</td>
                  <td>
                    {job.salary.toLocaleString("en-UK", {
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
                        NI Number uniquely identifies the employee for HMRC records.
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
