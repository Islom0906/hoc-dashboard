import {Button, Card, Col, Flex, Row, Space, Typography} from "antd";
import BackgroundContent from "../../AppLayout/AppPage/BackgrountContent";
import {CircleChart} from "../../components";
import {MapContainer, Marker, TileLayer, useMap} from "react-leaflet";
import 'leaflet/dist/leaflet.css'
import {FaPlus} from "react-icons/fa";
const { Title } = Typography;
const Dashboard = () => {
  function SetViewOnClick({ coords }) {
    const map = useMap();
    map.setView(coords, map.getZoom());

    return null;
  }

  const position = [51.505, -0.09]
  return (
      <div className={'site-space-compact-wrapper'}>
        <Space direction={'vertical'} size={"large"} style={{width: '100%'}}>
          <Row gutter={[16, 30]}  >
            <Col span={18}>
              <Title level={2} style={{marginBottom:0}}>
                Создать задачу
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
                      Создать задачу
                    </Title>
                  </Col>
                  <Col span={12}>
                    <Flex align={"end"} justify={"end"}>
                      <Button size={"small"} type={"primary"}><FaPlus /></Button>
                    </Flex>
                  </Col>
                  <Col span={24} style={{borderRadius:10 , overflow:"hidden"}}>
                  <MapContainer  style={{height:400,width:'100%'}} center={position} zoom={21} scrollWheelZoom={true}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={position}>
                    </Marker>
                  </MapContainer>
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