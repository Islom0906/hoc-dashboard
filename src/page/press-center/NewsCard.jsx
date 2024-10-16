import { Button, Card, Col, Flex, Row, Space, Typography } from "antd";
import { FaRegEye, FaRegFileAlt } from "react-icons/fa";
import dayjs from "dayjs";
import React from "react";

const { Title, Text } = Typography;

const NewsCard = ({ news, onClick }) => {
    return (
        <Card size={"small"} style={{ position: "relative" }} className={'news-card'}>

            {news?.file &&
                <Flex justify={"center"} align={"center"} style={{padding:4 , background:'blue' , borderRadius:2, position: "absolute", top: 10, right: 10 , }} >
                    <FaRegFileAlt style={{ fontSize:18 , color:'white', marginBottom:0 }} />
                </Flex>
            }
            <img src={news?.image} alt={news?.title} />
            <Space size={10} direction={"vertical"}>
                <Text style={{ fontSize: '12px' }}>
                    {dayjs(news?.created_at).format('DD.MM.YYYY')}
                </Text>
                <Title level={5} style={{ marginBottom: 0 }}>
                    {news?.title}
                </Title>
                <Text className={'description'}>
                    {news?.text}
                </Text>
                <Row gutter={10} justify={"space-between"}>
                    <Col span={10}>
                        <Flex justify={"start"} gap={5} align={"center"}>
                            <FaRegEye />
                            <Text type={"secondary"}>
                                {news?.views}
                            </Text>
                        </Flex>
                    </Col>
                    <Col span={10}>
                        <Button type={'primary'} style={{ width: '100%' }} onClick={onClick}>
                            Подробнее
                        </Button>
                    </Col>
                </Row>
            </Space>
        </Card>
    );
};

export default NewsCard;
