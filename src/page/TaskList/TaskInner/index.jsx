import {Avatar, Card, Col, Flex, Progress, Row, Space, Tooltip, Typography} from "antd";
import {AntDesignOutlined, UserOutlined} from "@ant-design/icons";
import { SettingOutlined } from '@ant-design/icons';
import { Collapse } from 'antd';
const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const items = [
  {
    key: '1',
    label: 'This is panel header 1',
    children: <div>{text}</div>,
  },
  {
    key: '2',
    label: 'This is panel header 2',
    children: <div>{text}</div>,
  },
  {
    key: '3',
    label: 'This is panel header 3',
    children: <div>{text}</div>,
  },
];

const TaskInner = () => {

  const onChange = (key) => {
    console.log(key);
  };


  return (
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Flex align={'center'} justify={'space-between'}>
            <h1>
              Update user flows with UX feedback from Session #245
            </h1>
            <Avatar.Group>
              <Tooltip title="Ant User" placement="top">
                <Avatar
                    style={{
                      backgroundColor: '#87d068',
                    }}
                    icon={<UserOutlined/>}
                />
              </Tooltip>
              <Tooltip title="Ant User" placement="top">
                <Avatar
                    style={{
                      backgroundColor: '#87d068',
                    }}
                    icon={<UserOutlined/>}
                />
              </Tooltip>
              <Tooltip title="Ant User" placement="top">
                <Avatar
                    style={{
                      backgroundColor: '#87d068',
                    }}
                    icon={<UserOutlined/>}
                />
              </Tooltip>
              <Tooltip title="Ant User" placement="top">
                <Avatar
                    style={{
                      backgroundColor: '#87d068',
                    }}
                    icon={<UserOutlined/>}
                />
              </Tooltip>
            </Avatar.Group>
          </Flex>

        </Col>
        <Col span={16}>
          <Collapse
            defaultActiveKey={['1']}
            onChange={onChange}
            expandIconPosition={'end'}
            items={items}
        />
         </Col>
        <Col span={8}>
        <TaskInnerCard />
        </Col>
      </Row>
  );
};

export const TaskInnerCard = () => {
  const { Text } = Typography;

 return(
     <Card size={"small"}  title="Details" >
        <Flex vertical={true} gap={10}>
          <Flex align={'center'} justify={'space-between'}>

            <Text type={'secondary'}> Assignees:</Text>
            <Flex align={"center"} gap={10}>
              <Avatar
                  size={30}
                  icon={<AntDesignOutlined />}
              />
              <p>
                Kuiper Split
              </p>
            </Flex>
          </Flex>
          <Flex align={'center'} justify={'space-between'}>
            <Text type={'secondary'}> Status:</Text>
            <Text type={'success'}>Active</Text>
          </Flex>
          <Flex align={'center'} justify={'space-between'}>
            <Text type={'secondary'}> Due date:</Text>
            <Text type={'success'}>21 Jan 2023</Text>
          </Flex>
          <Flex align={'center'} justify={'space-between'}>
            <Text type={'secondary'}> Progress:</Text>
            <div>
              <Progress percent={50}
                        percentPosition={{
                          align: 'center',
                          type: 'inner',
                        }}
                        size={[120, 12]}
                        strokeColor="red" className={'progress'}/>
            </div>

          </Flex>
          <Flex align={'left'} gap={2} vertical>
            <Text type={'secondary'}> Progress:</Text>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab beatae, delectus deserunt error excepturi perspiciatis sapiente suscipit tempora vitae voluptatum.
            </p>

          </Flex>
        </Flex>

     </Card>
 )

}

export default TaskInner;
