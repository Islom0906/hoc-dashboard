import {Col, Flex, Row, Space, Spin, Typography} from "antd";
import {
  useGetQuery,
} from "../../service/query/Queries";
import {useEffect} from "react";
import {useSelector} from "react-redux";
const {Text ,Title} = Typography

const PersonalInfo = () => {
  const {data: {user}} = useSelector(state => state.auth)
  const { data, isLoading: getTaskLoading, refetch } = useGetQuery(
      false,
      'get-task',
      `users/users/${user?.id}`,
      false
  );


  useEffect(() => {
    if(user?.id) {
    refetch()
    }
  } , [user])

console.log(data)

  return (
      <Spin spinning={getTaskLoading}>

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
                <img src={data?.images?.image} className={'logo'} alt={'company light'}
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
              data?.user_roles[0]?.module_name &&
                <Col span={8}>
                  <Flex vertical={true} gap={3}>
                    <Text type={"secondary"}>
                      Отдел:
                    </Text>
                    <p >
                      {data?.user_roles[0]?.module_name}
                    </p>
                  </Flex>
                </Col>
            }


            {
              data?.position &&
            <Col span={8}>
              <Flex vertical={true} gap={3}>
                <Text type={"secondary"}>
                  Должность:
                </Text>
                <p >
                  {data?.position}
                </p>
              </Flex>
            </Col>
            }
          </Row>
        </Space>
      </Spin>

  );
};

export default PersonalInfo;