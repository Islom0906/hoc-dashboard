import {Col, Flex, Row, Space,  Typography} from "antd";
const {Text ,Title} = Typography

const PersonalInfo = ({data}) => {

  return (
        <Space style={{width:'100%' ,  paddingBottom:20}} direction={"vertical"}  className={'UserProfile'}>
          <Title level={3}>
            Пользовательские настройки
          </Title>
          <Row style={{width:'100%'}} gutter={[10 ,20]}>
            <Col span={24}  >
              <Flex vertical={true} gap={3}>
                <Text type={"secondary"}>
                  Фотография:
                </Text>
                <img src={data?.image?.image} className={'logo'} alt={'company light'}
                     style={{width: '100px', height: '100px', objectFit: 'contain'}}/>
              </Flex>
            </Col>
            <Col span={8}>
              <Flex vertical={true} gap={3}>
                <Text type={"secondary"}>
                  Фамилия:
                </Text>
                <p >
                  {data?.last_name}
                </p>
              </Flex>
            </Col>
            <Col span={8}  >
              <Flex vertical={true} gap={3}>
                <Text type={"secondary"}>
                  Имя:
                </Text>
                <p >
                  {data?.first_name}
                </p>
              </Flex>

            </Col>

            <Col span={8}>
              <Flex vertical={true} gap={3}>
                <Text type={"secondary"}>
                  Отчество:
                </Text>
                <p >
                  {data?.middle_name}
                </p>
              </Flex>

            </Col>
            <Col span={8}  >
              <Flex vertical={true} gap={3}>
                <Text type={"secondary"}>
                  Дата рождения:
                </Text>
                <p >
                  {data?.birthday}
                </p>
              </Flex>

            </Col>
            <Col span={8}>
              <Flex vertical={true} gap={3}>
                <Text type={"secondary"}>
                  Номер телефона:
                </Text>
                <p >
                  {data?.phone}
                </p>
              </Flex>
            </Col>
            <Col span={8}>
              <Flex vertical={true} gap={3}>
                <Text type={"secondary"}>
                  Электронная почта:
                </Text>
                <p >
                  {data?.email}
                </p>
              </Flex>
            </Col>
            {
              data?.roles[0]?.module?.name &&
                <Col span={8}>
                  <Flex vertical={true} gap={3}>
                    <Text type={"secondary"}>
                      Отдел:
                    </Text>
                    <p >
                      {data?.roles[0]?.module?.name}
                    </p>
                  </Flex>
                </Col>
            }


            {
              data?.roles[0]?.position &&
            <Col span={8}>
              <Flex vertical={true} gap={3}>
                <Text type={"secondary"}>
                  Должность:
                </Text>
                <p >
                  { data?.roles[0]?.position }
                </p>
              </Flex>
            </Col>
            }
          </Row>
        </Space>

  );
};

export default PersonalInfo;