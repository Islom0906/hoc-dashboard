import React, {useEffect, useState,} from 'react';
import {Col, Flex, Row, Spin, theme, Typography} from 'antd';
import CustomCalendar from "./CustomCalendar";
import './calendar.scss'
import {useGetQuery} from "../../service/query/Queries";
import {useSelector} from "react-redux";

const {Title} = Typography

const colorMeeting = {
    meeting: {
        name: 'Встречи',
    },
    birthday: {
        name: 'Дни рождений',
    },
    deadline: {
        name: 'Сроки по задачам',
    }
}

const CalendarTask = () => {
    const [filterDate, setFilterDate] = useState({
        year: '',
        month: ''
    })
    const {systemMode}=useSelector(state => state.theme)
    const {
        token: {
            meetingBorderColor,
            meetingBgColor,
            birthdayBorderColor,
            birthdayBgColor,
            deadlineBorderColor,
            deadlineBgColor,
            tableBorder
        },
    } = theme.useToken();

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



    useEffect(() => {
        // Set CSS variables for dark mode
        document.documentElement.style.setProperty('--meetingBorderColor', meetingBorderColor);
        document.documentElement.style.setProperty('--meetingBgColor', meetingBgColor);
        document.documentElement.style.setProperty('--birthdayBorderColor', birthdayBorderColor);
        document.documentElement.style.setProperty('--birthdayBgColor', birthdayBgColor);
        document.documentElement.style.setProperty('--deadlineBorderColor', deadlineBorderColor);
        document.documentElement.style.setProperty('--deadlineBgColor', deadlineBgColor);
        document.documentElement.style.setProperty('--tableBorder', tableBorder);

    }, [systemMode]);
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
                            background: meetingBorderColor,
                            borderRadius: '4px'
                        }}/>
                        <p>
                            {colorMeeting.meeting.name}
                        </p>
                    </Flex>
                    <Flex align={'center'} gap={5}>
                        <span style={{
                            width: 20,
                            height: 20,
                            background: birthdayBorderColor,
                            borderRadius: '4px'
                        }}/>
                        <p>
                            {colorMeeting.birthday.name}
                        </p>
                    </Flex>
                    <Flex align={'center'} gap={5}>
                        <span style={{
                            width: 20,
                            height: 20,
                            background: deadlineBorderColor,
                            borderRadius: '4px'
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



