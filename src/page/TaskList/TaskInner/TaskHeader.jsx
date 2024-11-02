import {Button, Col, Row, Spin,  Typography, Tooltip, Flex} from "antd";
import { useEditQuery } from "../../../service/query/Queries";
import { FaRegCommentDots } from "react-icons/fa";
import { useSelector } from "react-redux";
import TaskStatusChecking from "./taskStatusChecking";

const { Text, Title } = Typography;

const TaskHeader = ({ task_manager, responsible_user_id, title, text, task_status, id, showModal, setWhichWriteIDTask, creat_by_id }) => {
  const { data: { user } = {} } = useSelector((state) => state.auth);

  const { mutate: updateTaskStatus, isLoading: isUpdating } = useEditQuery();
  const roles = user?.roles[0]?.role?.name;

  const clickHandle = (id) => {
    showModal();
    setWhichWriteIDTask(id);
  };

  const updateStatus = (id, newStatus) => {
    clickHandle(id);
    updateTaskStatus({ url: `/users/tasks-update`, data: { status: newStatus }, id });
  };

  return (
      <div>
        <Spin spinning={isUpdating}>
          <Row style={{ width: "100%" }}>
            <Col span={24}></Col>
            <Col span={20}>
              <Flex gap={20} align="start">
                <Flex align="start" gap={5} vertical>
                  <Title level={4}>{title}</Title>
                  <Text>{text}</Text>
                </Flex>
              </Flex>
            </Col>
            <Col span={4}>
              <Flex align="start" gap={5} justify="end" style={{ width: "100%" }}>
                <TaskStatusChecking
                    id={id}
                    task_manager={task_manager}
                    task_status={task_status}
                    roles={roles}
                    user_id={user?.id}
                    creat_by_id={creat_by_id}
                    updateStatus={updateStatus}
                    responsible_user_id={responsible_user_id}
                />
                {task_status !== 'done' && (
                    <Tooltip title="Написать комментарий" placement="top">
                      <Button type="primary" onClick={() => clickHandle(id)}>
                        <FaRegCommentDots />
                      </Button>
                    </Tooltip>
                )}
              </Flex>
            </Col>
          </Row>
        </Spin>
      </div>
  );
};

export default TaskHeader;
