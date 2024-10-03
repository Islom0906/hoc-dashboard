import {Card, Col, Row, Space, Typography} from "antd";
import {useEffect, useMemo, useState} from "react";
import 'leaflet/dist/leaflet.css'
import './Dashboard.css'
import DashboardProfileCard from "./profileCard/DashboardProfileCard";
import {useGetQuery} from "../../service/query/Queries";
import ForBossTaskChart from "./boss-chart/ForBossTaskChart";
import MapForDashboardStructure from "./map-company/MapForDashboardStructure";
import {useSelector} from "react-redux";
import {FaTasks} from "react-icons/fa";
import {GrCompliance, GrInProgress} from "react-icons/gr";
import {MdError} from "react-icons/md";
import {RiContractFill} from "react-icons/ri";
import SmallProfileCard from "./profileCard/smallProfileCard";
import AboutTagList from "./Tag-boss/AboutTagList";
import AboutTagChart from "./Tag-boss/AboutTagChart";
import {currentMonth, currentYear} from "../../helper/time.helper";


const { Title, Text  } = Typography;
const appointments = [
  {
    title: 'Dr Nail Wagner',
    specialty: 'Heart Specialist',
    time: '9:30',
    date: '15 Aug',
    avatar: 'https://example.com/avatar1.jpg', // Use actual avatar URLs
  },
  {
    title: 'Dr. Kane Williamson',
    specialty: 'Psychiatrist',
    time: '9:30',
    date: '15 Aug',
    avatar: 'https://example.com/avatar2.jpg',
  },
  {
    title: 'Dr. Tom Bundle',
    specialty: 'Neurologist',
    time: '9:30',
    date: '15 Aug',
    avatar: 'https://example.com/avatar3.jpg',
  },
  {
    title: 'Jone B. Rilea',
    specialty: 'Rheumatologist',
    time: '9:30',
    date: '15 Aug',
    avatar: 'https://example.com/avatar4.jpg',
  },
  {
    title: 'Dr. Kane Williamson',
    specialty: 'Psychiatrist',
    time: '9:30',
    date: '15 Aug',
    avatar: 'https://example.com/avatar2.jpg',
  },
  {
    title: 'Dr. Tom Bundle',
    specialty: 'Neurologist',
    time: '9:30',
    date: '15 Aug',
    avatar: 'https://example.com/avatar3.jpg',
  },
  {
    title: 'Jone B. Rilea',
    specialty: 'Rheumatologist',
    time: '9:30',
    date: '15 Aug',
    avatar: 'https://example.com/avatar4.jpg',
  },
  {
    title: 'Dr. Kane Williamson',
    specialty: 'Psychiatrist',
    time: '9:30',
    date: '15 Aug',
    avatar: 'https://example.com/avatar2.jpg',
  },
  {
    title: 'Dr. Tom Bundle',
    specialty: 'Neurologist',
    time: '9:30',
    date: '15 Aug',
    avatar: 'https://example.com/avatar3.jpg',
  },
  {
    title: 'Jone B. Rilea',
    specialty: 'Rheumatologist',
    time: '9:30',
    date: '15 Aug',
    avatar: 'https://example.com/avatar4.jpg',
  },
];


