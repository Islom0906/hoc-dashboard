import React, {useEffect, useMemo, useState,} from 'react';
import {Button, Col, Flex, Row, Select, Spin, theme, Typography} from 'antd';
import CustomCalendar from "./CustomCalendar";
import './calendar.scss'
import {useGetQuery} from "../../service/query/Queries";
import {useSelector} from "react-redux";
import {FaFileDownload} from "react-icons/fa";
import {FaUsersViewfinder} from "react-icons/fa6";
import {GrTask} from "react-icons/gr";
import {LiaBirthdayCakeSolid} from "react-icons/lia";

const {Title} = Typography

const colorMeeting = {
    meeting: {
        name: 'Встречи',
        icon:<FaUsersViewfinder style={{fontSize:16}}/>
    },
    birthday: {
        name: 'Дни рождений',
        icon:<LiaBirthdayCakeSolid style={{fontSize:16}}/>
    },
    deadline: {
        name: 'Сроки по задачам',
        icon:<GrTask style={{fontSize:16}}/>
    }
}

const CalendarTask = () => {
    const [filterDate, setFilterDate] = useState({
        year: '',
        month: ''
    })
    const [companyId, setCompanyId] = useState("")
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
        `/users/user-birthdays?` +
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
        if (filterDate?.year !== '' && filterDate?.month !== '') {
            refetchBirthDay()
            refetchMeeting()
            refetchDeadline()
        }
    }, [ filterDate.year, filterDate.month]);
    useEffect(() => {
        if (companyData) {
            refetchMeeting()
            refetchDeadline()
        }
    }, [companyId]);
    useEffect(() => {
        refetchCompanyData()
    }, []);



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
                <Row gutter={[10,10]}>
                    <Col span={24} sm={16}>
                        <Title className={'page--title'} level={2} style={{marginBottom:0}}>
                            Календарь
                        </Title>
                    </Col>
                    <Col span={24} sm={8}>
                        <Row gutter={5} >
                            <Col span={16}>

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
                            <Col span={8}>
                            <Button
                                style={{width:'100%'}}                  href={`${process.env.REACT_APP_CALENDAR_EXCEL_EXPORT_API_URL}?${companyId ? `company_id=${companyId}` : ''}${
                                    filterDate?.year && filterDate?.year !== 'null' ? `&year=${filterDate.year}` : ''
                                }${filterDate?.month && filterDate?.month !== 'null' ? `&month=${filterDate.month}` : ''}`}
                            >
                                <FaFileDownload />
                            </Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Flex align={'center'}  className={'info-tags'}>
                    <Flex align={'center'} gap={5}>
                        <span className={'info-tag'} style={{
                            background: meetingBorderColor,

                        }}/>
                        <p className={'info-tag-name'}>
                            {colorMeeting.meeting.name}
                        </p>
                    </Flex>
                    <Flex align={'center'} gap={5}>
                        <span className={'info-tag'} style={{
                            background: birthdayBorderColor,

                        }}/>
                        <p className={'info-tag-name'}>
                            {colorMeeting.birthday.name}
                        </p>
                    </Flex>
                    <Flex align={'center'} gap={5}>
                        <span className={'info-tag'} style={{


                            background: deadlineBorderColor,

                        }}/>
                        <p className={'info-tag-name'}>
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



