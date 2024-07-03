import {Button, Col, Input, Row, Typography, Space, Spin, message} from "antd";
import {PlusOutlined} from "@ant-design/icons";
// import CompanyTable from "./CompanyTable";
import apiService from "../../service/apis/api";
import {useMutation, useQuery} from "react-query";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {editIdQuery} from "../../store/slice/querySlice";
import {useNavigate} from "react-router-dom";
import TaskTable from "./TaskTable";

const {Title} = Typography


const TaskCreated = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  // delete
  const {
    mutate,
    isSuccess,
    isLoading: deleteLoading,
  } = useMutation(({url, id}) => apiService.deleteData(url, id));

  // get
  const {
    data,
    isLoading: getTaskLoading,
    refetch,
  } = useQuery('get-task', () => apiService.getData(`/users/tasks/`), {
    enabled: false,
    onError: (error) => {
      message.error(error.message);
    },
  });

  const [search, setSearch] = useState([]);
  const [isSearch, setIsSearch] = useState(false);

  useEffect(() => {
    refetch()
  }, [isSuccess]);

  // delete
  const deleteHandle = (url, id) => {
    mutate({url, id});
  };

  // add
  const addArticle = () => {
    dispatch(editIdQuery(""));
    navigate('/task/add');
  };
  const searchFunc = (value) => {
    if (value === '') {
      setIsSearch(false);
    } else {
      setIsSearch(true);
    }

    const filterData = data?.filter(
        (data) => data.title.toLowerCase().includes(value.toLowerCase()));
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
              spinning={getTaskLoading || deleteLoading}>
            <TaskTable
                data={isSearch ? search : data}
                deleteHandle={deleteHandle}
            />
          </Spin>
        </Space>
      </div>
  );
};

export default TaskCreated;

