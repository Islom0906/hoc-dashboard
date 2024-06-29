
// import { useQuery} from 'react-query';
import {Avatar, Card, Col, Divider, Flex, Progress, Row, Space, Tooltip, Typography} from "antd";
import './index.scss'
import {CalendarFilled, FieldTimeOutlined, UserOutlined} from "@ant-design/icons";
import TaskInner from "./TaskInner";
import apiService from "../../service/apis/api";
import {useQuery} from "react-query";
import {useEffect} from "react";

const TaskList = () => {
  const {data: staffGetTask, refetch: refetchStaffGetTask} = useQuery(
      'staff-get-task',
      () => apiService.getData('users/staff-subtasks'),
      {
        enabled: false,
      },
  );

  useEffect(() => {
    refetchStaffGetTask()
  }, []);

  console.log(staffGetTask)
  return (
      <div>
        <h1>
          User setting
        </h1>

        <Divider orientation="right"><h4>Completed</h4> </Divider>
        <Row gutter={[24, 24]} >

          {
            staffGetTask?.results?.map(task => (
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
                  <TaskCard task={task}/>
                </Col>
            ))
          }
        </Row>

        <TaskInner />
      </div>
  );
};


export  const  TaskCard = ({task})=> {
  const { Text } = Typography;
return(
    <Card className={'TaskCard'} size={"small"}>
      <Space size={20} direction={'vertical'}>
        <h3>
          {task?.main_task_title}
        </h3>
        <Flex  wrap={true} justify={'space-between'} gap={5} align={'center'}>
          <Flex align={'center'} wrap={'nowrap'} gap={8}>
            <CalendarFilled className={'icon'}/>
            <Text type={'secondary'} >Start: </Text>
            <Text type={'secondary'}>{task?.main_task_created_at}</Text>
          </Flex>
          <Flex wrap={'nowrap'} align={'center'} gap={8}>
            <FieldTimeOutlined className={'icon'}/>
            <Text type={'secondary'}>end: </Text>
            <Text type={'secondary'}>{task?.main_task_deadline}</Text>
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
            {task?.staff_last_sub_task_updated_at}
          </Text>
          <Avatar.Group size={"small"} >
            {
              task?.included_users.map(user => (
                  <Tooltip title={<p>
                    <span>
                      {user?.first_name
                        }
                        {user?.last_name
                        }
                    </span>
                    <br/>
                    <span>
                      {user?.roles[0]?.name}
                      {user?.roles[1]?.name}
                    </span>
                  </p>} placement="top">
                    <Avatar
                        style={{
                          backgroundColor: '#87d068',
                        }}
                        icon={user?.image? <img src={user?.image} alt={user?.first_name} />: <UserOutlined />}
                    />
                  </Tooltip>
              ))
            }
          </Avatar.Group>
        </Flex>
      </Space>
    </Card>
)
}

export default TaskList;