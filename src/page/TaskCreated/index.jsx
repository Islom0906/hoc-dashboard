import {Button, Col, Input, Row, Select, Space, Spin, Typography} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import React, {useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {editIdQuery} from "../../store/slice/querySlice";
import {useLocation as useReactLocation, useNavigate} from "react-router-dom";
import {useDeleteQuery, useGetQuery} from "../../service/query/Queries";
import useDebounce from "../../hooks/useDebounce";
import {TaskTable} from '../../components'
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
  const {companyID}=useSelector(state => state.companySlice)
  const [search, setSearch] = useState('');
  const [selectedOptionSearch, setSelectedOptionSearch] = useState(selectInputSearch[0].value);
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
  const { mutate, isLoading: deleteLoading,isSuccess:deleteSuccess } = useDeleteQuery();

  // Get tasks
  const { data, isLoading: getTaskLoading, refetch, isSuccess: getIsSuccess } = useGetQuery(
      false,
      'get-task',
      `/users/tasks/?page=${pagination.current}&page_size=${pagination.pageSize}${getTagCompany ? `&company__id=${getTagCompany}` : ''}${debounceInputValue ? `&${selectedOptionSearch === 'task' ? 'search' : 'full_name'}=${staff || debounceInputValue}` : staff ? `&full_name=${staff}` : ''}${deadlineStatus ? `&deadline_status=${deadlineStatus}` : ''}${ordering ? `&ordering=${ordering}` : ''}`,
      false
  );
  const { data: GetTagCompany = [], refetch: refetchGetTagCompany } = useGetQuery(false, "get-tag-company", `/users/company-selection/`, false);
  useEffect(() => {
    refetchGetTagCompany();
  }, []);
  useEffect(() => {
    if (getIsSuccess) {
      setPagination(prevState => ({ ...prevState, total: data?.count }));
    }
  }, [data, getIsSuccess]);
  useEffect(() => {
    if (staff && companyID) {
      setSelectedOptionSearch("staff");
      setSearch(staff);
    }

  }, [staff, companyID]);

  // useEffect(() => {
  //   if (staff && companyID){
  //     refetch()
  //   }
  // }, [search,getTagCompany]);

  useEffect(() => {
    if (companyID) {
      setGetTagCompany(companyID)
    }
  }, [companyID]);

  useEffect(() => {
    if (getTagCompany){
      refetch()
    }else {
      refetch()
    }

  }, [pagination.current, pagination.pageSize, debounceInputValue, deadlineStatus, ordering,search,getTagCompany,deleteSuccess]);

  const deleteHandle = (url, id) => {
    mutate({ url, id });
  };
  const addArticle = () => {
    dispatch(editIdQuery(""));
    navigate('/task/add');
  };
  const handleTableChange = (pagination, filters, sorter) => {
    setPagination({
      ...pagination,
      current: pagination.current,
    });
    setGetTagCompany(filters?.company ? filters.company.join(',') : '');
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
      <Select onChange={selectedSearchInput} value={selectedOptionSearch}>
        {selectInputSearch.map(item => (
            <Option key={item.value} value={item.value}>{item.name}</Option>
        ))}
      </Select>
  );

  return (
      <div className={'site-space-compact-wrapper'}>
        <Space direction={'vertical'} size={"large"} style={{ width: '100%' }}>
          <Row gutter={[{
            xs: 10,
            sm: 10,
            md: 16,

          }, {
            xs: 10,
            sm:10,
            md: 30,

          }]}>
            <Col span={18}>
              <Title className={'page--title'} level={2} style={{ marginBottom: 0 }}>
                Создать задачу
              </Title>
            </Col>
            <Col span={24} md={16}>
              <Input
                  value={staff ? staff:search }
                  addonBefore={selectBefore}
                  placeholder={`Поиск ${selectedOptionSearch === 'task' ? ' задач' : 'участники'}`}
                  onChange={(e) => searchFunc(e.target.value)}
                  
              />
            </Col>
            <Col span={24} md={8}>
              <Button
                  type='primary'
                  icon={<PlusOutlined />}
                  style={{ width: '100%' }}
                  onClick={addArticle}>
                Создать
              </Button>
            </Col>
          </Row>
          <Spin spinning={getTaskLoading || deleteLoading}>
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
