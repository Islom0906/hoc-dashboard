import {Button, Col, Input, Row,  Space, Spin, Typography} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import React, {useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import { editIdQuery } from "../../store/slice/querySlice";
import { useNavigate } from "react-router-dom";
import TaskTable from "./TaskTable";
import { useDeleteQuery, useGetQuery } from "../../service/query/Queries";
import {useQueryClient} from "react-query";
import {FilterCompanyForAdmin} from "../../components";
import {deadlineColor} from "../../constants/deadlineColor";

const { Title } = Typography;

const TaskCreated = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [deadlineStatus, setDeadlineStatus] = useState('');
  const [ordering, setOrdering] = useState('');
  const {companyID} = useSelector(state => state.companySlice)
  const [getTagCompany, setGetTagCompany] = useState('');

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  // delete
  const { mutate, isSuccess, isLoading: deleteLoading } = useDeleteQuery();

  // get
  const { data, isLoading: getTaskLoading, refetch, isSuccess: getIsSuccess } = useGetQuery(
      false,
      'get-task',
      `/users/tasks/?page=${pagination.current}&page_size=${pagination.pageSize}${companyID !== null ? `&company=${companyID}` :''}${getTagCompany && `&tag__in=${getTagCompany}`}${search && `&search=${search}`}${deadlineStatus && `&deadline_status=${deadlineStatus}`}${ordering && `&ordering=${ordering}`} `,
      false
  );
  // get-tag-company
  const {
    data: GetTagCompany =[],
    refetch: refetchGetTagCompany,
  } = useGetQuery(false, "get-tag-company", `users/tag-selection` ,false);
  useEffect(() => {
    refetch();
  }, [isSuccess, pagination.current, pagination.pageSize, search, deadlineStatus, ordering ,companyID ,getTagCompany]);
  useEffect(() => {
    refetchGetTagCompany()
  } , [])
  // get data
  useEffect(() => {
    if (getIsSuccess) {
      setPagination(prevState => ({ ...prevState, total: data?.count }));
    }
  }, [data, getIsSuccess]);

  // delete
  const deleteHandle = (url, id) => {
    mutate({ url, id });
  };
  // add
  const addArticle = () => {
    dispatch(editIdQuery(""));
    navigate('/task/add');
  };
  const searchFunc = (value) => {
    setSearch(value);
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setPagination({
      ...pagination,
      current: pagination.current,
    });
    if(filters?.tag) {
      setGetTagCompany(filters?.tag.join(','))
    }else{
      setGetTagCompany('')
    }
    if(filters?.deadline_status) {
      setDeadlineStatus(filters?.deadline_status?.toString())
    }
    if(sorter.order) {
      setOrdering(sorter.order === 'descend' ? `-${sorter.field}` : sorter.field);
    }else {
      setOrdering('')
    }
  };
  const getTagCompanyArray = useMemo(() => {
    return Object.entries(GetTagCompany).map(([key, value]) => ({
      text: value?.name,
      value: value?.id,
    }));
  }, [GetTagCompany]);


  return (
      <div className={'site-space-compact-wrapper'}>
        <Space direction={'vertical'} size={"large"} style={{ width: '100%' }}>
          <Row gutter={[16, 30]} >
            <Col span={18}>
              <Title level={2} style={{marginBottom:0}}>
                Создать задачу
              </Title>
            </Col>
            <FilterCompanyForAdmin/>
            <Col span={16}>
              <Input placeholder="Поиск задач" onChange={(e) => searchFunc(e.target.value)} />
            </Col>
            <Col span={8}>
              <Button
                  type='primary'
                  icon={<PlusOutlined />}
                  style={{ width: '100%' }}
                  onClick={addArticle}>
                Создать
              </Button>
            </Col>
          </Row>
          <Spin
              size='medium'
              spinning={getTaskLoading || deleteLoading}>
            <TaskTable
                getTagCompanyArray={getTagCompanyArray}
                data={data?.results}
                deleteHandle={deleteHandle}
                pagination={pagination}
                setPagination={setPagination}
                handleTableChange={handleTableChange}
            />
          </Spin>
        </Space>
      </div>
  );
};

export default TaskCreated;
