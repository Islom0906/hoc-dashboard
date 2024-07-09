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
import {FormTextArea} from "../../../components";
import {onPreviewImage} from "../../../hooks";

const {Text, Title} = Typography;

const TaskInner = () => {
  const [open, setOpen] = useState(false);
  const [whichWriteID, setWhichWriteID] = useState(null);
  const [whichWriteIDTask, setWhichWriteIDTask] = useState(null);
  const {item} = useParams();
  const {data: taskInner, refetch: refetchTaskInner, isLoading, isSuccess} = useQuery(["taskInner", item], () =>
      apiService.getDataByID('users/staff-subtask-retrieve', item), {enabled: false}
  );
  useEffect(() => {
    refetchTaskInner()
  }, [])

  console.log(taskInner)

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
              {taskInner?.title}
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
                      Open Modal
                    </Button>

                  </Space>
          }



        </Col>
        <Col span={8}>
          <TaskInnerCard main_task_responsible_user={taskInner?.main_task_responsible_user}
                         taskPercent={taskInner?.done_sub_tasks_count / taskInner?.sub_tasks_count * 100}
                         main_task_deadline={taskInner?.main_task_deadline}
                         main_task_created_at={taskInner?.main_task_created_at}
                         main_deadline_status={taskInner?.main_deadline_status}/>
        </Col>

        <Modal
            open={open}
            title="Send Comment"
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
              placeholder={'comment'}
              required={true}
              required_message={'текст к заданию'}
              name={'message'}
          />
          <Form.Item
              label='File'
              name={'file'}>
            <Upload
                maxCount={1}
                fileList={fileListProps}
                listType='picture-card'
                onChange={onChangeImage}
                onPreview={onPreviewImage}
                beforeUpload={() => false}
            >
              {fileListProps.length > 0 ? "" : "Upload"}
            </Upload>
          </Form.Item>
          <Button htmlType="submit" type={"primary"} >
            Send
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
                                  title={'Вы уверены, что хотите удалить это?'}
                                  description={'Удалить'}
                                  onConfirm={() =>  onChangeDoneProject(subTask?.id)}
                              >
                                <Checkbox  checked={!!checkedState[subTask.id]} style={{marginRight: 8}}/>
                              </Popconfirm>
                              <Flex align={"start"} gap={5} vertical={true}>
                                <Title level={4}>{subTask?.title}</Title>
                                <Text>{subTask?.text}</Text>
                              </Flex>
                              <Button  type="primary" onClick={() => clickHandle(subTask?.id)}>
                                Open Modal
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


export const TaskInnerCard = ({
                                main_task_responsible_user,
                                main_task_deadline,
                                main_task_created_at,
                                taskPercent,
                                main_deadline_status
                              }) => {
  const {Text} = Typography;
  const deadlineColor = useMemo(() => {
    const deadlineStatus = main_deadline_status;
    let color = '#3FA2F6';
    if (deadlineStatus === 'soon') {
      color = '#FAFFAF';
    } else if (deadlineStatus === 'failed') {
      color = '#C80036';
    } else if (deadlineStatus === 'progress') {
      color = '#FF7F3E';
    }
    return color;
  }, [main_deadline_status]);


  return (
      <Card size={"small"} style={{
        borderColor: `${deadlineColor}`,
        borderTop: '6px',
        borderStyle: 'solid',
        borderTopColor: `${deadlineColor}`
      }} title="Details">
        <Flex vertical={true} gap={10}>
          <Flex align={'center'} justify={'space-between'}>

            <Text type={'secondary'}> Assignees:</Text>
            <Flex align={"center"} gap={10}>
              <Tooltip
                  title={
                    <p>
                      <span>{main_task_responsible_user?.full_name}</span>
                    </p>
                  }
                  placement="top"
              >
                <Avatar
                    style={{backgroundColor: '#87d068'}}
                    icon={main_task_responsible_user?.image ?
                        <img src={main_task_responsible_user?.image} alt={main_task_responsible_user?.full_name}/> :
                        <UserOutlined/>}
                />
              </Tooltip>
            </Flex>
          </Flex>
          <Flex align={'center'} justify={'space-between'}>
            <Text type={'secondary'}> Status:</Text>
            <Text type={'success'}>Active</Text>
          </Flex>
          <Flex align={'center'} justify={'space-between'}>
            <Text type={'secondary'}> Due date:</Text>
            <Text type={'success'}>{dayjs(main_task_deadline).format('l')}</Text>
          </Flex>
          <Flex align={'center'} justify={'space-between'}>
            <Text type={'secondary'}> Due date:</Text>
            <Text type={'success'}>{dayjs(main_task_created_at).format('l')}</Text>
          </Flex>
          <Flex align={'center'} justify={'space-between'}>
            <Text type={'secondary'}> Progress:</Text>
            <div>
              <Progress percent={taskPercent}
                        percentPosition={{
                          align: 'center',
                          type: 'inner',
                        }}
                        size={[180, 12]}
                        strokeColor="red" className={'progress'}/>
            </div>

          </Flex>
          {/*<Flex align={'left'} gap={2} vertical>*/}
          {/*  <Text type={'secondary'}> Progress:</Text>*/}
          {/*  <p>*/}
          {/*    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab beatae, delectus deserunt error excepturi perspiciatis sapiente suscipit tempora vitae voluptatum.*/}
          {/*  </p>*/}

          {/*</Flex>*/}
        </Flex>

      </Card>
  )

}

export default TaskInner;
