import {Button, Col, Input, Row, Typography, Space, Spin, message} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import apiService from "../../service/apis/api";
import { useQuery} from "react-query";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {editIdQuery} from "../../store/slice/querySlice";
import {useNavigate} from "react-router-dom";
import TaskTableBoss from "./TaskTableBoss";

const {Title} = Typography


const TaskEditBoss = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [search, setSearch] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  // get
  const {
    data : dataGetBossNotShared,
    isLoading: loadingGetBossNotShared,
    refetch: refetchGetBossNotShared,
  } = useQuery('boss-task-get-noshared', () => apiService.getData(`/users/boss-task-filter-get/?shared=not_shared`), {
    enabled: false,
    onError: (error) => {
      message.error(error.message);
    },
  });
  const {
    data : dataGetBossShared,
    isLoading: loadingGetBossShared,
    refetch: refetchGetBossShared,
  } = useQuery('boss-task-get-shared', () => apiService.getData(`/users/boss-task-filter-get/?shared=shared`), {
    enabled: false,
    onError: (error) => {
      message.error(error.message);
    },
  });


  useEffect(() => {
    refetchGetBossNotShared()
    refetchGetBossShared()
  }, []);
  // add
  const addArticle = () => {
    dispatch(editIdQuery(""));
    navigate('/taskEditBoss/add');
  };
  const searchFunc = (value) => {
    if (value === '') {
      setIsSearch(false);
    } else {
      setIsSearch(true);
    }

    const filterData = dataGetBossShared?.filter(
        (data) => data?.results?.title.toLowerCase().includes(value.toLowerCase()));
    setSearch(filterData);
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
            />
          </Spin>

          <Title level={2}>
            Разделенные задачи
          </Title>
          <Spin
              size='medium'
              spinning={loadingGetBossShared}>
            <TaskTableBoss
                data={dataGetBossShared?.results}
            />
          </Spin>
        </Space>
      </div>
  );
};

export default TaskEditBoss;

