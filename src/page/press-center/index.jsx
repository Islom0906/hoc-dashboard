import React, {useState} from 'react';
import {Button, Col, Modal, Row, Typography} from "antd";
import MapForDashboardStructure from "../Dashboard/map-company/MapForDashboardStructure";
import NewsCard from "./NewsCard";
import './press-center.scss'
import {PlusOutlined} from "@ant-design/icons";
import NewsAddPostEdit from "./NewsAddPostEdit";

const { Title, Text  } = Typography;

const PressCenter = () => {
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
              Array(4).fill("").map((_, ind) => (
                  <Col span={6}>
                      <NewsCard/>
                  </Col>
              ))
          }
      <Col span={16}>
        <MapForDashboardStructure />
      </Col>

      </Row>
          <Modal title={'Тег'} open={isModalOpen} footer={null} onCancel={handelClose}>
              <NewsAddPostEdit setIsModalOpen={setIsModalOpen}  link={'/press-center'}
                                     isModalOpen={isModalOpen}/>
          </Modal>
      </>
  );
};

export default PressCenter;