import React, { useEffect, useState } from 'react';
import PieChart from './PieChart';
import BarChart from './BarChart';
import CompanyTaskTable from './CompanyTaskTable';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/dashboard/summary', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('データ取得エラー');
        return res.json();
      })
      .then(setData)
      .catch(err => setError(err.message));
  }, []);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!data) return <p>読み込み中...</p>;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-bold mb-4 text-gray-800">未完了タスク（期限：本日以前）</h2>
        <PieChart data={data.status_chart} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-bold mb-4 text-gray-800">期限別タスク数</h2>
        <BarChart data={data.due_bar_chart} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-bold mb-4 text-gray-800">企業ごとのタスク数</h2>
        <CompanyTaskTable data={data.company_task_table} />
      </div>
    </div>
  );
};

export default Dashboard;
