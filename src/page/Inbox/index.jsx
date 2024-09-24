import './index.scss'
import {Button, Col, Input, Row, Space, Spin, Typography} from "antd";
import {InboxCard} from "../../components";
import {PlusOutlined} from "@ant-design/icons";
import React, {useEffect} from "react";
import {editIdQuery} from "../../store/slice/querySlice";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useDeleteQuery, useGetQuery} from "../../service/query/Queries";

const {Title} = Typography

const Inbox = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {data, isLoading: getInboxLoading, refetch} = useGetQuery(false, 'inbox-get', `/users/inbox`, false)
    const {mutate, isSuccess, isLoading: deleteLoading} = useDeleteQuery()

    useEffect(() => {
        refetch()
    }, [isSuccess]);

    const deleteHandle = (url, id) => {
        mutate({url, id});

    };
    const addArticle = () => {
        dispatch(editIdQuery(""));
        navigate('/inbox-add');
    };
    const searchFunc = (value) => {
        console.log(value)
    };
  return (

      <Spin spinning={deleteLoading||getInboxLoading}>
          <Row gutter={[20,20]} >
              <Col span={24}


              >
                  <Space direction={'vertical'} size={"large"} style={{width: '100%'}}>
                      <Row gutter={[16, 30]}>
                          <Col span={24}>
                              <Title level={2} style={{marginBottom: 0}}>
                                  Мой почтовый ящик
                              </Title>
                          </Col>

                          <Col span={16}>
                              <Input placeholder="Поиск из избранного" onChange={(e) => searchFunc(e.target.value)}/>
                          </Col>
                          <Col span={8}>
                              <Button
                                  type='primary'
                                  icon={<PlusOutlined/>}
                                  style={{width: '100%'}}
                                  onClick={addArticle}>
                                  Создать
                              </Button>
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
      </Spin>
  );
};

export default Inbox;