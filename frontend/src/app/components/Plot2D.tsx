import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import type { SimulationResult } from '../types/simulation';

ChartJS.register(
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface Plot2DProps {
    results: SimulationResult[];
    xAxis: 'x' | 'y' | 'z' | 't';
    yAxis: 'x' | 'y' | 'z';
    title: string;
}

const Plot2D: React.FC<Plot2DProps> = ({ results, xAxis, yAxis, title }) => {
    const datasets = results.map((result, index) => {
        const dataPoints = result.x.map((_, i) => {
            let xValue: number;
            let yValue: number;

            if (xAxis === 't') {
                xValue = i; 
            } else if (xAxis === 'x') {
                xValue = result.x[i];
            } else if (xAxis === 'y') {
                xValue = result.y[i];
            } else if (xAxis === 'z' && result.z) {
                xValue = result.z[i];
            } else {
                xValue = i; 
            }

            if (yAxis === 'x') {
                yValue = result.x[i];
            } else if (yAxis === 'y') {
                yValue = result.y[i];
            } else if (yAxis === 'z' && result.z) {
                yValue = result.z[i];
            } else {
                yValue = 0; 
            }

            return { x: xValue, y: yValue };
        });

        return {
            label: `Simulation ${index + 1}`,
            data: dataPoints,
            borderColor: result.color,
            backgroundColor: result.color + '40', 
            tension: 0.1,
            showLine: true,
            pointRadius: 0, 
        };
    });

    const data = {
        datasets: datasets,
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    color: 'white', 
                }
            },
            title: {
                display: true,
                text: title,
                color: 'white',
            },
        },
        scales: {
            x: {
                type: 'linear' as const,
                position: 'bottom' as const,
                title: {
                    display: true,
                    text: xAxis.toUpperCase(),
                    color: 'white', 
                },
                ticks: {
                    color: 'white', 
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)', 
                }
            },
            y: {
                type: 'linear' as const,
                title: {
                    display: true,
                    text: yAxis.toUpperCase(),
                    color: 'white', 
                },
                ticks: {
                    color: 'white', 
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)', 
                }
            },
        },
        elements: {
            line: {
                borderWidth: 1,
            }
        }
    };

    return (
        <div style={{ height: '100%', width: '100%' }}>
            <Line data={data} options={options} />
        </div>
    );
};

export default Plot2D;