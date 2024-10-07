
import {Avatar, Col, Progress, Row, Select, Typography, Flex, Card} from "antd";
import React, { useEffect } from "react";
import AvatarUserProfile from "../../../components/AvatarUserProfile/AvatarUserProfile";
import { UserOutlined } from "@ant-design/icons";
import {useDispatch, useSelector} from "react-redux";
import { selectModuls } from "../../../store/slice/modulsSlice";
import {SelectMountYear} from "../../../components";

const AboutTagList = ({ data, valueYear, setValueYear, setValueMonth, valueMonth , setSelectModul }) => {
    const dispatch = useDispatch();
    const {modulsID} = useSelector(state => state.modulsSlice)

    useEffect(() => {
        if (data) {
            dispatch(selectModuls(data[0]?.id));
            setSelectModul(data[0].name)
        }
    }, [data]);

    const { Title } = Typography;

    const calculateProgressData = (doneTasks, failedTasks, inProgressTasks, totalTasks) => {
        const percent = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
        if (totalTasks === 0) {
            return {
                failedPercent: 0,
                donePercent: 0,
                inProgressPercent: 0,
                percent: 0,
            };
        }
        const failedPercent = Math.round((failedTasks / totalTasks) * 100);
        const donePercent = Math.round((doneTasks / totalTasks) * 100);
        const inProgressPercent = Math.round((inProgressTasks / totalTasks) * 100);
        return { percent, failedPercent, donePercent, inProgressPercent };
    };

    const handleRowClick = (item) => {
        dispatch(selectModuls(item?.id));
        setSelectModul(item.name)
    };

    return (
        <Card size={"small"}>
            <Row gutter={5}>
                <Col span={12} style={{paddingBottom:5}}>
                    <Title level={5}>Информация о Отдел</Title>
                </Col>
                <SelectMountYear  valueYear={valueYear} setValueYear={setValueYear} setValueMonth={setValueMonth} valueMonth={valueMonth}   />
            </Row>

            <div style={{ marginTop: 20  , overflowY:"scroll" , height:350}}>
                {data?.map((record) => {
                    const { percent } = calculateProgressData(
                        record?.done_tasks_count,
                        record?.failed_tasks_count,
                        record?.in_progress_tasks_count,
                        record?.total_tasks_count
                    );
                    return (
                        <Flex
                            key={record.id}
                            justify="space-between"
                            align="center"
                            style={{ padding: 10, borderBottom: `${modulsID === record.id ? '1px solid #76BC33': '0.1px solid #e8e8e8' } ` ,cursor:"pointer" }}
                            onClick={() => handleRowClick(record)}
                        >
                            <Flex align="center" gap={20}>
                                <Progress
                                    size={40}
                                    type="circle"
                                    percent={percent}
                                    strokeColor={"#11c15b"}
                                />
                                <Typography.Text>{record?.name}</Typography.Text>
                            </Flex>

                            <Avatar.Group
                                size={30}
                                max={{
                                    count: 2,
                                    style: { color: "#f56a00", backgroundColor: "#fde3cf" },
                                }}
                            >
                                {record?.staffs?.length > 0 ? (
                                    record?.staffs?.map((staff) => (
                                        <AvatarUserProfile
                                            key={staff?.id}
                                            size={30}
                                            full_name={staff?.full_name}
                                            image={staff?.image}
                                        />
                                    ))
                                ) : (
                                    <Avatar size={30} icon={<UserOutlined />} />
                                )}
                            </Avatar.Group>
                        </Flex>
                    );
                })}
            </div>
        </Card>
    );
};

export default AboutTagList;