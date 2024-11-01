import {useState, useEffect} from "react";
import { useSelector } from "react-redux";
import {Col, Row, Spin, Pagination, Flex, Tabs, Space} from "antd";
import { TaskDoneTable} from "../../components";
import { useGetQuery } from "../../service/query/Queries";


const SuccessTask = () => {
  const { data: { user } = {} } = useSelector((state) => state.auth);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const roleName = user?.roles[0]?.role?.name
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  console.log('roleName' ,roleName)
  const {
    data: staffGetTask ,
    refetch: refetchStaffGetTask,
    isLoading: isLoadingStaffGetTask,
  } = useGetQuery(false, "get-staff-done-task", `users/staff-done-subtasks/?page=${currentPage}&page_size=${pageSize}` , false);
  const {
    data: getTask,
    refetch: refetchGetTask,
    isLoading: isLoadingGetTask,
  } = useGetQuery(false, "get-done-task", `users/done-tasks/?page=${currentPage}&page_size=${pageSize}` , false);
  // useEffect(() => {
  //   refetchGetTagCompany()
  // } , [companyID])
  // useEffect(() => {
  //   refetchStaffGetTask();
  // }, [user, currentPage, pageSize , ordering , deadlineStatus , getTagCompany  ]);
  // const onPaginationChange = (page, pageSize) => {
  //   setCurrentPage(page);
  //   setPageSize(pageSize);
  // };

  useEffect(() =>{
    if(roleName !== 'staff')  {
      refetchStaffGetTask()
      refetchGetTask()
    }if(roleName === 'staff') {
      refetchStaffGetTask()
    }
  }, [])
  const handleTableChange = (pagination, ) => {
    setPagination({
      ...pagination,
      current: pagination.current,
    });
  };


  return (
      <>
        <Space direction={"vertical"} size={30}>
          {
              (roleName !== 'admin' && roleName !== 'general_director') &&
              <Row gutter={[16 , 30]}>
                <Col span={24}>
                  <h2>Ваши выполненные задачи:</h2>
                </Col>
                <Col span={24}>
                  <TaskDoneTable
                      data={staffGetTask?.results}
                      pagination={pagination}
                      setPagination={setPagination}
                      filter={false}
                      handleTableChange={handleTableChange}
                  />
                </Col>
              </Row>
          }
          {
              roleName  !== 'staff' &&
              <Row  gutter={[16 , 30]}>
                <Col span={24}>
                  {
                      roleName === 'boss' &&
                      < h2 > Ваши oтделение задачи:</h2>
                  }
                  {
                      roleName === 'director' &&
                      < h2 > Ваши компания задачи:</h2>
                  }
                  {
                      (roleName === 'admin') || roleName === 'general_director' &&
                      < h2 > Ваши компании задачи:</h2>
                  }
                </Col>
                <Col span={24}>
                  <TaskDoneTable
                      data={getTask?.results}
                      pagination={pagination}
                      setPagination={setPagination}
                      filter={false}
                      handleTableChange={handleTableChange}
                  />
                </Col>
              </Row>
          }
        </Space>



      </>
  );
};

export default SuccessTask;
