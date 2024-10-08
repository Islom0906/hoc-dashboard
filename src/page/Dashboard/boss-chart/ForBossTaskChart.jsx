import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend,Filler } from 'chart.js';
import { Chart } from 'react-chartjs-2';
import {Card, Col, Row, Select, theme, Typography} from "antd";
import dayjs from "dayjs";
import {useEffect, useState} from "react";
import {chartColor} from "../config.dashboard";


ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    Filler
);
const data1 = [
  {
    "year": 2024,
    "month": 1,
    "in_progress_tasks_count": 5,
    "total_tasks_count": 7,
    "done_tasks_count": 2,
    "failed_tasks_count": 0
  },
  {
    "year": 2024,
    "month": 2,
    "in_progress_tasks_count": 3,
    "total_tasks_count": 6,
    "done_tasks_count": 2,
    "failed_tasks_count": 1
  },
  {
    "year": 2024,
    "month": 3,
    "in_progress_tasks_count": 4,
    "total_tasks_count": 5,
    "done_tasks_count": 1,
    "failed_tasks_count": 0
  },
  {
    "year": 2024,
    "month": 4,
    "in_progress_tasks_count": 6,
    "total_tasks_count": 8,
    "done_tasks_count": 3,
    "failed_tasks_count": 1
  },
  {
    "year": 2024,
    "month": 5,
    "in_progress_tasks_count": 2,
    "total_tasks_count": 3,
    "done_tasks_count": 1,
    "failed_tasks_count": 0
  },
  {
    "year": 2024,
    "month": 6,
    "in_progress_tasks_count": 7,
    "total_tasks_count": 10,
    "done_tasks_count": 2,
    "failed_tasks_count": 1
  },
  {
    "year": 2024,
    "month": 7,
    "in_progress_tasks_count": 1,
    "total_tasks_count": 2,
    "done_tasks_count": 0,
    "failed_tasks_count": 0
  },
  {
    "year": 2024,
    "month": 8,
    "in_progress_tasks_count": 0,
    "total_tasks_count": 4,
    "done_tasks_count": 3,
    "failed_tasks_count": 1
  },
  {
    "year": 2024,
    "month": 9,
    "in_progress_tasks_count": 7,
    "total_tasks_count": 10,
    "done_tasks_count": 3,
    "failed_tasks_count": 0
  },
  {
    "year": 2024,
    "month": 10,
    "in_progress_tasks_count": 3,
    "total_tasks_count": 4,
    "done_tasks_count": 1,
    "failed_tasks_count": 0
  },
  {
    "year": 2024,
    "month": 11,
    "in_progress_tasks_count": 4,
    "total_tasks_count": 5,
    "done_tasks_count": 1,
    "failed_tasks_count": 1
  },
  {
    "year": 2024,
    "month": 12,
    "in_progress_tasks_count": 2,
    "total_tasks_count": 3,
    "done_tasks_count": 1,
    "failed_tasks_count": 0
  }
];


const { Title:AntTitle  } = Typography;

const ForBossTaskChart = ({modules , dataChart ,setSelectYear}) => {
  const {
    token: {colorChartLabel,colorChartLine},
  } = theme.useToken();

  const value = dayjs()
  const year = value.year();
  const month = value.month();
  const [chart , setChart] = useState({
    total_tasks_count : null,
    done_tasks_count : null,
    failed_tasks_count: null
  })
  const yearRange = Array.from({ length: 2030 - 2020 },(_, i) => 2020 + i);
  const mountName = Array.from({ length: 12 }, (_, i) => i).map(month => (
        dayjs().month(month).format('MMM')
  ))


  useEffect(() => {
    if (dataChart) {
      console.log('dataChart' , dataChart)
      const aggregatedData = {
        total_tasks_count: [],
        done_tasks_count: [],
        failed_tasks_count: []
      };
      dataChart.forEach(item => {
        aggregatedData.total_tasks_count.push(item.total_tasks_count || 0);
        aggregatedData.done_tasks_count.push(item.done_tasks_count || 0);
        aggregatedData.failed_tasks_count.push(item.failed_tasks_count || 0);
        return aggregatedData
      });

      console.log(aggregatedData)
      setChart({total_tasks_count: aggregatedData.total_tasks_count ,done_tasks_count: aggregatedData.done_tasks_count , failed_tasks_count: aggregatedData.failed_tasks_count});
    }
  }, [dataChart]);



  const data = {
    labels: mountName,
    datasets: [
      {
        type: 'bar',
        label: 'Все задачи',
        data: chart?.total_tasks_count,
        backgroundColor: chartColor.progress,
        order:3
      },
      {
        type: 'line',
        label: 'Выполненные задачи',
        data: chart?.done_tasks_count,
        fill: true, // Ensure this is set to true to fill the area under the line
        backgroundColor: chartColor.done+'90', // Set this to a semi-transparent color for the interior,
        order:2,
        tension: 0.4
      },
      {
        type: 'line',
        label: 'Невыполненные задачи',
        data: chart?.failed_tasks_count,
        fill: false, // Ensure this is set to true to fill the area under the line
        borderColor:chartColor.failed,
        backgroundColor: chartColor.failed, // Set this to a semi-transparent color for the interior,
        order:1
      },
    ],
  };


  const options = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: colorChartLabel, // Change the label color on the y-axis
        },
        grid: {
          color: colorChartLine,
        },
      },
      x: {
        ticks: {
          color: colorChartLabel, // Change the label color on the x-axis
        },
        grid: {
          display: false, // Disable horizontal grid lines
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: colorChartLabel, // Legend label color
        },
      },
    },
  };
  const handleYearChange = (newYear) => {
    const newValue = value.year(newYear);
    setSelectYear(newValue)
    // onChange(newValue);
  };

  const handleMonthChange = (newMonth) => {
    const newValue = value.month(newMonth);
    // onChange(newValue);
  };
  return (
      <Card>

        <Row gutter={10} justify={"space-between"}>
          <Col span={6}>
            <AntTitle level={4} style={{marginBottom:0}}>
              {modules}
            </AntTitle>
          </Col>
          <Col>
            <Select
                style={{ width: '100%' }}
                className="my-year-select"
                value={String(year)}
                onChange={(newYear) => handleYearChange(Number(newYear))}
            >
              {yearRange.map(year => (
                  <Select.Option key={year} value={String(year)}>
                    {year}
                  </Select.Option>
              ))}
            </Select>
          </Col>
          {/*<Col>*/}
          {/*  <Select*/}
          {/*      style={{ width: '100px' }}*/}
          {/*      value={String(month)}*/}
          {/*      onChange={(newMonth) => handleMonthChange(Number(newMonth))}*/}
          {/*  >*/}

          {/*    {*/}
          {/*      mountName?.map(mount => (*/}
          {/*          <Select.Option key={month} value={String(month)}>*/}
          {/*            {mount}*/}
          {/*          </Select.Option>*/}
          {/*      ))*/}
          {/*    }*/}

          {/*  </Select>*/}
          {/*</Col>*/}
        </Row>
        <Chart type="bar" style={{height:400 , width:'100%'}} data={data} options={options} />
      </Card>
  );
};

export default ForBossTaskChart;