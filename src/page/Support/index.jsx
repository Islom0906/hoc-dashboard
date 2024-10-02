import {Button, Card, Col, Flex, Form, Menu, Row, Space, Spin, theme, Typography} from "antd";
import {FaUser} from "react-icons/fa";
import {useEffect, useState} from "react";
import {FaUserGear} from "react-icons/fa6";
import {FormTextArea, ImageUploader} from "../../components";
import {useGetQuery, usePostQuery} from "../../service/query/Queries";
import {useSelector} from "react-redux";
import {BiCommentDetail, BiSolidPhoneCall} from "react-icons/bi";
import FileCard from "../../components/Inbox/FileCard";
import dayjs from "dayjs";


const {Text } = Typography

const initialValueForm = {
  text: '',
  file: [],
  created_by:'',
};

const Support = () => {
  const [checkInfo, setCheckInfo] = useState('programmer')
  const [form] = Form.useForm();
  const {data: {user}} = useSelector(state => state.auth)
  const {
    data: GetAdminAllTicket ,
    refetch: refetchGetAdminAllTicket,
  } = useGetQuery(false , 'ticket-for-admin' , '/users/ticket-for-admin/' , false)
  const {
    data: GetDeveloperTicket,
    refetch: refetchGetDeveloperTicket,
  } = useGetQuery(false , 'developer-ticket' , '/users/developer-ticket/' , false)
  const {
    data: GetAdminTicket,
    refetch: refetchGetAdminTicket,
  } = useGetQuery(false , 'admin-ticket' , '/users/admin-ticket/' , false)
  const {
    mutate: postCommentMutate,
    isLoading: postCommentLoading,
  } = usePostQuery();

  const handleMenu = (key) => {
    setCheckInfo(key)
  }
  const {
    token: {contentBg},
  } = theme.useToken();

  const onFinish = (value) => {
    const data = {
      file: value.file[0]?.uid,
      text: value.text,
      created_by:user?.id,
    };
    if( checkInfo === 'Admin') {
      postCommentMutate({url: "/users/admin-ticket/", data: data});
    }
    if(checkInfo === 'programmer'){
      postCommentMutate({url: "/users/developer-ticket/", data: data});
    }
    form.setFieldsValue(initialValueForm);
  };
  useEffect(() =>{
    refetchGetDeveloperTicket()
  } , [])
  useEffect(() => {
    if(checkInfo === 'history' ){
      refetchGetAdminAllTicket()
    }
    if(checkInfo === 'Admin') {
      refetchGetAdminTicket()
    }
    if(checkInfo === 'programmer'){
      refetchGetDeveloperTicket()
    }
  } , [checkInfo])
  return (
      <Spin spinning={postCommentLoading}>
        <Row gutter={30}>
          <Col span={8}>
            <Flex vertical={true} gap={20}>

              <div className={'card-personal'} style={{backgroundColor: contentBg}}>
                <Menu
                    mode="inline"
                    selectedKeys={[checkInfo]}
                    style={{height: '100%', borderRight: 0}}
                    onClick={({key}) => handleMenu(key)}
                >
                  <Menu.Item key="programmer" icon={<FaUserGear/>}>Разработчик программы</Menu.Item>
                  {
                      user?.position !== "Admin" &&
                      <Menu.Item key="admin" icon={<FaUser/>}>Программа для администратора</Menu.Item>
                  }
                  {
                      user?.position === "Admin" &&
                      <Menu.Item key="history" icon={<BiCommentDetail/>}>Мнения, присланные сотрудниками</Menu.Item>
                  }
                </Menu>

              </div>

              {/*<Card>*/}
              {/*  <BiSolidPhoneCall style={{fontsize:50  , color:'#'}} />*/}
              {/*  <Text>*/}
              {/*    Свяжитесь с администратором HOC*/}
              {/*    <a href="">*/}

              {/*    </a>*/}
              {/*  </Text>*/}
              {/*</Card>*/}
            </Flex>

          </Col>
          <Col span={16}>
            {
              checkInfo === 'history' ?
                  <Flex vertical={true} gap={20}>
                    {
                      GetAdminAllTicket?.map(ticket => (
                          <FileCard key={ticket?.id} files={[ticket.file]} comment={ticket?.text}
                                    date={dayjs(ticket?.created_at).format('YYYY.MM.DD')}
                                    user={ticket?.created_by}
                          />))
                    }
                  </Flex>
                  :
                  <Flex vertical={true} gap={20}>
                    <div className={'card-personal'} style={{backgroundColor: contentBg}}>
                      <Space direction={'vertical'} size={'large'}>
                        <h2>
                          Любые пожелания и предложения вы можете отправлять
                          {
                            checkInfo === 'Admin' ? '  администратору' : '  разработчику'
                          }
                          и вы получите ответ на почту.
                        </h2>
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
                            autoComplete="off"
                        >
                          <FormTextArea
                              placeholder={'Добавить комментарий'}
                              required={true}
                              required_message={'текст к заданию'}
                              name={'text'}
                          />
                          <ImageUploader form={form} fieldName="file" setImageUploaded={() => {
                          }}/>
                          <Button htmlType="submit" type="primary">
                            Отправить
                          </Button>
                        </Form>
                      </Space>
                    </div>
                      {
                          checkInfo === 'Admin' ?
                        GetAdminTicket?.map(ticket => (
                            <FileCard
                            key={ticket?.id}
                            files={[ticket.file]}
                            comment={ticket?.text}
                            date={dayjs(ticket?.created_at).format('YYYY.MM.DD')}  />
                        ))
                              : GetDeveloperTicket?.map(ticket => (
                                  <FileCard
                                      key={ticket?.id}
                                      files={[ticket.file]}
                                      comment={ticket?.text}
                                      date={dayjs(ticket?.created_at).format('YYYY.MM.DD')}
                                  />))
                      }
                    </Flex>

              }
          </Col>
        </Row>
      </Spin>

  );
};

export default Support;
