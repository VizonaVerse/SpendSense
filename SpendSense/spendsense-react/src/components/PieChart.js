import React, { useState, useCallback } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const PieChart = () => {
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
        hoverOffset: 20, // Add hover offset for 3D effect
      },
    ],
  });

  const [lastClickTime, setLastClickTime] = useState(0);

  const drag = useCallback((index, deltaValue) => {
    const data = [...chartData.datasets[0].data];
    const total = data.reduce((sum, value) => sum + value, 0);
    const newValue = Math.round(data[index] + deltaValue); // Round to nearest integer

    // Ensure values are within 0 and total range
    if (newValue < 0 || newValue > total) {
      return;
    }

    const remainingTotal = total - data[index];
    const remainingNewTotal = total - newValue;

    const normalizedData = data.map((value, i) => {
      if (i === index) {
        return newValue;
      }
      return Math.round((value / remainingTotal) * remainingNewTotal); // Round to nearest integer
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
  }, [chartData]);

  const handleDoubleClick = useCallback((event, elements) => {
    if (elements.length > 0) {
      const index = elements[0].index;
      const currentValue = chartData.datasets[0].data[index];
      const newValue = parseInt(prompt('Enter new value:', currentValue), 10); // Parse as integer
      const MIN_VALUE = 5;
      // Ensure the new value is not below the minimum threshold
      if (!isNaN(newValue) && newValue >= MIN_VALUE) {
        drag(index, newValue - currentValue); // Adjust the slice value
      } else if (newValue < MIN_VALUE) {
        alert(`Value cannot be less than ${MIN_VALUE}.`);
      }
    }
  }, [chartData, drag]);

  const handleClick = useCallback((event, elements) => {
    const currentTime = new Date().getTime();
    if (currentTime - lastClickTime < 200) { // double click within 200ms
      handleDoubleClick(event, elements);
    } else {
      if (elements.length > 0) {
        const index = elements[0].index;
        const deltaValue = 5; // value for how much slice changes per click
        drag(index, deltaValue);
      }
    }
    setLastClickTime(currentTime);
  }, [lastClickTime, handleDoubleClick, drag]);

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${value}%`;
          },
        },
      },
      datalabels: {
        display: false,
        color: '#fff',
        textShadowBlur: 10,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
      },
    },
    onClick: handleClick, // Use handleClick for both single and double-click
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ position: 'relative', width: '300px', height: '300px' }}>
        <Pie data={chartData} options={options} />
      </div>
    </DndProvider>
  );
};

export default PieChart;