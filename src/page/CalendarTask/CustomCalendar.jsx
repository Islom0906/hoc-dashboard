import React, {useMemo, useState} from 'react';
import {Badge, Calendar, Col, Row, Select} from "antd";
import dayjs from "dayjs";
import ModalCalendar from "./ModalCalendar";

const CustomCalendar = ({dataBirthDay}) => {
    const [value, setValue] = useState(() => dayjs());
    const [isModalOpen, setIsModalOpen] = useState(false);

    const birthdayMap = useMemo(() => {
        return dataBirthDay?.reduce((acc, birthday) => {
            const key = dayjs(birthday.birthday).format('YYYY-MM-DD');
            // const key = date.format('YYYY-MM-DD'); // get the YYYY-MM-DD format
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(birthday);
            return acc;
        }, {})
    }, [dataBirthDay])


    const dateCellRender = (value) => {
        const dateStr = value.format('YYYY-MM-DD');
        let birthdaysOnDate = []
        if (birthdayMap) {
            birthdaysOnDate = birthdayMap[dateStr] || [];

        }

        return (
            <ul className="events">

                {birthdaysOnDate.map(birthday => (
                    <li key={birthday.id}>
                        <Badge status="success" text={`${birthday.first_name} ${birthday.last_name}`}/>
                    </li>
                ))}
            </ul>
        );
    };


    const onSelect = (newValue, info) => {
        if (info.source === 'date') {
            setValue(newValue);
            setIsModalOpen(true)
        }
    };


    return (
        <>
            <Calendar
                headerRender={({value, onChange}) => (
                    <CustomHeader value={value} onChange={onChange}/>
                )}
                cellRender={dateCellRender}
                onSelect={onSelect}
            />
            <ModalCalendar value={value} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/>

        </>
    );
};

export default CustomCalendar;

const CustomHeader = ({value, onChange}) => {
    const year = value.year();
    const month = value.month();
    const yearRange = Array.from({length: 2030 - 1950 + 1}, (_, i) => 1950 + i);
    const handleYearChange = (newYear) => {
        const newValue = value.year(newYear);
        onChange(newValue);
    };

    const handleMonthChange = (newMonth) => {
        const newValue = value.month(newMonth);
        onChange(newValue);
    };

    return (
        <div style={{padding: 10}}>
            <Row gutter={8}>
                <Col offset={20} span={2}>
                    <Select
                        style={{
                            width: '100%'
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
                <Col span={2}>
                    <Select
                        style={{
                            width: '100%'
                        }}
                        value={String(month)}
                        onChange={(newMonth) => handleMonthChange(Number(newMonth))}
                    >
                        {Array.from({length: 12}, (_, i) => i).map(month => (
                            <Select.Option key={month} value={String(month)}>
                                {dayjs().month(month).format('MMM')}
                            </Select.Option>
                        ))}
                    </Select>
                </Col>
            </Row>
        </div>
    );
};
