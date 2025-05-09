import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react'; // Updated import from react instead of react-dom/test-utils
import EmploymentInfo from '../EmploymentInfo';

describe('EmploymentInfo Component', () => {
  const originalConsoleError = console.error;
  
  beforeEach(() => {
    // Mock console.error to suppress specific warnings
    console.error = jest.fn((...args) => {
      if (
        args[0].includes('act(...)') ||
        args[0].includes('Error fetching employment info') ||
        args[0].includes('ReactDOMTestUtils.act')
      ) {
        return;
      }
      originalConsoleError(...args);
    });
    
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
    console.error = originalConsoleError;
  });

  it('renders the heading and loading text initially', () => {
    render(<EmploymentInfo onClick={jest.fn()} />);

    // Verify the heading is rendered
    expect(screen.getByText('Employment Information')).toBeInTheDocument();

    // Verify the loading text is rendered
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('fetches and displays employment information on successful API call', async () => {
    const mockApiResponse = {
      details: {
        parts: [
          {
            body: `
              <h2>Full-time work</h2>
              <p>Full-time work is allowed under certain conditions.</p>
              <p>Additional details about full-time work.</p>
            `,
          },
        ],
      },
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse,
    });

    // Wrap the initial render in act
    await act(async () => {
      render(<EmploymentInfo onClick={jest.fn()} />);
    });

    // Wait for the API call to complete and verify the fetched text is displayed
    await waitFor(() =>
      expect(
        screen.getByText('Full-time work is allowed under certain conditions. Additional details about full-time work.')
      ).toBeInTheDocument()
    );
  });

  it('displays an error message when the API call fails', async () => {
    global.fetch.mockRejectedValueOnce(new Error('API error'));

    // Wrap the initial render in act
    await act(async () => {
      render(<EmploymentInfo onClick={jest.fn()} />);
    });

    // Wait for the API call to fail and verify the error message is displayed
    await waitFor(() =>
      expect(screen.getByText('Failed to load information.')).toBeInTheDocument()
    );
  });

  it('displays a message when no relevant information is found', async () => {
    const mockApiResponse = {
      details: {
        parts: [
          {
            body: `
              <h2>Other Section</h2>
              <p>This section does not contain relevant information.</p>
            `,
          },
        ],
      },
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse,
    });

    // Wrap the initial render in act
    await act(async () => {
      render(<EmploymentInfo onClick={jest.fn()} />);
    });

    // Wait for the API call to complete and verify the fallback message is displayed
    await waitFor(() =>
      expect(screen.getByText('No Full-time work section found.')).toBeInTheDocument()
    );
  });

  it('calls the onClick handler when the "Continue to Payslip" button is clicked', () => {
    const handleClick = jest.fn();

    render(<EmploymentInfo onClick={handleClick} />);

    // Click the "Continue to Payslip" button
    const continueButton = screen.getByText('Continue to Payslip');
    fireEvent.click(continueButton);

    // Verify the onClick handler is called
    expect(handleClick).toHaveBeenCalled();
  });
});