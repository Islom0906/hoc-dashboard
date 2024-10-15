import React, {useEffect, useState} from 'react';
import {Button, Col, Flex, Modal, Pagination, Row, Typography} from "antd";
import MapForDashboardStructure from "../Dashboard/map-company/MapForDashboardStructure";
import NewsCard from "./NewsCard";
import './press-center.scss'
import {PlusOutlined} from "@ant-design/icons";
import NewsAddPostEdit from "./NewsAddPostEdit";
import {useGetQuery} from "../../service/query/Queries";

const { Title, Text  } = Typography;

const PressCenter = () => {
    const [pageSize, setPageSize] = useState(12);
    const [currentPage, setCurrentPage] = useState(1);
    const {getNews,isLoading:isLoadingGetNews,refetch: refetchGetNews}=useGetQuery(false,'module-get',`/users/news?page=${currentPage}&page_size=${pageSize}`,false)

    const onPaginationChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };
    useEffect(() => {
        refetchGetNews()
    }, []);
    const [isModalOpen, setIsModalOpen] = useState(false)

    const addNews = () => {
        setIsModalOpen(true)
    }
    const handelClose = () => {
        setIsModalOpen(false)
    }
  return (
      <>
      <Row gutter={[16, 30]}>
          <Col span={12}>
          <Title level={2} style={{marginBottom:0}}>
            Пресс-центр
          </Title>
        </Col>
          <Col offset={6} span={6}>
              <Button
                  type='primary'
                  icon={<PlusOutlined/>}
                  style={{width: '100%'}}
                  onClick={addNews}>
                  Добавить новость
              </Button>
          </Col>
          {
              getNews?.results?.map((news) => (
                  <Col span={6} key={news?.id}>
                      <NewsCard news={news} />
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
      <Modal title={'Тег'} open={isModalOpen} footer={null} onCancel={handelClose}>
          <NewsAddPostEdit setIsModalOpen={setIsModalOpen}  link={'/press-center'}
                           isModalOpen={isModalOpen}/>
      </Modal>
      </Row>

      </>
  );
};

export default PressCenter;