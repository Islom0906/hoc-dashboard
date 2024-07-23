import React, {useEffect} from 'react';
import {message, Space, Spin} from 'antd';
import {useQuery} from "react-query";
import apiService from "../../service/apis/api";
import CustomCalendar from "./CustomCalendar";
import './calendar.scss'
import {useGetQuery} from "../../service/query/Queries";

const colorMeeting={
    meeting:'#1b1ba1',
    birthday:'#dde01b',
    deadline:'#e01b2b'
}

const CalendarTask = () => {
    // birthday
    const {
        data: dataBirthDay,
        isLoading:getBirthdayLoading,
        refetch: refetchBirthDay
    } = useGetQuery(false, 'birthDay-get', '/users/user-birthdays/', false)


    // meeting
    const {
        data: dataMeetting,
        isFetching:getMeetingLoading,
        refetch: refetchMeeting
    } = useGetQuery(false, 'meeting-get', '/users/meetings/', false)


    // deadline
    const {
        data: dataDeadline,
        isLoading:getDeadlineLoading,
        refetch: refetchDeadline
    } = useGetQuery(false, 'deadline-get', '/users/user-deadlines-calendar/', false)



    useEffect(() => {
        refetchBirthDay()
        refetchMeeting()
        refetchDeadline()
    }, []);
    return (
        <Spin spinning={getBirthdayLoading||getMeetingLoading||getDeadlineLoading}>
        <Space direction={"vertical"} size={20}>
            <h1>
                Календарь и Создать встречу
            </h1>
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



