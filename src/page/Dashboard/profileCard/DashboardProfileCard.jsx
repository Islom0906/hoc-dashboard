import { Avatar, Card, Typography, Tabs } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { FaChartPie, FaListAlt } from "react-icons/fa";

ChartJS.register(ArcElement, Tooltip, Legend);

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const DashboardProfileCard = ({ title, image, fullName, position, statistics, chartData }) => {
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
          <Tabs defaultActiveKey="1">
            <TabPane
                tab={
                  <span style={{display: 'flex', alignItems: 'center', gap: 5}}>
                <FaListAlt/> Статистика
              </span>
                }
                key="1"
            >
            {statistics && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {statistics.map((status, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          {status.icon}
                          <Text style={{ margin: 0 }}>{status.text}</Text>
                          <Title level={5} style={{ margin: 0 }}>
                            {status.count}
                          </Title>
                        </div>
                    ))}
                  </div>
              )}
            </TabPane>

            <TabPane
                tab={
                  <span style={{display: 'flex', alignItems: 'center', gap: 5}}>
                <FaChartPie/> Диаграмма
              </span>
                }
                key="2"
            >
            {chartData && <Doughnut data={chartData} />}
            </TabPane>
          </Tabs>
        </Card>
      </Card>
  );
};

export default DashboardProfileCard;
