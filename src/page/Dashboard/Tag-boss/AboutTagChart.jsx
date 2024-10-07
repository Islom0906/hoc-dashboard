import React, {useMemo} from 'react';
import {Bar} from "react-chartjs-2";
import {Card} from "antd";
import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip} from 'chart.js';

// Register necessary chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const options = {
    scales: {
        y: {
            beginAtZero: true,
        },
    },
};

const AboutTagChart = ({data}) => {
    const yearRange = Array.from({ length: 2030 - 2020 }, (_, i) => 2020 + i);

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
                    backgroundColor: 'rgba(240, 79, 71, 0.2)',
                    borderColor: 'rgb(240, 79, 71)',
                    borderWidth: 1,
                },
                {
                    label: 'Выполненные задачи',
                    data: doneTasks, // Dataset 2
                    backgroundColor: 'rgba(17, 193, 91, 0.2)',
                    borderColor: 'rgb(17, 193, 91)',
                    borderWidth: 1,
                },
                {
                    label: 'Задачи в процессе выполнения',
                    data: inProgressTasks, // Dataset 3
                    backgroundColor: 'rgba(10, 143, 220, 0.2)',
                    borderColor: 'rgb(10, 143, 220)',
                    borderWidth: 1,
                },
            ],
        }
    }, [data])

    return (
        <Card size={'small'} >
            <Bar data={dataChart} options={options}/>
        </Card>
    );
};

export default AboutTagChart;