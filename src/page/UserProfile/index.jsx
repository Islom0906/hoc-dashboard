import {Card, Col, Row, Tabs, theme} from "antd";
import './index.scss'
import {useEffect, useState} from "react";
import ReadingPresonalData from "./readingPresonalData";
import DashboardProfileCard from "../Dashboard/profileCard/DashboardProfileCard";
import { useGetQuery} from "../../service/query/Queries";
import {useSelector} from "react-redux";
import {useLocation as useReactLocation,  useParams} from "react-router-dom";
import {TaskDoneTable, TaskNoFilterTable} from "../../components";
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
    const [taskStatusTab, setTaskStatusTab] = useState('failed');
    const { item } = useParams();
    console.log( 'item', item)
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
        data: GetUserTaskStatusProgressFailed = [], refetch: refetchGetUserTaskStatusProgressFailed, isSuccess:isSuccessGetUserTaskStatusProgressFailed
    } = useGetQuery(false, "user-status-failed-progress", `users/tasks/?${userID && `staff_id=${userID}`}&status=${taskStatusTab}`, false);
    const {
        data: GetUserTaskStatusDone = [], refetch: refetchGetUserTaskStatusDone, isSuccess:isSuccessGetUserTaskStatusDone
    } = useGetQuery(false, "user-status-failed-progress", `users/done-tasks/?${userID && `staff_id=${userID}`}`, false);


    const handleTableChange = (pagination, ) => {
        setPagination({
            ...pagination,
            current: pagination.current,
        });
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
        if(userID) {
            refetchGetUserTaskStatistics()
            refetchGetUserInfo()
        }
    } , [userID])

    useEffect(() => {
        console.log(taskStatusTab)
        if(userID && (taskStatusTab === 'failed'|| 'progress')) {
            refetchGetUserTaskStatusProgressFailed()
        }else if(userID && taskStatusTab === 'done') {
             refetchGetUserTaskStatusDone()
        }
    } ,[taskStatusTab , userID])

    //
    // useEffect(() => {
    //     if (isSuccessGetUserTaskStatusFailed) {
    //         setPagination(prevState => ({ ...prevState, total: GetUserTaskStatusFailed?.count }));
    //     }
    // }, [GetUserTaskStatusFailed, isSuccessGetUserTaskStatusFailed]);
  const {
    token: {contentBg},
  } = theme.useToken();
  return (<Row gutter={[10  , 16]}>
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



          roleName === 'general_director' && userID &&
          <Col span={24}>
      <Card size={"small"}>
              <Tabs defaultActiveKey="failed"  >
                  <TabPane
                      tab={
                          <span onClick={() => setTaskStatusTab( prev => 'failed')} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
Неуспешный
              </span>
                      }
                      key="failed"
                  >
                      <TaskNoFilterTable
                          data={GetUserTaskStatusProgressFailed?.results}
                          pagination={pagination}
                          setPagination={setPagination}
                          filter={false}
                          handleTableChange={handleTableChange} />
                  </TabPane>
                  <TabPane

                      tab={
                          <span  onClick={() => setTaskStatusTab('progress')} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>

В процессе
              </span>
                      }
                      key="progress"
                  >
                      <TaskNoFilterTable
                          data={GetUserTaskStatusProgressFailed?.results}
                          pagination={pagination}
                          setPagination={setPagination}
                          filter={false}
                          handleTableChange={handleTableChange} />
                  </TabPane>
                  <TabPane

                      tab={
                          <span  onClick={() => setTaskStatusTab('done')} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              Сделанный
              </span>
                      }
                      key="done"
                  >
                      <TaskDoneTable
                          data={GetUserTaskStatusDone?.results}
                          pagination={pagination}
                          setPagination={setPagination}
                          filter={false}
                          handleTableChange={handleTableChange} />
                  </TabPane>
              </Tabs>
      </Card>

          </Col>
      }
      </Row>);
};

export default UserProfile;