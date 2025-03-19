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
    const total = data.reduce((sum, value) => sum + value, 0);

    const currentSlice = data[index];
    const nextSliceIndex = (index + 1) % data.length;
    const nextSlice = data[nextSliceIndex];

    // Calculate the new percentage for the current slice
    const newPercentage = Math.round((newAngle / (2 * Math.PI)) * 100);

    // Ensure the new slice values are positive and respect the minimum slice value
    const newCurrentSlice = Math.max(newPercentage, MIN_SLICE_VALUE);
    const newNextSlice = Math.max(currentSlice + nextSlice - newCurrentSlice, MIN_SLICE_VALUE);

    // Normalize the data to ensure the total is 100%
    let normalizedData = data.map((value, i) => {
      if (i === index) return newCurrentSlice;
      if (i === nextSliceIndex) return newNextSlice;
      return value;
    });

    const normalizedTotal = normalizedData.reduce((sum, value) => sum + value, 0);

    // Adjust the last slice to ensure the total is exactly 100%
    const adjustment = 100 - normalizedTotal;
    normalizedData[normalizedData.length - 1] = Math.max(
      normalizedData[normalizedData.length - 1] + adjustment,
      MIN_SLICE_VALUE
    );

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
    const radius = (chartArea.right - chartArea.left) / 2;

    const x = offsetX - centerX;
    const y = offsetY - centerY;
    const distance = Math.sqrt(x * x + y * y);

    if (distance > radius - 10 && distance < radius + 10) {
      chart.canvas.style.cursor = 'pointer';
    } else {
      chart.canvas.style.cursor = 'default';
    }

    if (dragging && dragIndex !== null) {
      let angle = Math.atan2(y, x);
      angle -= Math.PI / 2;
      if (angle < 0) {
        angle += 2 * Math.PI;
      }
      adjustSlices(dragIndex, angle);
    }
  };

  const handleMouseDown = (event) => {
    const chart = chartRef.current;
    const { offsetX, offsetY } = event.nativeEvent;
    const { chartArea } = chart;
    const centerX = chartArea.left + (chartArea.right - chartArea.left) / 2;
    const centerY = chartArea.top + (chartArea.bottom - chartArea.top) / 2;

    const x = offsetX - centerX;
    const y = offsetY - centerY;

    let angle = Math.atan2(y, x);
    angle -= Math.PI / 2;
    if (angle < 0) {
      angle += 2 * Math.PI;
    }

    const data = chart.data.datasets[0].data;
    const total = data.reduce((sum, value) => sum + value, 0);

    let startAngle = -Math.PI / 2;
    for (let i = 0; i < data.length; i++) {
      const sliceAngle = (data[i] / total) * 2 * Math.PI;

      if (angle >= startAngle && angle <= startAngle + sliceAngle) {
        setDragging(true);
        setDragIndex(i); // Correctly set the index of the slice being dragged
        break;
      }
      startAngle += sliceAngle;
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
    setDragIndex(null);
  };

  // Custom plugin to draw borders
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

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
          centerX + radius * Math.cos(startAngle),
          centerY + radius * Math.sin(startAngle)
        );
        ctx.strokeStyle = dragging && dragIndex === index ? 'rgba(0, 0, 255, 0.8)' : 'rgba(0, 0, 0, 0.5)';
        ctx.lineWidth = dragging && dragIndex === index ? 3 : 2;
        ctx.stroke();

        startAngle += angle;
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
        const percentage = ((value / total) * 100).toFixed(1) + '%';
        ctx.fillStyle = 'black';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(percentage, textX, textY);

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
            const percentage = ((value / total) * 100).toFixed(2);
            return `${label}: ${percentage}%`;
          },
        },
      },
    },
  };

  return (
    <div
      style={{ position: 'relative', width: '600px', height: '600px' }}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <Pie ref={chartRef} data={chartData} options={options} />
    </div>
    
  );
};

export default PieChart;