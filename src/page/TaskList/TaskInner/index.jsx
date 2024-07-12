import {
  Avatar,
  Button,
  Card,
  Col,
  Flex,
  Form,
  message,
  Progress,
  Row,
  Space,
  Spin,
  Tooltip,
  Typography,
  Upload,
  Modal, Popconfirm
} from "antd";
import {UserOutlined} from "@ant-design/icons";
import {useParams} from "react-router-dom";
import apiService from "../../../service/apis/api";
import {useMutation, useQuery} from "react-query";
import React, {useEffect, useMemo, useState} from "react";
import dayjs from "dayjs";
import {Checkbox, Input, List} from 'antd';
import {FormTextArea, TaskInnerCard} from "../../../components";
import {onPreviewImage} from "../../../hooks";
import {useSelector} from "react-redux";

const {Text, Title} = Typography;

const TaskInner = () => {
  const [open, setOpen] = useState(false);
  const [whichWriteID, setWhichWriteID] = useState(null);
  const [whichWriteIDTask, setWhichWriteIDTask] = useState(null);
  const {item} = useParams();
  const {data:{user}}=useSelector(state => state.auth)
  const {data: taskInner, refetch: refetchTaskInner, isLoading:loadingTaskInner, isSuccess:successTaskInner} = useQuery(["taskInner", item], () =>
      apiService.getDataByID('users/staff-subtask-retrieve', item), {enabled: false}
  );
  const {data: taskInnerBoss, refetch: refetchTaskInnerBoss, isLoading: loadingTaskInnerBoss, isSuccess:successTaskInnerBoss} = useQuery(["taskInnerBoss", item], () =>
      apiService.getDataByID('users/boss-tasks-retrieve', item), {enabled: false}
  );
  console.log(taskInnerBoss,taskInner)
const isBoss=user?.roles[0].name === 'boss'
  useEffect(() => {
    if(user?.roles[0].name === 'boss') {
      refetchTaskInnerBoss();
    }else{
      refetchTaskInner()
    }
  }, [user]);




  const showModal = () => {
    setOpen(true);
  };

  const handleCommentModel = (id) => {
    showModal()
    setWhichWriteIDTask(id)
  }


  const handleCancel = () => {
    setOpen(false);
  };
  return (
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Flex align={'center'} justify={'space-between'}>
            <h1>
              {isBoss ?taskInnerBoss?.main_task_title: taskInner?.title}
            </h1>
            <Avatar.Group>
              {taskInner?.included_users.map(user => (
                  <Tooltip
                      key={user?.id}
                      title={
                        <p>
                          <span>{user?.full_name}</span>
                          <br/>
                          <span>
                      {user?.roles[0]?.name}
                            {user?.roles[1]?.name}
                    </span>
                        </p>
                      }
                      placement="top"
                  >
                    <Avatar
                        style={{backgroundColor: '#87d068'}}
                        icon={user?.image ? <img src={user?.image} alt={user?.full_name}/> : <UserOutlined/>}
                    />
                  </Tooltip>
              ))}

            </Avatar.Group>
          </Flex>

        </Col>
        <Col span={16}>

          {
              taskInner?.sub_tasks.length  ?
              <TaskList subTask={taskInner?.sub_tasks} setWhichWriteID={setWhichWriteID} showModal={showModal}/>
                  :
                  <Space direction={"vertical"} size={'large'} style={{width:'100%'}}>
                    {taskInner?.messages?.map(message => (
                        <>
                          <Comment comment={message}/>
                        </>
                    ))
                    }
                    <Button  type="primary" onClick={() => handleCommentModel(taskInner?.id)}>
                      Добавить комментарий
                    </Button>

                  </Space>
          }



        </Col>
        <Col span={8}>
          {
            isBoss
                ?

          <TaskInnerCard main_task_responsible_user={taskInnerBoss?.main_task_responsible_user}
                         taskPercent={taskInnerBoss?.done_sub_tasks_count / taskInnerBoss?.sub_tasks_count * 100}
                         main_task_deadline={taskInnerBoss?.main_task_deadline}
                         main_task_created_at={taskInnerBoss?.main_task_created_at}
                         main_deadline_status={taskInnerBoss?.main_deadline_status}/>
                :
                <TaskInnerCard main_task_responsible_user={taskInner?.main_task_responsible_user}
                               taskPercent={taskInner?.done_sub_tasks_count / taskInner?.sub_tasks_count * 100}
                               main_task_deadline={taskInner?.deadline}
                               main_task_created_at={taskInner?.created_at}
                               main_deadline_status={taskInner?.deadline_status}/>
          }
        </Col>

        <Modal
            open={open}
            title=" Добавить коммент"
            onCancel={handleCancel}
            footer={null}
        >
          <WriteComment whichWriteID={whichWriteID} whichWriteIDTask={whichWriteIDTask} handleCancel={handleCancel} />
        </Modal>
      </Row>
  );
};

