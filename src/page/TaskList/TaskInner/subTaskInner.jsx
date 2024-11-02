import { Button, Card, Divider, Flex, Space, Spin, Tag, Tooltip, Typography } from "antd";
import { useEditQuery } from "../../../service/query/Queries";
import CommentUser from "./commentUser";
import { FaRegCommentDots } from "react-icons/fa";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { AvatarUserProfile } from "../../../components";
import { MdOutlineUpdate } from "react-icons/md";
import DeadlineStatusColor from "../../../hooks/deadlineStatusColor";
import { CiLink } from "react-icons/ci";
import TaskStatusChecking from "./taskStatusChecking";
import {IoMdArrowDropright} from "react-icons/io";
import HistoryCard from "../../../components/TaskTable/HistoryCard";
const { Title } = Typography;

const SubTaskInner = ({ subTask, showModal, whichWriteID, responsible_user_id, creat_by_id, setWhichWriteID, includedUser, deadline_status, isPostCommentSuccess }) => {
  const { data: { user } = {} } = useSelector((state) => state.auth);
  const StatusDeadlineColor = DeadlineStatusColor(deadline_status);
  const roles = user?.roles[0]?.role?.name;
  const { mutate: updateSubTaskStatus, isLoading: isLoadingUpdateSubTaskStatus } = useEditQuery();

  const clickHandle = (id) => {
    setWhichWriteID(id);
    showModal();
  };

  const extractFilename = (url) => url.substring(url.lastIndexOf('/') + 1);

  const updateStatus = (id, newStatus) => {
    clickHandle(id);
    updateSubTaskStatus({ url: `/users/staff-subtasks`, data: { status: newStatus }, id });
  };

  return (
      <div>
        <Spin spinning={isLoadingUpdateSubTaskStatus}>
          <Flex vertical={true} gap={30}>
            {subTask?.map((task) => (
                <Card key={task?.id} size={"small"} bordered={true}>
                  <Flex vertical={true} style={{ padding: '10px', paddingTop: '25px', borderRadius: 10, position: 'relative' }}>
                    <Flex justify={"space-between"} gap={10}>
                      <Flex gap={10} align={"start"}>
                        <Flex align={"start"} gap={5} vertical={true}>
                          <Title level={4}>{task?.title}</Title>
                          <p>{task?.text}</p>
                          {
                              task?.file &&
                              <Tag color={'blue'} icon={<CiLink />} style={{display:"flex" , alignItems:'center' , gap:5}}>
                                <a href={task?.file} download={true} target={"_blank"}>
                                  {extractFilename(task.file)}
                                </a>
                              </Tag>
                          }
                        </Flex>
                      </Flex>
                      <Flex vertical={true} gap={10}>
                        {(roles === 'admin' || roles === 'general_director') && includedUser?.find(user => user?.id === task?.task_manager) &&
                            <AvatarUserProfile key={includedUser?.find(user => user?.id === task?.task_manager)?.id} full_name={includedUser?.find(user => user?.id === task?.task_manager)?.full_name} moduls={includedUser?.find(user => user?.id === task?.task_manager)?.position} image={includedUser?.find(user => user?.id === task?.task_manager)?.image}  />
                        }
                        <Tooltip key={task?.id} title={'Крайний срок'}>
                          <Tag color={`${StatusDeadlineColor}`} icon={<MdOutlineUpdate />} style={{ position: "absolute", transform: 'translateX(50%)', right: '50%', top: '0', display: "flex", alignItems: "center", gap: 10 }}>
                            {dayjs(task?.deadline).format("DD.MM.YYYY")}
                          </Tag>
                        </Tooltip>
                        <Flex justify={'end'} align={'center'}>
                          <TaskStatusChecking
                              id={task.id}
                              task_manager={task.task_manager}
                              task_status={task.status}
                              roles={roles}
                              user_id={user.id}
                              creat_by_id={creat_by_id}
                              updateStatus={updateStatus}
                              responsible_user_id={responsible_user_id}
                          />
                        </Flex>
                        {task?.status !== 'done' &&
                            <Button type="primary" size={"small"} onClick={() => clickHandle(task?.id)}>
                              <FaRegCommentDots />
                            </Button>
                        }
                      </Flex>
                    </Flex>

                    {task?.histories?.length > 0 && <Divider plain>История процесса</Divider>}
                    {task?.histories?.length > 0 && (
                        <Flex gap={10} wrap={"nowrap"} style={{ width: '100%', overflowX: "scroll" }}>
                          {task?.histories.map((history) => (
                              <HistoryCard history={history} key={history.id}  />
                          ))}
                        </Flex>
                    )}

                    {task?.messages?.length > 0 && <Divider plain>Комментарии</Divider>}
                    {task?.messages?.length > 0 && (
                        <Space size={'small'} direction={"vertical"} style={{ width: '100%', height: 250, overflowY: "scroll" }}>
                          {task?.messages.map((message) => (
                              <CommentUser key={message?.id} comment={message} />
                          ))}
                        </Space>
                    )}
                  </Flex>
                </Card>
            ))}
          </Flex>
        </Spin>
      </div>
  );
};
export default SubTaskInner;
