import {useEffect, useMemo} from "react";
import {Button, Col, Flex, Row, Select} from "antd";
import dayjs from "dayjs";

const CustomHeader = ({ value, onChange, colorMeeting, setFilterForColor, filterForColor , setFilterDate }) => {
    const year = value.year();
    const month = value.month();
    const yearRange = Array.from({ length: 2030 - 2020 }, (_, i) => 2020 + i);
    const handleYearChange = (newYear) => {
        const newValue = value.year(newYear);
        onChange(newValue);
    };
    const handleMonthChange = (newMonth) => {
        const newValue = value.month(newMonth);
        onChange(newValue);
    };
    useEffect(() => {
        setFilterDate({
            year:value.year(),
            month: value.month()+1,
        })
    } , [value])
    const selectFilter = (btn) => {
        setFilterForColor(btn);
    }
    const showBtnSelected = useMemo(() => {
        return Object.entries(colorMeeting).map(([key, obj]) => (
            <Button type={filterForColor === obj?.name ? 'primary' : 'default'} key={key}
                    onClick={() => selectFilter(obj?.name)}>
                {obj?.name}
            </Button>));
    }, [colorMeeting, filterForColor]);
    return (
        <div style={{ padding: 10 ,backgroundColor:"transparent"}} >
            <Row justify={"space-between"}>
                <Flex gap={10}>
                    <Button type={filterForColor === 'all' ? 'primary' : 'default'} onClick={() => selectFilter('all')}>
                        Все
                    </Button>
                    {showBtnSelected}
                </Flex>
                <Row gutter={10}>
                    <Col>
                        <Select
                            style={{ width: '100%',
                            }}
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
                    <Col>
                        <Select
                            style={{ width: '100px' }}
                            value={String(month)}
                            onChange={(newMonth) => handleMonthChange(Number(newMonth))}
                        >
                            {Array.from({ length: 12 }, (_, i) => i).map(month => (
                                <Select.Option key={month} value={String(month)}>
                                    {dayjs().month(month).format('MMM')}
                                </Select.Option>
                            ))}
                        </Select>
                    </Col>
                </Row>
            </Row>
        </div>
    );
};

export default CustomHeader