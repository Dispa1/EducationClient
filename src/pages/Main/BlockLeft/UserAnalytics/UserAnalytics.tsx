import React, { useEffect, useRef } from 'react';
import { Chart, registerables, ChartConfiguration } from 'chart.js';

Chart.register(...registerables);

interface UserAnalyticsChartProps {
    daysInMonth: number;
}

const UserAnalyticsChart: React.FC<UserAnalyticsChartProps> = ({ daysInMonth }) => {
    const generateRandomData = (length: number) => {
        const data = [];
        for (let i = 0; i < length; i++) {
            data.push(Math.floor(Math.random() * 11));
        }
        return data;
    };

    const generateLabels = (daysInMonth: number) => {
        const labels = [];
        for (let j = 1; j <= daysInMonth; j++) {
            labels.push(`${j < 10 ? '0' + j : j}`);
        }
        return labels;
    };

    const labels = generateLabels(daysInMonth);

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'количество пройденных тестов',
                backgroundColor: '#5872f5',
                borderColor: 'rgba(0,0,0,1)',
                borderWidth: 1,
                data: generateRandomData(labels.length),
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
    }, []);

    return (
        <canvas id="userAnalyticsChart" />
    );
};

export default UserAnalyticsChart;
