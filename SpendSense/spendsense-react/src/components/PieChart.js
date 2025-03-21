import React, { useState, useRef } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const MIN_SLICE_VALUE = 1; // Minimum slice value in percentage

const PieChart = () => {
  const chartRef = useRef(null);

  const [chartData, setChartData] = useState({
    labels: ['Rent', 'Food', 'Transport', 'Utilities', 'Entertainment'],
    datasets: [
      {
        label: 'Spending',
        data: [30, 20, 15, 10, 25],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        hoverOffset: 20,
      },
    ],
  });

  const [dragging, setDragging] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);

  const adjustSlices = (index, newAngle) => {
    const data = [...chartData.datasets[0].data];

    const currentSlice = data[index];
    const nextSliceIndex = (index + 1) % data.length;
    const nextSlice = data[nextSliceIndex];

    // Calculate the new percentage based on the angle
    let newPercentage = Math.round((newAngle / (2 * Math.PI)) * 100);

    // Check if the new values would violate the minimum slice value constraint
    if (currentSlice <= MIN_SLICE_VALUE && newPercentage < currentSlice) {
      newPercentage = currentSlice; // Prevent decreasing the slice below the minimum
    }

    const maxPercentage = currentSlice + nextSlice - MIN_SLICE_VALUE;
    if (nextSlice <= MIN_SLICE_VALUE && newPercentage > maxPercentage) {
      newPercentage = maxPercentage; // Prevent increasing the slice beyond the maximum
    }

    const newCurrentSlice = Math.max(newPercentage, MIN_SLICE_VALUE);
    const newNextSlice = Math.max(currentSlice + nextSlice - newCurrentSlice, MIN_SLICE_VALUE);

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

    let angle = Math.atan2(y, x);
    if (angle < -Math.PI / 2) {
      angle += 2 * Math.PI;
    }

    if (dragging && dragIndex !== null) {
      adjustSlices(dragIndex, angle);
    }
  };

  const handleMouseDown = (event) => {
    const chart = chartRef.current;
    if (!chart) return;
  
    const { offsetX, offsetY } = event.nativeEvent;
    const { chartArea } = chart;
    const centerX = chartArea.left + (chartArea.right - chartArea.left) / 2;
    const centerY = chartArea.top + (chartArea.bottom - chartArea.top) / 2;
  
    const x = offsetX - centerX;
    const y = offsetY - centerY;
  
    let angle = Math.atan2(y, x);
    if (angle < -Math.PI / 2) {
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
        startAngle = endAngle;
        continue;
      }
  
      if (Math.abs(angle - endAngle) <= borderWidth) {
        setDragging(true);
        setDragIndex(i);
        chart.canvas.style.cursor = 'grabbing';
        break;
      }
      startAngle = endAngle;
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
    setDragIndex(null);
    if (chartRef.current) {
      chartRef.current.canvas.style.cursor = 'default'; // Reset cursor
    }
  };

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

        // Highlight the border if the mouse is over it
        const isHovered = dragging && dragIndex === index;
        ctx.strokeStyle = isHovered ? 'rgba(0, 0, 255, 0.8)' : 'rgba(0, 0, 0, 0.5)';
        ctx.lineWidth = isHovered ? 3 : 2;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
          centerX + radius * Math.cos(endAngle),
          centerY + radius * Math.sin(endAngle)
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

      data.forEach((value) => {
        const angle = (value / total) * 2 * Math.PI;
        const midAngle = startAngle + angle / 2;

        // Calculate the position for the percentage text
        const textX = centerX + (radius / 1.5) * Math.cos(midAngle);
        const textY = centerY + (radius / 1.5) * Math.sin(midAngle);

        // Draw the percentage text
        const percentage = Math.round((value / total) * 100);
        ctx.fillStyle = 'black';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(percentage + '%', textX, textY);

        startAngle += angle;
      });
    },
  };

  ChartJS.register(borderPlugin, percentagePlugin);
  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${percentage}%`;
          },
        },
      },
    },
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '800px', // Increased width
        height: '800px', // Increased height
        border: '2px solid black', // Added outline
        borderRadius: '10px', // Optional: Rounded corners
      }}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <Pie ref={chartRef} data={chartData} options={options} />
    </div>
  );
};

export default PieChart;