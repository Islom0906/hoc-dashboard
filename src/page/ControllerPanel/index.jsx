import {
  Col, Form,
  Row, Select,
} from "antd";
import { useSelector } from "react-redux";
import {TaskCard} from "../../components";

const ControllerPanel = () => {
  const { data: { user } = {} } = useSelector((state) => state.auth);


  return (
      <div>
        <h1> {user.roles[0].name === 'admin' ?'контролировать все задачи' : 'контроль сотрудников отдела'} </h1>
        <Form
            variant="outlined"
              layout={{
                wrapperCol: {
                  span: 14,
                  offset: 4,
                },
              }}
        >
        <Row gutter={[24, 24]} style={{ marginTop: 15 }}>
          <Col span={4}>
            <Form.Item
                label="выбрать компанию"
                name="selectCompany"
            >
              <Select />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item
                label="Выберите раздел"
                name="selectSection"
            >
              <Select />
            </Form.Item>
          </Col>
        </Row>
        </Form>

        <Row gutter={[24, 24]} style={{ marginTop: 15 }}>




          {/*{staffGetTask?.count > 0 &&*/}
          {/*    staffGetTask?.results?.map((task) => (*/}
          {/*        <Col*/}
          {/*            key={task?.main_task_id}*/}
          {/*            className="gutter-row"*/}
          {/*            xs={{ span: 12 }}*/}
          {/*            md={{ span: 8 }}*/}
          {/*            xl={{ span: 6 }}*/}
          {/*        >*/}
          {/*          <TaskCard key={task?.main_task_id}  title={task?.main_task_title} deadline_status={task?.main_deadline_status}  link={`/task-list/${task?.main_task_id}`} created_at={task?.main_task_created_at} deadline={task?.main_task_deadline}  doneCountTask={task?.done_sub_tasks_count} allCountTask={task?.sub_tasks_count} responsible_user={task?.responsible_user}  lastUpdate={task?.staff_last_sub_task_updated_at} included_users={task?.included_users} />*/}
          {/*          {task?.main_task_id}*/}
          {/*        </Col>*/}
          {/*    ))}*/}
          {/*{bossGetTask?.count > 0 &&*/}
          {/*    bossGetTask?.results?.map((task) => (*/}
          {/*        <Col*/}
          {/*            key={task?.main_task_id}*/}
          {/*            className="gutter-row"*/}
          {/*            xs={{ span: 12 }}*/}
          {/*            md={{ span: 8 }}*/}
          {/*            xl={{ span: 6 }}*/}
          {/*        >*/}
          {/*          <TaskCard key={task?.main_task_id}  title={task?.main_task_title} deadline_status={task?.main_deadline_status}  link={`/task-list/${task?.main_task_id}`} created_at={task?.main_task_created_at} deadline={task?.main_task_deadline}  doneCountTask={task?.done_sub_tasks_count} allCountTask={task?.sub_tasks_count} responsible_user={task?.responsible_user}  lastUpdate={task?.staff_last_sub_task_updated_at} included_users={task?.included_users} />*/}
          {/*        </Col>*/}
          {/*    ))}*/}
        </Row>
      </div>
  );
};
export default ControllerPanel;


