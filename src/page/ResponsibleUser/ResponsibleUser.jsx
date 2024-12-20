import React, {useState, useEffect} from "react";
import { useSelector } from "react-redux";
import {Col, Row, Spin, Pagination, Flex} from "antd";
import {FilterTaskList, TaskCard, TaskCardForBoss} from "../../components";
import { useGetQuery } from "../../service/query/Queries";


const BossTracking = () => {
  const { data: { user } = {} } = useSelector((state) => state.auth);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [ordering, setOrdering] = useState('');
  const [deadlineStatus, setDeadlineStatus] = useState('');
  const [getTagCompany, setGetTagCompany] = useState('');

  const {
    data: staffGetTask = {},
    refetch: refetchStaffGetTask,
    isLoading: isLoadingStaffGetTask,
  } = useGetQuery(false, "staff-get-task",
      `users/staff-responsible-tasks/?page=${currentPage}&page_size=${pageSize}${ordering && `&ordering=${ordering}`}${deadlineStatus && `&deadline_status__in=${deadlineStatus}`}` , false);

  const {
    data: GetTagCompany =[],
    refetch: refetchGetTagCompany,
  } = useGetQuery(false, "get-tag-company", `/users/responsible-company-selection/` , false);

  useEffect(() => {
    refetchGetTagCompany()
  } , [])

  useEffect(() => {
    refetchStaffGetTask();
  }, [user, currentPage, pageSize , ordering , deadlineStatus , getTagCompany ]);
  const onPaginationChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };
  const taskData = staffGetTask;
  return (
      <div>
        <Row gutter={[16 , 30]}>
          <Col span={24}>
            <h1>Контроль задач в ответственный</h1>
          </Col>
          <FilterTaskList setGetTagCompany={setGetTagCompany} getTagCompany={GetTagCompany}  setDeadlineStatus={setDeadlineStatus} setOrdering={setOrdering}  />
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
                      tag={task?.company}
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
                      isChecking={task?.is_checking}
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