export const WriteComment = ({whichWriteID ,handleCancel ,whichWriteIDTask}) => {
  const [fileListProps, setFileListProps] = useState([]);
  const [form] = Form.useForm();
  const initialValueForm = {
    message: '',
    file: []
  }
  const {
    mutate: postCommentMutate,
    isLoading: postCommentLoading,
    isSuccess: postCommentSuccess,
  } = useMutation(({url, data}) => apiService.postData(url, data), {
    onSuccess: () => {
      message.success('Успешно')
    },
    onError: (error) => {
      for (let obj in error.response.data) {
        message.error(`${obj}: ${error.response.data[obj][0]}`)
      }
    }
  });


  const {mutate: imagesDeleteMutate} = useMutation(({url, id}) => apiService.deleteData(url, id), {
    onSuccess: () => message.success('Успешно'),
    onError: (error) => message.error(error.message)
  });
  // query-image
  const {
    mutate: imagesUploadMutate,
    data: imagesUpload,
    isLoading: imagesUploadLoading,
    isSuccess: imagesUploadSuccess,
  } = useMutation(({url, formData}) => apiService.postData(url, formData), {
    onSuccess: () => {
      message.success('Успешно')
    },
    onError: (error) => {
      for (let obj in error.response.data) {
        message.error(`${obj}: ${error.response.data[obj][0]}`)
      }
    }
  });
  useEffect(() => {
    if (imagesUploadSuccess) {
      const uploadImg = [{
        uid: imagesUpload?.id,
        name: imagesUpload?.id,
        status: "done",
        url: imagesUpload?.image
      }]
      form.setFieldsValue({image: uploadImg});
      setFileListProps(uploadImg);
    }

  }, [imagesUpload]);
  const onChangeImage = ({fileList: newFileList}) => {
    const formData = new FormData();
    if (fileListProps.length !== 0 || newFileList.length === 0) {
      form.setFieldsValue({image: []});
      const id = [fileListProps[0]?.uid];
      imagesDeleteMutate({url: "users/files", id});
      setFileListProps([])
    } else if (newFileList.length !== 0) {
      formData.append("image", newFileList[0].originFileObj);
      imagesUploadMutate({url: "/users/files/", formData});
    }
  };
  // delete image
  const onFinishFailed = value => {
    console.log(value)
  }
  const onFinish = (value) => {
    const data = {
      task:whichWriteIDTask || null,
      sub_task: whichWriteID || null,
      image: fileListProps[0]?.uid,
      message: value.message,
    }
    postCommentMutate({url: "/users/messages/", data: data});
    form.setFieldsValue(initialValueForm)
    handleCancel()
  }

  return (
      <Spin spinning={imagesUploadLoading || postCommentLoading}>
        <Form
            form={form}
            name="basic"
            labelCol={{
              span: 24
            }}
            wrapperCol={{
              span: 24
            }}
            style={{
              maxWidth: "100%"
            }}
            initialValues={initialValueForm}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
          <FormTextArea
              placeholder={' Добавить коммент'}
              required={true}
              required_message={'текст к заданию'}
              name={'message'}
          />
          <Form.Item
              label='Добавить изображение'
              name={'file'}>
            <Upload
                maxCount={1}
                fileList={fileListProps}
                listType='picture-card'
                onChange={onChangeImage}
                onPreview={onPreviewImage}
                beforeUpload={() => false}
            >
              {fileListProps.length > 0 ? "" : "Добавить"}
            </Upload>
          </Form.Item>
          <Button htmlType="submit" type={"primary"} >
            Отправить
          </Button>
        </Form>
      </Spin>
  )
}