const Dashboard = () => {
  const { data: { user } = {} } = useSelector((state) => state.auth);
  const [modulID , setModulID] = useState('')
  const [valueYear, setValueYear] = useState(currentYear)
  const [valueMonth, setValueMonth] = useState(currentMonth)

  const {
    data: GetUserTaskStatistics =[],
    refetch: refetchGetUserTaskStatistics,
  } = useGetQuery(false, "user-task-statistics", `users/staff-statistics/` , false);


  const {
    data: GetBossStatistics =[],
    refetch: refetchGetBossStatistics,
  } = useGetQuery(false, "boss-task-statistics", `users/boss-statistics?from_year=2024&from_month=1&to_year=2024&to_month=12` , false);

    const {
        data:GetTagBossStatistics,
        refetch:refetchGetTagBossStatistics
    } = useGetQuery(false, 'company-all-data', `/users/tag-statistics/${user?.tags[0]?.id}?year=${valueYear}&month=${valueMonth}`, false)
  const {
    data: GetIdBossStatistics =[],
    refetch: refetchGetIdBossStatistics,
  } = useGetQuery(false, "modul-statistics", `users/modul-statistics/${modulID}` , false);


  useEffect((  ) => {
    if( user?.roles[0].name ==='boss') {
      setModulID(user?.modules[0].id)
    }
  } , [user])

  const taskStatus = useMemo(() => {

    let arrayList = [
      {
        id: 1,
        icon: <FaTasks style={{ fontSize: '24px' }} />,
        count: GetUserTaskStatistics?.total_tasks_count || 0,
        text: 'Все задачи',
      },
      {
        id: 2,
        icon: <GrCompliance style={{ fontSize: '24px' }} />,
        count: GetUserTaskStatistics?.done_tasks_count || 0,
        text: 'Сделанный',
        color: 'rgba(75, 192, 192, 0.5)'
      },
      {
        id: 3,
        icon: <GrInProgress style={{ fontSize: '24px' }} />,
        count: GetUserTaskStatistics?.in_progress_tasks_count || 0,
        text: 'В процессе',
        color: 'rgba(255, 206, 86, 0.5)'
      },
      {
        id: 4,
        icon: <MdError style={{ fontSize: '24px' }} />,
        count: GetUserTaskStatistics?.failed_tasks_count || 0,
        text: 'Неуспешный',
        color: 'rgba(255, 99, 132, 0.5)'
      },
      {
        id: 5,
        icon: <RiContractFill style={{ fontSize: '24px' }} />,
        count: GetUserTaskStatistics?.responsible_tasks_count || 0,
        text: 'Ответственная задача',
      },
    ]

    let filteredTaskStatus = arrayList?.filter(status => status.id !== 1 && status.id !== 5);
    const chartData = {
      labels: filteredTaskStatus.map(status => status.text),
      datasets: [
        {
          data: filteredTaskStatus?.map(status => status.count),
          backgroundColor: filteredTaskStatus?.map(status => status.color),
          borderWidth: 1,
        },
      ],
    };
    return {chartData,  arrayList}
  }, [GetUserTaskStatistics]);

  useEffect(() => {
    refetchGetUserTaskStatistics()
    refetchGetBossStatistics()
  }, [])

  useEffect(() => {
    console.log('render')
    if (user?.roles[0]?.name === 'director') {
      refetchGetTagBossStatistics()

    }
  }, [valueYear, valueMonth]);

  useEffect(() => {
    if(modulID) refetchGetIdBossStatistics()
  } , [modulID])



  return (
      <div className={'site-space-compact-wrapper'}>
        <Space direction={'vertical'} size={"large"} style={{width: '100%'}}>
          <Row gutter={[16, 30]}  >
            <Col span={18}>
              <Title level={2} style={{marginBottom:0}}>
                Панель
              </Title>
            </Col>
            {/*<Col span={12}>*/}
            {/*  <Card size={"small"}>*/}
            {/*    <CircleChart/>*/}
            {/*  </Card>*/}
            {/*</Col>*/}

            <Col span={16}>
              <MapForDashboardStructure />
            </Col>
            <Col span={8}>
              <DashboardProfileCard title={'Мой профиль'} image={user?.image} position={user?.position} fullName={`${user?.first_name} ${user?.last_name} ${user?.middle_name}`} statistics={taskStatus?.arrayList} chartData={taskStatus?.chartData}  />
            </Col>
            {/*--------- Tag Bos ----------*/}

            {
                user?.roles[0]?.name === 'director' &&
                <>
                  <Col span={16}>
                    <AboutTagChart data={GetTagBossStatistics}/>
                  </Col>
                  <Col span={8}>
                    <AboutTagList setValueMonth={setValueMonth} valueMonth={valueMonth} valueYear={valueYear}
                                  setValueYear={setValueYear} data={GetTagBossStatistics}
                                  setModulID={setModulID}/>
                  </Col>
                </>
          }


          {/*--------  Boss -------- */}
            {
                (user?.roles[0]?.name === 'director' || user?.roles[0]?.name === 'boss') &&
                <>
                  <Col span={16}>
                    <ForBossTaskChart dataChart={GetBossStatistics} modules={user?.modules[0]?.name} />
                  </Col>
                  <Col span={8}>
                    <Card
                        className={'staff-card'}
                        title="Сотрудники:"
                    >
                      <div   style={{height:400 , overflowY:"scroll"}}>
                        {GetIdBossStatistics.map((staff) => (
                            <SmallProfileCard staffID={staff?.id} failed_tasks_count={staff?.failed_tasks_count} total_tasks_count={staff?.total_tasks_count} in_progress_tasks_count={staff?.in_progress_tasks_count} avatar={staff?.image} fullName={staff?.full_name} position={staff?.position} done_tasks_count={staff?.done_tasks_count} />
                        ))}
                      </div>

                    </Card>
                  </Col>
                </>
            }


        </Row>
        </Space>
      </div>
  );
};

export default Dashboard;