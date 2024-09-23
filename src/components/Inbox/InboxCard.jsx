import React from 'react';
import {Button, Card, Col, Flex, Popconfirm, Row, Typography} from "antd";
import dayjs from "dayjs";
import {FaRegEye} from "react-icons/fa";
import {DeleteOutlined} from "@ant-design/icons";
import {LuCalendarDays} from "react-icons/lu";

const {Title, Text} = Typography

const items = [
    {
        key: '1',
        label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
                1st menu item
            </a>
        ),
    },
    {
        key: '2',
        label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
                2nd menu item
            </a>
        ),
    },
    {
        key: '3',
        label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
                3rd menu item
            </a>
        ),
    },
];
const InboxCard = () => {

    const Delete = () => {

    }
    return (
        <Card className={'chat-card'} size={"small"}>
            <Row gutter={[5, 10]}>


                <Col span={24}>
                    <Title level={4} className={'chat-title'}>
                        bu mening birinchi malumotlarim
                        bu mening birinchi malumotlarim

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
                        style={{width: '100%'}}
                        type="primary"
                        icon={<FaRegEye/>}
                    />
                </Col>
                <Col span={6}>

                    <Popconfirm
                        title={"Вы уверены, что хотите удалить это?"}
                        description={"Удалить"}
                        onConfirm={() => Delete(1)}
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