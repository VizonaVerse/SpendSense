import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);
const percentageLabelPlugin = {
  id: 'percentageLabelPlugin',
  afterDraw(chart) {
    const { ctx } = chart;
    const dataset = chart.data.datasets[0];
    const meta = chart.getDatasetMeta(0);
    const total = dataset.data.reduce((a, b) => a + b, 0);

    ctx.save();
    meta.data.forEach((element, index) => {
      const value = dataset.data[index];
      const percentage = Math.round((value / total) * 100);
      const { x, y } = element.tooltipPosition();
      ctx.fillStyle = 'black';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${percentage}%`, x, y);
    });
    ctx.restore();
  }
};

ChartJS.register(percentageLabelPlugin);


const MIN_SLICE_VALUE = 1;

const PieChart = ({ onComplete }) => {
  const chartRef = useRef(null);
  const previousAngleRef = useRef(null);
  const dragTimeout = useRef(null);

  const [chartData, setChartData] = useState({
    labels: ['Wants', 'Needs', 'Savings'],
    datasets: [
      {
        label: 'Spending',
        data: [33, 33, 34],
        backgroundColor: [
          'rgba(255, 0, 55, 0.6)',
          'rgba(0, 153, 255, 0.6)',
          'rgba(255, 183, 0, 0.6)',
        ],
        hoverOffset: 20,
      },
    ],
  });

  const [dragging, setDragging] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);

  const adjustSlices = (index, angleDiff) => {
    const data = [...chartData.datasets[0].data];
    const total = data.reduce((sum, value) => sum + value, 0);
    const percentageDiff = (angleDiff / (2 * Math.PI)) * total;

    const currentSlice = data[index];
    const nextSliceIndex = (index + 1) % data.length;
    const nextSlice = data[nextSliceIndex];

    let newCurrentSlice = currentSlice + percentageDiff;
    let newNextSlice = nextSlice - percentageDiff;

    if (newCurrentSlice < MIN_SLICE_VALUE) {
      newCurrentSlice = MIN_SLICE_VALUE;
      newNextSlice = currentSlice + nextSlice - MIN_SLICE_VALUE;
    }

    if (newNextSlice < MIN_SLICE_VALUE) {
      newNextSlice = MIN_SLICE_VALUE;
      newCurrentSlice = currentSlice + nextSlice - MIN_SLICE_VALUE;
    }

    const normalizedData = data.map((value, i) => {
      if (i === index) return newCurrentSlice;
      if (i === nextSliceIndex) return newNextSlice;
      return value;
    });

    setChartData({
      ...chartData,
      datasets: [{ ...chartData.datasets[0], data: normalizedData }],
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
    if (angle < 0) angle += 2 * Math.PI;

    const data = chart.data.datasets[0].data;
    const total = data.reduce((sum, value) => sum + value, 0);
    let startAngle = -Math.PI / 2;
    const borderWidth = 0.05;

    let isHovering = false;
    for (let i = 0; i < data.length - 1; i++) {
      const sliceAngle = (data[i] / total) * 2 * Math.PI;
      const endAngle = startAngle + sliceAngle;
      const angleDiff = Math.abs(((angle - endAngle) + 2 * Math.PI) % (2 * Math.PI));
      if (angleDiff <= borderWidth || 2 * Math.PI - angleDiff <= borderWidth) {
        isHovering = true;
        break;
      }
      startAngle = endAngle;
    }

    if (chart.canvas) {
      chart.canvas.style.cursor = isHovering ? 'pointer' : dragging ? 'grabbing' : 'default';
    }

    if (!dragging || dragIndex === null) return;

    let currentAngle = Math.atan2(y, x);
    if (currentAngle < 0) currentAngle += 2 * Math.PI;

    if (previousAngleRef.current === null) {
      previousAngleRef.current = currentAngle;
      return;
    }

    let angleDiff = currentAngle - previousAngleRef.current;
    if (Math.abs(angleDiff) > Math.PI) {
      angleDiff = angleDiff > 0 ? angleDiff - 2 * Math.PI : angleDiff + 2 * Math.PI;
    }

    if (Math.abs(angleDiff) > 0.0001) {
      adjustSlices(dragIndex, angleDiff);
      previousAngleRef.current = currentAngle;
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
    if (angle < 0) angle += 2 * Math.PI;

    const data = chart.data.datasets[0].data;
    const total = data.reduce((sum, value) => sum + value, 0);
    let startAngle = -Math.PI / 2;
    const borderWidth = 0.05;

    for (let i = 0; i < data.length; i++) {
      const sliceAngle = (data[i] / total) * 2 * Math.PI;
      const endAngle = startAngle + sliceAngle;
      const angleDiff = Math.abs(((angle - endAngle) + 2 * Math.PI) % (2 * Math.PI));
      if (angleDiff <= borderWidth || 2 * Math.PI - angleDiff <= borderWidth) {
        setDragging(true);
        setDragIndex(i);
        previousAngleRef.current = angle;
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
    if (chartRef.current) chartRef.current.canvas.style.cursor = 'default';

    const data = [...chartData.datasets[0].data];
    const total = data.reduce((sum, value) => sum + value, 0);
    const exactPercentages = data.map(value => (value / total) * 100);
    const floored = exactPercentages.map(p => Math.floor(p));
    const remainders = exactPercentages.map((p, i) => ({ index: i, remainder: p - floored[i] }))
      .sort((a, b) => b.remainder - a.remainder);

    const totalFloored = floored.reduce((sum, p) => sum + p, 0);
    const pointsToDistribute = 100 - totalFloored;

    const normalizedData = [...floored];
    for (let i = 0; i < pointsToDistribute; i++) {
      normalizedData[remainders[i % remainders.length].index]++;
    }

    setChartData({
      ...chartData,
      datasets: [{ ...chartData.datasets[0], data: normalizedData }],
    });

    if (dragTimeout.current) clearTimeout(dragTimeout.current);
    dragTimeout.current = setTimeout(() => {
      previousAngleRef.current = null;
      dragTimeout.current = null;
    }, 10);
  }, [dragging, chartData]);

  useEffect(() => {
    const handleGlobalMouseUp = () => handleMouseUp();
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [dragging, handleMouseUp]);

  const handleNext = () => {
    if (onComplete) {
      const data = chartData.datasets[0].data;
      const labels = chartData.labels;
      const result = labels.reduce((acc, label, index) => {
        acc[label] = data[index];
        return acc;
      }, {});
      onComplete(result);
    }
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
            const percentage = Math.round((context.raw / total) * 100);
            return `${label}: ${percentage}%`;
          },
        },
      },
      legend: {
        onClick: null,
      },
    },
  };

  return (
    <div className="piechart-section">
      <h1 className="piechart-title">🎯 Budget Blaster!</h1>
      <div className="piechart-container">
        
        {/* Left Column: Instructions */}
        <div className="piechart-column piechart-instructions">
          <h3>💡 Instructions</h3>
          <p>Drag the borders to adjust how much of your salary you'd like to save, spend on needs, and spend on wants.</p>
          <p>Click 'Next' when you're happy!</p>
        </div>
  
        {/* Center Column: Chart + Button */}
        <div
          className="piechart-column piechart-chart-wrapper"
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <Pie ref={chartRef} data={chartData} options={options} />
          <button className="piechart-button" onClick={handleNext}>Next</button>
        </div>
  
        {/* Right Column: Tips */}
        <div className="piechart-column piechart-tips">
          <h4>💰 Tips</h4>
          <p><strong>Needs:</strong> Rent, food, bills</p>
          <p><strong>Wants:</strong> Clothes, takeaways, games</p>
          <p><strong>Savings:</strong> Set aside for future goals or emergencies</p>
        </div>
  
      </div>
    </div>
  );  
};

export default PieChart; /* Global Variables */