import {Col, Row, Space, Typography} from "antd";
import BackgroundContent from "../../AppLayout/AppPage/BackgrountContent";
import {CircleChart} from "../../components";
const { Title } = Typography;

const Dashboard = () => {
  return (
      <div className={'site-space-compact-wrapper'}>
        <Space direction={'vertical'} size={"large"} style={{width: '100%'}}>
          <Row gutter={[16, 30]} >
            <Col span={18}>
              <Title level={2} style={{marginBottom:0}}>
                Создать задачу
              </Title>
            </Col>

            <Col span={12}>
              <BackgroundContent>
                <CircleChart/>
              </BackgroundContent>
            </Col>

            </Row>

        </Space>
      </div>
  );
};

export default Dashboard;