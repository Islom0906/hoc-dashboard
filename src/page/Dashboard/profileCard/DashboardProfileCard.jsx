import { Avatar, Card, Carousel, Col, Flex, Row, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);


const { Title, Text } = Typography;

const DashboardProfileCard = ({ title , image ,fullName, position , statistics , chartData  }) => {





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
          {title}
        </Title>

        <Avatar size={80} src={image} icon={<UserOutlined />} />

        <Title level={4} style={{ marginTop: 10 }}>
          {fullName}
        </Title>
        <Text type="secondary">{position}</Text>

        <Card
            style={{
              marginTop: 20,
              borderRadius: 10,
              backgroundColor: '#E8F4FF',
              textAlign: 'center',
            }}
            bodyStyle={{ padding: '10px' }}
        >
          <Carousel  className={'dashboard-profile-card'}  dotPosition={'top'}>
            <div>
              <Row justify="center" gutter={[1, 15]} style={{ width: '100%' }}>
                {statistics?.map(status => (
                    <Col  span={status?.span} key={status?.id} style={{height:'100%'}}>
                      <Flex vertical={true} gap={3} align={"center"}  style={{height:'100%'}} justify={"center"}>
                        {status?.icon}
                        <Title level={5} style={{ margin: 0 }}>
                          {status?.count}
                        </Title>
                        <Text style={{ margin: 0 }}>{status?.text}</Text>
                      </Flex>
                    </Col>
                ))}
              </Row>
            </div>
            <div>
              {chartData &&
              <Doughnut data={chartData} />
              }
            </div>
          </Carousel>
        </Card>
      </Card>
  );
};

export default DashboardProfileCard;
