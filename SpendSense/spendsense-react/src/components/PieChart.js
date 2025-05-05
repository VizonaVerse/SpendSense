import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);


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

  useEffect(() => {
    return () => {
      if (dragTimeout.current) clearTimeout(dragTimeout.current);
    };
  }, []);

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
    const remainders = exactPercentages.map((p, i) => ({ index: i, remainder: p - floored[i] }));
    remainders.sort((a, b) => b.remainder - a.remainder);

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

  useEffect(() => {
    previousAngleRef.current = null;
  }, [chartData]);

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
  
      const exactPercentages = data.map(value => (value / total) * 100);
      const floored = exactPercentages.map(p => Math.floor(p));
      const remainders = exactPercentages.map((p, i) => ({
        index: i,
        remainder: p - floored[i]
      }));
      remainders.sort((a, b) => b.remainder - a.remainder);
  
      const totalFloored = floored.reduce((sum, p) => sum + p, 0);
      const pointsToDistribute = 100 - totalFloored;
  
      const adjustedPercentages = [...floored];
      for (let i = 0; i < pointsToDistribute; i++) {
        adjustedPercentages[remainders[i % remainders.length].index]++;
      }
  
      data.forEach((value, index) => {
        const angle = (value / total) * 2 * Math.PI;
        const midAngle = startAngle + angle / 2;
  
        const textX = centerX + (radius / 1.5) * Math.cos(midAngle);
        const textY = centerY + (radius / 1.5) * Math.sin(midAngle);
  
        ctx.fillStyle = 'black';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(adjustedPercentages[index] + '%', textX, textY);
  
        startAngle += angle;
      });
    },
  };
  
  ChartJS.register(percentagePlugin);
  
  const options = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    tooltip: {
      callbacks: {
        label: (context) => {
          const label = context.label || '';
          const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
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
      onClick: null,
    },
  },
};

  return (
    <div style={{ padding: '1rem' }}>
      <h1 style={{
        fontFamily: "'Press Start 2P', cursive",
        fontSize: '2rem',
        color: '#fff',
        textAlign: 'center',
        marginBottom: '1.5rem'
      }}>🎯 Budget Blaster!</h1>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: '40px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '10px',
        padding: '2rem'
      }}>
        <div style={{ maxWidth: '300px', color: '#fff', fontFamily: "'Press Start 2P', cursive" }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
  <span role="img" aria-label="lightbulb">💡</span> Instructions
</h3>

          <p>Drag the borders to adjust how much of your salary you'd like to save, spend on needs, and spend on wants.</p>
          <p>Click 'Next' when you're happy!</p>
          <hr style={{ borderColor: '#fff' }} />
          <h4>💰 Tips:</h4>
          <p><strong>Needs:</strong> Rent, food, bills</p>
          <p><strong>Wants:</strong> Clothes, takeaways, games</p>
          <p><strong>Savings:</strong> Set aside for future goals or emergencies</p>
        </div>

        <div
          style={{
            position: 'relative',
            width: '600px',
            height: '600px',
          }}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <Pie ref={chartRef} data={chartData} options={options} />
          <button
            onClick={handleNext}
            className="btn btn-primary mt-4"
            style={{ display: 'block', margin: '20px auto' }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PieChart;
