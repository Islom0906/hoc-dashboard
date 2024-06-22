

import {Avatar, Card, Col, Divider, Flex, Progress, Row, Space, Tooltip, Typography} from "antd";
import './index.scss'
import {AntDesignOutlined, CalendarFilled, FieldTimeOutlined, UserOutlined} from "@ant-design/icons";
import TaskInner from "./TaskInner";

const TaskList = () => {
  return (
      <div>
        <h1>
          User setting
        </h1>

        <Divider orientation="right"><h4>Completed</h4> </Divider>
        <Row gutter={[24, 24]} >
          <Col className="gutter-row" xs={{
              span:12
          }}
               md={{
                   span:8
               }}

          xl={{
              span:6
          }}
          >
            <TaskCard/>
          </Col>
          <Col className="gutter-row" xs={{
              span:12
          }}
               md={{
                   span:8
               }}
          xl={{
              span:6
          }}>
            <TaskCard/>
          </Col>
          <Col className="gutter-row" xs={{
              span:12
          }}
               md={{
                   span:8
               }}
          xl={{
              span:6
          }}>
            <TaskCard/>
          </Col>
          <Col className="gutter-row" xs={{
              span:12
          }}
               md={{
                   span:8
               }}
          xl={{
              span:6
          }}>
            <TaskCard/>
          </Col>
          <Col className="gutter-row" xs={{
              span:12
          }}
               md={{
                   span:8
               }}
          xl={{
              span:6
          }}>
            <TaskCard/>
          </Col>
          <Col className="gutter-row" xs={{
              span:12
          }}
               md={{
                   span:8
               }}
          xl={{
              span:6
          }}>
            <TaskCard/>
          </Col>
          <Col className="gutter-row" xs={{
              span:12
          }}
               md={{
                   span:8
               }}
          xl={{
              span:6
          }}>
            <TaskCard/>
          </Col>


        </Row>

        <TaskInner />
      </div>
  );
};


export  const  TaskCard = ()=> {
  const { Text } = Typography;
return(
    <Card className={'TaskCard'} size={"small"}>
      <Space size={20} direction={'vertical'}>
        <h3>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis, tempora?
        </h3>
        <Flex  wrap={true} justify={'space-between'} gap={5} align={'center'}>
          <Flex align={'center'} wrap={'nowrap'} gap={8}>
            <CalendarFilled className={'icon'}/>
            <Text type={'secondary'} >Start: </Text>
            <Text type={'secondary'}>Nov 12</Text>
          </Flex>
          <Flex wrap={'nowrap'} align={'center'} gap={8}>
            <FieldTimeOutlined className={'icon'}/>
            <Text type={'secondary'}>Start: </Text>
            <Text type={'secondary'}>Nov 12</Text>
          </Flex>
        </Flex>
        <Progress percent={30}
                  percentPosition={{
                    align: 'center',
                    type: 'outer',
                  }}
                  size={['100%', 5]}
                  strokeColor="#E6F4FF" className={'progress'}/>
        <Flex align={'center'} wrap={true} gap={5} justify={'space-between'}>
          <Text type={'secondary'}>
            Last updated: 10 Dec, 2023
          </Text>
          <Avatar.Group size={"small"} >
            <Tooltip title="Ant User" placement="top">
              <Avatar
                  style={{
                    backgroundColor: '#87d068',
                  }}
                  icon={<UserOutlined />}
              />
            </Tooltip>
            <Tooltip title="Ant User" placement="top">
              <Avatar
                  style={{
                    backgroundColor: '#87d068',
                  }}
                  icon={<UserOutlined />}
              />
            </Tooltip>
            <Tooltip title="Ant User" placement="top">
              <Avatar
                  style={{
                    backgroundColor: '#87d068',
                  }}
                  icon={<UserOutlined />}
              />
            </Tooltip>
            <Tooltip title="Ant User" placement="top">
              <Avatar
                  style={{
                    backgroundColor: '#87d068',
                  }}
                  icon={<UserOutlined />}
              />
            </Tooltip>
          </Avatar.Group>
        </Flex>
      </Space>
    </Card>
)
}

export default TaskList;