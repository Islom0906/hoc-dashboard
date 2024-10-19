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
import {IoMdCheckboxOutline} from "react-icons/io";
import {CgDanger} from "react-icons/cg";
const { Title } = Typography;

const SubTaskInner = ({ subTask, showModal, whichWriteID, responsible_user_id, creat_by_id, setWhichWriteID, includedUser, deadline_status, isPostCommentSuccess }) => {
  const { data: { user } = {} } = useSelector((state) => state.auth);
  const StatusDeadlineColor = DeadlineStatusColor(deadline_status);
  const roles = user?.roles[0]?.role?.name
  const { mutate: updateSubTaskStatus, isLoading: isLoadingUpdateSubTaskStatus } = useEditQuery();

  const clickHandle = (id) => {
    setWhichWriteID(id);
    showModal();
  };
  const extractFilename = (url) => {
    return url.substring(url.lastIndexOf('/') + 1);
  };
  const updateStatus = (id, newStatus) => {
    clickHandle(id)
    updateSubTaskStatus({ url: `/users/staff-subtasks`, data: { status: newStatus }, id });
  };

  const taskStatusChecking = ( id,task_manager ,task_status ) => {
    if(task_manager === user?.id){
      if(task_status === 'done'){
        return <Tag color="green">Done</Tag>
      }else if(task_status === 'progress'){
        return<Popconfirm
            cancelText={'Отменить'}
            okText={'Завершить'}
            title={'Завершить задачу'}
            description={'Вы уверены, что хотите завершить задачу?'}
            onConfirm={() => updateStatus(id, 'checking')}
        >
          <Button type="primary">
            <IoMdCheckboxOutline /> Set to Checking
          </Button>
        </Popconfirm>
      }else if(task_status === 'checking'){
        return<Tag color="green">Checking</Tag>
      }
    }
    if(  roles === 'general_director'|| roles === 'director' || responsible_user_id === user?.id || (roles === 'boss' && creat_by_id !== user?.id)) {
      if(task_status === 'done'){
        return <Tag color="green">Done</Tag>
      }else if(task_status === 'progress'){
        return <Tag color="green">Progress</Tag>
      }else if(task_status === 'checking'){
        return <Tag color="green">Checking</Tag>
      }
    }else if( creat_by_id === user?.id || roles === 'admin' ){
      if(task_status === 'done'){
        return <Tag color="green">Done</Tag>
      }else if(task_status === 'progress'){
        return <Tag color="green">Progress</Tag>
      }else if(task_status === 'checking'){
        return(<>
          <Popconfirm
              cancelText={'Отменить'}
              okText={'Завершить'}
              title={'Завершить задачу'}
              description={'Вы уверены, что хотите завершить задачу?'}
              onConfirm={() => updateStatus(id, 'done')}
          >
            <Button type="primary">
              <IoMdCheckboxOutline /> Done
            </Button>
          </Popconfirm>
          <Popconfirm
              cancelText={'Отменить'}
              okText={'Завершить'}
              title={'Завершить задачу'}
              description={'Вы уверены, что хотите завершить задачу?'}
              onConfirm={() => updateStatus(id, 'progress')}
          >
            <Button type="danger">
              <CgDanger /> Set to Progress
            </Button>
          </Popconfirm>
        </>)
      }
    }
  }
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
                        {user?.roles[0].name === 'admin' && includedUser?.find(user => user?.id === task?.staff) &&
                            <AvatarUserProfile key={includedUser?.find(user => user?.id === task?.staff)?.id} full_name={includedUser?.find(user => user?.id === task?.staff)?.full_name} moduls={includedUser?.find(user => user?.id === task?.staff)?.position} image={includedUser?.find(user => user?.id === task?.staff)?.image} messenger1={includedUser?.find(user => user?.id === task?.staff)?.messenger_link1} messenger2={includedUser?.find(user => user?.id === task?.staff)?.messenger_link2} />
                        }
                        <Tooltip key={task?.id} title={'Крайний срок'}>
                          <Tag color={`${StatusDeadlineColor}`} icon={<MdOutlineUpdate />} style={{ position: "absolute", transform: 'translateX(50%)', right: '50%', top: '0', display: "flex", alignItems: "center", gap: 10 }}>
                            {dayjs(task?.deadline).format("DD.MM.YYYY")}
                          </Tag>
                        </Tooltip>
                        {
                          taskStatusChecking(task?.id ,task?.task_manager ,task?.status )
                        }
                        <Button type="primary" size={"small"} onClick={() => clickHandle(task?.id)}>
                          <FaRegCommentDots />
                        </Button>
                      </Flex>
                    </Flex>
                    {task?.messages.length > 0 && <Divider plain>Комментарии</Divider>}
                    <Space size={'large'} direction={"vertical"} style={{ width: '100%' ,  height:300 , overflowY:"scroll"}}>
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
