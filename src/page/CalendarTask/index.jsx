import React, {useEffect} from 'react';
import {message, Space, Spin} from 'antd';
import {useQuery} from "react-query";
import apiService from "../../service/apis/api";
import CustomCalendar from "./CustomCalendar";


const CalendarTask = () => {
    const {
        data: dataBirthDay,
        isLoading: getLoading,
        refetch: refetchBirthDay,
    } = useQuery('birthDay-get', () => apiService.getData(`/users/user-birthdays/`), {
        enabled: false,
        onError: (error) => {

            message.error(error.message);
            // Handle the error
        },
    });

    useEffect(() => {
        refetchBirthDay()
    }, []);
    return (
        <Spin spinning={getLoading}>
        <Space direction={"vertical"} size={20}>
            <h1>
                Календарь
            </h1>
            <CustomCalendar

                dataBirthDay={dataBirthDay}
            />
        </Space>
        </Spin>
    );
};


export default CalendarTask;



