import './index.scss'
import {Button, Card, Col, Flex, Input, Modal, Popconfirm, Popover, Row, Space, Spin, Typography} from "antd";
import {InboxCard} from "../../components";
import {DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import {editIdQuery} from "../../store/slice/querySlice";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useDeleteQuery, useGetQuery} from "../../service/query/Queries";
import InboxCategoryPostEdit from "./category/inboxCategoryPostEdit";
import {CiHashtag} from "react-icons/ci";
const {Title, Text} = Typography


const Inbox = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [checkCategory, setCheckCategory] = useState("")

    const {
        data, isLoading: getInboxLoading, refetch
    } = useGetQuery(false, 'inbox-get', `/users/inbox?${checkCategory ? `cat=${checkCategory}` : ""}`, false)
    const {
        data: categoryData, refetch: categoryRefetch
    } = useGetQuery(false, 'inbox-category-get', `/users/inbox-category`, false)

    const {mutate: deleteInbox, isSuccess: inboxSuccess, isLoading: deleteLoading} = useDeleteQuery()
    const {mutate: deleteCategory, isSuccess: categorySuccess, isLoading: deleteCategoryLoading} = useDeleteQuery()

    useEffect(() => {
        refetch()

    }, [inboxSuccess, checkCategory]);

    useEffect(() => {
        categoryRefetch()
    }, [categorySuccess]);

    const deleteHandle = (url, id) => {
        deleteInbox({url, id});
    };
    const Delete = async (id) => {
        deleteCategory({url: '/users/inbox-category', id})
    };
    const Edit = (id) => {
        localStorage.setItem('editDataId', id)
        dispatch(editIdQuery(id))
        setIsModalOpen(true)
    };
    const addInbox = () => {
        dispatch(editIdQuery(""));
        navigate('/inbox-add');
    };

    const addCategory = () => {
        setIsModalOpen(true)
    }
    const handelClose = () => {
        setIsModalOpen(false)
    }
    const searchFunc = (value) => {
        console.log(value)
    };


  return (

      <Spin spinning={deleteLoading || getInboxLoading || deleteCategoryLoading}>
          <Row className={'inbox'} gutter={[20,20]} >
              <Col span={24}


              >
                  <Space direction={'vertical'} size={"large"} style={{width: '100%'}}>
                      <Row gutter={[16, 30]}>
                          <Col span={20}>
                              <Title level={2} style={{marginBottom: 0}}>
                                  Избранный
                              </Title>
                          </Col>
                          <Col span={4}>
                              <Button
                                  type='primary'
                                  icon={<PlusOutlined/>}
                                  style={{width: '100%'}}
                                  onClick={addCategory}>
                                  Создать категорию
                              </Button>
                          </Col>

                          <Col span={16}>
                              <Input placeholder="Поиск из избранного" onChange={(e) => searchFunc(e.target.value)}/>
                          </Col>
                          <Col span={8}>
                              <Button
                                  type='primary'
                                  icon={<PlusOutlined/>}
                                  style={{width: '100%'}}
                                  onClick={addInbox}>
                                  Создать
                              </Button>
                          </Col>
                          <Col span={24}>
                              <Flex gap={10} wrap={"wrap"}>

                                  <Card
                                      bordered={true}
                                      size={"small"}
                                      style={{
                                          cursor: 'pointer',
                                          background: checkCategory === "" ? "#F2FFEA" : "",
                                      }}
                                      onClick={() => setCheckCategory("")}>
                                      <Flex align={"center"} gap={4}>
                                          <CiHashtag  style={{
                                              fontSize: '18px',
                                              color: checkCategory === "" ? "#69B13D" : "#818181",
                                          }}/>
                                          <Text style={{
                                              fontSize: 12,
                                              color: checkCategory === "" ? "#69B13D" : "#818181",
                                          }}>
                                              Все
                                          </Text>
                                      </Flex>
                                  </Card>
                                  {categoryData?.map(category => (
                                      <Popover key={category?.id}
                                               content={<Flex gap={20}>
                                                   <Button
                                                       onClick={() => Edit(category?.id)}
                                                       type='dashed'
                                                       out
                                                       icon={<EditOutlined/>}/>
                                                   <Popconfirm
                                                       title={'Вы уверены, что хотите удалить это?'}
                                                       description={'Удалить'}
                                                       onConfirm={() => Delete(category?.id)}>
                                                       <Button type='primary' danger
                                                               icon={<DeleteOutlined/>}/>
                                                   </Popconfirm>
                                               </Flex>
                                               }>

                                          <Card
                                              bordered={true}

                                              size={"small"}
                                              style={{
                                                  cursor: 'pointer',
                                                  background: checkCategory === category?.id ? "#F2FFEA" : "",
                                              }}
                                              onClick={() => setCheckCategory(category?.id)}>
                                              <Flex align={"center"} gap={4}>
                                                  <CiHashtag style={{
                                                      fontSize: '18px',
                                                      color: checkCategory === category?.id ? "#69B13D" : "#818181",
                                                  }}
                                                  />
                                                  <Text style={{
                                                      fontSize: 12,
                                                      color: checkCategory === category?.id ? "#69B13D" : "#959595",
                                                  }}>
                                                      {category?.name}
                                                  </Text>
                                              </Flex>
                                          </Card>
                                      </Popover>))}

                              </Flex>
                          </Col>
                      </Row>
                  </Space>
              </Col>
          {
              data?.map((message) => (
                  <Col
                      span={6}
                      xl={{
                          span:6
                      }}
                      md={{
                          span:8
                      }}
                      xs={{
                          span:12
                      }}
                       key={message?.id}>
                      <InboxCard title={message?.title} id={message?.id} deleteHandle={deleteHandle}/>
                  </Col>
              ))
          }
      </Row>
          <Modal title={'Тег'} open={isModalOpen} footer={null} onCancel={handelClose}>
              <InboxCategoryPostEdit setIsModalOpen={setIsModalOpen} categoryRefetch={categoryRefetch} link={'/inbox'}
                                     isModalOpen={isModalOpen}/>
          </Modal>
      </Spin>
  );
};

export default Inbox;