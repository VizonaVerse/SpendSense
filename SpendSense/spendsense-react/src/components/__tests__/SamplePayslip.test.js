import { render, screen } from '@testing-library/react';
import SamplePayslip from '../SamplePayslip';

// Mock gsap to avoid animation issues in tests
jest.mock('gsap', () => ({
  gsap: {
    fromTo: jest.fn(),
  },
}));

describe('SamplePayslip Component', () => {
  const mockJob = {
    title: 'Software Engineer',
    description: 'Develop software applications',
  };
  
  const mockSalary = 36000;
  const mockName = 'John Smith';

  it('displays placeholder when no job is selected', () => {
    render(<SamplePayslip />);
    expect(screen.getByText('Please select a job')).toBeInTheDocument();
  });

  it('renders payslip with job information', () => {
    render(
      <SamplePayslip
        job={mockJob}
        salary={mockSalary}
        name={mockName}
      />
    );

    // Verify payslip header is rendered
    expect(screen.getByText('Monthly Payslip')).toBeInTheDocument();
    
    // Verify company and employee info
    expect(screen.getByText('ACME Corp Ltd.')).toBeInTheDocument();
    expect(screen.getByText('John Smith')).toBeInTheDocument();
    
    // Verify earnings section
    expect(screen.getByText('Earnings')).toBeInTheDocument();
    expect(screen.getByText('Basic Pay')).toBeInTheDocument();
    expect(screen.getByText('Total Earnings')).toBeInTheDocument();
    
    // Verify deductions section
    expect(screen.getByText('Deductions')).toBeInTheDocument();
    expect(screen.getByText('Income Tax')).toBeInTheDocument();
    expect(screen.getByText('National Insurance')).toBeInTheDocument();
    expect(screen.getByText('Pension')).toBeInTheDocument();
    expect(screen.getByText('Student Loan')).toBeInTheDocument();
    
    // Verify summary section
    expect(screen.getByText('Summary')).toBeInTheDocument();
    expect(screen.getByText('Gross Pay')).toBeInTheDocument();
    expect(screen.getByText('Net Pay')).toBeInTheDocument();
    
    // Verify employer contributions section
    expect(screen.getByText('Employer\'s Contributions')).toBeInTheDocument();
    expect(screen.getByText('Annual Salary (before Tax)')).toBeInTheDocument();
    expect(screen.getByText('Amount Paid (Employer)')).toBeInTheDocument();
  });

  it('calculates correct monthly salary', () => {
    render(
      <SamplePayslip
        job={mockJob}
        salary={mockSalary}
        name={mockName}
      />
    );

    const monthlyGross = Math.ceil(mockSalary / 12);
    const formattedMonthlyGross = new Intl.NumberFormat('en-UK', {
      style: 'currency',
      currency: 'GBP',
    }).format(monthlyGross);

    // Get all cells with the monthly gross value
    const cells = screen.getAllByText(formattedMonthlyGross);
    expect(cells.length).toBeGreaterThan(0);
  });

  it('calculates correct deductions', () => {
    render(
      <SamplePayslip
        job={mockJob}
        salary={mockSalary}
        name={mockName}
      />
    );

    const monthlyGross = Math.ceil(mockSalary / 12);
    const pension = monthlyGross * 0.05;
    const formattedPension = new Intl.NumberFormat('en-UK', {
      style: 'currency',
      currency: 'GBP',
    }).format(pension);

    expect(screen.getByText(formattedPension)).toBeInTheDocument();
  });

  it('uses default name when name is not provided', () => {
    render(
      <SamplePayslip
        job={mockJob}
        salary={mockSalary}
      />
    );

    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
  });

  it('calls callback functions with correct values', () => {
    const mockOnAnnualContributionsChange = jest.fn();
    const mockOnNetPayChange = jest.fn();
    const mockOnPensionChange = jest.fn();

    render(
      <SamplePayslip
        job={mockJob}
        salary={mockSalary}
        name={mockName}
        onAnnualContributionsChange={mockOnAnnualContributionsChange}
        onNetPayChange={mockOnNetPayChange}
        onPensionChange={mockOnPensionChange}
      />
    );

    // Calculate expected values
    const monthlyGross = Math.ceil(mockSalary / 12);
    const pension = monthlyGross * 0.05;
    const monthlyNI = monthlyGross * 0.08;
    const studentLoan = monthlyGross * 0.03;
    const monthlyTax = (monthlyGross - (pension + studentLoan + monthlyNI)) * 0.2;
    const totalDeductions = monthlyTax + monthlyNI + pension + studentLoan;
    const netPay = monthlyGross - totalDeductions;
    const employerContribution = monthlyGross * 0.03;
    const annualContributions = (employerContribution + pension) * 12;

    // Verify callbacks were called with correct values
    expect(mockOnPensionChange).toHaveBeenCalledWith(pension);
    expect(mockOnNetPayChange).toHaveBeenCalledWith(netPay);
    expect(mockOnAnnualContributionsChange).toHaveBeenCalledWith(annualContributions);
  });

  it('displays National Insurance Number', () => {
    render(
      <SamplePayslip
        job={mockJob}
        salary={mockSalary}
        name={mockName}
      />
    );

    // Check that the NI Number field exists and has the correct format
    const niNumberCell = screen.getByText(/[A-Z]{2} \d{2} \d{2} \d{2} [A-D]/);
    expect(niNumberCell).toBeInTheDocument();
  });

  it('displays payroll number', () => {
    render(
      <SamplePayslip
        job={mockJob}
        salary={mockSalary}
        name={mockName}
      />
    );

    // Check that the Payroll Number field exists and contains a 6-digit number
    const payrollText = screen.getByText(/Payroll No: \d{6}/);
    expect(payrollText).toBeInTheDocument();
  });
});