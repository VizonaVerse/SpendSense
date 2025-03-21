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

    let newPercentage = Math.round((newAngle / (2 * Math.PI)) * 100);

    if (currentSlice <= MIN_SLICE_VALUE && newPercentage < currentSlice) {
      newPercentage = currentSlice;
    }

    const maxPercentage = currentSlice + nextSlice - MIN_SLICE_VALUE;
    if (nextSlice <= MIN_SLICE_VALUE && newPercentage > maxPercentage) {
      newPercentage = maxPercentage;
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
    const radius = (chartArea.right - chartArea.left) / 2;

    const x = offsetX - centerX;
    const y = offsetY - centerY;

    let angle = Math.atan2(y, x);
    if (angle < 0) {
      angle += 2 * Math.PI;
    }

    const data = chart.data.datasets[0].data;
    const total = data.reduce((sum, value) => sum + value, 0);
    let startAngle = -Math.PI / 2;
    const borderWidth = 0.05;

    // Store the angle of the first border
    const firstBorderAngle = -Math.PI / 2;

    for (let i = 0; i < data.length; i++) {
      const sliceAngle = (data[i] / total) * 2 * Math.PI;
      const endAngle = startAngle + sliceAngle;

      // Prevent dragging the border before the first slice
      if (i === 4) {
          return; // Prevent dragging this border
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
      chartRef.current.canvas.style.cursor = 'default';
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

      for (let i = 0; i < data.length; i++) {
        const angle = (data[i] / total) * 2 * Math.PI;
        const endAngle = startAngle + angle;

        const isHovered = dragging && dragIndex === i;

        ctx.strokeStyle = isHovered ? 'rgba(255, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.5)';
        ctx.lineWidth = isHovered ? 3 : 2;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);

        let mouseAngle;
        if (dragging && dragIndex === i) {
          // Get mouse position relative to the chart
          const { offsetX, offsetY } = chart.canvas;
          const x = offsetX - centerX;
          const y = offsetY - centerY;

          // Calculate the angle from the center to the mouse position
          mouseAngle = Math.atan2(y, x);

          // Normalize the angle to be between 0 and 2*PI
          if (mouseAngle < 0) {
            mouseAngle += 2 * Math.PI;
          }
        } else {
          mouseAngle = endAngle; // Default to the end of the slice
        }

        ctx.lineTo(
          centerX + radius * Math.cos(mouseAngle),
          centerY + radius * Math.sin(mouseAngle)
        );
        ctx.stroke();

        startAngle = endAngle;
      }
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

        const textX = centerX + (radius / 1.5) * Math.cos(midAngle);
        const textY = centerY + (radius / 1.5) * Math.sin(midAngle);

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
        width: '800px',
        height: '800px',
        border: '2px solid black',
        borderRadius: '10px',
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