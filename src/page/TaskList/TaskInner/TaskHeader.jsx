import {Button, Checkbox, Col, Flex, Popconfirm, Row, Spin, Typography} from "antd";
import React, {useEffect,  useState} from "react";
import {useEditQuery} from "../../../service/query/Queries";
import {FaRegCommentDots} from "react-icons/fa";
import {useSelector} from "react-redux";
const {Text, Title} = Typography;


const TaskHeader = ({title, text,  task_status , id ,showModal ,setWhichWriteIDTask}) => {
  const {data: {user} = {}} = useSelector((state) => state.auth);

  const [checkedState, setCheckedState] = useState({});
  const {
    mutate: putProjectDone,
    isLoading: putProjectDoneLoading,
    isSuccess: putProjectDoneSuccess
  } = useEditQuery()
  const roles = user?.roles[0]?.role?.name
  const onChangeDoneProject = (id) => {
    if (task_status === "done" && roles !== "staff") {
      putProjectDone({url: `/users/tasks-update`, data: {status: 'not_started'}, id})
      setCheckedState((prevState) => ({...prevState, [id]: true}));
    } else if (roles === "staff" || roles === "boss") {
      // checking
      putProjectDone({url: `/users/tasks-update`, data: {status: 'done'}, id})
      setCheckedState((prevState) => ({...prevState, [id]: true}));
    }
  }
  useEffect(() => {
    setCheckedState((prevState) => ({...prevState, [id]: task_status === 'done' ? true : false}));
  }, [id])

  const clickHandle = (id) => {
    showModal()
    setWhichWriteIDTask(id)
  }

  return (
      <div>
        <Spin spinning={putProjectDoneLoading}>
          <Row style={{width: '100%'}}>
            <Col span={20}>
              <Flex gap={20} align={"start"}>
                <Popconfirm
                    cancelText={'Отменить'}
                    okText={'Завершить'}
                    title={'Выполнить задачу?'}
                    description={'Вы уверены, что хотите выполнить задачу?'}
                    onConfirm={() => onChangeDoneProject(id)}
                >
                  <Checkbox checked={!!checkedState[id]} style={{marginRight: 8}}/>
                </Popconfirm>
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
              </Flex>
            </Col>

          </Row>


        </Spin>
      </div>
  );
};
export default TaskHeader