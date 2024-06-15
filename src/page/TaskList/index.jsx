

import {Card, Col, Divider, Row} from "antd";

const TaskList = () => {
  return (
      <div>
        <h1>
          User setting
        </h1>

        <Divider orientation="left"><h4>Completed</h4> </Divider>
        <Row gutter={16}>
          <Col span={6}>
            <TaskCard/>

          </Col>

        </Row>
      </div>
  );
};


export  const  TaskCard = ({})=> {
return(
    <Card className={'TaskCard'} title="Update user flows with UX feedback from Session #245"  style={{ width: 300 }}>
      <p>Card content</p>
      <p>Card content</p>
      <p>Card content</p>
    </Card>
)
}

export default TaskList;