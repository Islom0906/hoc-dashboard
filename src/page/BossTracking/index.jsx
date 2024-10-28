import React, {useState, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Col, Row, Spin, Pagination, Flex, Button} from "antd";
import {FilterTaskList, TaskCard} from "../../components";
import {useDeleteQuery, useGetQuery} from "../../service/query/Queries";
import {editIdQuery} from "../../store/slice/querySlice";
import {PlusOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";


const BossTracking = () => {
  const { data: { user } = {} } = useSelector((state) => state.auth);
  const navigate=useNavigate()
  const dispatch=useDispatch()
  const {modulsID} = useSelector(state => state.modulsSlice)
  const {staffIDs} = useSelector(state => state.staffSlice)
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [deadlineStatus, setDeadlineStatus] = useState('');
  const [ordering, setOrdering] = useState('');
  const [getTagCompany, setGetTagCompany] = useState('');
  const { mutate, isLoading: deleteLoading } = useDeleteQuery();
  const {
    data: staffGetTask = {},
    refetch: refetchStaffGetTask,
    isLoading: isLoadingStaffGetTask,
  } = useGetQuery(false, "staff-get-task", `users/module-staff-tasks/${modulsID}?page=${currentPage}&page_size=${pageSize}${staffIDs?.length !== 0 ? `&staff_id=${staffIDs}` : ''}${ordering && `&ordering=${ordering}`}${deadlineStatus && `&deadline_status__in=${deadlineStatus}`}${getTagCompany && `&company_id=${getTagCompany}`}` , false);

  // const {
  //   data: staffGetDoneTask = {},
  //   refetch: refetchGetDoneTask,
  //   isLoading: isLoadingGetDoneTask,
  // } = useGetQuery(false, "staff-get-task", `users/module-staff-tasks/${modulsID}?page=${currentPage}&page_size=${pageSize}${staffIDs?.length !== 0 ? `&staff_id=${staffIDs}` : ''}${ordering && `&ordering=${ordering}`}${deadlineStatus && `&deadline_status__in=${deadlineStatus}`}${getTagCompany && `&company_id=${getTagCompany}`}` , false);


  const {
    data: GetTagCompany =[],
    refetch: refetchGetTagCompany,
  } = useGetQuery(false, "get-tag-company", `/users/company-selection/` ,false);

  const {
    data: GetStaffForModuls =[],
    refetch: refetchStaffForModuls,
  } = useGetQuery(false, "get-staff-moduls", `/users/user-filter?module_id=${modulsID}` ,false);

  useEffect(() => {
      refetchGetTagCompany()
  } , [])
  useEffect(() => {
    if(modulsID) {
      refetchStaffForModuls()
    }
  } , [modulsID])
  useEffect(() => {
      refetchStaffGetTask();
  }, [user, currentPage, pageSize , ordering , deadlineStatus  , getTagCompany , staffIDs , modulsID]);
  const onPaginationChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };
  const addArticle = () => {
    dispatch(editIdQuery(""));
    navigate('/task/add');
  };

  const handleDeleteBossTask = (id) => {
    mutate({ url:'/users/tasks' , id:`${id}/` });

  }



  return (
      <div>
        <Row gutter={[16 , 30]}>
          <Col span={12}>
              <h1>Контроль задач в отделе</h1>
          </Col>
          <Col offset={6} span={6}>
            <Button
                type='primary'
                icon={<PlusOutlined />}
                style={{ width: '100%' }}
                onClick={addArticle}>
              Создать задачу
            </Button>
          </Col>
        <FilterTaskList  getTagCompany={GetTagCompany} setGetTagCompany={setGetTagCompany}  setDeadlineStatus={setDeadlineStatus} setOrdering={setOrdering} getStaffForModuls={GetStaffForModuls?.results } />
        </Row>
        <Spin spinning={isLoadingStaffGetTask  || deleteLoading}>
          <Row gutter={[24, 24]} style={{ marginTop: 15 }}>
            {staffGetTask?.results?.map((task) => (
                <Col
                    key={task?.main_task_id}
                    className="gutter-row"
                    md={{ span: 24 }}
                    lg={{ span: 12 }}
                    xl={{ span: 8 }}
                    xxl={{ span: 6 }}

                >
                  <TaskCard
                      tag={task?.main_company}
                      key={task?.main_task_id}
                      title={task?.main_task_title}
                      deadline_status={task?.main_deadline_status}
                      id={task?.main_task_id}
                      link={`/task-list/${task?.main_task_id}`}
                      created_at={task?.main_task_created_at}
                      created_by={task?.main_task_created_by}
                      main_task_status={task?.main_task_status}
                      deadline={task?.main_task_deadline}
                      doneCountTask={task?.done_sub_tasks_count}
                      allCountTask={task?.sub_tasks_count}
                      responsible_user={task?.main_task_responsible_user}
                      lastUpdate={task?.staff_last_sub_task_updated_at}
                      included_users={task?.included_users}
                      isChecking={task?.is_checking}
                      handleDeleteBossTask={handleDeleteBossTask}
                  />
                </Col>
            ))}
          </Row>
            <Flex align={'center'} justify={'center'} style={{paddingTop:20 , paddingBlock:10}}>
              <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={staffGetTask?.count || 0}
                  onChange={onPaginationChange}
                  showSizeChanger
              />
            </Flex>
        </Spin>
      </div>
  );
};

export default BossTracking;
