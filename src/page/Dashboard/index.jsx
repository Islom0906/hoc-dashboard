import {Button, Card, Col, Flex, Row, Space, Typography} from "antd";
import {CircleChart , Map} from "../../components";
import 'leaflet/dist/leaflet.css'
import {FaPlus} from "react-icons/fa";
const { Title } = Typography;
const Dashboard = () => {


  const positions = [
    {
      latitude: 324.505,
      longitude: -324.12,
      name: 'leapmotors',
      fulladdress: 'leapmotors full adress',
      category:'dillers',
      icon: 'https://hoc.evms.uz/media/EHOC.png',
    } ,
    {
      latitude: 324.505,
      longitude: -123.12,
      name: 'leapmotors',
      fulladdress: 'leapmotors full adress',
      category: 'home',
      icon: 'https://hoc.evms.uz/media/EHOC.png',
    },
    {
      latitude: 12.505,
      longitude: -123.12,
      name: 'leapmotors',
      fulladdress: 'leapmotors full adress',
      category: 'home',
      icon: 'https://hoc.evms.uz/media/EHOC.png',
    },
    {
      latitude: 232.505,
      longitude: -2323.12,
      name: 'leapmotors',
      fulladdress: 'leapmotors full adress',
      category: 'home',
      icon: 'https://hoc.evms.uz/media/EHOC.png',
    }
  ]

  return (
      <div className={'site-space-compact-wrapper'}>
        <Space direction={'vertical'} size={"large"} style={{width: '100%'}}>
          <Row gutter={[16, 30]}  >
            <Col span={18}>
              <Title level={2} style={{marginBottom:0}}>
                Панель
              </Title>
            </Col>
            <Col span={12}>
              <Card size={"small"}>
                <CircleChart/>
              </Card>
            </Col>
            <Col span={12}>
              <Card size={"small"}>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Title level={4} style={{marginBottom:0}}>
                      Наши офисы:
                    </Title>
                  </Col>
                  <Col span={12}>
                    <Flex align={"end"} justify={"end"}>
                      <Button size={"small"} type={"primary"}><FaPlus /></Button>
                    </Flex>
                  </Col>
                  <Col span={24} style={{borderRadius:10 , overflow:"hidden"}}>
                    <Map zoom={12} positions={positions} mapHeight={400}/>
                  </Col>
                </Row>
              </Card>
            </Col>
            </Row>
        </Space>
      </div>
  );
};

export default Dashboard;