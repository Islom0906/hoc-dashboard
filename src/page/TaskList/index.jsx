import {
  Avatar,
  Card,
  Col,
  Flex,
  Progress,
  Row,
  Space,
  Tooltip,
  Typography,
} from "antd";
import "./index.scss";
import {
  CalendarFilled,
  FieldTimeOutlined,
} from "@ant-design/icons";
import { useEffect } from "react";
import { MdOutlineReadMore } from "react-icons/md";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import DeadlineStatusColor from "../../hooks/deadlineStatusColor";
import { Link } from "react-router-dom";
import {AvatarUserProfile} from "../../components";
import { useGetQuery } from "../../service/query/Queries";

const TaskList = () => {
  const { data: { user } = {} } = useSelector((state) => state.auth);

  const {
    data: staffGetTask = {},
    refetch: refetchStaffGetTask,
    isSuccess: isSuccessStaffGetTask,
  } = useGetQuery(false, "staff-get-task", "users/staff-subtasks");

  const {
    data: bossGetTask = {},
    refetch: refetchBossGetTask,
    isSuccess: isSuccessBossGetTask,
  } = useGetQuery(false, "boss-get-task", "users/boss-assigned-task-get/");

  useEffect(() => {
    if (user?.roles?.[0]?.name === "boss") {
      refetchBossGetTask();
    } else {
      refetchStaffGetTask();
    }
  }, [user]);


  return (
      <div>
        <h1>Ваши задачи</h1>
        <Row gutter={[24, 24]} style={{ marginTop: 15 }}>
          {staffGetTask?.count > 0 &&
              staffGetTask?.results?.map((task) => (
                  <Col
                      key={task?.main_task_id}
                      className="gutter-row"
                      xs={{ span: 12 }}
                      md={{ span: 8 }}
                      xl={{ span: 6 }}
                  >
                    <TaskCard key={task?.main_task_id} task={task} />
                    {task?.main_task_id}
                  </Col>
              ))}
          {bossGetTask?.count > 0 &&
              bossGetTask?.results?.map((task) => (
                  <Col
                      key={task?.main_task_id}
                      className="gutter-row"
                      xs={{ span: 12 }}
                      md={{ span: 8 }}
                      xl={{ span: 6 }}
                  >
                    <TaskCard key={task?.main_task_id} task={task} />
                  </Col>
              ))}
        </Row>
      </div>
  );
};
export default TaskList;

 const TaskCard = ({ task }) => {
  const deadlineColor = DeadlineStatusColor(task?.main_deadline_status);
  const { Text } = Typography;

  return (
      <Card
          className={"TaskCard"}
          style={{
            borderColor: `${deadlineColor}`,
            borderTop: "6px",
            borderStyle: "solid",
            borderTopColor: `${deadlineColor}`,
          }}
          size={"small"}
          title={task?.main_task_title}
          extra={
            <Link to={`/task-list/${task?.main_task_id}`} type={"primary"} size={"small"}>
              <MdOutlineReadMore style={{ fontSize: "27px" }} />
            </Link>
          }
      >
        <Space style={{ width: "100%" }} size={20} direction={"vertical"}>
          <Flex wrap={true} justify={"space-between"} gap={5} align={"center"}>
            <Tooltip title={<p>Начало времени:</p>} placement="top">
              <Flex align={"center"} wrap={"nowrap"} gap={8}>
                <CalendarFilled className={"icon"} />
                <Text type={"secondary"}>
                  {dayjs(task?.main_task_created_at).format("DD.MM.YYYY")}
                </Text>
              </Flex>
            </Tooltip>

            <Tooltip title={<p>Окончание срока:</p>} placement="top">
              <Flex wrap={"nowrap"} align={"center"} gap={8}>
                <FieldTimeOutlined className={"icon"} />
                <Text type={"secondary"}>
                  {dayjs(task?.main_task_deadline).format("DD.MM.YYYY h:mm:ss")}
                </Text>
              </Flex>
            </Tooltip>
          </Flex>
          <Progress
              percent={(task?.done_sub_tasks_count / task?.sub_tasks_count) * 100}
              percentPosition={{
                align: "center",
                type: "outer",
              }}
              size={["100%", 3]}
              strokeColor="#E6F4FF"
              className={"progress"}
          />
          <Flex align={"center"} justify={"space-between"} gap={5}>
            <Text>Ответственный человек:</Text>
            <AvatarUserProfile full_name={task?.main_task_responsible_user?.full_name} moduls={task?.main_task_responsible_user?.modules?.[0]?.name} image={task?.main_task_responsible_user?.image} />
          </Flex>

          <Flex align={"center"} wrap={true} gap={5} justify={"space-between"}>
            <Text type={"secondary"}>
              {dayjs(task?.staff_last_sub_task_updated_at).format("DD.MM.YYYY")}
            </Text>

            <Avatar.Group size={"small"}>
              {task?.included_users?.map((user) => (
                  <AvatarUserProfile key={user?.id} full_name={user?.full_name} moduls={user?.roles?.[0]?.name} image={user?.image}/>
              ))}
            </Avatar.Group>
          </Flex>
        </Space>
      </Card>
  );
};

