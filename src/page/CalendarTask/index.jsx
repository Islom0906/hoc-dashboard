import React, {useEffect, useMemo, useState,} from 'react';
import {Col, Flex, Row, Select, Spin, theme, Typography} from 'antd';
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
    const [companyId, setCompanyId] = useState(null)
    const {systemMode}=useSelector(state => state.theme)
    const {
        token: {
            meetingBorderColor,
            meetingBgColor,
            birthdayBorderColor,
            birthdayBgColor,
            deadlineBorderColor,
            deadlineBgColor,
            tableBorder,activeDay
        },
    } = theme.useToken();

    const {
        data: companyData,
        refetch: refetchCompanyData,
        isSuccess:successCompany
    } = useGetQuery(false, 'get-company-meeting-filter', `users/companies`, false)
    // birthday
    const {
        data: dataBirthDay,
        isLoading: getBirthdayLoading,
        refetch: refetchBirthDay
    } = useGetQuery(false, 'birthDay-get',
        `/users/user-birthdays?${companyId && `company__id=${companyId}`}` +
        (filterDate?.month !== 'null' ? `&month=${filterDate?.month}` : ''), false)
    // meeting
    const {
        data: dataMeetting,
        isFetching: getMeetingLoading,
        refetch: refetchMeeting
    } = useGetQuery(false, 'meeting-get', `/users/meetings/?${companyId && `company__id=${companyId}`}` +
        (filterDate?.year !== 'null' ? `&year=${filterDate?.year}` : '') +
        (filterDate?.month !== 'null' ? `&month=${filterDate?.month}` : ''), false)
    // deadline
    const {
        data: dataDeadline,
        isLoading: getDeadlineLoading,
        refetch: refetchDeadline
    } = useGetQuery(false, 'deadline-get', `/users/user-deadlines-calendar/?${companyId && `company__id=${companyId}`}` +
        (filterDate?.year !== 'null' ? `&year=${filterDate?.year}` : '') +
        (filterDate?.month !== 'null' ? `&month=${filterDate?.month}` : ''), false)
    useEffect(() => {
        if (companyData&&filterDate?.year !== '' && filterDate?.month !== '') {
            refetchBirthDay()
            refetchMeeting()
            refetchDeadline()
        }
    }, [companyId, filterDate.year, filterDate.month]);

    useEffect(() => {
        refetchCompanyData()
    }, []);

    useEffect(() => {
        if (successCompany){
            setCompanyId(companyData[0]?.id)
        }
    }, [companyData]);

    useEffect(() => {
        // Set CSS variables for dark mode
        document.documentElement.style.setProperty('--meetingBorderColor', meetingBorderColor);
        document.documentElement.style.setProperty('--meetingBgColor', meetingBgColor);
        document.documentElement.style.setProperty('--birthdayBorderColor', birthdayBorderColor);
        document.documentElement.style.setProperty('--birthdayBgColor', birthdayBgColor);
        document.documentElement.style.setProperty('--deadlineBorderColor', deadlineBorderColor);
        document.documentElement.style.setProperty('--deadlineBgColor', deadlineBgColor);
        document.documentElement.style.setProperty('--tableBorder', tableBorder);
        document.documentElement.style.setProperty('--activeDayBackground', activeDay);

    }, [systemMode]);



    const optionsCompany = useMemo(() => {
        let data=[{
            value: "",
            label: "Все"
        }]
         companyData?.map(company => {
             data.push({
                 value: company?.id,
                 label: company?.title
             })
         })
        return data
    }, [companyData]);

    const onChangeCompany=(value)=>{
        setCompanyId(value)
    }

    return (
        <Spin spinning={getBirthdayLoading || getMeetingLoading || getDeadlineLoading}>
            <Flex gap={10} vertical={true} className={'calendar-card'}>
                <Row gutter={20}>
                    <Col span={18}>
                        <Title level={2} style={{marginBottom:0}}>
                            Календарь
                        </Title>
                    </Col>
                    <Col span={6}>

                        <Select
                            style={{
                                width: '100%',
                            }}
                            value={companyId}
                            placeholder='Выберите компания'
                            optionLabelProp='label'
                            onChange={onChangeCompany}
                            options={optionsCompany}
                        />
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



