import {Button, Card, Carousel, Col, Flex, Modal, Row, Typography} from "antd";
import {FaPlus} from "react-icons/fa";
import {Map} from "../../../components";
import MapTable from "./map-table";
import AddLocationMap from "./AddLocationMap";
import {useState} from "react";


const {Title} = Typography


const positions = [
  {
    latitude: 41.2995,
    longitude: 69.2401,
    name: 'Tashkent',
    fulladdress: 'Tashkent, Uzbekistan',
    category: 'Capital',
    icon: 'https://gacauto.uz/icon.png',
  },
  {
    latitude: 40.7821,
    longitude: 72.3500,
    name: 'Andijan',
    fulladdress: 'Andijan Region, Uzbekistan',
    category: 'Region',
    icon: 'https://gacauto.uz/icon.png',
  },
  {
    latitude: 39.7747,
    longitude: 64.4286,
    name: 'Bukhara',
    fulladdress: 'Bukhara Region, Uzbekistan',
    category: 'Region',
    icon: 'https://gacauto.uz/icon.png',
  },
  {
    latitude: 40.3744,
    longitude: 71.7843,
    name: 'Fergana',
    fulladdress: 'Fergana Region, Uzbekistan',
    category: 'Region',
    icon: 'https://gacauto.uz/icon.png',
  },
  {
    latitude: 40.1250,
    longitude: 67.8286,
    name: 'Jizzakh',
    fulladdress: 'Jizzakh Region, Uzbekistan',
    category: 'Region',
    icon: 'https://gacauto.uz/icon.png',
  },
  {
    latitude: 42.3553,
    longitude: 59.4658,
    name: 'Karakalpakstan',
    fulladdress: 'Karakalpakstan, Uzbekistan',
    category: 'Autonomous Republic',
    icon: 'https://gacauto.uz/icon.png',
  },
  {
    latitude: 38.8564,
    longitude: 65.7932,
    name: 'Kashkadarya',
    fulladdress: 'Kashkadarya Region, Uzbekistan',
    category: 'Region',
    icon: 'https://gacauto.uz/icon.png',
  },
  {
    latitude: 41.3809,
    longitude: 60.3666,
    name: 'Khorezm',
    fulladdress: 'Khorezm Region, Uzbekistan',
    category: 'Region',
    icon: 'https://gacauto.uz/icon.png',
  },
  {
    latitude: 40.9983,
    longitude: 71.6726,
    name: 'Namangan',
    fulladdress: 'Namangan Region, Uzbekistan',
    category: 'Region',
    icon: 'https://gacauto.uz/icon.png',
  },
  {
    latitude: 40.1039,
    longitude: 65.3700,
    name: 'Navoiy',
    fulladdress: 'Navoiy Region, Uzbekistan',
    category: 'Region',
    icon: 'https://gacauto.uz/icon.png',
  },
  {
    latitude: 39.6542,
    longitude: 66.9597,
    name: 'Samarkand',
    fulladdress: 'Samarkand Region, Uzbekistan',
    category: 'Region',
    icon: 'https://gacauto.uz/icon.png',
  },
  {
    latitude: 40.4459,
    longitude: 68.6626,
    name: 'Sirdaryo',
    fulladdress: 'Sirdaryo Region, Uzbekistan',
    category: 'Region',
    icon: 'https://gacauto.uz/icon.png',
  },
  {
    latitude: 37.8093,
    longitude: 67.1585,
    name: 'Surkhandarya',
    fulladdress: 'Surkhandarya Region, Uzbekistan',
    category: 'Region',
    icon: 'https://gacauto.uz/icon.png',
  },

  {
    latitude: 41.3300,
    longitude: 69.2199,
    name: 'Tashkent Region',
    fulladdress: 'Tashkent Region, Uzbekistan',
    category: 'Region',
    icon: 'https://gacauto.uz/icon.png',
  }
];
const MapForDashboardStructure = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
      <>
        <Card size={"small"}>
          <Row gutter={16}>
            <Col span={12}>
              <Title level={4} style={{marginBottom:0}}>
                Наши офисы:
              </Title>
            </Col>
            <Col span={12}>
              <Flex align={"end"} justify={"end"}>
                <Button onClick={showModal} size={"small"} type={"primary"}><FaPlus /></Button>
              </Flex>
            </Col>
            <Col span={24} style={{marginTop:10}}>
              <Carousel autoplay={true} className={'current_carousel'} arrows infinite={true}  dotPosition={'top'} >
                <Col span={24} style={{borderRadius:10 , overflow:"hidden"}}>
                  <Map zoom={12} positions={positions} mapHeight={400}/>
                </Col>
                <Col span={24} style={{borderRadius:10 , overflow:"hidden"}}>
                  <MapTable />
                </Col>
              </Carousel>
            </Col>
          </Row>
        </Card>
        <Col span={24}>
          <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={false}>
            <AddLocationMap setIsModalOpen={setIsModalOpen} />
          </Modal>
        </Col>
      </>

  );
};

export default MapForDashboardStructure;