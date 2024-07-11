import { Avatar, Button, Card, Col, Divider, Flex, Progress, Row, Space, Tooltip, Typography } from "antd";
import './index.scss';
import { CalendarFilled, FieldTimeOutlined, UserOutlined } from "@ant-design/icons";
import apiService from "../../service/apis/api";
import { useQuery } from "react-query";
import { useEffect, useMemo } from "react";
import dayjs from "dayjs";
import { MdOutlineReadMore } from "react-icons/md";
import {useSelector} from "react-redux";

const TaskList = () => {
  const {data:{user}}=useSelector(state => state.auth)
  const { data: staffGetTask, refetch: refetchStaffGetTask } = useQuery(
      'staff-get-task',
      () => apiService.getData('users/staff-subtasks'),
      {
        enabled: false,
      },
  );
  const { data: bossGetTask, refetch: refetchBossGetTask } = useQuery(
      'boss-get-task',
      () => apiService.getData('users/boss-assigned-task-get/'),
      {
        enabled: false,
      },
  );

  useEffect(() => {
    if(user?.roles[0].name === 'boss') {
      refetchBossGetTask();
    }else{
      refetchStaffGetTask()
    }
  }, [user]);



  return (
      <div>
        <h1>User setting</h1>
        <Divider orientation="right"><h4>Completed</h4></Divider>
        <Row gutter={[24, 24]}>
          {staffGetTask &&  staffGetTask?.results?.map(task => (
              <Col key={task?.main_task_id} className="gutter-row" xs={{ span: 12 }} md={{ span: 8 }} xl={{ span: 6 }}>
                <TaskCard key={task?.main_task_id} task={task} />
              </Col>
          ))}
          {bossGetTask?.count > 0 &&  bossGetTask?.results?.map(task => (
              <Col key={task?.main_task_id} className="gutter-row" xs={{ span: 12 }} md={{ span: 8 }} xl={{ span: 6 }}>
                <TaskCard key={task?.main_task_id} task={task} />
              </Col>
          ))}
        </Row>
      </div>
  );
};

export const TaskCard = ({ task }) => {
  const deadlineColor = useMemo(() => {
    const deadlineStatus = task?.main_deadline_status;
    let color = '#3FA2F6';
    if (deadlineStatus === 'soon') {
      color = '#FAFFAF';
    } else if (deadlineStatus === 'failed') {
      color = '#C80036';
    } else if (deadlineStatus === 'progress') {
      color = '#FF7F3E';
    }
    return color;
  }, [task]);


  if (!task) {
    return null;
  }

  const { Text } = Typography;
  return (
      <Card
          className={'TaskCard'}
          style={{ borderColor:`${deadlineColor}` , borderTop: '6px', borderStyle: 'solid', borderTopColor:`${deadlineColor}` }}
          size={"small"}
          title={task?.main_task_title}
          extra={
              <Button href={`task-list/${task?.main_task_id}`} type={"primary"} size={"small"}>
                <MdOutlineReadMore />
              </Button>
          }
      >
        <Space style={{ width: '100%' }} size={20} direction={'vertical'}>
          <Flex wrap={true} justify={'space-between'} gap={5} align={'center'}>
            <Tooltip title={<p>time start:</p>} placement="top">
              <Flex align={'center'} wrap={'nowrap'} gap={8}>
                <CalendarFilled className={'icon'} />
                <Text type={'secondary'}>{dayjs(task?.main_task_created_at).format('DD.MM.YYY')}</Text>
              </Flex>
            </Tooltip>

            <Tooltip title={<p>time end:</p>} placement="top">
              <Flex wrap={'nowrap'} align={'center'} gap={8}>
                <FieldTimeOutlined className={'icon'} />
                <Text type={'secondary'}>{dayjs(task?.main_task_deadline).format('DD.MM.YYY:h:mm:ss')}</Text>
              </Flex>
            </Tooltip>
          </Flex>
          <Progress
              percent={task?.done_sub_tasks_count/task?.sub_tasks_count * 100}
              percentPosition={{
                align: 'center',
                type: 'outer',
              }}
              size={['100%', 3]}
              strokeColor="#E6F4FF"
              className={'progress'}
          />
          <Flex align={'center'} justify={'space-between'} gap={5}>
            <Text>
              офицер по назначениям:

            </Text>
            <Tooltip
                title={
                  <p>
                    <span>{task?.main_task_responsible_user?.full_name}</span>
                  </p>
                }
                placement="top"
            >
              <Avatar
                  style={{ backgroundColor: '#87d068' }}
                  icon={task?.main_task_responsible_user?.image ? <img src={task?.main_task_responsible_user?.image} alt={task?.main_task_responsible_user?.full_name} /> : <UserOutlined />}
              />
            </Tooltip>
          </Flex>

          <Flex align={'center'} wrap={true} gap={5} justify={'space-between'}>

            <Text type={'secondary'}>
              {dayjs(task?.staff_last_sub_task_updated_at).format('DD.MM.YYY')}
            </Text>


            <Avatar.Group size={"small"}>
              {task?.included_users?.map(user => (
                  <Tooltip
                      key={user?.id}
                      title={
                        <p>
                          <span>{user?.full_name}</span>
                          <br />
                          <span>
                      {user?.roles[0]?.name}
                            {user?.roles[1]?.name}
                    </span>
                        </p>
                      }
                      placement="top"
                  >
                    <Avatar
                        style={{ backgroundColor: '#87d068' }}
                        icon={user?.image ? <img src={user?.image} alt={user?.full_name} /> : <UserOutlined />}
                    />
                  </Tooltip>
              ))}
            </Avatar.Group>
          </Flex>

        </Space>
      </Card>
  );
};

export default TaskList;
