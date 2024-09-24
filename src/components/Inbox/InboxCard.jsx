import React from 'react';
import {Button, Card, Col, Flex, Popconfirm, Row, Typography} from "antd";
import dayjs from "dayjs";
import {FaRegEye} from "react-icons/fa";
import {DeleteOutlined} from "@ant-design/icons";
import {LuCalendarDays} from "react-icons/lu";
import {useNavigate} from "react-router-dom";

const {Title, Text} = Typography

const InboxCard = ({title,id,deleteHandle}) => {
    const navigate = useNavigate();
    const ViewInner=()=>{
        navigate(`/inbox/${id}`)
    }

    const Delete = (id) => {
        deleteHandle('/users/inbox',id)
    }
    return (
        <Card className={'chat-card'} size={"small"}>
            <Row gutter={[5, 10]}>


                <Col span={24}>
                    <Title level={4} className={'chat-title'}>
                        {title}

                    </Title>
                </Col>

                <Col span={12} style={{display:'flex',alignItems:'end'}}>
                    <Flex align={"start"} wrap={"nowrap"} gap={8} style={{height:'100%'}} >
                        <LuCalendarDays className={"icon"}/>
                        <Text style={{fontSize: '12px'}}>
                            {dayjs(new Date()).format('DD.MM.YYYY hh:mm')}
                        </Text>
                    </Flex>
                </Col>
                <Col span={6}>

                    <Button
                        onClick={ViewInner}
                        style={{width: '100%'}}
                        type="primary"
                        icon={<FaRegEye/>}
                    />
                </Col>
                <Col span={6}>

                    <Popconfirm
                        title={"Вы уверены, что хотите удалить это?"}
                        description={"Удалить"}
                        onConfirm={() => Delete(id)}
                    >
                        <Button
                            style={{width: '100%'}}
                            type="primary" danger icon={<DeleteOutlined/>}/>
                    </Popconfirm>
                </Col>
            </Row>
        </Card>
    );
};

export default InboxCard;