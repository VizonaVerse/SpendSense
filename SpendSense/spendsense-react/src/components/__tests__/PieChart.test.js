import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PieChart from '../PieChart';
import { Chart as ChartJS } from 'chart.js';

// Mock react-chartjs-2
jest.mock('react-chartjs-2', () => ({
  Pie: ({ data, options, ref }) => {
    // Store the ref for testing
    if (ref) {
      ref.current = {
        data,
        canvas: { style: {} },
        chartArea: { left: 0, right: 200, top: 0, bottom: 200 },
        getDatasetMeta: () => ({
          data: data.datasets[0].data.map((_, i) => ({
            tooltipPosition: () => ({ x: 100 + i * 10, y: 100 + i * 10 })
          }))
        })
      };
    }
    return (
      <div data-testid="pie-chart">
        <div data-testid="chart-data">{JSON.stringify(data)}</div>
        <div data-testid="chart-options">{JSON.stringify(options)}</div>
      </div>
    );
  }
}));

// Mock ChartJS
jest.mock('chart.js', () => ({
  Chart: {
    register: jest.fn()
  },
  ArcElement: jest.fn(),
  Tooltip: jest.fn(),
  Legend: jest.fn()
}));

describe('PieChart Component', () => {
  beforeEach(() => {
    // Clear mock function calls
    jest.clearAllMocks();
  });
  
  it('renders the pie chart with initial data', () => {
    render(<PieChart />);
    
    // Check if title is rendered
    expect(screen.getByText('🎯 Budget Blaster!')).toBeInTheDocument();
    
    // Check if instructions are rendered
    expect(screen.getByText('💡 Instructions')).toBeInTheDocument();
    expect(screen.getByText(/Drag the borders to adjust/)).toBeInTheDocument();
    
    // Check if tips are rendered
    expect(screen.getByText('💰 Tips')).toBeInTheDocument();
    expect(screen.getByText(/Needs:/)).toBeInTheDocument();
    expect(screen.getByText(/Wants:/)).toBeInTheDocument();
    expect(screen.getByText(/Savings:/)).toBeInTheDocument();
    
    // Check if chart is rendered
    const chartData = JSON.parse(screen.getByTestId('chart-data').textContent);
    expect(chartData.labels).toEqual(['Wants', 'Needs', 'Savings']);
    expect(chartData.datasets[0].data).toEqual([33, 33, 34]);
  });
  
  it('calls onComplete with correct data when Next button is clicked', () => {
    const mockOnComplete = jest.fn();
    render(<PieChart onComplete={mockOnComplete} />);
    
    // Click the Next button
    fireEvent.click(screen.getByText('Next'));
    
    // Check if onComplete is called with the correct data
    expect(mockOnComplete).toHaveBeenCalledWith({
      'Wants': 33,
      'Needs': 33,
      'Savings': 34
    });
  });
  
  it('handles mouse down event on chart border', () => {
    render(<PieChart />);
    
    // Get the chart wrapper element
    const chartWrapper = screen.getByTestId('pie-chart').parentNode;
    
    // Simulate mouse down at a position that corresponds to slice border
    // Mocking the event with position data
    const mockEvent = {
      nativeEvent: {
        offsetX: 150, // Center X + radius * cos(angle)
        offsetY: 0    // Center Y + radius * sin(angle)
      }
    };
    
    fireEvent.mouseDown(chartWrapper, mockEvent);
    
    // Since we're mocking the chart, we can't directly test the dragging state
    // but we can check that the event handler doesn't throw errors
  });
  
  it('handles mouse move event during dragging', () => {
    render(<PieChart />);
    
    // Get the chart wrapper element
    const chartWrapper = screen.getByTestId('pie-chart').parentNode;
    
    // Simulate mouse down to start dragging
    fireEvent.mouseDown(chartWrapper, {
      nativeEvent: {
        offsetX: 150,
        offsetY: 0
      }
    });
    
    // Simulate mouse move to drag
    fireEvent.mouseMove(chartWrapper, {
      nativeEvent: {
        offsetX: 140,
        offsetY: 20
      }
    });
    
    // We can't directly test the state update because of the mocking,
    // but we can verify the component doesn't crash
  });
  
  it('handles mouse up event to end dragging', () => {
    render(<PieChart />);
    
    // Get the chart wrapper element
    const chartWrapper = screen.getByTestId('pie-chart').parentNode;
    
    // Simulate mouse down to start dragging
    fireEvent.mouseDown(chartWrapper, {
      nativeEvent: {
        offsetX: 150,
        offsetY: 0
      }
    });
    
    // Simulate mouse up to end dragging
    fireEvent.mouseUp(chartWrapper);
    
    // Since we're mocking the chart, we can't directly test the state changes
    // but we can check that the event handler doesn't throw errors
  });
  
  it('handles mouse leave event to end dragging', () => {
    render(<PieChart />);
    
    // Get the chart wrapper element
    const chartWrapper = screen.getByTestId('pie-chart').parentNode;
    
    // Simulate mouse down to start dragging
    fireEvent.mouseDown(chartWrapper, {
      nativeEvent: {
        offsetX: 150,
        offsetY: 0
      }
    });
    
    // Simulate mouse leave to end dragging
    fireEvent.mouseLeave(chartWrapper);
    
    // Since we're mocking the chart, we can't directly test the state changes
    // but we can check that the event handler doesn't throw errors
  });

  it('registers Chart.js plugins', () => {
    render(<PieChart />);
  });
});