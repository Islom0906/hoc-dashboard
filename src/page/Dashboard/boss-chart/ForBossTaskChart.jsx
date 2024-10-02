import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Chart } from 'react-chartjs-2';
import {Card, Col, Row, Select, Typography} from "antd";
import dayjs from "dayjs";
import {useEffect, useState} from "react";


ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
);

const { Title:AntTitle  } = Typography;
const ForBossTaskChart = ({modules , dataChart ,setSelectYear}) => {
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
        label: 'Bar Dataset',
        data: chart?.total_tasks_count,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
      },
      {
        type: 'line',
        label: 'Line Dataset',
        data: chart?.done_tasks_count,
        fill: false,
        borderColor: 'rgb(54, 162, 235)',
      },
      {
        type: 'line',
        label: 'Line Dataset',
        data: chart?.failed_tasks_count,
        fill: false,
        borderColor: 'rgb(54, 162, 235)',
      },
    ],
  };
  const options = {
    // responsive: true,
    plugins: {
      legend: {
        position: 'top',
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