import { Button, Col, Input, Row, Select, Space, Spin, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { editIdQuery } from "../../store/slice/querySlice";
import { useNavigate } from "react-router-dom";
import TaskTable from "./TaskTable";
import { useLocation as useReactLocation } from 'react-router-dom';
import { useDeleteQuery, useGetQuery } from "../../service/query/Queries";
import useDebounce from "../../hooks/useDebounce";

const { Title } = Typography;

const TaskCreated = () => {
  const selectInputSearch = [
    { name: "Задача", value: "task" },
    { name: "Участники", value: "staff" }
  ];

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useReactLocation();
  const queryParams = new URLSearchParams(location.search);
  const staff = queryParams.get('staff');
  const [search, setSearch] = useState('');
  const [selectedOptionSearch, setSelectedOptionSearch] = useState('task');
  const [deadlineStatus, setDeadlineStatus] = useState('');
  const [ordering, setOrdering] = useState('');
  const [getTagCompany, setGetTagCompany] = useState('');

  const { Option } = Select;
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const debounceInputValue = useDebounce(search, 500);

  // Delete
  const { mutate, isLoading: deleteLoading } = useDeleteQuery();

  // Get tasks
  const { data, isLoading: getTaskLoading, refetch, isSuccess: getIsSuccess } = useGetQuery(
      false,
      'get-task',
      `/users/tasks/?page=${pagination.current}&page_size=${pagination.pageSize}${getTagCompany && `&company__id=${getTagCompany}`}${debounceInputValue && `&${selectInputSearch[0].value === selectedOptionSearch ? 'search' : 'full_name'}=${debounceInputValue}`}${deadlineStatus && `&deadline_status=${deadlineStatus}`}${ordering && `&ordering=${ordering}`}${staff ? `&user_id=${staff}`:''}`,
      false
  );

  // Get tag company
  const { data: GetTagCompany = [], refetch: refetchGetTagCompany } = useGetQuery(false, "get-tag-company", `users/company-selection`, false);

  useEffect(() => {
    refetchGetTagCompany();
  }, []);

  useEffect(() => {
    if (getIsSuccess) {
      setPagination(prevState => ({ ...prevState, total: data?.count }));
    }
  }, [data, getIsSuccess]);

  // Handle staff search
  useEffect(() => {
    if (staff) {
      setSelectedOptionSearch("staff");
      setSearch(staff);
      refetch()
    }
  }, [staff]);

  useEffect(() => {
    refetch();
  }, [pagination.current, pagination.pageSize, debounceInputValue, deadlineStatus, ordering, getTagCompany]);

  // Delete function
  const deleteHandle = (url, id) => {
    mutate({ url, id });
  };

  // Add function
  const addArticle = () => {
    dispatch(editIdQuery(""));
    navigate('/task/add');
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setPagination({
      ...pagination,
      current: pagination.current,
    });
    setGetTagCompany(filters?.tag ? filters.tag.join(',') : '');
    setDeadlineStatus(filters?.deadline_status?.toString() || '');
    setOrdering(sorter.order ? (sorter.order === 'descend' ? `-${sorter.field}` : sorter.field) : '');
  };

  const getTagCompanyArray = useMemo(() => {
    return Object.entries(GetTagCompany).map(([key, value]) => ({
      text: value?.title,
      value: value?.id,
    }));
  }, [GetTagCompany]);

  const selectedSearchInput = (e) => {
    setSelectedOptionSearch(e);
  };

  const searchFunc = (value) => {
    setSearch(value);
  };

  const selectBefore = (
      <Select onChange={selectedSearchInput} defaultValue={selectInputSearch[0].value}>
        {selectInputSearch.map(item => (
            <Option key={item.value} value={item.value}>{item.name}</Option>
        ))}
      </Select>
  );

  return (
      <div className={'site-space-compact-wrapper'}>
        <Space direction={'vertical'} size={"large"} style={{ width: '100%' }}>
          <Row gutter={[16, 30]}>
            <Col span={18}>
              <Title level={2} style={{ marginBottom: 0 }}>
                Создать задачу
              </Title>
            </Col>
            <Col span={16}>
              <Input
                  addonBefore={selectBefore}
                  placeholder={`Поиск ${selectedOptionSearch === 'task' ? ' задач' : 'участники'}`}
                  onChange={(e) => searchFunc(e.target.value)}
                  
              />
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
