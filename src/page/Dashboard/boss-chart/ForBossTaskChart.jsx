import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Chart } from 'react-chartjs-2';
import {Card, Col, Row, Select, Typography} from "antd";
import dayjs from "dayjs";

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
const ForBossTaskChart = ({modules}) => {
  const value = dayjs()
  const year = value.year();
  const month = value.month();
  const yearRange = Array.from({ length: 2030 - 2020 },(_, i) => 2020 + i);

  console.log(month)

  console.log(modules)
  const mountName = Array.from({ length: 12 }, (_, i) => i).map(month => (
        dayjs().month(month).format('MMM')
  ))


  const data = {
    labels: mountName,
    datasets: [
      {
        type: 'bar',
        label: 'Bar Dataset',
        data: [10, 20, 30, 40],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
      },
      {
        type: 'line',
        label: 'Line Dataset',
        data: [[3, 30], 15, 20,33],
        fill: false,
        borderColor: 'rgb(54, 162, 235)',
      },
      {
        type: 'line',
        label: 'Line Dataset',
        data: [0, 25, 0,43],
        fill: false,
        borderColor: 'rgb(54, 162, 235)',
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Mixed Bar and Line Chart',
      },
    },
  };

  const handleYearChange = (newYear) => {
    const newValue = value.year(newYear);
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