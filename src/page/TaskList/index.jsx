import { Avatar, Button, Card, Col, Divider, Flex, Progress, Row, Space, Tooltip, Typography } from "antd";
import './index.scss';
import { CalendarFilled, FieldTimeOutlined, UserOutlined } from "@ant-design/icons";
import apiService from "../../service/apis/api";
import { useQuery } from "react-query";
import { useEffect, useMemo } from "react";
import dayjs from "dayjs";
import { MdOutlineReadMore } from "react-icons/md";
import {useSelector} from "react-redux";
import DeadlineStatusColor from "../../hooks/deadlineStatusColor";
import {Link} from "react-router-dom";
import {FaRegUserCircle} from "react-icons/fa";

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

console.log(bossGetTask)

  return (
      <div>
        <h1>Ваши задачи</h1>
        {/*<Divider orientation="right"><h4>Выполненные задачи</h4></Divider>*/}
        <Row gutter={[24, 24]} style={{marginTop:15}}>
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

    console.log(task?.included_users)
    const deadlineColor= DeadlineStatusColor(task?.main_deadline_status)



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
              <Link to={`/task-list/${task?.main_task_id}`} type={"primary"} size={"small"}>
                <MdOutlineReadMore style={{fontSize: '27px'}}/>
              </Link>
          }
      >
        <Space style={{ width: '100%' }} size={20} direction={'vertical'}>
          <Flex wrap={true} justify={'space-between'} gap={5} align={'center'}>
            <Tooltip title={<p>Начало времени:</p>} placement="top">
              <Flex align={'center'} wrap={'nowrap'} gap={8}>
                <CalendarFilled className={'icon'} />
                <Text type={'secondary'}>{dayjs(task?.main_task_created_at).format('DD.MM.YYYY')}</Text>
              </Flex>
            </Tooltip>

            <Tooltip title={<p>Окончание срока:</p>} placement="top">
              <Flex wrap={'nowrap'} align={'center'} gap={8}>
                <FieldTimeOutlined className={'icon'} />
                <Text type={'secondary'}>{dayjs(task?.main_task_deadline).format('DD.MM.YYYY h:mm:ss')}</Text>
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
                Ответственный человек:
            </Text>
            <Tooltip
                title={
                    <Flex vertical={true} gap={5} >
                        <Flex gap={5} align={'center'}>
                            <FaRegUserCircle />
                            <p>{task?.main_task_responsible_user?.full_name}</p>
                        </Flex>

                    </Flex>


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
              {dayjs(task?.staff_last_sub_task_updated_at).format('DD.MM.YYYY')}
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
