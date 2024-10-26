import React, { useEffect, useState } from 'react';
import {Button, Col, Flex, Modal, Pagination, Row, Spin, Typography} from "antd";
import MapForDashboardStructure from "../Dashboard/map-company/MapForDashboardStructure";
import NewsCard from "./NewsCard";
import './press-center.scss';
import { PlusOutlined } from "@ant-design/icons";
import NewsAddPostEdit from "./NewsAddPostEdit";
import {useDeleteQuery, useGetQuery} from "../../service/query/Queries";
import dayjs from "dayjs";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";

const { Title, Text } = Typography;

const PressCenter = () => {
    const navigator = useNavigate()
    const [pageSize, setPageSize] = useState(12);
    const [currentPage, setCurrentPage] = useState(1);
    const {data: {user} = {}} = useSelector((state) => state.auth);
    const { data: getNews, refetch:refetchGetNews, isLoading:isLoadingGetNews, isSuccess  } = useGetQuery(false, 'module-get', `/users/news?page=${currentPage}&page_size=${pageSize}`, false);
    const {mutate: deleteNews, isSuccess: newsSuccess, isLoading: deleteLoading} = useDeleteQuery()
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const roleName = user?.roles[0]?.role?.name

    const onPaginationChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    useEffect(() => {
        refetchGetNews();
    }, [currentPage, pageSize,newsSuccess]);

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
            <Spin spinning={isLoadingGetNews||deleteLoading}>
            <Row gutter={[16, 30]}>
                <Col span={24}>
                    <Title level={2} style={{ marginBottom: 0 }}>
                        Пресс-центр
                    </Title>
                </Col>

                {
                    roleName === 'admin' &&
                    <Col offset={6} span={6}>
                        <Button
                            type='primary'
                            icon={<PlusOutlined />}
                            style={{ width: '100%' }}
                            onClick={addNews}>
                            Добавить новость
                        </Button>
                    </Col>
                }
                {
                    getNews?.results?.map((news) => (
                        <Col span={6} key={news?.id}>
                            <NewsCard deleteNews={deleteNews} setIsAddModalOpen={setIsAddModalOpen} news={news} onClick={() => handleCardClick(news?.id)} />
                        </Col>
                    ))
                }
                <Col span={24}>
                    <Flex align={'center'} justify={'end'}>
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
                    <MapForDashboardStructure roleName={roleName} />
                </Col>
                <Modal title={'Добавить новость'} open={isAddModalOpen} footer={null} onCancel={handleAddModalClose}>
                    <NewsAddPostEdit setIsModalOpen={setIsAddModalOpen} isAddModalOpen={isAddModalOpen}  refetchGetNews={refetchGetNews} />
                </Modal>
            </Row>
            </Spin>

        </>
    );
};

export default PressCenter;
