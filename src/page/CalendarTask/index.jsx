import React, {useEffect, useMemo, useState} from 'react';
import {Col, Flex, Select, Space, Spin} from 'antd';
import CustomCalendar from "./CustomCalendar";
import './calendar.scss'
import {useGetQuery} from "../../service/query/Queries";

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
    const [selectCompanyID, setSelectCompanyID] = useState(null)

    const {
        data: getCompany,
        refetch: refetchGetCompany
    } = useGetQuery(false, 'get-company', `/users/companies`, false)

    // birthday
    const {
        data: dataBirthDay,
        isLoading:getBirthdayLoading,
        refetch: refetchBirthDay
    } = useGetQuery(false, 'birthDay-get', `/users/user-birthdays?company__id=${selectCompanyID}`, false)
    // meeting
    const {
        data: dataMeetting,
        isFetching:getMeetingLoading,
        refetch: refetchMeeting
    } = useGetQuery(false, 'meeting-get', `/users/meetings/?company__id=${selectCompanyID}`, false)
    // deadline
    const {
        data: dataDeadline,
        isLoading:getDeadlineLoading,
        refetch: refetchDeadline
    } = useGetQuery(false, 'deadline-get', `/users/user-deadlines-calendar/?company__id=${selectCompanyID}`, false)
    useEffect(() => {
        if(selectCompanyID !== null) {
            refetchBirthDay()
            refetchMeeting()
            refetchDeadline()
        }
    }, [selectCompanyID]);

    const optionsCompany = useMemo(() => {
        return getCompany?.map((option) => {
            return {
                value: option?.id,
                label: option?.title,
            };
        });
    }, [getCompany]);
    const onChangeCompany = (id) => {
        setSelectCompanyID(id)
    }

    useEffect(() => {
        refetchGetCompany()
    } , [])

    return (
        <Spin spinning={getBirthdayLoading||getMeetingLoading||getDeadlineLoading}>
        <Space direction={"vertical"} size={20}>
            <h1>
                Календарь
            </h1>

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
            <Col span={6}>
                <Select
                    style={{
                        width: '100%',
                    }}
                    placeholder='Выберите компанию'
                    optionLabelProp='label'
                    options={optionsCompany}
                    onChange={onChangeCompany}
                />
            </Col>
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



