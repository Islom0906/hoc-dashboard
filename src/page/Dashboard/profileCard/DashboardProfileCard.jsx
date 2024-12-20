import {Avatar, Card, Typography, Tabs, theme, Tag, Flex} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { selectCompany, selectCompanyName } from "../../../store/slice/companySlice";
import { useDispatch } from "react-redux";
import './profile-card.scss';
import {memo} from "react";

ChartJS.register(ArcElement, Tooltip, Legend);

const { Title, Text } = Typography;

const DashboardProfileCard = ({ companyIDSlice, companyID, title, image, fullName, position, total_tasks_count, done_tasks_count, in_progress_tasks_count, failed_tasks_count, responsible_tasks_count }) => {
    const dispatch = useDispatch();
    const handlerCompanyId = () => {
        if (companyID && fullName) {
            dispatch(selectCompany(companyID));
            dispatch(selectCompanyName(fullName));
        }
    };


    const {
        token: {
            allTask,
            allTaskHover,
            doneTask,
            doneTaskHover,
            progressTask,
            progressTaskHover,
            failedTask,
            failedTaskHover,
            responsibleTask,
            responsibleTaskHover
        }
    } = theme.useToken();

    const chartData = {
        labels: ['Сделанный', 'В процессе', 'Неуспешный', 'Ответственная задача'],
        datasets: [
            {
                data: [done_tasks_count || 0, in_progress_tasks_count || 0, failed_tasks_count || 0, responsible_tasks_count || 0],
                backgroundColor: [doneTask, progressTask, failedTask, responsibleTask],
                hoverBackgroundColor: [doneTaskHover, progressTaskHover, failedTaskHover, responsibleTaskHover],
                borderRadius: 7,
                spacing: 5
            },
        ],
    };

    const options = {
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    pointStyle: "circle",
                },
            },
        },
        responsive: true,
        cutout: '50%',
    };

    const items = [
        {
            key: "1",
            label: <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>Статистика</span>,
            children: (
                <div className="statistics">
                    {/*{total_tasks_count}*/}
                    <div className={'statistics'}>
                        <Flex align={"center"} justify={"space-between"} gap={5}
                              className={'statistics-item'}
                              style={{borderBottom: '1px solid #DADCDD'}}>
                            <Flex gap={10} align={"center"}>
                                <div style={{
                                    width: 16,
                                    height: 16,
                                    borderRadius: '100%',
                                    backgroundColor: allTask
                                }}/>
                                <Text style={{margin: 0, fontSize: 12}}>Все задачи</Text>
                            </Flex>
                            <Tag color={allTaskHover}
                                 style={{fontSize: '14px', color: allTask, fontWeight: 600, padding: '2px 10px'}}>
                                {total_tasks_count || 0}
                            </Tag>
                        </Flex>
                        <Flex gap={5} align={"center"} justify={"space-between"}
                              className={'statistics-item'}
                              style={{
                                  borderBottom: '1px solid #DADCDD',
                                  color: '#11c15b'
                              }}>
                            <Flex gap={10} align={"center"}>
                                <div style={{
                                    width: 16,
                                    height: 16,
                                    borderRadius: '100%',
                                    backgroundColor: doneTask
                                }}/>
                                <Text style={{margin: 0, fontSize: 14, color: '#11c15b'}}>Сделанный</Text>
                            </Flex>
                            <Tag color={doneTaskHover}
                                 style={{fontSize: '14px', color: doneTask, fontWeight: 600, padding: '2px 10px'}}>
                                {done_tasks_count || 0}
                            </Tag>
                        </Flex>

                        <Flex gap={5} align={"center"} justify={'space-between'}
                              className={'statistics-item'}
                              style={{
                                  borderBottom: '1px solid #DADCDD',
                                  color: 'rgb(10, 143, 220)'
                              }}>
                            <Flex gap={10} align={"center"}>
                                <div style={{
                                    width: 16,
                                    height: 16,
                                    borderRadius: '100%',
                                    backgroundColor: progressTask
                                }}/>
                                <Text style={{margin: 0, fontSize: 14, color: 'rgb(10, 143, 220)'}}>В процессе</Text>
                            </Flex>
                            <Tag color={progressTaskHover}
                                 style={{fontSize: '14px', color: progressTask, fontWeight: 600, padding: '2px 10px'}}>
                                {in_progress_tasks_count || 0}
                            </Tag>
                        </Flex>

                        <Flex gap={5} align={"center"} justify={"space-between"}
                              className={'statistics-item'}
                              style={{

                                  borderBottom: '1px solid #DADCDD',

                                  color: 'rgb(240, 79, 71)'
                              }}>
                            <Flex gap={10} align={"center"}>
                                <div style={{
                                    width: 16,
                                    height: 16,
                                    borderRadius: '100%',
                                    backgroundColor: failedTask
                                }}/>
                                <Text style={{margin: 0, fontSize: 14, color: 'rgb(240, 79, 71)'}}>Неуспешный</Text>
                            </Flex>
                            <Tag color={failedTaskHover}
                                 style={{fontSize: '14px', color: failedTask, fontWeight: 600, padding: '2px 10px'}}>
                                {failed_tasks_count || 0}
                            </Tag>
                        </Flex>
                        {
                            responsible_tasks_count ?
                                <Flex align={"center"} justify={"space-between"} gap={5}
                                      className={'statistics-item'}
                                      style={{width: '100%', borderBottom: '1px solid #DADCDD',}}>
                                    <Flex gap={10} align={"center"}>

                                        <div style={{
                                            width: 16,
                                            height: 16,
                                            borderRadius: '100%',
                                            backgroundColor: responsibleTask
                                        }}/>
                                        <Text style={{margin: 0, fontSize: "14px"}}>Ответственная задача</Text>
                                    </Flex>
                                    <Tag color={responsibleTaskHover} style={{
                                        fontSize: '14px',
                                        color: responsibleTask,
                                        fontWeight: 600,
                                        padding: '2px 10px'
                                    }}>
                                        {responsible_tasks_count || 0}
                                    </Tag>
                                </Flex>
                                : ''
                        }
                    </div>
                </div>
            ),
        },
        {
            key: "2",
            label: <span style={{display: 'flex', alignItems: 'center', gap: 5}}>Диаграмма</span>,
            children: chartData && <Doughnut data={chartData} options={options}/>,
        },
    ];

    return (
        <>
        <Card
            className="profile-card"
            onClick={handlerCompanyId}
            style={{
                cursor: "pointer",
                borderRadius: 10,
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
                border: companyIDSlice === companyID ? '1px solid #76BC33' : '1px solid transparent'
            }}
            size="small"
        >
            <Title level={4} style={{textAlign: 'left', margin: '0 0 10px 20px'}}>
                {title}
            </Title>
            <Avatar style={{flexShrink: 0}} size={60} src={image} icon={<UserOutlined/>}/>
            <Title className="profile-card-title" level={4} style={{marginTop: 10}}>
                {fullName}
            </Title>
            <Text type="secondary">{position}</Text>
            <Tabs defaultActiveKey="1" items={items}/>
        </Card>
        </>
    );
};

export default memo(DashboardProfileCard);
