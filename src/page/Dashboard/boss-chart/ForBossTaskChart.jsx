import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  LineController, BarController
} from 'chart.js';
import { Chart ,Bar} from 'react-chartjs-2';
import {Card, Col, Row, Select, theme, Typography} from "antd";
import dayjs from "dayjs";
import {memo, useEffect, useState} from "react";
import {chartColor} from "../config.dashboard";
import useBreakpoint from "antd/es/grid/hooks/useBreakpoint";


ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    BarController,
    LineController
);


const { Title:AntTitle  } = Typography;

const ForBossTaskChart = ({modules , dataChart ,setSelectYear}) => {
  const {
    token: {colorChartLabel,colorChartLine},
  } = theme.useToken();
  const screens = useBreakpoint();
  const chartHeight = screens.lg ? 200 : 400;
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
        backgroundColor: function(context) {
          const bgColor=[
              'rgba(219, 251, 222,0.9)',
              'rgba(0,236,33,0.5)'
          ]
          if (!context.chart.chartArea){
            return;
          }
          const {ctx,data,chartArea:{top,bottom}}=context.chart;
          const gradientBg=ctx.createLinearGradient(0,top,0,bottom);
          gradientBg.addColorStop(0,bgColor[0])
          gradientBg.addColorStop(1,bgColor[1])
          return gradientBg
        },
        order:2,
        tension: 0.4
      },
      {
        type: 'line',
        label: 'Невыполненные задачи',
        data: chart?.failed_tasks_count,
        fill: true, // Ensure this is set to true to fill the area under the line
        borderColor:chartColor.failed,
        backgroundColor: function(context) {
          const chart = context.chart;
          const {ctx, chartArea} = chart;
          if (!chartArea) {
            return null;
          }
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(232, 74, 74, 0.5)'); // Light red at the top
          gradient.addColorStop(1, 'rgba(232, 74, 74, 0)');   // Transparent red at the bottom
          return gradient;
        }, // Set this to a semi-transparent color for the interior,
        order:1
      },
    ],
  };


  const options = {
    responsive: true,
    // maintainAspectRatio: false,
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
      <Card size={"small"}>
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
        <Bar   data={data} options={options} />
      </Card>
  );
};

export default memo(ForBossTaskChart);