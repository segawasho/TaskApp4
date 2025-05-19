import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data }) => {
  const labels = data.map(d => d.label);
  const values = data.map(d => d.value);

  const backgroundColors = [
    '#A5C8E1', // パステルブルー
    '#F6B8B8', // パステルレッド
    '#BFE3C0', // パステルグリーン
    '#F9E0A3', // パステルイエロー
    '#D8C5F0', // パステルパープル
    '#F5C7DE'  // パステルピンク
  ];

  // ”未完了かつ期限が本日以前”はコントローラで設定

  const chartData = {
    labels,
    datasets: [
      {
        label: 'タスク数',
        data: values,
        backgroundColor: backgroundColors.slice(0, values.length),
      }
    ]
  };

  const options = {
    plugins: {
      datalabels: {
        color: '#333',
        font: {
          weight: 'bold',
          size: 14,
        },
        formatter: value => value,
      },
    }
  };

  return <Pie data={chartData} options={options} />;
};

export default PieChart;
