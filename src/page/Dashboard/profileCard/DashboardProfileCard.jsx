import { Avatar, Card, Typography, Tabs } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { FaChartPie, FaListAlt, FaTasks } from "react-icons/fa";
import { MdError } from "react-icons/md";
import { GrCompliance, GrInProgress } from "react-icons/gr";
import { RiContractFill } from "react-icons/ri";

ChartJS.register(ArcElement, Tooltip, Legend);

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const DashboardProfileCard = ({selectCompany , companyID, title, image, fullName, position, total_tasks_count, done_tasks_count, in_progress_tasks_count, failed_tasks_count, responsible_tasks_count , setSelectCompany }) => {
  const handlerCompanyId = () => {
    if(companyID && fullName) setSelectCompany({id:companyID , name:fullName})
  }

  const chartData = {
    labels: ['Сделанный', 'В процессе', 'Неуспешный', 'Ответственная задача'],
    datasets: [
      {
        data: [done_tasks_count || 0, in_progress_tasks_count || 0, failed_tasks_count || 0, responsible_tasks_count || 0],
        backgroundColor: ['#11c15b', 'rgb(10, 143, 220)', 'rgb(240, 79, 71)', '#f4c542'],
        hoverBackgroundColor: ['#0da248', 'rgb(8, 110, 180)', 'rgb(210, 69, 61)', '#e3b737'],
      },
    ],
  };

  return (
      <Card
          onClick={handlerCompanyId}
          style={{
            cursor:"pointer",
            borderRadius: 10,
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            border: `${selectCompany.id === companyID ? '1px solid #76BC33' : '1px solid transparent'}`
          }}
          size={"small"}
      >
        <Title level={4} style={{ textAlign: 'left', margin: '0 0 10px 20px' }}>
          {title}
        </Title>

        <Avatar size={80} src={image} icon={<UserOutlined />} />

        <Title level={4} style={{ marginTop: 10 }}>
          {fullName}
        </Title>
        <Text type="secondary">{position}</Text>

        <Card
            style={{
              marginTop: 20,
            }}
            bodyStyle={{ padding: '10px' }}
        >
          <Tabs defaultActiveKey="1">
            <TabPane
                tab={
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <FaListAlt /> Статистика
              </span>
                }
                key="1"
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{display: 'flex', alignItems: 'center', gap: 5}}>
                      <FaTasks style={{fontSize: '18px'}}/>
                      <Text style={{margin: 0, fontSize: 12}}>Все задачи</Text>
                      <Title level={5} style={{margin: 0}}>
                        {total_tasks_count || 0}
                      </Title>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: 5, color: '#11c15b'}}>
                      <GrCompliance style={{fontSize: '18px'}}/>
                      <Text style={{margin: 0, fontSize: 12, color: '#11c15b'}}>Сделанный</Text>
                      <Title level={5} style={{margin: 0, color: '#11c15b'}}>
                        {done_tasks_count || 0}
                      </Title>
                    </div>

                    <div style={{display: 'flex', alignItems: 'center', gap: 5, color: 'rgb(10, 143, 220)'}}>
                      <GrInProgress style={{fontSize: '18px'}}/>
                      <Text style={{margin: 0, fontSize: 12, color: 'rgb(10, 143, 220)'}}>В процессе</Text>
                      <Title level={5} style={{margin: 0, color: 'rgb(10, 143, 220)'}}>
                        {in_progress_tasks_count || 0}
                      </Title>
                    </div>

                    <div style={{display: 'flex', alignItems: 'center', gap: 5, color: 'rgb(240, 79, 71)'}}>
                      <MdError style={{fontSize: '18px'}}/>
                      <Text style={{margin: 0, fontSize: 12, color: 'rgb(240, 79, 71)'}}>Неуспешный</Text>
                      <Title level={5} style={{margin: 0, color: 'rgb(240, 79, 71)'}}>
                      {failed_tasks_count || 0}
                      </Title>
                    </div>
                {
                    responsible_tasks_count ?
                    <div style={{display: 'flex', alignItems: 'center', gap: 5}}>
                      <RiContractFill style={{fontSize: '18px'}}/>
                      <Text style={{margin: 0}}>Ответственная задача</Text>
                      <Title level={5} style={{margin: 0}}>
                        {responsible_tasks_count || 0}
                      </Title>
                    </div>
                        : ''
                }
              </div>
            </TabPane>

            <TabPane
                tab={
                  <span style={{display: 'flex', alignItems: 'center', gap: 5}}>
                <FaChartPie/> Диаграмма
              </span>
                }
                key="2"
            >
              {chartData && <Doughnut data={chartData}/>}
            </TabPane>
          </Tabs>
        </Card>
      </Card>
  );
};

export default DashboardProfileCard;
