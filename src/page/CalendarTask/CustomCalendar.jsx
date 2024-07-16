import React, {useMemo, useState} from 'react';
import {Calendar, Col, Popover, Row, Select, Typography} from "antd";
import dayjs from "dayjs";
import ModalCalendar from "./ModalCalendar";

import {useDispatch, useSelector} from "react-redux";
import {editIdQuery} from "../../store/slice/querySlice";


const color={
    meeting:'#6e6efc',
    deadline:'#e8284d'
}

const contentPopover=(content)=>{
    return (
        <div className={'popover-card'}>
            <p>Время: {dayjs(content.meeting_date).format("HH:mm:ss")}</p>
            <p>О чем: {content.text}</p>
        </div>
    )
}

const {Text} = Typography
const CustomCalendar = ({dataBirthDay, dataMeeting, refetchMeeting,dataDeadline,colorMeeting}) => {
    const [value, setValue] = useState(() => dayjs());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {data: {user}} = useSelector(state => state.auth)
    const dispatch = useDispatch()


    const changeMeeting = (e, id) => {
        e.stopPropagation()
        dispatch(editIdQuery(id))
        if (user?.roles[0]?.name === 'admin'){
        setIsModalOpen(true)

        }
    }

    const birthdayMap = useMemo(() => {
        return dataBirthDay?.reduce((acc, birthday) => {
            const key = dayjs(birthday.birthday).format('MM-DD');
            acc[key] = acc[key] || [];
            acc[key].push(birthday);
            return acc;
        }, {});
    }, [dataBirthDay]);

    const meetingMap = useMemo(() => {
        return dataMeeting?.reduce((acc, meeting) => {
            console.log(acc)
            const key = dayjs(meeting.meeting_date).format('YYYY-MM-DD');
            acc[key] = acc[key] || [];
            acc[key].push(meeting);
            return acc;
        }, {});
    }, [dataMeeting]);
    const deadlineMap = useMemo(() => {
        return dataDeadline?.results?.reduce((acc, deadline) => {
            console.log(acc)
            const key = dayjs(deadline.deadline).format('YYYY-MM-DD');
            acc[key] = acc[key] || [];
            acc[key].push(deadline);
            return acc;
        }, {});
    }, [dataDeadline?.results]);

    const dateCellRender = (value) => {
        const birthdayStr = value.format('MM-DD');
        const dateStr = value.format('YYYY-MM-DD');
        let meetingsOnDate = []
        let birthdaysOnDate = []
        let deadlineOnDate=[]
        if (birthdayMap) {
            birthdaysOnDate = birthdayMap[birthdayStr] || [];
        }
        if (meetingMap) {
            meetingsOnDate = meetingMap[dateStr] || [];
        }
        if (deadlineMap){
            deadlineOnDate=deadlineMap[dateStr]||[]
        }

        return (
            <ul className="events">
                {birthdaysOnDate.map(birthday => (
                    <li key={birthday.id} >

                            <div className={'color-badge'} style={{backgroundColor:colorMeeting.birthday}}></div>
                        <Text type="warning" className={''}>

                            {birthday.first_name} {birthday.last_name}
                        </Text>
                    </li>
                ))}
                {meetingsOnDate.map((meeting) => (
                    <li onClick={(e) => changeMeeting(e, meeting?.id)} key={meeting.id}>
                        <div className={'color-badge'} style={{backgroundColor: colorMeeting.meeting}}></div>
                        <Popover content={contentPopover(meeting)} title={meeting.title}>

                            <Text style={{color: color.meeting}}>
                                 {meeting.title}
                            </Text>
                        </Popover>

                    </li>
                ))}
                {deadlineOnDate.map((meeting) => (
                    <li key={meeting.id}>
                        <div className={'color-badge'} style={{backgroundColor: colorMeeting.deadline}}></div>
                        <Text style={{color: color.deadline}}>
                             {meeting.title}
                        </Text>
                    </li>
                ))}
            </ul>
        );
    };

    const onSelect = (newValue, info) => {
        if (info.source === 'date' && user?.roles[0]?.name === 'admin') {
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
            <ModalCalendar
                refetchMeeting={refetchMeeting}
                date={value}
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
            />
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
