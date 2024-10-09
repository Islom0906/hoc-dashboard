import {Avatar, Col, Flex, Row, Typography} from 'antd';
import {FaTasks} from "react-icons/fa";
import {GrCompliance, GrInProgress} from "react-icons/gr";
import {MdError} from "react-icons/md";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {selectModuls} from "../../../store/slice/modulsSlice";
import {selectStaffIDs} from "../../../store/slice/staffSlice";

const {Text} = Typography

const SmallProfileCard = ({staffID , avatar, fullName, position , done_tasks_count , failed_tasks_count , total_tasks_count , in_progress_tasks_count }) => {
  const navigate=useNavigate()
  const dispatch = useDispatch()
  const { data: { user } = {} } = useSelector((state) => state.auth);
  const handlerCard = () => {
    dispatch(selectStaffIDs(staffID))
    // dispatch(selectModuls(modulID))
    if (user?.roles[0]?.role.name!=='boss'){
    navigate('/view-task-director')
    }else{
      navigate('/taskEditBoss')
    }
  }
  return (
      <div onClick={handlerCard} style={{padding: '10px 0',
      }}>
        <Row
            align="middle"
            style={{
              cursor: 'pointer',
            }}
        >
          <Col span={5}>
            <Avatar src={avatar}/>
          </Col>
          <Col span={19}>
            <Text strong>{fullName}</Text>
            <br/>
            <Text type="secondary" style={{fontSize:11}}>{position}</Text>
          </Col>
        </Row>
        <Row style={{marginTop: 4}}>
          <Col span={6}>
            <Flex gap={4} align={"center"}>
              <FaTasks style={{fontSize: '12px'}}/>
              <Text>{total_tasks_count}</Text>
            </Flex>
          </Col>
          <Col span={6}>
            <Flex gap={4} align={"center"} style={{ color:'#11c15b'}}>
              <GrCompliance style={{fontSize: '12px' }}/>
              <Text>{done_tasks_count}</Text>
            </Flex>
          </Col>
          <Col span={6}>
            <Flex gap={4} align={"center"} style={{ color:'rgb(10, 143, 220)'}}>
              <GrInProgress style={{fontSize: '12px'}}/>
              <Text>{in_progress_tasks_count}</Text>
            </Flex>
          </Col>
          <Col span={6}>
            <Flex gap={4} align={"center"} style={{ color:'rgb(240, 79, 71)'}}>
              <MdError style={{fontSize: '12px' }}/>
              <Text>{failed_tasks_count}</Text>
            </Flex>
          </Col>
        </Row>
      </div>
  )
};

export default SmallProfileCard;
