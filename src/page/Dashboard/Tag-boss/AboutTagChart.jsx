import React, {memo, useMemo} from 'react';
import {Bar} from "react-chartjs-2";
import {Card, theme} from "antd";
import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip} from 'chart.js';
import {chartColor} from "../config.dashboard";
import useBreakpoint from "antd/es/grid/hooks/useBreakpoint";

// Register necessary chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);




const AboutTagChart = ({data}) => {
    const {
        token: {colorChartLabel,colorChartLine},
    } = theme.useToken();
    const screens = useBreakpoint();
    const chartHeight = screens.lg ? 200 : 400;

    const options = {
        responsive:true,
        maintainAspectRatio:false,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: colorChartLabel, // Change the label color on the y-axis
                },
                grid:{
                    color:colorChartLine

                }
            },
            x:{
                ticks: {
                    maxRotation: 90,       // Rotate labels to 90 degrees
                    minRotation: 90,// Ensure labels stay at 90 degrees
                    color: colorChartLabel, // Change the label color on the y-axis
                },
                grid: {
                    display: false, // Disable horizontal grid lines
                },
            }
        },
        plugins: {
            legend: {
                labels: {
                    color: colorChartLabel, // Legend label color
                },
            },
        },

    };

    const dataChart = useMemo(() => {

      const labels=  data?.map((label)=>(label.name))
        const failedTasks = data?.map(item => item.failed_tasks_count);
        const doneTasks = data?.map(item => item.done_tasks_count);
        const inProgressTasks = data?.map(item => item.in_progress_tasks_count);



        return {
            labels: labels,
            datasets: [
                {
                    label: 'Невыполненные задачи',
                    data: failedTasks, // Dataset 1
                    backgroundColor: chartColor.failed,
                },
                {
                    label: 'Выполненные задачи',
                    data: doneTasks, // Dataset 2
                    backgroundColor: chartColor.done,
                },
                {
                    label: 'Задачи в процессе выполнения',
                    data: inProgressTasks, // Dataset 3
                    backgroundColor: chartColor.progress,
                },
            ],
        }
    }, [data])

    return (
        <Card size={'small'} >
            <Bar height={chartHeight} data={dataChart} options={options}/>
        </Card>
    );
};

export default memo(AboutTagChart);