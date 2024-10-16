import React, { useEffect, useState } from 'react';
import { Button, Col, Flex, Modal, Pagination, Row, Typography } from "antd";
import MapForDashboardStructure from "../Dashboard/map-company/MapForDashboardStructure";
import NewsCard from "./NewsCard";
import './press-center.scss';
import { PlusOutlined } from "@ant-design/icons";
import NewsAddPostEdit from "./NewsAddPostEdit";
import { useGetQuery } from "../../service/query/Queries";
import dayjs from "dayjs";
import {useNavigate} from "react-router-dom";

const { Title, Text } = Typography;

const PressCenter = () => {
    const navigator = useNavigate()
    const [pageSize, setPageSize] = useState(12);
    const [currentPage, setCurrentPage] = useState(1);
    const { data: getNews, refetch:refetchGetNews, isLoadingGetNews, isSuccess  } = useGetQuery(false, 'module-get', `/users/news?page=${currentPage}&page_size=${pageSize}`, false);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const onPaginationChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    useEffect(() => {
        refetchGetNews();
    }, [currentPage, pageSize]);

    const addNews = () => {
        setIsAddModalOpen(true);
    };

    const handleAddModalClose = () => {
        setIsAddModalOpen(false);
    };
    const handleCardClick = (newsId) => {
        navigator(`${newsId}`)
    };




    return (
        <>
            <Row gutter={[16, 30]}>
                <Col span={12}>
                    <Title level={2} style={{ marginBottom: 0 }}>
                        Пресс-центр
                    </Title>
                </Col>
                <Col offset={6} span={6}>
                    <Button
                        type='primary'
                        icon={<PlusOutlined />}
                        style={{ width: '100%' }}
                        onClick={addNews}>
                        Добавить новость
                    </Button>
                </Col>
                {
                    getNews?.results?.map((news) => (
                        <Col span={6} key={news?.id}>
                            <NewsCard news={news} onClick={() => handleCardClick(news?.id)} />
                        </Col>
                    ))
                }
                <Col span={24}>
                    <Flex align={'center'} justify={'center'}>
                        <Pagination
                            current={currentPage}
                            pageSize={pageSize}
                            total={getNews?.count || 0}
                            onChange={onPaginationChange}
                            showSizeChanger
                        />
                    </Flex>
                </Col>
                <Col span={16}>
                    <MapForDashboardStructure />
                </Col>
                <Modal title={'Добавить новость'} open={isAddModalOpen} footer={null} onCancel={handleAddModalClose}>
                    <NewsAddPostEdit setIsModalOpen={setIsAddModalOpen} link={'/press-center'} isModalOpen={isAddModalOpen} />
                </Modal>
            </Row>
        </>
    );
};

export default PressCenter;
