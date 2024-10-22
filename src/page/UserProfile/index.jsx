import {Col, Menu, Row, theme} from "antd";
import './index.scss'
import {FaUser} from "react-icons/fa";
import {useEffect, useState} from "react";
import ReadingPresonalData from "./readingPresonalData";
import DashboardProfileCard from "../Dashboard/profileCard/DashboardProfileCard";
import {useGetQuery} from "../../service/query/Queries";
import {currentMonth, currentYear} from "../../helper/time.helper";
import {useSelector} from "react-redux";
// import Personal from "./personal";
// import ChangePassword from "./ChangePassword";
// import {RiLockPasswordFill} from "react-icons/ri";

const UserProfile = () => {
  const {data: {user} = {}} = useSelector((state) => state.auth);
  const [checkInfo, setCheckInfo] = useState('personal')
  const {
    data: GetUserTaskStatistics = [], refetch: refetchGetUserTaskStatistics,
  } = useGetQuery(false, "user-task-statistics", `users/staff-statistics`, false);
  const handleMenu = (key) => {
    setCheckInfo(key)
  }
  useEffect(() => {
    refetchGetUserTaskStatistics()
  }, [])

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
          <DashboardProfileCard title={'Мой профиль'} image={user?.image} position={user.roles[0]?.position}
                                fullName={`${user?.full_name}`}
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
            <ReadingPresonalData/>
            {/*{*/}
            {/*    checkInfo === 'personal' ?*/}
            {/*        <Personal/> :*/}
            {/*        <ChangePassword setCheckInfo={setCheckInfo}/>*/}
            {/*}*/}

          </div>
        </Col>
      </Row>);
};

export default UserProfile;