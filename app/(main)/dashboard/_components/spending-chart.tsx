"use client";

import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const SpendingChart = () => {
    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Income',
                data: [3000, 2500, 3200, 2800, 3500, 3100],
                borderColor: 'rgb(34, 197, 94)',
                tension: 0.4,
            },
            {
                label: 'Expenses',
                data: [2000, 2200, 1800, 2400, 2100, 2300],
                borderColor: 'rgb(239, 68, 68)',
                tension: 0.4,
            }
        ]
    };

    return <Line data={data} options={{ responsive: true }} />;
};

export default SpendingChart; 