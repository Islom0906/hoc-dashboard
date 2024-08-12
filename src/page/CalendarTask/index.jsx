import React, {useEffect,} from 'react';
import {Col, Flex, Row, Space, Spin, Typography} from 'antd';
import CustomCalendar from "./CustomCalendar";
import './calendar.scss'
import {useGetQuery} from "../../service/query/Queries";
import {FilterCompanyForAdmin} from "../../components";
import {useSelector} from "react-redux";
const {Title}=Typography

const colorMeeting={
    meeting:{
       color:'#1b1ba1',
        name: 'Встречи',
    }  ,
    birthday:{
        color:'#dde01b',
        name: 'Дни рождений',
    },
    deadline:{
        color:'#e01b2b',
        name: 'Сроки по задачам',
    }
}

const CalendarTask = () => {
    const {companyID} = useSelector(state => state.companySlice)

    // birthday
    const {
        data: dataBirthDay,
        isLoading:getBirthdayLoading,
        refetch: refetchBirthDay
    } = useGetQuery(false, 'birthDay-get', `/users/user-birthdays?company__id=${companyID}`, false)
    // meeting
    const {
        data: dataMeetting,
        isFetching:getMeetingLoading,
        refetch: refetchMeeting
    } = useGetQuery(false, 'meeting-get', `/users/meetings/?company__id=${companyID}`, false)
    // deadline
    const {
        data: dataDeadline,
        isLoading:getDeadlineLoading,
        refetch: refetchDeadline
    } = useGetQuery(false, 'deadline-get', `/users/user-deadlines-calendar/?company__id=${companyID}`, false)
    useEffect(() => {
        if(companyID !== null) {
            refetchBirthDay()
            refetchMeeting()
            refetchDeadline()
        }
    }, [companyID]);



    return (
        <Spin spinning={getBirthdayLoading||getMeetingLoading||getDeadlineLoading}>
        <Space direction={"vertical"} size={20}>
            <Row gutter={20}>
                <Col span={18}>
                    <Title level={2}>
                        Календарь
                    </Title>
                </Col>
                <FilterCompanyForAdmin/>
            </Row>
            <Flex align={'center'} gap={20}>
                <Flex align={'center'} gap={5}>
                    <span style={{width:20, height:20 , background:colorMeeting.meeting.color, borderRadius:'100%'}} />
                    <p>
                        Встречи
                    </p>

                </Flex>
                <Flex align={'center'} gap={5}>
                    <span style={{width:20, height:20 , background:colorMeeting.birthday.color, borderRadius:'100%'}} />
                    <p>
                        Дни рождений
                    </p>
                </Flex>
                <Flex align={'center'} gap={5}>
                    <span style={{width:20, height:20 , background:colorMeeting.deadline.color, borderRadius:'100%'}} />
                    <p>
                        Сроки по задачам
                    </p>
                </Flex>
            </Flex>
            <CustomCalendar
                colorMeeting={colorMeeting}
                refetchMeeting={refetchMeeting}
                dataBirthDay={dataBirthDay}
                dataMeeting={dataMeetting}
                dataDeadline={dataDeadline}
            />
        </Space>
        </Spin>
    );
};


export default CalendarTask;



