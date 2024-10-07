import React, {useMemo} from 'react';
import {Bar} from "react-chartjs-2";
import {Card, theme} from "antd";
import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip} from 'chart.js';
import {chartColor} from "../config.dashboard";

// Register necessary chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


const data1 = [
    {
        "id": 9,
        "name": "Hoc_ishchilari",
        "total_tasks_count": 10,
        "failed_tasks_count": 7,
        "done_tasks_count": 2,
        "in_progress_tasks_count": 1,
        "staffs": []
    },
    {
        "id": 7,
        "name": "Evolution Service",
        "total_tasks_count": 9,
        "failed_tasks_count": 4,
        "done_tasks_count": 5,
        "in_progress_tasks_count": 0,
        "staffs": []
    },
    {
        "id": 3,
        "name": "IT",
        "total_tasks_count": 15,
        "failed_tasks_count": 5,
        "done_tasks_count": 5,
        "in_progress_tasks_count": 5,
        "staffs": []
    },
    {
        "id": 6,
        "name": "Logistika",
        "total_tasks_count": 0,
        "failed_tasks_count": 0,
        "done_tasks_count": 0,
        "in_progress_tasks_count": 0,
        "staffs": []
    },
    {
        "id": 5,
        "name": "Sotuv",
        "total_tasks_count": 20,
        "failed_tasks_count": 0,
        "done_tasks_count": 18,
        "in_progress_tasks_count": 2,
        "staffs": []
    },
    {
        "id": 4,
        "name": "Bugalteriya",
        "total_tasks_count": 0,
        "failed_tasks_count": 0,
        "done_tasks_count": 0,
        "in_progress_tasks_count": 0,
        "staffs": []
    },

    {
        "id": 1,
        "name": "IT Bo'lim",
        "total_tasks_count": 7,
        "failed_tasks_count": 0,
        "done_tasks_count": 2,
        "in_progress_tasks_count": 5,
        "staffs": [
            {
                "id": 2,
                "full_name": "Bobur Berdiev Iskandar o'g'li",
                "position": "Frontend dasturchi",
                "email": "o.abduganiev@evms.uz",
                "image": "http://95.46.96.95:82/media/images/2125c2db-1420-488f-be81-98987e045ffe.png"
            },
            {
                "id": 3,
                "full_name": "Ravshan Giyosov Ilyos o'g'li",
                "position": "Backend dasturchi",
                "email": "ravshangiyosov2002@gmail.com",
                "image": "http://95.46.96.95:82/media/images/2125c2db-1420-488f-be81-98987e045ffe.png"
            },
            {
                "id": 7,
                "full_name": "Islom Abdug'ofurov Bahrom o'g'li",
                "position": "Frontend dasturchi",
                "email": "abdugofurovislom1@gmail.com",
                "image": "http://95.46.96.95:82/media/images/f912f567-4741-4289-b48a-1a5928f4cbdb.jpg"
            },
            {
                "id": 8,
                "full_name": "Bobur Berdiev Iskandar o'g'li",
                "position": "Manager",
                "email": "b.berdiev@leapmotorca.uz",
                "image": "http://95.46.96.95:82/media/images/197e24e1-a4d5-4660-bef1-ea3bf1e4e4f1.png"
            }
        ]
    }
]

const AboutTagChart = ({data}) => {
    const {
        token: {colorChartLabel,colorChartLine},
    } = theme.useToken();


    const options = {
        responsive:true,
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

      const labels=  data1?.map((label)=>(label.name))
        const failedTasks = data1?.map(item => item.failed_tasks_count);
        const doneTasks = data1?.map(item => item.done_tasks_count);
        const inProgressTasks = data1?.map(item => item.in_progress_tasks_count);
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
            <Bar data={dataChart} options={options}/>
        </Card>
    );
};

export default AboutTagChart;