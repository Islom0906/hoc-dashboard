import {Button, Col, Row, Spin, Tag, Typography, Flex, Popconfirm} from "antd";
import React, { useEffect, useState } from "react";
import { useEditQuery } from "../../../service/query/Queries";
import { FaRegCommentDots } from "react-icons/fa";
import { useSelector } from "react-redux";
import { IoMdCheckboxOutline } from "react-icons/io";
import { CgDanger } from "react-icons/cg";

const { Text, Title } = Typography;

const TaskHeader = ({ title, text, task_status, id, showModal, setWhichWriteIDTask, creatBy }) => {
  const { data: { user } = {} } = useSelector((state) => state.auth);

  const [checkedState, setCheckedState] = useState({});
  const { mutate: updateTaskStatus, isLoading: isUpdating } = useEditQuery();
  const roles = user?.roles[0]?.role?.name;

  useEffect(() => {
    setCheckedState((prevState) => ({ ...prevState, [id]: task_status === 'checking' }));
  }, [id, task_status]);

  const clickHandle = (id) => {
    showModal();
    setWhichWriteIDTask(id);
  };

  const updateStatus = (id, newStatus) => {
    updateTaskStatus({ url: `/users/tasks-update`, data: { status: newStatus }, id });
  };

  const taskStatusChecking = () => {
    if(roles === 'general_director'|| roles === 'director' || user?.roles[0]?.module?.id ) {
      if(task_status === 'done'){
        return <Tag color="green">Done</Tag>
      }else if(task_status === 'progress'){
        return <Tag color="green">Progress</Tag>
      }else if(task_status === 'checking'){
        return <Tag color="green">Checking</Tag>
      }
    }else if( creatBy?.id === user?.id || roles === 'admin' ){
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
      }else {
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
        }else {
        console.log('aaa')
        }
      }
    }
  }

  return (
      <div>
        <Spin spinning={isUpdating}>
          <Row style={{ width: "100%" }}>
            <Col span={24}>
              {/*{*/}
              {/*  roles === 'general' && task_status === "done" &&*/}
              {/*    <Tag color="green">Done</Tag>*/}
              {/*}*/}
              {/*{*/}
              {/*    roles === 'general' && task_status === "progress" &&*/}
              {/*    <Tag color="green">progress</Tag>*/}
              {/*}*/}


              {/*{task_status === 'checking' && (roles === 'admin' || creatBy?.id === user?.id) ? (*/}
              {/*    <>*/}
              {/*      <Button type="primary" onClick={() => updateStatus(id, 'done')}>*/}
              {/*        <IoMdCheckboxOutline /> Done*/}
              {/*      </Button>*/}
              {/*      <Button type="danger" onClick={() => updateStatus(id, 'progress')}>*/}
              {/*        <CgDanger /> Set to Progress*/}
              {/*      </Button>*/}
              {/*    </>*/}
              {/*) : task_status === 'checking' && task_status !== 'done' ? (*/}
              {/*    <Tag color="red">Checking</Tag>*/}
              {/*) : task_status !== 'done' ? (*/}
              {/*    <Button type="primary" onClick={() => updateStatus(id, 'checking')}>*/}
              {/*      <IoMdCheckboxOutline /> Set to Checking*/}
              {/*    </Button>*/}
              {/*) : (*/}
              {/*    <Tag color="green">Done</Tag>*/}
              {/*)}*/}

              {
                taskStatusChecking()
              }
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
              <Flex align="start" justify="end" style={{ width: "100%" }}>
                <Button type="primary" onClick={() => clickHandle(id)}>
                  <FaRegCommentDots />
                </Button>
              </Flex>
            </Col>
          </Row>
        </Spin>
      </div>
  );
};

export default TaskHeader;
