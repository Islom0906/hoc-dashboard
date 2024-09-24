import React, {useEffect} from 'react';
import {Button, Card, Col, Flex, Image, Row, Space, Typography} from "antd";
import {LuCalendarDays} from "react-icons/lu";
import dayjs from "dayjs";
import {EditOutlined} from "@ant-design/icons";
import {useParams} from "react-router-dom";
import {useGetByIdQuery} from "../../service/query/Queries";
import {FileCard} from "../../components";

const {Title, Text} = Typography
const InboxInner = () => {
    const {id} = useParams()
    const {
        isLoading: editInboxLoading,
        data: editInboxData,
        refetch: editInboxRefetch,
        isSuccess: editInboxSuccess
    } = useGetByIdQuery(false, ["edit-inbox", id], id, '/users/inbox')
    console.log(id)
    useEffect(() => {
        if (id) {
            editInboxRefetch()
        }
    }, [id]);
    console.log(editInboxData)
    return (
        <>
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
                                style={{width: '100%'}}
                                type="primary"
                                icon={<EditOutlined/>}
                            />
                        </Space>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default InboxInner;


