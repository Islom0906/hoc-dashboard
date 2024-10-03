import {Avatar, Col, Flex, Progress, Row, Select, Table} from "antd";
import React, {useEffect, useState} from "react";
import AvatarUserProfile from "../../../components/AvatarUserProfile/AvatarUserProfile";
import {UserOutlined} from "@ant-design/icons";
import {currentYear, fromNowYear} from "../../../helper/time.helper";
import dayjs from "dayjs";
import {useDispatch} from "react-redux";
import {selectModuls} from "../../../store/slice/modulsSlice";

const AboutTagList = ({data, setModulID,valueYear,setValueYear,setValueMonth,valueMonth}) => {
    const dispatch=useDispatch()
    useEffect(() => {
        if (data) {
            setModulID(data[0]?.id)
        }
    }, [data]);

    const calculateProgressData = (doneTasks, failedTasks, inProgressTasks, totalTasks) => {

        // Calculate percentage
        const percent = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

        if (totalTasks === 0) {
            return {
                failedPercent: 0,
                donePercent: 0,
                inProgressPercent: 0,
                percent: 0
            };
        }

        const failedPercent = Math.round((failedTasks / totalTasks) * 100);
        const donePercent = Math.round((doneTasks / totalTasks) * 100);
        const inProgressPercent = Math.round((inProgressTasks / totalTasks) * 100);
        console.log({percent, failedPercent, donePercent, inProgressPercent})
        return {percent, failedPercent, donePercent, inProgressPercent};

    }

    const handleYearChange = (newYear) => {
        console.log(newYear)
        // const newValue = value.year(newYear);
        // setValue(newValue);
        setValueYear(newYear)
    };
    const handleMonthChange = (newMonth) => {
        console.log(newMonth)
        // const newValue = value.year(newYear);
        // setValue(newValue);
        setValueMonth(newMonth)
    };

    const columns = [
        {
            title: 'Название компании',
            dataIndex: 'name',
            id: 'name',
            render: (text, record) => {
                const {percent, failedPercent, donePercent, inProgressPercent} = calculateProgressData(
                    record?.done_tasks_count,
                    record?.failed_tasks_count,
                    record?.in_progress_tasks_count,
                    record?.total_tasks_count
                );
                return (
                    <Flex align={'center'} gap={10}>
                        <Progress
                            size={40}
                                type="circle"
                            percent={percent}
                            strokeColor={'#11c15b'}
                            />


                        <p>{text}</p>
                    </Flex>
                )
            },
        },
        {
            title: 'Работники отдела',
            dataIndex: 'staffs',
            id: 'staffs',
            render: (avatar) => {
                return (
                    <Avatar.Group size={30} max={{
                        count: 2,

                        style: {

                            color: '#f56a00',
                            backgroundColor: '#fde3cf',
                        },
                    }}>
                        {
                            avatar?.length >0 ?
                            avatar?.map((staff) => (

                                <AvatarUserProfile key={staff?.id} size={30} full_name={staff?.full_name} image={staff?.image}/>
                            ))
                                :
                                <Avatar size={30} icon={<UserOutlined />} />
                        }

                    </Avatar.Group>
                )
            },
        },

    ];

    const handleRow = (record) => {
        dispatch(selectModuls(record?.id))
        setModulID(record?.id)
    }
    return <Table
        onRow={(record, rowIndex) => {
            return {
                onClick: () => handleRow(record), // click row

            };
        }}
        columns={columns}
        dataSource={data}
        size={"small"}
        rowKey={(record) => record.id}
        title={() => <Row gutter={5}>
            <Col span={12}>
                'Информация о компании'
            </Col>
            <Col span={6}>
                <Select
                    style={{width: '100%'}}
                    className="my-year-select"
                    value={dayjs().month(valueMonth).format('MMM')}
                    onChange={(newMonth) => handleMonthChange(newMonth)}
                >
                    {Array.from({ length: 12 }, (_, i) => i).map(month => (
                        <Select.Option key={month} value={String(month)}>
                            {dayjs().month(month).format('MMM')}
                        </Select.Option>
                    ))}
                </Select>
            </Col>
            <Col span={6}>
                <Select
                    style={{width: '100%'}}
                    className="my-year-select"
                    value={valueYear}
                    onChange={(newYear) => handleYearChange(newYear)}
                >
                    {fromNowYear.map(year => (
                        <Select.Option key={year} value={year}>
                            {year}
                        </Select.Option>
                    ))}
                </Select>
            </Col>
        </Row>

        }
        scroll={{
            y: 80 * 5
        }}
    />
};

export default AboutTagList;