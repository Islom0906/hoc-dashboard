import { Button, Card, Checkbox, Divider, Flex, Popconfirm, Space, Spin, Tag, Tooltip, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useEditQuery } from "../../../service/query/Queries";
import CommentUser from "./commentUser";
import { FaRegCommentDots } from "react-icons/fa";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { AvatarUserProfile } from "../../../components";
import { MdOutlineUpdate } from "react-icons/md";
import DeadlineStatusColor from "../../../hooks/deadlineStatusColor";
import { deadlineColor } from "../../../constants/deadlineColor";
import {CiLink} from "react-icons/ci";
const { Title } = Typography;

const SubTaskInner = ({ subTask, showModal, whichWriteID, setWhichWriteID, includedUser, deadline_status, isPostCommentSuccess }) => {
  const { data: { user } = {} } = useSelector((state) => state.auth);
  const [checkedState, setCheckedState] = useState({});
  const [isChecked, setIsChecked] = useState(false);
  const StatusDeadlineColor = DeadlineStatusColor(deadline_status);
  const { mutate: putProjectDone, isLoading: putProjectDoneLoading } = useEditQuery();
  const roles = user?.roles[0]?.role?.name

  const clickHandle = (id) => {
    setWhichWriteID(id);
    showModal();
  };
  const onChangeDoneProject = (id) => {
    setIsChecked(true);
    setWhichWriteID(id);
    showModal();
  };
  const extractFilename = (url) => {
    return url.substring(url.lastIndexOf('/') + 1);
  };
  useEffect(() => {
    const [subTaskItem] = subTask.filter((subtaskChild) => subtaskChild?.id === whichWriteID);
    if (isPostCommentSuccess && isChecked) {
      if (subTaskItem?.status === "done" && roles !== "staff") {
        putProjectDone({ url: `/users/staff-subtasks`, data: { status: 'progress' }, id: whichWriteID });
        setCheckedState((prevState) => ({ ...prevState, [whichWriteID]: false }));
      } else if ( roles === "staff" || roles === "boss") {
        putProjectDone({ url: `/users/staff-subtasks`, data: { status: 'checking' }, id: whichWriteID });
        setCheckedState((prevState) => ({ ...prevState, [whichWriteID]: true }));
      }
      setIsChecked(false);
    }
  }, [isPostCommentSuccess]);

  useEffect(() => {
    subTask?.map((item) => {
      setCheckedState((prevState) => ({ ...prevState, [item?.id]: item?.status === 'checking' ? true : false }));
    });
  }, [subTask]);

  return (
      <div>
        <Spin spinning={putProjectDoneLoading}>
          <Flex vertical={true} gap={30}>
            {subTask?.map((task) => (
                <Card key={task?.id} size={"small"} bordered={true}>
                  <Flex vertical={true} style={{ padding: '10px', paddingTop: '25px', borderRadius: 10, position: 'relative' }}>
                    <Flex justify={"space-between"} gap={10}>
                      <Flex gap={10} align={"start"}>
                        <Popconfirm
                            cancelText={'Отменить'}
                            okText={'Завершить'}
                            title={'Завершить задачу'}
                            description={'Вы уверены, что хотите завершить задачу?'}
                            onConfirm={() => onChangeDoneProject(task?.id)}
                        >
                          <Checkbox checked={!!checkedState[task.id]} style={{ marginRight: 8 }} />
                        </Popconfirm>
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
                        {user?.roles[0].name === 'admin' && includedUser?.find(user => user?.id === task?.staff) &&
                            <AvatarUserProfile key={includedUser?.find(user => user?.id === task?.staff)?.id} full_name={includedUser?.find(user => user?.id === task?.staff)?.full_name} moduls={includedUser?.find(user => user?.id === task?.staff)?.position} image={includedUser?.find(user => user?.id === task?.staff)?.image} messenger1={includedUser?.find(user => user?.id === task?.staff)?.messenger_link1} messenger2={includedUser?.find(user => user?.id === task?.staff)?.messenger_link2} />
                        }
                        <Tooltip key={task?.id} title={'Крайний срок'}>
                          <Tag color={`${StatusDeadlineColor}`} icon={<MdOutlineUpdate />} style={{ position: "absolute", transform: 'translateX(50%)', right: '50%', top: '0', display: "flex", alignItems: "center", gap: 10 }}>
                            {dayjs(task?.deadline).format("DD.MM.YYYY")}
                          </Tag>
                        </Tooltip>
                        <Button type="primary" size={"small"} onClick={() => clickHandle(task?.id)}>
                          <FaRegCommentDots />
                        </Button>
                      </Flex>
                    </Flex>
                    {task?.messages.length > 0 && <Divider plain>Комментарии</Divider>}
                    <Space size={'large'} direction={"vertical"} style={{ width: '100%' }}>
                      {task?.messages?.map((message) => (
                          <CommentUser key={message?.id} comment={message} />
                      ))}
                    </Space>
                  </Flex>
                </Card>
            ))}
          </Flex>
        </Spin>
      </div>
  );
};

export default SubTaskInner;
