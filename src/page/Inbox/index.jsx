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
import useDebounce from "../../hooks/useDebounce";
import useBreakpoint from "antd/es/grid/hooks/useBreakpoint";

const {Title, Text} = Typography


const Inbox = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [checkCategory, setCheckCategory] = useState("")
    const [search, setSearch] = useState('');
    const screen = useBreakpoint();
    const debounceInputValue=useDebounce(search,500)
    const {
        data, isLoading: getInboxLoading, refetch
    } = useGetQuery(false, 'inbox-get', `/users/inbox?${checkCategory ? `cat=${checkCategory}` : ""}${search ? `&title=${search}`:""}`, false)
    const {
        data: categoryData, refetch: categoryRefetch
    } = useGetQuery(false, 'inbox-category-get', `/users/inbox-category`, false)

    const {mutate: deleteInbox, isSuccess: inboxSuccess, isLoading: deleteLoading} = useDeleteQuery()
    const {mutate: deleteCategory, isSuccess: categorySuccess, isLoading: deleteCategoryLoading} = useDeleteQuery()

    useEffect(() => {
        refetch()

    }, [inboxSuccess, checkCategory,debounceInputValue]);

    useEffect(() => {
        categoryRefetch()
    }, [categorySuccess]);

    const deleteHandle = (url, id) => {
        deleteInbox({url, id});
    };
    const Delete = async (id) => {
        deleteCategory({url: '/users/inbox-category', id:`${id}/`})
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
        setSearch(value)
    };


  return (

      <Spin spinning={deleteLoading || getInboxLoading || deleteCategoryLoading}>
          <Row  className={'inbox'}  gutter={[
              {
                  xs: 10,
                  md: 20,
              },
              {
                  xs: 10,
                  md: 20,
              }
          ]} >
              <Col span={24}
              >
                  <Space direction={'vertical'} size={"large"} style={{width: '100%'}}>
                      <Row gutter={[ {
                          xs: 10,
                          sm:14,
                          md: 16,
                      },
                          {
                              xs: 10,
                              sm:14,
                              md: 30,
                          }]}>
                          <Col  xs={24} sm={12} md={16} xxl={18}>
                              <Title className={'page--title'} level={2} style={{marginBottom: 0}}>
                                  Избранный
                              </Title>
                          </Col>
                          <Col xs={24} sm={12} md={8} xxl={6}>
                              <Button
                                  type='primary'
                                  size={screen.sm ? '' :'small'}
                                  icon={<PlusOutlined/>}
                                  style={{width: '100%'}}
                                  onClick={addCategory}>
                                  Создать категорию
                              </Button>
                          </Col>

                          <Col xs={24} sm={16}>
                              <Input placeholder="Поиск из избранного" onChange={(e) => searchFunc(e.target.value)}/>
                          </Col>
                          <Col xs={24} sm={8}>
                              <Button
                                  size={screen.sm ? '' :'small'}
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
                                      <TagCard key={category?.id} Edit={Edit} Delete={Delete} category={category}
                                               setCheckCategory={setCheckCategory} checkCategory={checkCategory}/>
                                  ))}

                              </Flex>
                          </Col>
                      </Row>
                  </Space>
              </Col>
          {
              data?.map((message) => (
                  <Col

                      xl={{
                          span:6
                      }}
                      md={{
                          span:8
                      }}
                      sm={{
                          span:12
                      }}
                      xs={{
                          span:24
                      }}
                       key={message?.id}>
                      <InboxCard created_at={message?.created_at} title={message?.title} id={message?.id} deleteHandle={deleteHandle}/>
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

const TagCard = ({category, Edit, Delete, checkCategory, setCheckCategory}) => {
    return (
        <Popover
            content={<Flex gap={20}>
                <Button
                    onClick={() => Edit(category?.id)}
                    type='dashed'
                    out={'true'}
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
        </Popover>
    )
}

