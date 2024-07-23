import {Button, Col, Input, Row, Space, Spin, Typography} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {editIdQuery} from "../../store/slice/querySlice";
import {useNavigate} from "react-router-dom";
import TaskTable from "./TaskTable";
import {useDeleteQuery, useGetQuery} from "../../service/query/Queries";

const {Title} = Typography


const TaskCreated = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  // delete
  const {mutate,isSuccess,isLoading:deleteLoading}=useDeleteQuery()


  // get
  const {data,isLoading:getTaskLoading,refetch,isSuccess:getIsSuccess}=useGetQuery(false,'get-task',`/users/tasks/?page=${pagination.current}&page_size=${pagination.pageSize}`,false)



  const [search, setSearch] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  // delete and pagination
  useEffect(() => {
    refetch()
  }, [isSuccess]);

  // get data
  useEffect(() => {
    if (getIsSuccess) {
      setPagination(prevState => ({...prevState, total: data?.count}))
    }
  }, [data]);
  useEffect(() => {
    refetch()
  }, [pagination.current,pagination.pageSize]);
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

    const filterData = data?.results?.filter(
        (data) => data?.title.toLowerCase().includes(value.toLowerCase()));
    setSearch(filterData);
  };

  return (
      <div className={'site-space-compact-wrapper'}>
        <Space direction={'vertical'} size={"large"} style={{width: '100%'}}>
          <Row gutter={20}>
            <Col span={24}>
              <Title level={2}>
                Создать задачу
              </Title>
            </Col>
            <Col span={16}>
              <Input placeholder="Поиск задач" onChange={(e) => searchFunc(e.target.value)}/>
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
                data={isSearch ? search : data?.results}
                deleteHandle={deleteHandle}
                pagination={pagination}
                setPagination={setPagination}
            />
          </Spin>
        </Space>
      </div>
  );
};

export default TaskCreated;

