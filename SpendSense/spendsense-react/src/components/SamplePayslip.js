// src/components/SamplePayslip.js
import React, { useEffect } from "react";
import { gsap } from "gsap";
import "../App.css";

export default function SamplePayslip({
  job,
  salary,
  onAnnualContributionsChange,
  onNetPayChange,
  onPensionChange,
  name,
}) {
  const displayName = name && name.trim() !== "" ? name : "Jane Doe";

  const today = new Date();
  const payMonth = today.toLocaleString("default", { month: "long" });
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const payDate = `${String(lastDay.getDate()).padStart(2, "0")}/${String(
    lastDay.getMonth() + 1
  ).padStart(2, "0")}/${lastDay.getFullYear()}`;

  const payrollNumber = Math.floor(100000 + Math.random() * 900000);

  const generateNINumber = () => {
    const letters = "ABCEGHJKLMNPRSTWXYZ";
    const prefix =
      letters.charAt(Math.floor(Math.random() * letters.length)) +
      letters.charAt(Math.floor(Math.random() * letters.length));
    const digits = Math.floor(100000 + Math.random() * 900000)
      .toString()
      .replace(/(\d{2})(\d{2})(\d{2})/, "$1 $2 $3");
    const suffix = "ABCD".charAt(Math.floor(Math.random() * 4));
    return `${prefix} ${digits} ${suffix}`;
  };

  const niNumber = generateNINumber();

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

  useEffect(() => {
    if (onPensionChange) onPensionChange(pension);
  }, [pension, onPensionChange]);

  useEffect(() => {
    if (onAnnualContributionsChange) onAnnualContributionsChange(annualContributions);
  }, [annualContributions, onAnnualContributionsChange]);

  useEffect(() => {
    if (onNetPayChange) onNetPayChange(netPay);
  }, [netPay, onNetPayChange]);

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
    <>
      <h2 className="mb-3">Monthly Payslip</h2>
      <div className="row mb-2">
        <div className="col-6 text-start">
          <div>ACME Corp Ltd.</div>
          <div>{displayName}</div>
          <div>
            Payroll No: {payrollNumber}{" "}
            <span className="hover-info">
              (i)
              <div className="info-box">
                Payroll Number is a unique number allocated to each worker in the payroll system.
              </div>
            </span>
          </div>
        </div>
        <div className="col-6 text-end">
          <div>Pay Month: {payMonth}</div>
          <div>Pay Day: {payDate}</div>
          <div>
            Tax Code: 1257L{" "}
            <span className="hover-info">
              (i)
              <div className="info-box">Tax code indicates your tax bracket</div>
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
            <h4>
              Deductions
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
                <td>{niNumber}</td>
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
    </>
  );
}
