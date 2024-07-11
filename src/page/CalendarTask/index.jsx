import React, {useEffect} from 'react';
import {message, Space, Spin} from 'antd';
import {useQuery} from "react-query";
import apiService from "../../service/apis/api";
import CustomCalendar from "./CustomCalendar";
import './calendar.scss'

const CalendarTask = () => {
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

    useEffect(() => {
        refetchBirthDay()
        refetchMeeting()
    }, []);
    return (
        <Spin spinning={getBirthdayLoading||getMeetingLoading}>
        <Space direction={"vertical"} size={20}>
            <h1>
                Calendar
            </h1>
            <CustomCalendar
                refetchMeeting={refetchMeeting}
                dataBirthDay={dataBirthDay}
                dataMeeting={dataMeetting}
            />
        </Space>
        </Spin>
    );
};


export default CalendarTask;



