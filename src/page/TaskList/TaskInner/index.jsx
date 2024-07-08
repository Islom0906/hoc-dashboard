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
  Upload
} from "antd";
import {AntDesignOutlined, UserOutlined} from "@ant-design/icons";
// import { SettingOutlined } from '@ant-design/icons';
import { Collapse  } from 'antd';
import { useParams } from "react-router-dom";
import apiService from "../../../service/apis/api";
import {useMutation, useQuery} from "react-query";
import React, {useEffect, useMemo, useState} from "react";
import moment from "moment/moment";
import {  Checkbox, Input,  List } from 'antd';
import {FormTextArea} from "../../../components";
import {onPreviewImage} from "../../../hooks";
const { TextArea } = Input;
const { Text ,Title } = Typography;

const TaskInner = () => {
    const { item } = useParams();
  const { data: taskInner  , refetch: refetchTaskInner, isLoading , isSuccess } = useQuery(["taskInner" , item], () =>
      apiService.getDataByID('users/staff-subtask-retrieve' ,item) , { enabled: false}
  );
  useEffect(() => {
    refetchTaskInner()
  } , [])

  const onChange = (key) => {
    console.log(key);
  };

  console.log(taskInner)

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
                          <br />
                          <span>
                      {user?.roles[0]?.name}
                            {user?.roles[1]?.name}
                    </span>
                        </p>
                      }
                      placement="top"
                  >
                    <Avatar
                        style={{ backgroundColor: '#87d068' }}
                        icon={user?.image ? <img src={user?.image} alt={user?.full_name} /> : <UserOutlined />}
                    />
                  </Tooltip>
              ))}

            </Avatar.Group>
          </Flex>

        </Col>
        <Col span={16}>
          {
            taskInner?.sub_tasks?.map(subTask => (
              <TaskList subTask={subTask} />
            ))
          }
         </Col>
        <Col span={8}>
        <TaskInnerCard main_task_responsible_user={taskInner?.main_task_responsible_user} taskPercent={taskInner?.done_sub_tasks_count/taskInner?.sub_tasks_count * 100} main_task_deadline={taskInner?.main_task_deadline} main_task_created_at={taskInner?.main_task_created_at}  main_deadline_status={taskInner?.main_deadline_status} />
        </Col>
      </Row>
  );
};



const tasks = [
  {
    message: 'Create login UX Flow for new product line',
    subMessage: 'asdasd safafasfas',
    comment: '',
    dueDate: '21 Jan 2023',
    avatar: 'adsdasda',
    completed: false,
  },
];

export  const TaskList = ({subTask}) => {
  const [fileListProps, setFileListProps] = useState([]);
  const [form] = Form.useForm();
  const initialValueForm = {
    message: '',
    file:[]
  }
  const {
    mutate: postCommentMutate,
    isLoading: postCommentLoading,
    isSuccess: postCommentSuccess,
  } = useMutation(({url, data}) => apiService.postData(url, data), {
    onSuccess: () => {
      message.success('Success')
    },
    onError: (error) => {
      for (let obj in error.response.data) {
        message.error(`${obj}: ${error.response.data[obj][0]}`)
      }
    }
  });

  const {mutate: imagesDeleteMutate} = useMutation(({url, id}) => apiService.deleteData(url, id), {
    onSuccess: () => message.success('Success'),
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
      imagesDeleteMutate({url: "users/images", id});
      setFileListProps([])
    } else if (newFileList.length !== 0) {
      formData.append("image", newFileList[0].originFileObj);
      imagesUploadMutate({url: "/users/images/", formData});
    }
  };
  // delete image




  const onFinishFailed = value => {
    console.log(value)
  }
  const onFinish = (value) => {
    console.log(value)
    const data = {
      task: null,
      sub_task: subTask?.id,
      image: fileListProps[0]?.uid,
      message: value.message,
    }
    console.log(data)
      postCommentMutate({url: "/users/messages/", data: data});
  }

  return (
      <div>
        <List
            itemLayout="vertical"
            dataSource={tasks}
            renderItem={task => (
                <List.Item>
                  <Card style={{ width: '100%' }}>
                    <List.Item.Meta
                        title={
                          <Flex gap={10} align={"start"}>
                              <Checkbox defaultChecked={task.completed} style={{ marginRight: 8 }} />
                            <Flex align={"start"} gap={10} vertical={true}>
                              <Title level={4}>{subTask?.title}</Title>
                            <Text>{subTask?.message}</Text>
                            </Flex>
                          </Flex>

                        }

                        description={
                          <Space size={'large'} direction={"vertical"} style={{width:'100%'}} >
                            <Spin spinning={imagesUploadLoading}>
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

                              <Button htmlType="submit" type={"primary"} style={{marginTop:20}}>
                                Send
                              </Button>
                            </Form>
                            </Spin>

                            <Comment comment={task} />
                          </Space>
                        }
                    />
                  </Card>
                </List.Item>
            )}
        />
      </div>
  );
};


export const Comment = ({comment}) => {
  <Flex align={"start"} justify={"space-between"} style={{ width: '100%'}}>
    <Flex align={"start"} gap={10} style={{ width: '100%'}}>
      <Avatar style={{flexShrink:0}} icon={<UserOutlined />}  />
      <Text >Update user flows with UX feedback lorem smfkmelkgmslkm sdlkgmlskmlkmgslkmfd msdmslkdgmslkgmdkmgsdg msmdmms;dflmsm;ldf from Session #245 skmlam lkama skmlasm lkfamlfmalkfm lasmflk kmsflkmal kfmals fkmalkkm lsfkmlaskm flakfsm lakksmfl kamsflamlf malskfm alk fmaslfmalk mflkasmflamflsmlka mfksam</Text>
    </Flex>
    <Text style={{flexShrink:0 , fontSize:'12px'}} type="secondary" >Due {comment.dueDate}</Text>
  </Flex>
}




export const TaskInnerCard = ({main_task_responsible_user , main_task_deadline , main_task_created_at , taskPercent , main_deadline_status}) => {
  const { Text } = Typography;
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

  console.log(main_deadline_status)

 return(
     <Card size={"small"}  style={{ borderColor:`${deadlineColor}` , borderTop: '6px', borderStyle: 'solid', borderTopColor:`${deadlineColor}` }}  title="Details" >
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
                    style={{ backgroundColor: '#87d068' }}
                    icon={main_task_responsible_user?.image ? <img src={main_task_responsible_user?.image} alt={main_task_responsible_user?.full_name} /> : <UserOutlined />}
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
            <Text type={'success'}>{moment(main_task_deadline).format('l')}</Text>
          </Flex>
          <Flex align={'center'} justify={'space-between'}>
            <Text type={'secondary'}> Due date:</Text>
            <Text type={'success'}>{moment(main_task_created_at).format('l')}</Text>
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
