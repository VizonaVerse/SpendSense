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

<<<<<<< Updated upstream
  // Calculate monthly values based on the selected job's annual salary. Placeholder calculations
  const monthlyGross = job.salary / 12;
  const monthlyTax = monthlyGross * 0.2; // 20% Income Tax
  const monthlyNI = monthlyGross * 0.12; // 12% National Insurance
  const pension = monthlyGross * 0.05; // 5% Pension Contribution
  const studentLoan = monthlyGross * 0.03; // 3% Student Loan Repayment
  const totalDeductions = monthlyTax + monthlyNI + pension + studentLoan;
  const netPay = monthlyGross - totalDeductions;
  const employerContribution = monthlyGross * 0.1; // 10% Employer Contribution

  return (
    <div className="payslip-container">
      <div className="card payslip-card p-3 shadow-sm">
        <h2 className="mb-3">Payslip</h2>
=======
  // Calculation logic remains the same
  let monthlyGross = Math.ceil(job.salary / 12);
  let pension = monthlyGross * 0.05;
  let monthlyTax = 0;
  let monthlyNI = 0;
  let studentLoan = 0;

  if (monthlyGross > 960) {
    monthlyNI = monthlyGross * 0.08;
    studentLoan = monthlyGross * 0.03;
    monthlyTax = (monthlyGross - (pension + studentLoan + monthlyNI)) * 0.2;
  }

  let totalDeductions = monthlyTax + monthlyNI + pension + studentLoan;
  let netPay = monthlyGross - totalDeductions;
  let employerContribution = monthlyGross * 0.03;

  return (
    <div className="payslip-container" style={{ fontSize: '0.8rem' }}>
      <div className="card payslip-card p-2 shadow-sm">
        <h3 className="mb-2 text-center">Monthly Payslip</h3>
        
>>>>>>> Stashed changes
        {/* Company & Employee Details */}
        <div className="row mb-1">
          <div className="col-6 text-start" style={{ fontSize: '0.7rem' }}>
            <div>ACME Corp Ltd.</div>
            <div>Jane Doe</div>
            <div>
              Payroll No: 789012{" "}
              <span className="hover-info">
                (i)
                <div className="info-box" style={{ fontSize: '0.6rem' }}>
                  Payroll Number is a unique number allocated to each worker in the payroll system.
                </div>
              </span>
            </div>
          </div>
          <div className="col-6 text-end" style={{ fontSize: '0.7rem' }}>
            <div>Pay Month: May</div>
            <div>Pay Day: 31/05/2023</div>
            <div>
              Tax Code: 1257L{" "}
              <span className="hover-info">
                (i)
                <div className="info-box" style={{ fontSize: '0.6rem' }}>
                  Tax code indicates how much you can earn before tax.
                </div>
              </span>
            </div>
          </div>
        </div>

        {/* Earnings & Deductions */}
        <div className="row">
          <div className="col-6 px-1">
            <div className="section-header mb-1">
              <h4 style={{ fontSize: '0.8rem', margin: 0 }}>Earnings</h4>
            </div>
            <table className="table table-sm table-bordered mb-1" style={{ fontSize: '0.7rem' }}>
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
                  <td><strong>Total Earnings</strong></td>
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

          <div className="col-6 px-1">
            <div className="section-header mb-1">
              <h4 style={{ fontSize: '0.8rem', margin: 0 }}>Deductions</h4>
            </div>
            <table className="table table-sm table-bordered mb-1" style={{ fontSize: '0.7rem' }}>
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
                  <td><strong>Total Deductions</strong></td>
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
        <div className="row mt-1">
          <div className="col-12">
            <div className="section-header mb-1">
              <h4 style={{ fontSize: '0.8rem', margin: 0 }}>Summary</h4>
            </div>
            <table className="table table-sm table-bordered mb-1" style={{ fontSize: '0.7rem' }}>
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
        <div className="row mt-1">
          <div className="col-12">
            <div className="section-header mb-1">
              <h4 style={{ fontSize: '0.8rem', margin: 0 }}>Employer's Contributions</h4>
            </div>
            <table className="table table-sm table-bordered mb-1" style={{ fontSize: '0.7rem' }}>
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
                      <div className="info-box" style={{ fontSize: '0.6rem' }}>
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