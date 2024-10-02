import React, {useMemo} from 'react';
import {Pie} from "react-chartjs-2";
import {ArcElement, Chart as ChartJS, Legend, Tooltip} from 'chart.js';
import {Card} from "antd";

// Registering necessary components
ChartJS.register(ArcElement, Tooltip, Legend);
const AboutTagChart = ({tagChartData}) => {

    const data = useMemo(() => {
        const data = {
            labels: ['Red', 'Blue', 'Yellow'],
            datasets: [
                {
                    label: 'My First Dataset',
                    data: [
                        tagChartData?.done_tasks_count,
                        tagChartData.failed_tasks_count,
                        tagChartData.in_progress_tasks_count
                    ],
                    backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(54, 162, 235)',
                        'rgb(255, 205, 86)',
                    ],
                    hoverOffset: 4,
                },
            ],
        };
        return data
    }, [tagChartData])

    return (
        <Card size={'small'}>
            <Pie data={data}>

            </Pie>
        </Card>
    );
};

export default AboutTagChart;