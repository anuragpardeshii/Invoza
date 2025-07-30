import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Line } from 'react-chartjs-2';

function Analytics() {
  const [topSellers, setTopSellers] = useState([]);
  const [salesWeek, setSalesWeek] = useState([]);
  const [salesMonth, setSalesMonth] = useState([]);
  const [salesYear, setSalesYear] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/api/analytics/top-sellers', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setTopSellers(res.data)).catch(() => setError('Failed to fetch top sellers'));
    axios.get('http://localhost:5000/api/analytics/sales-stats?groupBy=week', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setSalesWeek(res.data)).catch(() => setError('Failed to fetch weekly sales'));
    axios.get('http://localhost:5000/api/analytics/sales-stats?groupBy=month', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setSalesMonth(res.data)).catch(() => setError('Failed to fetch monthly sales'));
    axios.get('http://localhost:5000/api/analytics/sales-stats?groupBy=year', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setSalesYear(res.data)).catch(() => setError('Failed to fetch yearly sales'));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Sales Analytics</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Top 5 Best Sellers</h3>
        <Bar
          data={{
            labels: topSellers.map(s => `${s.product} (${s.code})`),
            datasets: [{
              label: 'Total Sold',
              data: topSellers.map(s => s.totalSold),
              backgroundColor: 'rgba(37, 99, 235, 0.7)',
            }],
          }}
          options={{ responsive: true, plugins: { legend: { display: false } } }}
        />
      </div>
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Sales Per Week</h3>
        <Line
          data={{
            labels: salesWeek.map(s => s._id),
            datasets: [{
              label: 'Total Sales',
              data: salesWeek.map(s => s.total),
              borderColor: 'rgba(16, 185, 129, 1)',
              backgroundColor: 'rgba(16, 185, 129, 0.2)',
              tension: 0.3,
            }],
          }}
        />
      </div>
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Sales Per Month</h3>
        <Line
          data={{
            labels: salesMonth.map(s => s._id),
            datasets: [{
              label: 'Total Sales',
              data: salesMonth.map(s => s.total),
              borderColor: 'rgba(59, 130, 246, 1)',
              backgroundColor: 'rgba(59, 130, 246, 0.2)',
              tension: 0.3,
            }],
          }}
        />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Sales Per Year</h3>
        <Line
          data={{
            labels: salesYear.map(s => s._id),
            datasets: [{
              label: 'Total Sales',
              data: salesYear.map(s => s.total),
              borderColor: 'rgba(234, 179, 8, 1)',
              backgroundColor: 'rgba(234, 179, 8, 0.2)',
              tension: 0.3,
            }],
          }}
        />
      </div>
    </div>
  );
}

export default Analytics;
