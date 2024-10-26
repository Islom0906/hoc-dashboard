import {Card, Col, Row, Space, Typography} from "antd";
import React, {useEffect, useState} from "react";
import 'leaflet/dist/leaflet.css'
import './Dashboard.css'
import {useGetQuery} from "../../service/query/Queries";
import ForBossTaskChart from "./boss-chart/ForBossTaskChart";
import {useDispatch, useSelector} from "react-redux";
import SmallProfileCard from "./profileCard/smallProfileCard";
import AboutTagList from "./Tag-boss/AboutTagList";
import AboutTagChart from "./Tag-boss/AboutTagChart";
import {currentMonth, currentYear} from "../../helper/time.helper";
import {SelectMountYear} from "../../components";
import DashboardProfileCard from "./profileCard/DashboardProfileCard";
import {selectCompany, selectCompanyName} from "../../store/slice/companySlice";
import {selectModuls} from "../../store/slice/modulsSlice";


const {Title, Text} = Typography;

const Dashboard = () => {
  const {data: {user} = {}} = useSelector((state) => state.auth);
  const [valueYear, setValueYear] = useState(currentYear)
  const [valueMonth, setValueMonth] = useState(currentMonth)
  const [selectModul, setSelectModul] = useState('')
  const {modulsID} = useSelector(state => state.modulsSlice)
  const {companyID ,companyName} = useSelector(state => state.companySlice)
  const roleName = user?.roles[0]?.role?.name
  const dispatch = useDispatch()

  // modulni getBYID
  const {
    data: GetModulByIDStatistics = [], refetch: refetchGetModulByIDStatistics,
  } = useGetQuery(false, "boss-task-statistics", `users/boss-statistics/${modulsID}?company_id=${companyID}&from_year=2024&to_year=${valueYear}&from_month=1&to_month=12`, false);

  // modulni Staff GetBYID
  const {
    data: GetModulStaffStatistics = [], refetch: refetchGetModulStaffStatistics,
  } = useGetQuery(false, "modul-statistics", `users/modul-statistics/${modulsID ? modulsID :""}?company_id=${companyID}&year=${valueYear}&month=${+valueMonth+1}`, false);

  // Company Get BY ID
  const {
    data: GetCompanyByIDStatistics, refetch: refetchGetCompanyByIDStatistics
  } = useGetQuery(false, 'company-data', `/users/company-statistics/${companyID}?year=${valueYear}&month=${+valueMonth+1}`, false)

  // Company Get
  const {
    data: GetCompanyAllForGeneralStatistics, refetch: refetchGetCompanyAllForGeneralStatistics
  } = useGetQuery(false, 'company-all-data', `/users/companies-statistics?year=${valueYear}&month=${+valueMonth+1}`, false)

  // general derector

  useEffect(() => {
    if (roleName === 'general_director' || roleName === 'admin') {
      refetchGetCompanyAllForGeneralStatistics()
    }
  }, [user,valueMonth,valueYear])
  useEffect(() => {
    if (GetCompanyAllForGeneralStatistics) {
      dispatch(selectCompany(GetCompanyAllForGeneralStatistics[0]?.id))
      dispatch(selectCompanyName(GetCompanyAllForGeneralStatistics[0]?.title))
    }
  }, [GetCompanyAllForGeneralStatistics])



  useEffect(() => {
    if ((roleName === 'general_director'  || roleName === 'admin') && companyID) {
      refetchGetCompanyByIDStatistics()
    }
  }, [valueYear, valueMonth, companyID])
  useEffect(() => {
    if ((roleName === 'general_director' || roleName === 'admin') && modulsID) {
      refetchGetModulStaffStatistics()
    }
  }, [modulsID, companyID ,valueYear, valueMonth])
  // director
  useEffect(() => {
    if (roleName === 'director' && companyID) {
      refetchGetCompanyByIDStatistics()
    }
  }, [companyID, valueYear, valueMonth]);
  useEffect(() => {
    if ((roleName !== 'boss' || roleName !== 'staff') && GetCompanyByIDStatistics) {
      dispatch(selectModuls(GetCompanyByIDStatistics[0]?.id))
    }
  }, [GetCompanyByIDStatistics]);
  //
  // useEffect(() => {
  //   if (user?.roles[0].name === 'director') {
  //     setSelectCompany({id: user?.company[0]?.id, name: user?.company[0]?.name})
  //   }
  // }, [user])


  // boss

  useEffect(() => {
    if (modulsID && companyID) {
      refetchGetModulStaffStatistics()
    }
  }, [modulsID, valueYear, valueMonth])


  useEffect(() => {
    if(modulsID && companyID ) {
      refetchGetModulByIDStatistics()
    }
  } , [modulsID, valueYear])
  console.log(modulsID)

  return (<div className={'site-space-compact-wrapper'}>
        <Space direction={'vertical'} size={"large"} style={{width: '100%'}}>
          <Row gutter={5} style={{paddingBottom: 5}}>
            <Col span={12}>
              <Title level={2} style={{marginBottom: 0}}>
                Панель
              </Title>
            </Col>

            {

                (roleName === 'general_director' || roleName === 'admin')&&
                <SelectMountYear valueYear={valueYear} setValueYear={setValueYear} setValueMonth={setValueMonth}
                                 valueMonth={valueMonth}/>

            }
          </Row>
          <Row gutter={[16, 30]}>
            {/*---- General derector ----*/}

            {(roleName === 'general_director' || roleName === 'admin')&& <>
              <Col span={24}>
                <Title level={4}>
                  Компания
                </Title>
                <Row gutter={5}>
                  {GetCompanyAllForGeneralStatistics?.map(general => (<Col span={6} key={general?.id}>
                        <DashboardProfileCard companyIDSlice={companyID}  companyID={general?.id}
                                              image={general?.image_dark}
                                              fullName={general?.title}
                                              in_progress_tasks_count={general?.total_tasks_count - (general?.done_tasks_count - general?.failed_tasks_count)}
                                              done_tasks_count={general?.done_tasks_count}
                                              failed_tasks_count={general?.failed_tasks_count}
                                              total_tasks_count={general?.total_tasks_count}
                        />
                      </Col>))}
                </Row>

              </Col>
            </>}


            {/*--------- derector ----------*/}
            {roleName !== 'boss' && <>
              <Col span={24}>
                <Title level={4} style={{textAlign: 'center'}}>
                  {companyName}
                </Title>
              </Col>
              <Col span={16}>
                <AboutTagChart data={GetCompanyByIDStatistics}/>
              </Col>
              <Col span={8}>
                <AboutTagList setSelectModul={setSelectModul} setValueMonth={setValueMonth} valueMonth={valueMonth}
                              valueYear={valueYear}
                              setValueYear={setValueYear} data={GetCompanyByIDStatistics}
                />
              </Col>
            </>}
            {/*--------  Boss -------- */}
            <Col span={16}>
              <ForBossTaskChart dataChart={GetModulByIDStatistics} modules={selectModul || user?.roles[0].module?.name}/>
            </Col>
            <Col span={8}>
              <Card
                  className={'staff-card'}
              >
                <Row gutter={5} style={{paddingBottom: 5}}>
                  <Col span={12}>
                    <Title level={5}>Сотрудники:</Title>
                  </Col>
                  <SelectMountYear valueYear={valueYear} setValueYear={setValueYear} setValueMonth={setValueMonth}
                                   valueMonth={valueMonth}/>
                </Row>
                <div style={{height: 400, overflowY: "scroll"}}>
                  {GetModulStaffStatistics.map((staff) => (<SmallProfileCard
                      key={staff?.id}
                      staffID={staff?.id}
                      companyID={companyID}
                                                                             failed_tasks_count={staff?.failed_tasks_count}
                                                                             total_tasks_count={staff?.total_tasks_count}
                                                                             in_progress_tasks_count={staff?.in_progress_tasks_count}
                                                                             avatar={staff?.image}
                                                                             fullName={staff?.full_name}
                                                                             position={staff?.position}
                                                                             done_tasks_count={staff?.done_tasks_count}/>))}
                </div>
              </Card>
            </Col>
          </Row>
        </Space>
      </div>);
};

export default Dashboard;