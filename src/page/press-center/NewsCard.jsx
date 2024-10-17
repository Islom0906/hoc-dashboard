import {Button, Card, Col, Flex, Popconfirm, Row, Space, Typography} from "antd";
import { FaRegEye, FaRegFileAlt } from "react-icons/fa";
import dayjs from "dayjs";
import React from "react";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {useDispatch, useSelector} from "react-redux";
import {editIdQuery} from "../../store/slice/querySlice";

const { Title, Text } = Typography;

const NewsCard = ({ news, onClick,setIsAddModalOpen,deleteNews }) => {
    const {data: {user} = {}} = useSelector((state) => state.auth);
    const dispatch=useDispatch()
    const Edit = (id) => {
        localStorage.setItem("editDataId", id);
        dispatch(editIdQuery(id));
        setIsAddModalOpen(true)
    };

    const Delete = (id) => {
        deleteNews({url:'/users/news',id})
    };

    return (
        <Card size={"small"} style={{ position: "relative" }} className={'news-card'}>

            {news?.file &&
                <Flex justify={"center"} align={"center"} style={{padding:4 , background:'blue' , borderRadius:2, position: "absolute", top: 10, right: 10 , }} >
                    <FaRegFileAlt style={{ fontSize:18 , color:'white', marginBottom:0 }} />
                </Flex>
            }
            <img src={news?.image} alt={news?.title} />
            <Space size={10} direction={"vertical"} style={{width:'100%'}}>
                <Text style={{ fontSize: '12px' }}>
                    {dayjs(news?.created_at).format('DD.MM.YYYY')}
                </Text>
                <Title level={5} style={{ marginBottom: 0 }}>
                    {news?.title}
                </Title>
                <Text className={'description'}>
                    {news?.text}
                </Text>
                <Row gutter={[10,15]} justify={"space-between"}>
                    <Col  span={user?.roles[0]?.role?.name === 'admin' ?24 :10}>
                        <Flex justify={"start"} gap={5} align={"center"}>
                            <FaRegEye />
                            <Text type={"secondary"}>
                                {news?.views}
                            </Text>
                        </Flex>
                    </Col>
                    {
                        user?.roles[0]?.role?.name === 'admin' &&
                        <>
                            <Col span={8}>

                                    <Button icon={<EditOutlined/>} style={{textAlign: "center", width: '100%'}}
                                            type={"default"} onClick={()=>Edit(news?.id)}>
                                    </Button>
                            </Col>
                            <Col span={8}>
                                <Popconfirm
                                    title={"Вы уверены, что хотите удалить это?"}
                                    description={"Удалить"}
                                    onConfirm={() => Delete(news?.id)}
                                >
                                    <Button style={{textAlign: "center", width: '100%'}} type="primary" danger
                                            icon={<DeleteOutlined/>}/>
                                </Popconfirm>
                            </Col>
                        </>
                    }
                    <Col span={user?.roles[0]?.role?.name === 'admin' ? 8 : 14}>


                                <Button onClick={onClick}  icon={<FaRegEye style={{fontSize: "23px"}}/>} style={{textAlign: "center", width: '100%'}}
                                         type={"primary"}>
                                    {
                                        !(user?.roles[0]?.role?.name === 'admin') &&

                                        "Подробнее"
                                    }
                                </Button>


                    </Col>
                    {/*<Col span={10}>*/}
                    {/*    <Button type={'primary'} style={{ width: '100%' }} onClick={onClick}>*/}
                    {/*        Подробнее*/}
                    {/*    </Button>*/}
                    {/*</Col>*/}
                </Row>
            </Space>
        </Card>
    );
};

export default NewsCard;
