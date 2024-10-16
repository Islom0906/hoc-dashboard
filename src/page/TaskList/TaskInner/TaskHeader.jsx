import {Button, Checkbox, Col, Flex, Popconfirm, Row, Spin, Tag, Typography} from "antd";
import React, {useEffect,  useState} from "react";
import {useEditQuery} from "../../../service/query/Queries";
import {FaRegCommentDots} from "react-icons/fa";
import {useSelector} from "react-redux";
import {IoMdCheckboxOutline} from "react-icons/io";
import {CgDanger} from "react-icons/cg";
const {Text, Title} = Typography;


const TaskHeader = ({title, text,  task_status , id ,showModal ,setWhichWriteIDTask ,creatBy}) => {
  const {data: {user} = {}} = useSelector((state) => state.auth);

  const [checkedState, setCheckedState] = useState({});
  const {
    mutate: putProjectDone,
    isLoading: putProjectDoneLoading,
    isSuccess: putProjectDoneSuccess
  } = useEditQuery()
  const roles = user?.roles[0]?.role?.name

  useEffect(() => {
    setCheckedState((prevState) => ({...prevState, [id]: task_status === 'checking' ? true : false}));
  }, [id])

  const clickHandle = (id) => {
    showModal()
    setWhichWriteIDTask(id)
  }

  const handleStatusChecking = (id) => {
    // if(task_status === 'progress') {
      putProjectDone({url: `/users/tasks-update`, data: {status: 'checking'}, id})
    // }
  }
  const handleStatusDone = (id) => {
    // if(task_status === 'progress') {
    putProjectDone({url: `/users/tasks-update`, data: {status: 'done'}, id})
    // }
  }
  const handleStatusProgress = (id) => {
    // if(task_status === 'progress') {
    putProjectDone({url: `/users/tasks-update`, data: {status: 'progress'}, id})
    // }
  }


  return (
      <div>
        <Spin spinning={putProjectDoneLoading}>
          <Row style={{width: '100%'}}>
            <Col span={24}>
              {
                task_status === 'checking' && (roles === 'admin' || creatBy?.id === user?.id  ) ?
                    <>
                      <Button type="primary" onClick={() => handleStatusDone(id)}>
                        <IoMdCheckboxOutline />
                      </Button>
                      <Button color="danger" variant="solid" onClick={() => handleStatusProgress(id)}>
                        <CgDanger />
                      </Button>
                    </>
                    :
                    <Tag color={'red'}>
                      Checking
                    </Tag>

              }

              {
                task_status === 'checking' && task_status !== 'done' ?
                    <Tag color={'red'}>
                      Checking
                    </Tag>
                    :
                    <Button type="primary" onClick={() => handleStatusChecking(id)}>
                      <IoMdCheckboxOutline />
                    </Button>
              }
              {
                  task_status === 'done' &&
                  <Tag color={'red'}>
                    Done
                  </Tag>

              }
            </Col>
            <Col span={20}>
              <Flex gap={20} align={"start"}>
                {/*<Popconfirm*/}
                {/*    cancelText={'Отменить'}*/}
                {/*    okText={'Завершить'}*/}
                {/*    title={'Выполнить задачу?'}*/}
                {/*    description={'Вы уверены, что хотите выполнить задачу?'}*/}
                {/*    onConfirm={() => onChangeDoneProject(id)}*/}
                {/*>*/}
                {/*  <Checkbox checked={!!checkedState[id]} style={{marginRight: 8}}/>*/}
                {/*</Popconfirm>*/}
                <Flex align={"start"} gap={5} vertical={true}>
                  <Title level={4}>{title}</Title>
                  <Text>{text}</Text>
                </Flex>
              </Flex>
            </Col>
            <Col span={4}>
              <Flex align={"start"} justify={"end"} style={{width: '100%'}}>
                <Button type="primary" onClick={() => clickHandle(id)}>
                  <FaRegCommentDots/>
                </Button>

                {/*{*/}
                {/*  roles === 'admin' ?*/}
                {/*      task_status ==='checking' ?*/}
                {/*      <Button type="primary" onClick={() => clickHandle(id)}>*/}
                {/*        <IoMdCheckboxOutline />*/}
                {/*      </Button>*/}
                {/*          : ''*/}
                {/*      :*/}
                {/*      <Button type="primary" onClick={() => handleStatusProgress(id)}>*/}
                {/*        <IoMdCheckboxOutline />*/}
                {/*      </Button>*/}
                {/*}*/}


              </Flex>
            </Col>
          </Row>


        </Spin>
      </div>
  );
};
export default TaskHeader