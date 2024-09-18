import {Button, Col, Input, Row, Typography, Space, Spin} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {editIdQuery} from "../../store/slice/querySlice";
import {useNavigate} from "react-router-dom";
import TaskTableBoss from "./TaskTableBoss";
import {useGetQuery} from "../../service/query/Queries";

const {Title} = Typography


const TaskEditBoss = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [search, setSearch] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  // get
  const {data : dataGetBossNotShared,
    isLoading: loadingGetBossNotShared,
    refetch: refetchGetBossNotShared, isSuccess:isSuccessGetBossNotShared}=useGetQuery(false,'boss-task-get-noshared',`/users/boss-task-filter-get/?page=${pagination.current}&page_size=${pagination.pageSize}&shared=not_shared` , false)
  // const { data : dataGetBossShared,
  //   isLoading: loadingGetBossShared,
  //   refetch: refetchGetBossShared,}=useGetQuery(false,'boss-task-get-shared',`/users/boss-task-filter-get/?shared=shared?page=${pagination.current}&page_size=${pagination.pageSize}`)
  //


  useEffect(() => {
    refetchGetBossNotShared()

    // refetchGetBossShared()
  }, []);
  // add
  const addArticle = () => {
    dispatch(editIdQuery(""));
    navigate('/taskEditBoss/add');
  };
  useEffect(() => {
    if (isSuccessGetBossNotShared) {
      setPagination(prevState => ({...prevState, total: dataGetBossNotShared?.count}))
    }
  }, [dataGetBossNotShared]);
  const searchFunc = (value) => {
    if (value === '') {
      setIsSearch(false);
    } else {
      setIsSearch(true);
    }

    // const filterData = dataGetBossShared?.filter(
    //     (data) => data?.results?.title.toLowerCase().includes(value.toLowerCase()));
    // setSearch(filterData);
  };

  return (
      <div className={'site-space-compact-wrapper'}>
        <Space direction={'vertical'} size={"large"} style={{width: '100%'}}>
          <Row gutter={20}>
            <Col span={24}>
              <Title level={2}>
                Разделите задачи
              </Title>
            </Col>
            <Col span={16}>
              <Input onChange={(e) => searchFunc(e.target.value)}/>
            </Col>
            <Col span={8}>
              <Button
                  type='primary'
                  icon={<PlusOutlined/>}
                  style={{width: '100%'}}
                  onClick={addArticle}>
                Добавить
              </Button>
            </Col>
          </Row>
          <Spin
              size='medium'
              spinning={loadingGetBossNotShared}>
            <TaskTableBoss
                data={isSearch ? search : dataGetBossNotShared?.results}
                pagination={pagination}
                setPagination={setPagination}
            />
          </Spin>
          {/*<Title>*/}
          {/*  Разделенные задачи*/}
          {/*</Title>*/}
          {/*<Spin*/}
          {/*    size='medium'*/}
          {/*    spinning={loadingGetBossShared}>*/}
          {/*  <TaskTableBoss*/}
          {/*      data={dataGetBossShared?.results}*/}
          {/*  />*/}
          {/*</Spin>*/}
        </Space>
      </div>
  );
};

export default TaskEditBoss;