export const TaskList = ({subTask, showModal, setWhichWriteID}) => {
  const [checkedState, setCheckedState] = useState({});
  const clickHandle = (id) => {
    setWhichWriteID(id)
    showModal()
  }
  const {
    mutate: putProjectDone,
    isLoading: putProjectDoneLoading,
    isSuccess: putProjectDoneSuccess
  } = useMutation(({
                     url,
                     data,
                     id
                   }) => apiService.editData(url, data, id), {
    onSuccess: () => {
      message.success('Успешно')
    },
    onError: (error) => {
      for (let obj in error.response.data) {
        message.error(`${obj}: ${error.response.data[obj][0]}`)
      }
    }
  });

  const onChangeDoneProject = (id) => {
    putProjectDone({url: `/users/staff-subtasks`, data:{task_status: 'done'}, id})
    setCheckedState((prevState) => ({ ...prevState, [id]: true }));
  }

  useEffect(() => {
    subTask?.map(item => {
    setCheckedState((prevState) => ({ ...prevState, [item?.id]: item?.task_status === 'done'? true : false }));
    })
  } , [subTask])

  return (
      <div>
        <Spin spinning={putProjectDoneLoading}>
          <List
              dataSource={Array.isArray(subTask) ? subTask : []}
              itemLayout="vertical"
              renderItem={subTask => (
                  <List.Item>
                    <Card style={{width: '100%'}}>
                      <List.Item.Meta
                          title={
                            <Flex gap={10} align={"start"}>
                              <Popconfirm
                                  cancelText={'Отменить'}
                                  okText={'Завершить'}
                                  title={'Выполнить задачу?'}
                                  description={'Вы уверены, что хотите выполнить задачу?'}
                                  onConfirm={() =>  onChangeDoneProject(subTask?.id)}
                              >
                                <Checkbox  checked={!!checkedState[subTask.id]} style={{marginRight: 8}}/>
                              </Popconfirm>
                              <Flex align={"start"} gap={5} vertical={true}>
                                <Title level={4}>{subTask?.title}</Title>
                                <Text>{subTask?.text}</Text>
                              </Flex>
                              <Button  type="primary" onClick={() => clickHandle(subTask?.id)}>
                                Добавить комментарий
                              </Button>
                            </Flex>
                          }
                          description={
                            <Space size={'large'} direction={"vertical"} style={{width: '100%'}}>
                              {subTask?.messages?.map(message => (
                                  <Comment comment={message}/>
                              ))
                              }
                            </Space>
                          }
                      />
                    </Card>
                  </List.Item>
              )}
          />
        </Spin>

      </div>
  );
};


export const Comment = ({comment}) => {
  const extractFilename = (url) => {
    return url.substring(url.lastIndexOf('/') + 1);
  };
  return (
      <Flex align={"start"} justify={"space-between"} gap={15} style={{width: '100%',padding:'10px 5px',
        border:'1px dashed #ffffff70' , borderRadius:'5px'}}>
        <Flex align={"start"} gap={10} style={{width: '100%'}}>
          <Tooltip
              key={comment?.created_user?.id}
              title={
                <p>
                  <span>{comment?.created_user?.full_name}</span>
                  <br/>
                  <span>
                    {comment?.created_user?.position}
                  </span>
                </p>
              }
              placement="top"
          >
            <Avatar style={{flexShrink: 0}} icon={comment?.created_user?.images?.image ?
                <img src={comment?.created_user?.images.image} alt={comment?.created_user?.full_name}/> :
                <UserOutlined/>}/>
          </Tooltip>
          <Flex vertical={true} gap={5}>
            <Text>{comment?.message}</Text>
            {
                comment?.file &&
                <a href={comment?.file}>
                  {extractFilename(comment.file)}
                </a>
            }
          </Flex>
        </Flex>
        <Text style={{flexShrink: 0, fontSize: '11px'}}
              type="secondary">{dayjs(comment.created_at).format('llll')}</Text>
      </Flex>
  );
};


export default TaskInner;
