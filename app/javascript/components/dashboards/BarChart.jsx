import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, ChartDataLabels);

const BarChart = ({ data }) => {
  const labels = data.map(d => d.label);
  const values = data.map(d => d.value);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'タスク数',
        data: values,
        backgroundColor: 'rgba(54, 162, 235, 0.5)'
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'top',
        color: '#333',
        font: {
          weight: 'bold'
        },
        formatter: (value) => value,
      },
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return <Bar data={chartData} options={options} />;
};

export default BarChart;
