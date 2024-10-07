import React from 'react';
import {Col, Row, Typography} from "antd";
import MapForDashboardStructure from "../Dashboard/map-company/MapForDashboardStructure";
const { Title, Text  } = Typography;

const Index = () => {
  return (
      <Row gutter={[16, 30]}>
        <Col span={18}>
          <Title level={2} style={{marginBottom:0}}>
            Пресс-центр
          </Title>
        </Col>
      <Col span={16}>
        <MapForDashboardStructure />
      </Col>

      </Row>
  );
};

export default Index;