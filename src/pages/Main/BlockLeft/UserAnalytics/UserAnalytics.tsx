// В React компоненте UserAnalyticsChart
import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables, ChartConfiguration } from 'chart.js';
import axios from 'axios';

Chart.register(...registerables);

interface AnalyticsItem {
  id: string;
  type: string;
  userId: string;
  userName: string;
  testId: string;
  createdAt: string;
  correctAnswersCount: number;
  incorrectAnswersCount: number;
  unansweredQuestionsCount: number;
  updatedAt: string;
}

interface UserAnalyticsChartProps {
  daysInWeek: number;
}

const UserAnalyticsChart: React.FC<UserAnalyticsChartProps> = ({ daysInWeek }) => {
  const [analytics, setAnalytics] = useState<AnalyticsItem[]>([]);
  const userDataString = sessionStorage.getItem('userData');
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const userId = userData?.userId;

  useEffect(() => {
    if (userId) {
      fetchAnalytics(userId);
    }
  }, [userId]);

  const fetchAnalytics = async (userId: string) => {
    try {
      const data = await getAllAnalyticsForUser(userId);
      setAnalytics(data);
    } catch (error) {
      console.error('Ошибка при загрузке аналитики:', error);
    }
  };

  const generateLabels = (daysInWeek: number) => {
    const labels = [];
    const today = new Date();

    for (let j = daysInWeek - 1; j >= 0; j--) {
      const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - j);
      labels.push(date.toLocaleDateString('ru-RU', { month: 'short', day: 'numeric' }));
    }
    return labels;
  };

  const countRecordsByDate = (analytics: AnalyticsItem[], daysInWeek: number) => {
    const today = new Date();
    const recordCounts = Array(daysInWeek).fill(0);

    analytics.forEach(item => {
      const date = new Date(item.createdAt);
      const diffInDays = (today.getTime() - date.getTime()) / (1000 * 3600 * 24);

      if (diffInDays < daysInWeek && diffInDays >= 0) {
        const dayIndex = daysInWeek - 1 - Math.floor(diffInDays);
        recordCounts[dayIndex]++;
      }
    });

    return recordCounts;
  };

  const labels = generateLabels(daysInWeek);
  const dataCounts = countRecordsByDate(analytics, daysInWeek);

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Количество тестов',
        backgroundColor: 'rgba(88, 114, 245, 0.4)', // Цвет заливки под графиком
        borderColor: '#5872f5',
        borderWidth: 2,
        data: dataCounts,
        fill: true, // Закрашиваем пространство под линией
        tension: 0.4, // Устанавливаем напряжение кривой
        pointRadius: 4, // Радиус точек
        pointBackgroundColor: '#5872f5', // Цвет точек
        pointBorderColor: '#5872f5', // Цвет границ точек
        pointHoverRadius: 6, // Радиус точек при наведении
        pointHoverBackgroundColor: '#5872f5', // Цвет точек при наведении
        pointHoverBorderColor: '#fff', // Цвет границ точек при наведении
      },
    ],
  };

  const chartConfig: ChartConfiguration<'line', number[], string> = {
    type: 'line',
    data: data,
    options: {
      scales: {
        x: {
          type: 'category',
          labels: labels,
          position: 'bottom',
        },
        y: {
          type: 'linear',
          position: 'left',
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          intersect: false,
        },
      },
    },
  };

  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    const canvas = document.getElementById('userAnalyticsChart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
      chartRef.current = new Chart(ctx, chartConfig);
    }
    
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data]);

  return <canvas id="userAnalyticsChart" />;
};

export default UserAnalyticsChart;

export const getAllAnalyticsForUser = async (userId: string) => {
  try {
    const token = sessionStorage.getItem('token');
    if (!token) {
      throw new Error('No token found in session storage');
    }

    const response = await axios.get(
      `${process.env.REACT_APP_API_EDUCATION}/api/AllAnalytics/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении записей аналитики для пользователя:', error);
    throw new Error('Произошла ошибка при получении записей аналитики для пользователя');
  }
};
