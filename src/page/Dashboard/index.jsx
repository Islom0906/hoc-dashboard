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
  const [tagChartData, setTagChartData] = useState({})
  const {
    data: GetUserTaskStatistics =[],
    refetch: refetchGetUserTaskStatistics,
  } = useGetQuery(false, "user-task-statistics", `users/staff-statistics/` , false);


  const {
    data: GetBossStatistics =[],
    refetch: refetchGetBossStatistics,
  } = useGetQuery(false, "boss-task-statistics", `users/boss-statistics?from_year=2024&from_month=2&to_year=2024&to_month=8` , false);

  const {
    data:GetTagBossStatistics,
    refetch:refetchGetTagBossStatistics
  }=useGetQuery(false,'company-all-data',`/users/tag-statistics/1?year=2024&month=9`,false)


  const taskStatus = useMemo(() => {

    let arrayList = [
      {
        id: 1,
        icon: <FaTasks style={{ fontSize: '24px' }} />,
        count: GetUserTaskStatistics?.total_tasks_count || 0,
        text: 'Все задачи',
        span: '24',
      },
      {
        id: 2,
        icon: <GrCompliance style={{ fontSize: '24px' }} />,
        count: GetUserTaskStatistics?.done_tasks_count || 0,
        text: 'Сделанный',
        span: '8',
        color: 'rgba(75, 192, 192, 0.5)'
      },
      {
        id: 3,
        icon: <GrInProgress style={{ fontSize: '24px' }} />,
        count: GetUserTaskStatistics?.in_progress_tasks_count || 0,
        text: 'В процессе',
        span: '8',
        color: 'rgba(255, 206, 86, 0.5)'
      },
      {
        id: 4,
        icon: <MdError style={{ fontSize: '24px' }} />,
        count: GetUserTaskStatistics?.failed_tasks_count || 0,
        text: 'Неуспешный',
        span: '8',
        color: 'rgba(255, 99, 132, 0.5)'
      },
      {
        id: 5,
        icon: <RiContractFill style={{ fontSize: '24px' }} />,
        count: GetUserTaskStatistics?.responsible_tasks_count || 0,
        text: 'Ответственная задача',
        span: '24',
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
  refetchGetTagBossStatistics()
} , [])


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
            {/*--------  Boss -------- */}
            <Col span={16}>
              <ForBossTaskChart modules={user?.modules[0]?.name} />
            </Col>
            <Col span={8}>
              <Card
                  className={'staff-card'}
                  title="Сотрудники:"
                  extra={<Text strong>...</Text>}
              >
                <div   style={{height:400 , overflowY:"scroll"}}>
                  {appointments.map((appointment, index) => (
                      <SmallProfileCard date={appointment?.date} avatar={appointment?.avatar} title={appointment?.title} specialty={appointment?.specialty} time={appointment?.time} />
                  ))}
                </div>

              </Card>
            </Col>
            <Col span={16}>
              <AboutTagList setTagChartData={setTagChartData} data={GetTagBossStatistics}/>
            </Col>
            <Col span={8}>
              <AboutTagChart tagChartData={tagChartData}/>
            </Col>
            </Row>
        </Space>
      </div>
  );
};

export default Dashboard;