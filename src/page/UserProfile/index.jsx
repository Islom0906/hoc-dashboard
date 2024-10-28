import {Col, Flex, Menu, Row, Tabs, Tag, theme} from "antd";
import './index.scss'
import {useEffect, useState} from "react";
import ReadingPresonalData from "./readingPresonalData";
import DashboardProfileCard from "../Dashboard/profileCard/DashboardProfileCard";
import {useDeleteQuery, useGetQuery} from "../../service/query/Queries";
import {useSelector} from "react-redux";
import {useLocation as useReactLocation, useNavigate} from "react-router-dom";
import {Doughnut} from "react-chartjs-2";
import {TaskTable} from "../../components";
// import Personal from "./personal";
// import ChangePassword from "./ChangePassword";
// import {RiLockPasswordFill} from "react-icons/ri";

const UserProfile = () => {
  const {data: {user} = {}} = useSelector((state) => state.auth);
  const [checkInfo, setCheckInfo] = useState('personal')
    const [userID , setUserID] = useState('')
    const { TabPane } = Tabs;
    const location = useReactLocation();
    const queryParams = new URLSearchParams(location.search);
    const queryUserID = queryParams.get('user');
    const [taskStatus , setTaskStatus] = useState('progress');
    const [deadlineStatus, setDeadlineStatus] = useState('');
    const [ordering, setOrdering] = useState('');
    const [getTagCompany, setGetTagCompany] = useState('');
    const { mutate, isLoading: deleteLoading } = useDeleteQuery();
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const roleName = user?.roles[0]?.role?.name
    const { data: getUserInfo, isLoading: loadingGetUserInfo, refetch:refetchGetUserInfo } = useGetQuery(
        false,
        'get-user-info',
        `users/users/${userID && userID}`,
        false
    );
  const {
    data: GetUserTaskStatistics = [], refetch: refetchGetUserTaskStatistics,
  } = useGetQuery(false, "user-task-statistics", `users/staff-statistics/${userID && userID}/`, false);

    const {
        data: GetUserTaskStatusFailed = [], refetch: refetchGetUserTaskStatusFailed, isSuccess:isSuccessGetUserTaskStatusFailed
    } = useGetQuery(false, "user-status-failed-progress", `users/staff-subtasks/?${userID && `staff_id=${userID}`}&status=${taskStatus}`, false);
    // status=progress
    // status=failed

    const handleTableChange = (pagination, filters, sorter) => {
        setPagination({
            ...pagination,
            current: pagination.current,
        });
        setGetTagCompany(filters?.company ? filters.company.join(',') : '');
        setDeadlineStatus(filters?.deadline_status?.toString() || '');
        setOrdering(sorter.order ? (sorter.order === 'descend' ? `-${sorter.field}` : sorter.field) : '');
    };


    const handleMenu = (key) => {
    setCheckInfo(key)
  }
  useEffect(() => {
      if(queryUserID && roleName === 'general_director' ) {
          setUserID(queryUserID)
      }else if(!queryUserID) {
          setUserID(user?.id)
      }
  }, [queryUserID])

    useEffect(() => {
    })

    useEffect(() => {
        if(userID) {
            refetchGetUserTaskStatistics()
            refetchGetUserInfo()
            refetchGetUserTaskStatusFailed()
        }
    } , [userID])

    const deleteHandle = (url, id) => {
        mutate({ url, id });
    };


    useEffect(() => {
        if (isSuccessGetUserTaskStatusFailed) {
            setPagination(prevState => ({ ...prevState, total: GetUserTaskStatusFailed?.count }));
        }
    }, [GetUserTaskStatusFailed, isSuccessGetUserTaskStatusFailed]);
  const {
    token: {contentBg},
  } = theme.useToken();
  return (<Row gutter={10}>
        <Col span={8}>
          {/*<div className={'card-personal'} style={{backgroundColor: contentBg}}>*/}
          {/*<Menu*/}
          {/*    mode="inline"*/}

          {/*    selectedKeys={[checkInfo]}*/}
          {/*    style={{height: '100%', borderRight: 0}}*/}
          {/*    onClick={({key}) => handleMenu(key)}*/}
          {/*>*/}
          {/*    <Menu.Item key="personal" icon={<FaUser/>}>Личная информация</Menu.Item>*/}
          {/*    /!*<Menu.Item key="password" icon={<RiLockPasswordFill/>}>Пароль</Menu.Item>*!/*/}
          {/*</Menu>*/}

          {/*</div>*/}
          <DashboardProfileCard title={'Мой профиль'} image={getUserInfo?.image?.image } position={getUserInfo?.roles[0]?.position}
                                fullName={(`${getUserInfo?.last_name} ${getUserInfo?.first_name} ${getUserInfo?.middle_name}`)}
                                total_tasks_count={GetUserTaskStatistics?.total_tasks_count}
                                failed_tasks_count={GetUserTaskStatistics?.failed_tasks_count}
                                done_tasks_count={GetUserTaskStatistics?.done_tasks_count}
                                in_progress_tasks_count={GetUserTaskStatistics?.in_progress_tasks_count}
                                responsible_tasks_count={GetUserTaskStatistics?.responsible_tasks_count}
          />
        </Col>
        <Col span={16}>
          <div className={'card-personal'} style={{backgroundColor: contentBg}}>
            {/*<Personal/>*/}
            <ReadingPresonalData data={getUserInfo}/>
            {/*{*/}
            {/*    checkInfo === 'personal' ?*/}
            {/*        <Personal/> :*/}
            {/*        <ChangePassword setCheckInfo={setCheckInfo}/>*/}
            {/*}*/}

          </div>
        </Col>

      {

          roleName !== 'staff' &&
          <Col span={24}>

              <Tabs defaultActiveKey="1" >
                  <TabPane
                      tab={
                          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                 Статистика
              </span>
                      }
                      key="1"
                  >
                      <TaskTable
                          data={GetUserTaskStatusFailed?.results}
                          deleteHandle={deleteHandle}
                          pagination={pagination}
                          setPagination={setPagination}
                          handleTableChange={handleTableChange} />
                  </TabPane>
              </Tabs>

          </Col>
      }



      </Row>);
};

export default UserProfile;