import {
  Avatar,
  Col,
  Row,
  Space,
  Modal,
  Spin, Flex,
} from "antd";
import { useParams } from "react-router-dom";
import  { useEffect, useState } from "react";
import { AvatarUserProfile, TaskInnerCard } from "../../../components";
import { useSelector } from "react-redux";
import { useGetByIdQuery } from "../../../service/query/Queries";
import WriteComment from "./writeComment";
import SubTaskInner from "./subTaskInner";
import CommentUser from "./commentUser";
import TaskHeader from "./TaskHeader";

const TaskInner = () => {
  const [open, setOpen] = useState(false);
  const [whichWriteID, setWhichWriteID] = useState(null);
  const [whichWriteIDTask, setWhichWriteIDTask] = useState(null);
  const [isPostCommentSuccess, setIsPostCommentSuccess] = useState(null);
  const { item } = useParams();
  const { data: { user } } = useSelector(state => state.auth);

  const {
    data: taskInner,
    refetch: refetchTaskInner,
    isLoading: loadingTaskInner,
  } = useGetByIdQuery(false, "taskInner", item, 'users/staff-subtask-retrieve');

  useEffect(() => {
    refetchTaskInner();
  }, [user]);

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
      <Spin spinning={loadingTaskInner}>
        <Row gutter={[16, 16]}>
          <Col span={16}>
            <Space style={{width:'100%'}} direction={"vertical"} size="middle">
              <div>
                {taskInner?.sub_tasks?.length > 0 ? (
                    <>
                      <h1>{taskInner?.title}</h1>
                      <p>{taskInner?.text}</p>
                    </>
                ) : (
                    <TaskHeader
                        responsible_user_id={taskInner?.responsible_user?.id}
                        task_manager={taskInner?.task_manager}
                        showModal={showModal}
                        task_status={taskInner?.status}
                        setWhichWriteIDTask={setWhichWriteIDTask}
                        title={taskInner?.title}
                        text={taskInner?.text}
                        id={taskInner?.id}
                        creat_by_id={taskInner?.created_by?.id}
                    />
                )}
              </div>
              <div>
                {taskInner?.sub_tasks.length > 0 ? (
                    <SubTaskInner
                        whichWriteID={whichWriteID}
                        isPostCommentSuccess={isPostCommentSuccess}
                        includedUser={taskInner?.included_users}
                        subTask={taskInner?.sub_tasks}
                        setWhichWriteID={setWhichWriteID}
                        showModal={showModal}
                        deadline_status={taskInner?.deadline_status}
                        creat_by_id={taskInner?.created_by?.id}
                        responsible_user_id={taskInner?.responsible_user?.id}
                    />
                ) : (
                    <Space direction="vertical" size="large" style={{ width: '100%' ,  height:300 , overflowY:"scroll"}}>
                      {taskInner?.messages?.map(message => (
                          <CommentUser key={message?.id} comment={message} />
                      ))}
                    </Space>
                )}
              </div>
            </Space>
          </Col>
          <Col span={8}>
            <Space style={{width:"100%"}} direction={"vertical"} size="large">
              <Flex justify={"end"}>
                <Avatar.Group>
                  {taskInner?.included_users?.map(user => (
                      <AvatarUserProfile
                          key={user?.id}
                          full_name={user?.full_name}
                          roles={user?.roles[0].position}
                          image={user?.image}
                      />
                  ))}
                </Avatar.Group>
              </Flex>
              <Flex style={{width:'100%'}} justify={"end"} >
                <TaskInnerCard
                    tag={taskInner?.company}
                    main_task_responsible_user={taskInner?.responsible_user}
                    taskPercent={taskInner?.done_sub_tasks_count / taskInner?.sub_tasks_count * 100}
                    main_task_deadline={taskInner?.deadline}
                    main_task_created_at={taskInner?.created_at}
                    main_deadline_status={taskInner?.deadline_status}
                    created_by={taskInner?.created_by}
                />
              </Flex>
            </Space>
          </Col>
          <Modal
              open={open}
              title="Добавить комментарий"
              onCancel={handleCancel}
              footer={null}
          >
            <WriteComment
                whichWriteID={whichWriteID}
                whichWriteIDTask={whichWriteIDTask}
                handleCancel={handleCancel}
                setIsPostCommentSuccess={setIsPostCommentSuccess}
            />
          </Modal>
        </Row>
      </Spin>
  );
};

export default TaskInner;
