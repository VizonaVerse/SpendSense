import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const MIN_SLICE_VALUE = 1; // Minimum slice value in percentage

const PieChart = ({ onComplete }) => {
  const chartRef = useRef(null);
  const previousAngleRef = useRef(null);
  const dragTimeout = useRef(null);

  const [chartData, setChartData] = useState({
    labels: ['Wants', 'Needs', 'Savings'],
    datasets: [
      {
        label: 'Spending',
        data: [30, 20, 50],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
        ],
        hoverOffset: 20,
      },
    ],
  });

  const [dragging, setDragging] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);

  // Clean up any ongoing timeouts on unmount
  useEffect(() => {
    return () => {
      if (dragTimeout.current) {
        clearTimeout(dragTimeout.current);
      }
    };
  }, []);

  // Track continuous movements instead of absolute angles
  const adjustSlices = (index, angleDiff) => {
    const data = [...chartData.datasets[0].data];
    const total = data.reduce((sum, value) => sum + value, 0);

    // Convert the angle difference to percentage difference
    // The full circle is 2π radians = 100% of the total
    const percentageDiff = (angleDiff / (2 * Math.PI)) * total;

    const currentSlice = data[index];
    const nextSliceIndex = (index + 1) % data.length;
    const nextSlice = data[nextSliceIndex];

    // Calculate new slice values based on the difference
    let newCurrentSlice = currentSlice + percentageDiff;
    let newNextSlice = nextSlice - percentageDiff;

    // Apply minimum constraints
    if (newCurrentSlice < MIN_SLICE_VALUE) {
      newCurrentSlice = MIN_SLICE_VALUE;
      newNextSlice = currentSlice + nextSlice - MIN_SLICE_VALUE;
    }

    if (newNextSlice < MIN_SLICE_VALUE) {
      newNextSlice = MIN_SLICE_VALUE;
      newCurrentSlice = currentSlice + nextSlice - MIN_SLICE_VALUE;
    }

    // Round the values
    let normalizedData = data.map((value, i) => {
      if (i === index) return newCurrentSlice;
      if (i === nextSliceIndex) return newNextSlice;
      return value;
    });

    setChartData({
      ...chartData,
      datasets: [
        {
          ...chartData.datasets[0],
          data: normalizedData,
        },
      ],
    });
  };

  const handleMouseMove = (event) => {
    const chart = chartRef.current;
    if (!chart) return;

    const { offsetX, offsetY } = event.nativeEvent;
    const { chartArea } = chart;
    const centerX = chartArea.left + (chartArea.right - chartArea.left) / 2;
    const centerY = chartArea.top + (chartArea.bottom - chartArea.top) / 2;

    const x = offsetX - centerX;
    const y = offsetY - centerY;

    // Calculate current angle
    let angle = Math.atan2(y, x);
    if (angle < 0) {
      angle += 2 * Math.PI;
    }

    const data = chart.data.datasets[0].data;
    const total = data.reduce((sum, value) => sum + value, 0);
    let startAngle = -Math.PI / 2;
    const borderWidth = 0.05; // Adjust for sensitivity

    let isHovering = false;

    for (let i = 0; i < data.length - 1; i++) { // Exclude the final border
      const sliceAngle = (data[i] / total) * 2 * Math.PI;
      const endAngle = startAngle + sliceAngle;

      // Check if mouse is near the handle
      const angleDiff = Math.abs(((angle - endAngle) + 2 * Math.PI) % (2 * Math.PI));
      if (angleDiff <= borderWidth || 2 * Math.PI - angleDiff <= borderWidth) {
        isHovering = true;
        break;
      }
      startAngle = endAngle;
    }

    // Change cursor to pointer if hovering over a draggable border
    if (chart.canvas) {
      chart.canvas.style.cursor = isHovering ? 'pointer' : dragging ? 'grabbing' : 'default';
    }

    if (!dragging || dragIndex === null) return;

    // Handle dragging logic
    let currentAngle = Math.atan2(y, x);
    if (currentAngle < 0) {
      currentAngle += 2 * Math.PI;
    }

    if (previousAngleRef.current === null) {
      previousAngleRef.current = currentAngle;
      return;
    }

    let angleDiff = currentAngle - previousAngleRef.current;

    if (Math.abs(angleDiff) > Math.PI) {
      angleDiff = angleDiff > 0
        ? angleDiff - 2 * Math.PI
        : angleDiff + 2 * Math.PI;
    }

    if (Math.abs(angleDiff) > 0.0001) {
      adjustSlices(dragIndex, angleDiff);
      previousAngleRef.current = currentAngle;
    }
  };

  const handleMouseDown = (event) => {
    // Clear any existing timeouts
    if (dragTimeout.current) {
      clearTimeout(dragTimeout.current);
      dragTimeout.current = null;
    }

    const chart = chartRef.current;
    if (!chart) return;

    const { offsetX, offsetY } = event.nativeEvent;
    const { chartArea } = chart;
    const centerX = chartArea.left + (chartArea.right - chartArea.left) / 2;
    const centerY = chartArea.top + (chartArea.bottom - chartArea.top) / 2;

    const x = offsetX - centerX;
    const y = offsetY - centerY;

    let angle = Math.atan2(y, x);
    if (angle < 0) {
      angle += 2 * Math.PI;
    }

    const data = chart.data.datasets[0].data;
    const total = data.reduce((sum, value) => sum + value, 0);
    let startAngle = -Math.PI / 2;
    const borderWidth = 0.05; // Adjust for sensitivity

    for (let i = 0; i < data.length; i++) {
      const sliceAngle = (data[i] / total) * 2 * Math.PI;
      const endAngle = startAngle + sliceAngle;
      if (i === 4) {
        return;
      }
      // Check if mouse is near the handle
      // Use modulo to handle the wrap-around at 2*PI
      const angleDiff = Math.abs(((angle - endAngle) + 2 * Math.PI) % (2 * Math.PI));
      if (angleDiff <= borderWidth || 2 * Math.PI - angleDiff <= borderWidth) {
        setDragging(true);
        setDragIndex(i);
        previousAngleRef.current = angle; // Set the initial angle
        chart.canvas.style.cursor = 'grabbing';
        break;
      }
      startAngle = endAngle;
    }
  };

  const handleMouseUp = useCallback(() => {
    if (!dragging) return;

    setDragging(false);
    setDragIndex(null);

    if (chartRef.current) {
      chartRef.current.canvas.style.cursor = 'default';
    }


  // Normalize the data to ensure the total is exactly 100%
  const data = [...chartData.datasets[0].data];
  const total = data.reduce((sum, value) => sum + value, 0);

  // Calculate exact percentages
  const exactPercentages = data.map(value => (value / total) * 100);

  // Floor all percentages initially and track remainders
  const floored = exactPercentages.map(p => Math.floor(p));
  const remainders = exactPercentages.map((p, i) => ({
    index: i,
    remainder: p - floored[i],
  }));

  // Sort by remainder in descending order
  remainders.sort((a, b) => b.remainder - a.remainder);

  // Calculate how many percentage points we need to distribute
  const totalFloored = floored.reduce((sum, p) => sum + p, 0);
  const pointsToDistribute = 100 - totalFloored;

  // Distribute remaining points to slices with the largest remainders
  const normalizedData = [...floored];
  for (let i = 0; i < pointsToDistribute; i++) {
    normalizedData[remainders[i % remainders.length].index]++;
  }

  // Update the chart data with normalized values
  setChartData({
    ...chartData,
    datasets: [
      {
        ...chartData.datasets[0],
        data: normalizedData,
      },
    ],
  });

    // Use a timeout to clear the angle reference after the current event cycle
    // This fixes the issue with handles not being draggable after first use
    if (dragTimeout.current) {
      clearTimeout(dragTimeout.current);
    }

    dragTimeout.current = setTimeout(() => {
      previousAngleRef.current = null;
      dragTimeout.current = null;
    }, 10);
  }, [dragging, chartData]); // Add 'dragging' as a dependency


  const borderPlugin = {
    id: 'borderPlugin',
    afterDraw: (chart) => {
      const { ctx, chartArea } = chart;
      const data = chart.data.datasets[0].data;
      const total = data.reduce((sum, value) => sum + value, 0);

      const centerX = chartArea.left + (chartArea.right - chartArea.left) / 2;
      const centerY = chartArea.top + (chartArea.bottom - chartArea.top) / 2;
      const radius = (chartArea.right - chartArea.left) / 2;

      let startAngle = -Math.PI / 2;

      data.forEach((value, index) => {
        const angle = (value / total) * 2 * Math.PI;
        const endAngle = startAngle + angle;

        // Make the border invisible
        ctx.strokeStyle = 'rgba(0, 0, 0, 0)'; // Fully transparent
        ctx.lineWidth = 2;

        const innerRadius = radius * 0.3;
        const outerRadius = radius * 0.7;

        ctx.beginPath();
        ctx.moveTo(
          centerX + innerRadius * Math.cos(endAngle),
          centerY + innerRadius * Math.sin(endAngle)
        );
        ctx.lineTo(
          centerX + outerRadius * Math.cos(endAngle),
          centerY + outerRadius * Math.sin(endAngle)
        );
        ctx.stroke();

        startAngle = endAngle;
      });
    },
  };

  const percentagePlugin = {
    id: 'percentagePlugin',
    afterDraw: (chart) => {
      const { ctx, chartArea } = chart;
      const data = chart.data.datasets[0].data;
      const total = data.reduce((sum, value) => sum + value, 0);

      const centerX = chartArea.left + (chartArea.right - chartArea.left) / 2;
      const centerY = chartArea.top + (chartArea.bottom - chartArea.top) / 2;
      const radius = (chartArea.right - chartArea.left) / 2;

      let startAngle = -Math.PI / 2;

      // Calculate exact percentages first
      const exactPercentages = data.map(value => (value / total) * 100);

      // Floor all percentages initially and track remainders
      const floored = exactPercentages.map(p => Math.floor(p));
      const remainders = exactPercentages.map((p, i) => ({
        index: i,
        remainder: p - floored[i]
      }));

      // Sort by remainder in descending order
      remainders.sort((a, b) => b.remainder - a.remainder);

      // Calculate how many percentage points we need to distribute
      const totalFloored = floored.reduce((sum, p) => sum + p, 0);
      const pointsToDistribute = 100 - totalFloored;

      // Distribute remaining points to slices with largest remainders
      const adjustedPercentages = [...floored];
      for (let i = 0; i < pointsToDistribute; i++) {
        adjustedPercentages[remainders[i % remainders.length].index]++;
      }

      // Now draw the percentages
      data.forEach((value, index) => {
        const angle = (value / total) * 2 * Math.PI;
        const midAngle = startAngle + angle / 2;

        // Calculate the position for the percentage text
        const textX = centerX + (radius / 1.5) * Math.cos(midAngle);
        const textY = centerY + (radius / 1.5) * Math.sin(midAngle);

        // Draw the percentage text
        ctx.fillStyle = 'black';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(adjustedPercentages[index] + '%', textX, textY);

        startAngle += angle;
      });
    },
  };

  ChartJS.register(borderPlugin, percentagePlugin);
  const options = {
    responsive: true, // Enable responsiveness
    maintainAspectRatio: true, // Allow the chart to resize freely
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const total = context.dataset.data.reduce((sum, val) => sum + val, 0);

            // Use the same calculation as in the percentagePlugin
            const exactPercentages = context.dataset.data.map(v => (v / total) * 100);
            const floored = exactPercentages.map(p => Math.floor(p));
            const remainders = exactPercentages.map((p, i) => ({
              index: i,
              remainder: p - floored[i]
            })).sort((a, b) => b.remainder - a.remainder);

            const totalFloored = floored.reduce((sum, p) => sum + p, 0);
            const pointsToDistribute = 100 - totalFloored;

            const adjustedPercentages = [...floored];
            for (let i = 0; i < pointsToDistribute; i++) {
              adjustedPercentages[remainders[i % remainders.length].index]++;
            }

            return `${label}: ${adjustedPercentages[context.dataIndex]}%`;
          },
        },
      },
      legend: {
        onClick: null, // Disable legend click functionality
      },
    },
  };

  // Add window event listeners for mouse events outside the component
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      handleMouseUp();
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [dragging, handleMouseUp]); // Add 'handleMouseUp' to the dependency array

  // Add a new useEffect to ensure event binding is consistent
  useEffect(() => {
    // Force reset angle reference when dependencies change
    previousAngleRef.current = null;

    // No need to return cleanup as we're not adding event listeners here
  }, [chartData]); // Re-run when chart data changes

  const handleNext = () => {
    // Call onComplete with the current chart data
    if (onComplete) {
      const data = chartData.datasets[0].data;
      const labels = chartData.labels;
      const result = labels.reduce((acc, label, index) => {
        acc[label] = data[index];
        return acc;
      }, {});
      onComplete(result); // Send data to App.js
    }
  };

  // Return your existing JSX
  return (
    <div
      style={{
        position: 'relative',
        width: '600px',
        height: '600px',
        margin: '0 auto',
      }}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp} // Add this to handle mouse leaving the component
    >
      <Pie ref={chartRef} data={chartData} options={options} />
      {/* Add a Next button to trigger onComplete */}
      <button
        onClick={handleNext}
        className="btn btn-primary mt-4"
        style={{ display: 'block', margin: '0 auto' }}
      >
        Next
      </button>
    </div>
  );
};

export default PieChart;