import { Button, Card, Col, Flex, Row, Typography, Tabs } from "antd";
import { FaPlus, FaMapMarkerAlt, FaListAlt } from "react-icons/fa";
import { Map } from "../../../components";
import MapTable from "./map-table";
import { useNavigate } from "react-router-dom";
import {useDeleteQuery, useGetQuery} from "../../../service/query/Queries";
import {useEffect} from "react";

const { Title } = Typography;



const MapForDashboardStructure = ({roleName}) => {
  const navigate = useNavigate();
  const { data: getOffice, refetch:refetchGetOffice, isLoading:isLoadingGetOffice, isSuccess  } = useGetQuery(false, 'office-get', `/users/offices`, false);
  const {mutate,isSuccess:deleteSuccess,isLoading:deleteLoading}=useDeleteQuery()

  const showModal = () => {
    navigate('/map-add');
  };
  useEffect(() => {
    refetchGetOffice()
  }, [deleteSuccess]);
  const deleteHandle = (url, id) => {
    mutate({url, id});
  };
  const items = [
    {
      key: '1',
      label: (
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <FaMapMarkerAlt /> Карта
      </span>
      ),
      children: (
          <Col span={24} style={{ borderRadius: 10, overflow: 'hidden' }}>
            <Map zoom={12} positions={getOffice?.results} mapHeight={400} />
          </Col>
      ),
    },
    {
      key: '2',
      label: (
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <FaListAlt /> Таблица
      </span>
      ),
      children: (
          <Col span={24} style={{ borderRadius: 10, overflow: 'hidden' }}>
            <MapTable data={getOffice?.results} deleteHandle={deleteHandle} />
          </Col>
      ),
    },
  ];
  return (
      <>
        <Card size={"small"}>
          <Row gutter={16}>
            <Col span={12}>
              <Title level={4} style={{ marginBottom: 0 }}>
                Наши офисы:
              </Title>
            </Col>
            {
              roleName === 'admin' &&
                <Col span={12}>
                  <Flex align={"end"} justify={"end"}>
                    <Button onClick={showModal} size={"small"} type={"primary"}>
                      <FaPlus />
                    </Button>
                  </Flex>
                </Col>
            }

            <Col span={24} style={{ marginTop: 10 }}>
              <Tabs defaultActiveKey="1" items={items}/>
            </Col>
          </Row>
        </Card>
      </>
  );
};

export default MapForDashboardStructure;
