import {useState, useEffect} from "react";
import { useSelector } from "react-redux";
import {Col, Row, Spin, Pagination, Flex, Tabs, Space} from "antd";
import { TaskDoneTable} from "../../components";
import { useGetQuery } from "../../service/query/Queries";


const SuccessTask = () => {
  const { data: { user } = {} } = useSelector((state) => state.auth);
  const roleName = user?.roles[0]?.role?.name
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const {
    data: staffGetTask ,
    refetch: refetchStaffGetTask,
    isLoading: isLoadingStaffGetTask,
  } = useGetQuery(false, "get-staff-done-task", `users/staff-done-subtasks/?page=${pagination.current}&page_size=${pagination.pageSize}` , false);
  const {
    data: getTask,
    refetch: refetchGetTask,
    isLoading: isLoadingGetTask,
      isSuccess: isSuccessGetTask
  } = useGetQuery(false, "get-done-task", `users/done-tasks/?page=${pagination.current}&page_size=${pagination.pageSize}` , false);

  useEffect(() => {
    if (isSuccessGetTask) {
      setPagination(prevState => ({ ...prevState, total: getTask?.count }));
    }
  }, [isSuccessGetTask]);

  // const onPaginationChange = (page, pageSize) => {
  //   setCurrentPage(page);
  //   setPageSize(pageSize);
  // };

  useEffect(() => {
    const fetchData = () => {
      if (roleName === 'admin' || roleName === 'general_director') {
        refetchGetTask();
      } else if (roleName === 'boss' || roleName === 'director') {
        refetchGetTask();
        refetchStaffGetTask();
      } else if (roleName === 'staff') {
        refetchStaffGetTask();
      }
    };
    fetchData();
  }, [user, pagination.current, pagination.pageSize]);
  const handleTableChange = (pagination) => {
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
              <>
              <Row gutter={[16 , 30]}>
                <Col span={24}>
                  <h2>Ваши выполненные задачи:</h2>
                </Col>
                <Col span={24}>
                  {/*<Spin spinning={isLoadingStaffGetTask}>*/}
                  {/*</Spin>*/}
                </Col>
              </Row>
                  <TaskDoneTable
                      data={staffGetTask?.results}
                      pagination={pagination}
                      setPagination={setPagination}
                      handleTableChange={handleTableChange}
                  />
              </>
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
                      (roleName === 'admin' || roleName === 'general_director') &&
                      < h2 > Ваши компании задачи:</h2>
                  }
                </Col>
                <Col span={24}>
                  <TaskDoneTable
                      isLoading={isLoadingGetTask}
                      data={getTask?.results}
                      pagination={pagination}
                      setPagination={setPagination}
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
