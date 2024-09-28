import {Avatar, Col, Flex, Row, Typography} from 'antd';
import {FaTasks} from "react-icons/fa";
import {GrCompliance, GrInProgress} from "react-icons/gr";
import {MdError} from "react-icons/md";

const {Text} = Typography

const SmallProfileCard = ({avatar, title, specialty}) => {
  return (
      <div style={{padding: '10px 0',
      }}>
        <Row
            align="middle"
            style={{
              cursor: 'pointer',
            }}
        >
          <Col span={5}>
            <Avatar src={avatar} size="large"/>
          </Col>
          <Col span={19}>
            <Text strong>{title}</Text>
            <br/>
            <Text type="secondary">{specialty}</Text>
          </Col>
        </Row>
        <Row style={{marginTop: 4}}>
          <Col span={6}>
            <Flex gap={4} align={"center"}>
              <FaTasks style={{fontSize: '16px'}}/>
              <Text>100</Text>
            </Flex>
          </Col>
          <Col span={6}>
            <Flex gap={4} align={"center"}>
              <GrCompliance style={{fontSize: '16px'}}/>
              <Text>20</Text>
            </Flex>
          </Col>
          <Col span={6}>
            <Flex gap={4} align={"center"}>
              <GrInProgress style={{fontSize: '16px'}}/>
              <Text>30</Text>
            </Flex>
          </Col>
          <Col span={6}>
            <Flex gap={4} align={"center"}>
              <MdError style={{fontSize: '16px'}}/>
              <Text>40</Text>
            </Flex>
          </Col>
        </Row>
      </div>
  )
};

export default SmallProfileCard;
