'use client';

import { useState, useEffect, useContext } from 'react';
import { apiFetch } from '../../lib/api';
import { AuthContext } from '../../components/AuthContext';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

interface DailyRevenue {
  date: string;
  revenue: number;
}

interface CategoryAverage {
  category: string;
  _avg: { price: number };
}

export default function Reports() {
  const [dailyRevenue, setDailyRevenue] = useState<DailyRevenue[]>([]);
  const [categoryAvg, setCategoryAvg] = useState<CategoryAverage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const auth = useContext(AuthContext);

  
  if (auth?.user?.role !== 'admin') return <p className="text-red-500">Forbidden</p>;
  if (loading) return <p className="text-center">Loading reports...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  const dailyRevenueData = {
    labels: dailyRevenue.map(r => r.date),
    datasets: [
      {
        label: 'Daily Revenue ($)',
        data: dailyRevenue.map(r => r.revenue || 0),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const categoryAvgData = {
    labels: categoryAvg.map(a => a.category),
    datasets: [
      {
        data: categoryAvg.map(a => a._avg?.price || 0),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const barOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Daily Revenue' },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'Revenue ($)' } },
    },
  };

  const pieOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: { position: 'right' as const },
      title: { display: true, text: 'Average Price by Category' },
    },
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4 text-center">Reports</h1>
      
      <section className="mb-6 p-4 border rounded" aria-label="Daily Revenue Chart">
        <h2 className="text-xl mb-2">Daily Revenue Chart</h2>
        {dailyRevenue.length > 0 ? (
          <div className="h-80">
            <Bar data={dailyRevenueData} options={barOptions} />
          </div>
        ) : (
          <p className="text-gray-500 italic">No revenue data available. Create some orders to see the chart.</p>
        )}
      </section>

      <section className="p-4 border rounded" aria-label="Category Average Price Chart">
        <h2 className="text-xl mb-2">Category Average Price Chart</h2>
        {categoryAvg.length > 0 ? (
          <div className="h-80">
            <Pie data={categoryAvgData} options={pieOptions} />
          </div>
        ) : (
          <p className="text-gray-500 italic">No category data available.</p>
        )}
      </section>
    </div>
  );
}