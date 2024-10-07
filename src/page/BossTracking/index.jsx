import React, {useState, useEffect} from "react";
import { useSelector } from "react-redux";
import {Col, Row, Spin, Pagination, Flex} from "antd";
import {FilterTaskList, TaskCard, TaskCardForBoss} from "../../components";
import { useGetQuery } from "../../service/query/Queries";


const BossTracking = () => {
  const { data: { user } = {} } = useSelector((state) => state.auth);
  const {companyID} = useSelector(state => state.companySlice)
  const {modulsID} = useSelector(state => state.modulsSlice)
  const {staffIDs} = useSelector(state => state.staffSlice)
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [ordering, setOrdering] = useState('');
  const [deadlineStatus, setDeadlineStatus] = useState('');
  const [getTagCompany, setGetTagCompany] = useState('');
  const {
    data: staffGetTask = {},
    refetch: refetchStaffGetTask,
    isLoading: isLoadingStaffGetTask,
  } = useGetQuery(false, "staff-get-task", `users/module-staff-tasks/${modulsID}?page=${currentPage}&page_size=${pageSize}${staffIDs?.length !== 0 ? `&staff_id=${staffIDs}` : ''}${ordering && `&ordering=${ordering}`}${deadlineStatus && `&deadline_status__in=${deadlineStatus}${getTagCompany && `&tag__in=${getTagCompany}`}`}` , false);


  const {
    data: GetTagCompany =[],
    refetch: refetchGetTagCompany,
  } = useGetQuery(false, "get-tag-company", `/users/tags/${companyID}` ,false);

  const {
    data: GetStaffForModuls =[],
    refetch: refetchStaffForModuls,
  } = useGetQuery(false, "get-staff-moduls", `/users/user-filter?module_id=${modulsID}` ,false);

  useEffect(() => {
    refetchGetTagCompany()
  } , [companyID])
  useEffect(() => {
    refetchStaffForModuls()
  } , [modulsID])
  useEffect(() => {
      refetchStaffGetTask();
  }, [user, currentPage, pageSize , ordering , deadlineStatus  , getTagCompany , staffIDs , modulsID]);
  const onPaginationChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };
  const taskData = staffGetTask;


  return (
      <div>
        <Row gutter={[16 , 30]}>
          <Col span={24}>
              <h1>Контроль задач в отделе</h1>
          </Col>
        <FilterTaskList getTagCompany={GetTagCompany} setGetTagCompany={setGetTagCompany}  setDeadlineStatus={setDeadlineStatus} setOrdering={setOrdering} getStaffForModuls={GetStaffForModuls?.results } />
        </Row>
        <Spin spinning={isLoadingStaffGetTask}>
          <Row gutter={[24, 24]} style={{ marginTop: 15 }}>
            {taskData?.results?.map((task) => (
                <Col
                    key={task?.main_task_id}
                    className="gutter-row"
                    xs={{ span: 12 }}
                    md={{ span: 8 }}
                    xl={{ span: 6 }}
                >
                  <TaskCard
                      tag={task?.main_tag}
                      key={task?.main_task_id}
                      title={task?.main_task_title}
                      deadline_status={task?.main_deadline_status}
                      link={`/task-list/${task?.main_task_id}`}
                      created_at={task?.main_task_created_at}
                      deadline={task?.main_task_deadline}
                      doneCountTask={task?.done_sub_tasks_count}
                      allCountTask={task?.sub_tasks_count}
                      responsible_user={task?.main_task_responsible_user}
                      lastUpdate={task?.staff_last_sub_task_updated_at}
                      included_users={task?.included_users}
                  />
                </Col>
            ))}
          </Row>
            <Flex align={'center'} justify={'center'} style={{paddingTop:20 , paddingBlock:10}}>
              <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={taskData?.count || 0}
                  onChange={onPaginationChange}
                  showSizeChanger
              />
            </Flex>
        </Spin>
      </div>
  );
};

export default BossTracking;
