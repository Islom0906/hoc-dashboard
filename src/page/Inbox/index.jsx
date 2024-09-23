import './index.scss'
import {Col, Row} from "antd";
import {InboxCard} from "../../components";

const Inbox = () => {

  return (
      <Row gutter={[20,20]} >
          {
              Array(8).fill("").map((message, ind) => (
                  <Col span={6} key={ind}>
                      <InboxCard/>
                  </Col>
              ))
          }
      </Row>
  );
};

export default Inbox;