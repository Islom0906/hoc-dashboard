import React from 'react';
import {Avatar, Card, Col, Row, Typography} from "antd";
import {TeamOutlined, TrophyOutlined, UserOutlined} from "@ant-design/icons";

const { Title , Text } = Typography;
const DashboardProfileCard = () => {
  return (
      <Card
          style={{
            borderRadius: 10,
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
          }}
          size={"small"}
      >
        <Title level={4} style={{ textAlign: 'left', margin: '0 0 10px 20px' }}>
          My Profile :
        </Title>
        <Avatar
            size={80}
            src="https://randomuser.me/api/portraits/women/44.jpg"
            icon={<UserOutlined />}
        />
        <Title level={4} style={{ marginTop: 10 }}>
          Donald O Donhue
        </Title>
        <Text type="secondary">Student</Text>

        <Card
            style={{
              marginTop: 20,
              borderRadius: 10,
              backgroundColor: '#E8F4FF',
              textAlign: 'center',
            }}
            bodyStyle={{ padding: '10px' }}
        >
          <Row justify="center">
            <Col span={12}>
              <TrophyOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
              <Title level={5} style={{ marginTop: 5, color: '#1890ff' }}>
                2300
              </Title>
              <Text>Achievements</Text>
            </Col>
            <Col span={12}>
              <TeamOutlined style={{ fontSize: '24px', color: '#ff4d4f' }} />
              <Title level={5} style={{ marginTop: 5, color: '#ff4d4f' }}>
                38
              </Title>
              <Text>Friends</Text>
            </Col>
          </Row>
        </Card>
      </Card>
  );
};

export default DashboardProfileCard;