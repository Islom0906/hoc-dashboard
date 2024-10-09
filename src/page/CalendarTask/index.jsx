import React, {useEffect, useState,} from 'react';
import {Col, Flex, Row, Spin, Typography} from 'antd';
import CustomCalendar from "./CustomCalendar";
import './calendar.scss'
import {useGetQuery} from "../../service/query/Queries";
import {useSelector} from "react-redux";

const {Title} = Typography

const colorMeeting = {
    meeting: {
        color: '#1b1ba1',
        name: 'Встречи',
    },
    birthday: {
        color: '#dde01b',
        name: 'Дни рождений',
    },
    deadline: {
        color: '#e01b2b',
        name: 'Сроки по задачам',
    }
}

const CalendarTask = () => {
    const [filterDate, setFilterDate] = useState({
        year: '',
        month: ''
    })

    const {companyID} = useSelector(state => state.companySlice)

    // birthday
    const {
        data: dataBirthDay,
        isLoading: getBirthdayLoading,
        refetch: refetchBirthDay
    } = useGetQuery(false, 'birthDay-get',
        `/users/user-birthdays?company__id=${companyID}` +
        (filterDate?.month !== 'null' ? `&month=${filterDate?.month}` : ''), false)


    // meeting
    const {
        data: dataMeetting,
        isFetching: getMeetingLoading,
        refetch: refetchMeeting
    } = useGetQuery(false, 'meeting-get', `/users/meetings/?company__id=${companyID}` +
        (filterDate?.year !== 'null' ? `&year=${filterDate?.year}` : '') +
        (filterDate?.month !== 'null' ? `&month=${filterDate?.month}` : ''), false)
    // deadline
    const {
        data: dataDeadline,
        isLoading: getDeadlineLoading,
        refetch: refetchDeadline
    } = useGetQuery(false, 'deadline-get', `/users/user-deadlines-calendar/?company__id=${companyID}` +
        (filterDate?.year !== 'null' ? `&year=${filterDate?.year}` : '') +
        (filterDate?.month !== 'null' ? `&month=${filterDate?.month}` : ''), false)
    useEffect(() => {
        if (companyID !== null && filterDate?.year !== '' && filterDate?.month !== '') {
            refetchBirthDay()
            refetchMeeting()
            refetchDeadline()
        }
    }, [companyID, filterDate.year, filterDate.month]);
    return (
        <Spin spinning={getBirthdayLoading || getMeetingLoading || getDeadlineLoading}>
            <Flex gap={10} vertical={true} className={'calendar-card'}>
                <Row gutter={20}>
                    <Col span={18}>
                        <Title level={2} style={{marginBottom:0}}>
                            Календарь
                        </Title>
                    </Col>
                </Row>
                <Flex align={'center'} gap={20}>
                    <Flex align={'center'} gap={5}>
                        <span style={{
                            width: 20,
                            height: 20,
                            background: colorMeeting.meeting.color,
                            borderRadius: '100%'
                        }}/>
                        <p>
                            {colorMeeting.meeting.name}
                        </p>
                    </Flex>
                    <Flex align={'center'} gap={5}>
                        <span style={{
                            width: 20,
                            height: 20,
                            background: colorMeeting.birthday.color,
                            borderRadius: '100%'
                        }}/>
                        <p>
                            {colorMeeting.birthday.name}
                        </p>
                    </Flex>
                    <Flex align={'center'} gap={5}>
                        <span style={{
                            width: 20,
                            height: 20,
                            background: colorMeeting.deadline.color,
                            borderRadius: '100%'
                        }}/>
                        <p>
                            {colorMeeting.deadline.name}
                        </p>
                    </Flex>
                </Flex>
                    <CustomCalendar
                        setFilterDate={setFilterDate}
                        colorMeeting={colorMeeting}
                        refetchMeeting={refetchMeeting}
                        dataBirthDay={dataBirthDay}
                        dataMeeting={dataMeetting}
                        dataDeadline={dataDeadline}
                    />

            </Flex>
        </Spin>
    );
};


export default CalendarTask;



