import {useEffect, useMemo} from "react";
import {Button, Col, Flex, Row, Select} from "antd";
import dayjs from "dayjs";
import useBreakpoint from "antd/es/grid/hooks/useBreakpoint";

const CustomHeader = ({ value, onChange, colorMeeting, setFilterForColor, filterForColor , setFilterDate }) => {
    const screens = useBreakpoint();
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
            <Button className={'calendar-filter-button'} type={filterForColor === obj?.name ? 'primary' : 'default'}
                    key={key}
                    onClick={() => selectFilter(obj?.name)}>
                <Flex align={"center"} gap={3}>

                    {obj.icon}
                    {
                        screens.md &&
                        <p>
                {obj?.name}
                        </p>
                    }
                </Flex>

            </Button>));
    }, [colorMeeting, filterForColor,screens]);
    return (
        <div style={{ backgroundColor:"transparent"}} >
            <Row gutter={[10,10]} justify={"space-between"}>
                <Col span={24} md={16}>
                    <Flex className={'calendar-filter'}>
                        <Button className={'calendar-filter-button'} type={filterForColor === 'all' ? 'primary' : 'default'}
                                onClick={() => selectFilter('all')}>
                            <p>Все</p>
                        </Button>
                        {showBtnSelected}
                    </Flex>
                </Col>
               <Col span={24} md={8}>
                   <Row justify={"end"} gutter={10}>
                       <Col span={12}>
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
                       <Col span={12}>
                           <Select
                               style={{ width: '100%' }}
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
               </Col>

            </Row>
        </div>
    );
};

export default CustomHeader