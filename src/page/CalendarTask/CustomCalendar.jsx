import React, {useMemo, useState} from 'react';
import {Badge, Calendar, Col, Row, Select, Space, Typography} from "antd";
import dayjs from "dayjs";
import ModalCalendar from "./ModalCalendar";
import {FaBirthdayCake} from "react-icons/fa";


const color={
    meeting:'#6e6efc'
}

const {Text} = Typography
const CustomCalendar = ({dataBirthDay, dataMeeting, refetchMeeting}) => {
    const [value, setValue] = useState(() => dayjs());
    const [isModalOpen, setIsModalOpen] = useState(false);

    const birthdayMap = useMemo(() => {
        return dataBirthDay?.reduce((acc, birthday) => {
            // console.log(acc)
            const key = dayjs(birthday.birthday).format('MM-DD');
            // console.log(key,acc[key])
            acc[key] = acc[key] || [];
            acc[key].push(birthday);
            return acc;
        }, {});
    }, [dataBirthDay]);

    const meetingMap = useMemo(() => {
        return dataMeeting?.reduce((acc, meeting) => {
            const key = dayjs(meeting.meeting_date).format('YYYY-MM-DD');
            acc[key] = acc[key] || [];
            acc[key].push(meeting);
            return acc;
        }, {});
    }, [dataMeeting]);

    const dateCellRender = (value) => {
        const birthdayStr = value.format('MM-DD');
        const dateStr = value.format('YYYY-MM-DD');
        let meetingsOnDate = []
        let birthdaysOnDate = []
        if (birthdayMap) {
            birthdaysOnDate = birthdayMap[birthdayStr] || [];
        }
        if (meetingMap) {
            meetingsOnDate = meetingMap[dateStr] || [];
        }

        return (
            <ul className="events">
                {birthdaysOnDate.map(birthday => (
                    <li key={birthday.id} >

                        <Text type="warning">
                            🎉  {birthday.first_name} {birthday.last_name}
                        </Text>

                    </li>
                ))}
                {meetingsOnDate.map((meeting) => (
                    <li key={`meeting-${meeting.id}`}>
                        <Text style={{color:color.meeting}}>
                            📌  {meeting.title}
                        </Text>
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
            <ModalCalendar refetchMeeting={refetchMeeting} date={value} isModalOpen={isModalOpen}
                           setIsModalOpen={setIsModalOpen}/>

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
