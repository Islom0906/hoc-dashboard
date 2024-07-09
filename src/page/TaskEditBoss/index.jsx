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
  // get
  const {
    data,
    isLoading: getTaskLoading,
    refetch,
  } = useQuery('boss-task-get', () => apiService.getData(`/users/boss-task-get/`), {
    enabled: false,
    onError: (error) => {
      message.error(error.message);
    },
  });
  const [search, setSearch] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  useEffect(() => {
    refetch()
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

    const filterData = data?.filter(
        (data) => data?.results?.title.toLowerCase().includes(value.toLowerCase()));
    setSearch(filterData);
  };

  return (
      <div className={'site-space-compact-wrapper'}>
        <Space direction={'vertical'} size={"large"} style={{width: '100%'}}>
          <Row gutter={20}>
            <Col span={24}>
              <Title level={2}>
                создайте задачу:
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
              spinning={getTaskLoading}>
            <TaskTableBoss
                data={isSearch ? search : data}
            />
          </Spin>
        </Space>
      </div>
  );
};

export default TaskEditBoss;
