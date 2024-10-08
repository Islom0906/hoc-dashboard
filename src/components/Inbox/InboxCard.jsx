import React from 'react';
import {Button, Card, Col, Flex, Popconfirm, Row, Typography} from "antd";
import dayjs from "dayjs";
import {FaRegEye} from "react-icons/fa";
import {DeleteOutlined} from "@ant-design/icons";
import {LuCalendarDays} from "react-icons/lu";
import {useNavigate} from "react-router-dom";

const {Title, Text} = Typography

const InboxCard = ({title,id,deleteHandle,created_at}) => {
    const navigate = useNavigate();
    const ViewInner=()=>{
        navigate(`/inbox/${id}`)
    }

    const Delete = (id) => {
        deleteHandle('/users/inbox',id)
    }
    return (
        <Card className={'chat-card'} size={"small"}>
            <Row gutter={[2, 5]}>


                <Col span={24}>
                    <Title level={5} className={'chat-title'}>
                        {title}
                    </Title>
                </Col>

                <Col span={16} style={{display:'flex',alignItems:'end'}}>
                    <Flex align={"center"} wrap={"nowrap"} gap={3}  >
                        <LuCalendarDays className={"icon"} style={{marginBottom:4}}/>
                        <Text style={{fontSize: '12px'}} >
                            {dayjs(created_at).format('DD.MM.YYYY hh:mm')}
                        </Text>
                    </Flex>
                </Col>
                <Col span={4}>

                    <Button
                        onClick={ViewInner}
                        style={{width: '100%'}}
                        size={"small"}
                        type="primary"
                        icon={<FaRegEye/>}
                    />
                </Col>
                <Col span={4}>

                    <Popconfirm
                        title={"Вы уверены, что хотите удалить это?"}
                        description={"Удалить"}
                        onConfirm={() => Delete(id)}
                    >
                        <Button
                            size={"small"}

                            style={{width: '100%'}}
                            type="primary" danger icon={<DeleteOutlined/>}/>
                    </Popconfirm>
                </Col>
            </Row>
        </Card>
    );
};

export default InboxCard;