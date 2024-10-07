import {Col, Select} from "antd";
import dayjs from "dayjs";
import {currentYear , currentMonth} from "../../helper/time.helper";
const Index = ({valueYear, setValueYear, setValueMonth, valueMonth}) => {
  const handleYearChange = (newYear) => {
    setValueYear(newYear);
  };

  const handleMonthChange = (newMonth) => {
    setValueMonth(newMonth);
  };



  return (
      <>
        <Col span={6}>
          <Select
              style={{ width: "100%" }}
              value={dayjs().month(valueMonth).format("MMM")}
              onChange={handleMonthChange}
          >
            {Array.from({ length: 12 }, (_, i) => i).map((month) => (
                <Select.Option key={month} value={String(month)}>
                  {dayjs().month(month).format("MMM")}
                </Select.Option>
            ))}
          </Select>
        </Col>
        <Col span={6}>
          <Select
              style={{ width: "100%" }}
              value={valueYear}
              onChange={handleYearChange}
          >
            {Array.from({ length: 10 }, (_, i) => currentYear - i).map((year) => (
                <Select.Option key={year} value={year}>
                  {year}
                </Select.Option>
            ))}
          </Select>
        </Col>
      </>

  );
};

export default Index;