import {Button, Card, Flex, Space, Spin, Tag, Tooltip, Typography, Tabs, Steps} from "antd";
import { useEditQuery } from "../../../service/query/Queries";
import CommentUser from "./commentUser";
import {FaFileDownload, FaRegCommentDots} from "react-icons/fa";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { AvatarUserProfile , HistoryCard } from "../../../components";
import { MdOutlineUpdate } from "react-icons/md";
import DeadlineStatusColor from "../../../hooks/deadlineStatusColor";
import TaskStatusChecking from "./taskStatusChecking";
import './index.scss'
import {useEffect} from "react";
const { Title , Text } = Typography;
const { TabPane } = Tabs;

const SubTaskInner = ({ refetchTaskInner,subTask, showModal, whichWriteID, responsible_user_id, creat_by_id, setWhichWriteID, includedUser, deadline_status, isPostCommentSuccess }) => {
  const { data: { user } = {} } = useSelector((state) => state.auth);
  const StatusDeadlineColor = DeadlineStatusColor(deadline_status);
  const roles = user?.roles[0]?.role?.name;
  const { mutate: updateSubTaskStatus, isLoading: isLoadingUpdateSubTaskStatus,isSuccess } = useEditQuery();

  const clickHandle = (id) => {
    setWhichWriteID(id);
    showModal();
  };

  useEffect(() => {
    if (isSuccess){
    refetchTaskInner()

    }
  }, [isSuccess]);
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
                <Card className={"card--sub-task"} key={task?.id} size={"small"} bordered={true}>
                  <Flex className={"card--sub-task__card"} vertical={true} >
                    <Flex justify={"space-between"} gap={10}>
                      <Space size={[6 , 12]} >
                        <Flex align={"start"} gap={5} vertical={true}>
                          <Title className={'page--title'} level={4}>{task?.title}</Title>
                          <Text type={'secondary'}>{task?.text}</Text>
                          {task?.file && (
                              <Tag className={'file'} color={'blue'} icon={<FaFileDownload  style={{ fontSize:14 ,flexShrink:0}} />} style={{display:"flex" , alignItems:'center' , gap:5 ,width:'100%'}}>
                                <a role={'button'} href={task?.file} download={task?.file} target={"_blank"}>
                                  <p >{extractFilename(task.file)}</p>
                                </a>
                              </Tag>
                          )}
                        </Flex>
                      </Space>
                      <Space size={[5 ,10]}>
                        <Flex align={"start"}  gap={2}>
                        {(roles === 'admin' || roles === 'general_director')  && (
                            <AvatarUserProfile
                                keyId={task?.task_manager?.id}
                                full_name={task?.task_manager?.full_name}
                                moduls={task?.task_manager?.position}
                                image={task?.task_manager?.image}
                            />
                        )}
                        <Tooltip key={task?.id} title={'Крайний срок'}>
                          <Tag color={`${StatusDeadlineColor}`} icon={<MdOutlineUpdate />} style={{ position: "absolute", transform: 'translateX(50%)', right: '50%', top: '0', display: "flex", alignItems: "center", gap: 5 }}>
                            {dayjs(task?.deadline).format("DD.MM.YYYY")}
                          </Tag>
                        </Tooltip>
                        <Flex justify={'end'} align={'start'}>
                          <TaskStatusChecking
                              id={task?.id}
                              task_manager={task?.task_manager?.id}
                              task_status={task?.status}
                              roles={roles}
                              user_id={user?.id}
                              creat_by_id={creat_by_id}
                              updateStatus={updateStatus}
                              responsible_user_id={responsible_user_id}
                          />
                        </Flex>
                        {task?.status !== 'done' && (
                            <Button type="primary" onClick={() => clickHandle(task?.id)}>
                              <FaRegCommentDots />
                            </Button>
                        )}
                        </Flex>

                      </Space>
                    </Flex>

                    <Tabs defaultActiveKey="1">
                          <TabPane tab="История процесса" key="2" style={{height:50}}>
                            <Space size={'small'} direction={"vertical"} style={{ width: '100%', height: 250, overflowY: "scroll" }}>
                              {task?.histories.map((history) => (
                                  <HistoryCard history={history} key={history.id} />
                              ))}
                            </Space>
                          </TabPane>

                          <TabPane tab="Комментарии" key="1">
                            <Space size={'small'} direction={"vertical"} style={{ width: '100%', height: 250, overflowY: "scroll" }}>
                              {task?.messages.map((message) => (
                                  <CommentUser key={message?.id} comment={message} />
                              ))}
                            </Space>
                          </TabPane>
                    </Tabs>
                  </Flex>
                </Card>
            ))}
          </Flex>
        </Spin>
      </div>
  );
};

export default SubTaskInner;
