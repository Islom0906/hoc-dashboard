import React, { useEffect, useState } from 'react';
import {Avatar, Button, Col, Flex, Row, Space, Tag, Typography} from "antd";
import './press-center.scss';
import {useEditQuery, useGetByIdQuery, useGetQuery} from "../../service/query/Queries";
import dayjs from "dayjs";
import {useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import {AvatarUserProfile} from "../../components";
import {CiLink} from "react-icons/ci";
import {FaRegEye} from "react-icons/fa";
import {IoCalendarOutline} from "react-icons/io5";

const { Title, Text } = Typography;

const NewsInner = () => {
    const { item } = useParams();
    const { data: { user } } = useSelector(state => state.auth);
    const role =user?.roles[0]?.role.name
    const {
        data: getByIdNews,
        refetch: refetchGetByIdNews,
        isLoading: isLoadingGetByIdNews,
    } = useGetByIdQuery(false, "taskInner", item, 'users/news');
    const {
        mutate: putCompany,
        isLoading: putCompanyLoading,
        isSuccess: putCompanySuccess
    } = useEditQuery()
    useEffect(() => {
        if(item) {
            refetchGetByIdNews();
        }
    }, [user]);

    const onView = () => {
        putCompany({url: `/users/news` , id: item})
    }

    return (
        <>
            <Row gutter={[10, 30]}>
                <Col span={24}>
                    {
                        getByIdNews?.image &&
                        <img src={getByIdNews?.image} alt={getByIdNews?.title}
                             style={{width: '100%', minHeight: 250, objectFit: "cover", objectPosition: 'top center'}}/>

                    }
                    <Title level={2}>
                        {getByIdNews?.title}
                    </Title>
                    <Flex justify={"start"} align={"center"} gap={3}>
                        <IoCalendarOutline />
                        <Text type={"secondary"}>
                            {dayjs(getByIdNews?.created_at).format('DD.MM.YYYY')}
                        </Text>
                    </Flex>
                    {
                        role === 'staff' || role ==='boss' ?
                        <Flex justify={"start"} align={"center"} gap={3}>
                        <FaRegEye />
                        <Text type={"secondary"}>
                            {getByIdNews?.views}
                        </Text>
                        </Flex>
                            :
                            <Flex justify={"start"}>
                                <Avatar.Group size={"large"}>
                                    {getByIdNews?.views?.map(user => (
                                        <AvatarUserProfile
                                            key={user?.id}
                                            full_name={user?.full_name}
                                            roles={user?.position}
                                            image={user?.image}
                                        />
                                    ))}
                                </Avatar.Group>
                            </Flex>
                    }
                </Col>

                <Col span={24}>
                    <Flex gap={20} vertical={true} >
                        <Text >
                            {getByIdNews?.text}
                        </Text>
                        <Flex style={{width:300}}>
                            {
                                getByIdNews?.file &&
                                <Tag color={'blue'} icon={<CiLink />} style={{display:"flex" , alignItems:'center' , gap:5}}>
                                    <a href={getByIdNews?.file} download={true} target={"_blank"} style={{display:"inline"}}>
                                        {getByIdNews?.file}
                                    </a>
                                </Tag>
                            }

                        </Flex>

                        {
                            !getByIdNews?.is_read &&
                            <Button onClick={onView} type={'primary'}>
                                Я ознакомился
                            </Button>
                        }
                    </Flex>

                </Col>

            </Row>
        </>
    );
};

export default NewsInner;
