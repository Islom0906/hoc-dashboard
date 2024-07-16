import React, {useEffect} from 'react';
import {message, Space, Spin} from 'antd';
import {useQuery} from "react-query";
import apiService from "../../service/apis/api";
import CustomCalendar from "./CustomCalendar";
import './calendar.scss'

const colorMeeting={
    meeting:'#1b1ba1',
    birthday:'#dde01b',
    deadline:'#e01b2b'
}

const CalendarTask = () => {
    // birthday
    const {
        data: dataBirthDay,
        isLoading: getBirthdayLoading,
        refetch: refetchBirthDay,
    } = useQuery('birthDay-get', () => apiService.getData(`/users/user-birthdays/`), {
        enabled: false,
        onError: (error) => {

            message.error(error.message);
            // Handle the error
        },
    });
    // meeting
    const {
        data: dataMeetting,
        isLoading: getMeetingLoading,
        refetch: refetchMeeting,
    } = useQuery('meeting-get', () => apiService.getData(`/users/meetings/`), {
        enabled: false,
        onError: (error) => {

            message.error(error.message);
            // Handle the error
        },
    });
    // meeting
    const {
        data: dataDeadline,
        isLoading: getDeadlineLoading,
        refetch: refetchDeadline,
    } = useQuery('deadline-get', () => apiService.getData(`/users/user-deadlines-calendar/`), {
        enabled: false,
        onError: (error) => {

            message.error(error.message);
            // Handle the error
        },
    });
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



