import {Button, Col, Row, Spin, Tag, Typography, Flex, Popconfirm, Tooltip} from "antd";
import React, { useEffect, useState } from "react";
import { useEditQuery } from "../../../service/query/Queries";
import { FaRegCommentDots } from "react-icons/fa";
import { useSelector } from "react-redux";
import { IoMdCheckboxOutline } from "react-icons/io";
import { CgDanger } from "react-icons/cg";
import {ProfileHoverActive} from "../../../components";

const { Text, Title } = Typography;

const TaskHeader = ({ task_manager, responsible_user_id ,title, text, task_status, id, showModal, setWhichWriteIDTask, creat_by_id }) => {
  const { data: { user } = {} } = useSelector((state) => state.auth);

  const { mutate: updateTaskStatus, isLoading: isUpdating } = useEditQuery();
  const roles = user?.roles[0]?.role?.name;

  const clickHandle = (id) => {
    showModal();
    setWhichWriteIDTask(id);
  };

  const updateStatus = (id, newStatus) => {
    clickHandle(id)
    updateTaskStatus({ url: `/users/tasks-update`, data: { status: newStatus }, id });
  };

  const taskStatusChecking = () => {
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
          <Tooltip
              title={'Установить для проверки'}
              placement="top"
          >
          <Button type="primary">
            <IoMdCheckboxOutline />
          </Button>
          </Tooltip>
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
          <Tooltip
              title={'Сделанный'}
              placement="top"
          >
          <Button type="primary">
            <IoMdCheckboxOutline />
          </Button>
          </Tooltip>
        </Popconfirm>
        <Popconfirm
            cancelText={'Отменить'}
            okText={'Завершить'}
            title={'Завершить задачу'}
            description={'Вы уверены, что хотите завершить задачу?'}
            onConfirm={() => updateStatus(id, 'progress')}
        >
          <Tooltip
              title={'Установить на Прогресс'}
              placement="top"
          >
            <Button type="primary" danger>
              <CgDanger />
            </Button>
          </Tooltip>

        </Popconfirm>
          </>)
      }
    }
  }

  return (
      <div>
        <Spin spinning={isUpdating}>
          <Row style={{ width: "100%" }}>
            <Col span={24}>

            </Col>
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
                {
                  taskStatusChecking()
                }
                {
                  task_status !== 'done' &&
                    <Tooltip
                        title={'Написать комментарий'}
                        placement="top">
                      <Button type="primary" onClick={() => clickHandle(id)}>
                        <FaRegCommentDots />
                      </Button>
                    </Tooltip>
                }

              </Flex>
            </Col>
          </Row>
        </Spin>
      </div>
  );
};

export default TaskHeader;
