import { render, screen, fireEvent } from '@testing-library/react';
import Home from '../Home';

describe('Home Component', () => {
  it('renders the SpendSense logo and buttons', () => {
    const handleStart = jest.fn();

    render(<Home onStart={handleStart} />);

    // Verify the SpendSense logo is rendered
    const logo = screen.getByAltText('SpendSense Logo');
    expect(logo).toBeInTheDocument();

    // Verify the "Start Game" button is rendered
    const startButton = screen.getByTestId('start-game-button');
    expect(startButton).toBeInTheDocument();

    // Verify the "Tutorial" button is rendered
    const tutorialButton = screen.getByText('Tutorial');
    expect(tutorialButton).toBeInTheDocument();
  });

  it('calls onStart when the "Start Game" button is clicked', () => {
    const handleStart = jest.fn();

    render(<Home onStart={handleStart} />);

    // Click the "Start Game" button
    const startButton = screen.getByTestId('start-game-button');
    fireEvent.click(startButton);

    // Verify the onStart handler is called
    expect(handleStart).toHaveBeenCalled();
  });

  it('opens the tutorial when the "Tutorial" button is clicked', () => {
    render(<Home onStart={jest.fn()} />);

    // Click the "Tutorial" button
    const tutorialButton = screen.getByText('Tutorial');
    fireEvent.click(tutorialButton);

    // Verify the tutorial overlay is added to the DOM
    const overlay = document.getElementById('tutorial-overlay');
    expect(overlay).toBeInTheDocument();
  });
});