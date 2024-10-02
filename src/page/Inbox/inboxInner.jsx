import React, {useEffect} from 'react';
import {Button, Card, Col, Flex, Row, Space, Spin, Typography} from "antd";
import {LuCalendarDays} from "react-icons/lu";
import dayjs from "dayjs";
import {EditOutlined} from "@ant-design/icons";
import {useNavigate, useParams} from "react-router-dom";
import {useGetByIdQuery} from "../../service/query/Queries";
import {FileCard} from "../../components";
import {editIdQuery} from "../../store/slice/querySlice";
import {useDispatch} from "react-redux";

const {Title, Text} = Typography
const InboxInner = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {id} = useParams()
    const {
        isLoading: editInboxLoading,
        data: editInboxData,
        refetch: editInboxRefetch,
        isSuccess: editInboxSuccess
    } = useGetByIdQuery(false, "inbox-inner", id, '/users/inbox')


    const Edit = (id) => {
        localStorage.setItem('editDataId', id)
        dispatch(editIdQuery(id))
        navigate('/inbox-add')
    };

    useEffect(() => {
        if (id) {
            editInboxRefetch()
        }
    }, [id]);
    console.log(editInboxData)
    return (
        <>
            <Spin spinning={editInboxLoading}>
                <Row gutter={20}>
                    <Col span={18}>
                        <Card size={"small"}>
                            <Space size={20} direction={"vertical"} style={{width: '100%'}}>
                                <Title level={4}>
                                    {editInboxData?.title}
                                </Title>
                                <Text>
                                    {editInboxData?.text}
                                </Text>
                                {
                                    editInboxData?.items?.map((message) => (
                                        <FileCard key={message?.id} files={message?.files} comment={message?.comment}/>
                                    ))
                                }
                            </Space>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card size={"small"}>
                            <Space size={5} direction={"vertical"} style={{width: '100%'}}>

                                <Flex align={"start"} wrap={"nowrap"} gap={8} style={{height: '100%'}}>
                                    <LuCalendarDays className={"icon"}/>
                                    <Text style={{fontSize: '12px'}}>
                                        {dayjs(editInboxData?.created_at).format('DD.MM.YYYY hh:mm')}
                                    </Text>
                                </Flex>
                                <Button
                                    onClick={() => Edit(editInboxData?.id)}
                                    style={{width: '100%'}}
                                    type="primary"
                                    icon={<EditOutlined/>}
                                />
                            </Space>
                        </Card>
                    </Col>
                </Row>
            </Spin>
        </>
    );
};

export default InboxInner;


