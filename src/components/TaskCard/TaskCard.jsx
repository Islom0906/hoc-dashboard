import DeadlineStatusColor from "../../hooks/deadlineStatusColor";
import {
    Avatar,
    Badge,
    Button,
    Card,
    Col,
    Divider,
    Flex,
    Popconfirm,
    Progress,
    Row,
    Space,
    Tooltip,
    Typography
} from "antd";
import {Link} from "react-router-dom";
import {DeleteOutlined, EditOutlined, FieldTimeOutlined} from "@ant-design/icons";
import dayjs from "dayjs";
import {AvatarUserProfile} from "../index";
import {useDispatch, useSelector} from "react-redux";
import {editIdQuery} from "../../store/slice/querySlice";
import {IoCalendarOutline} from "react-icons/io5";
import {FaRegEye} from "react-icons/fa";

const TaskCard = ({
                      id,
                      title,
                      deadline_status,
                      link,
                      created_at,
                      deadline,
                      tag,
                      doneCountTask,
                      allCountTask,
                      responsible_user,
                      lastUpdate,
                      included_users,
                      created_by,
                        isChecking
                  }) => {
    const {data: {user} = {}} = useSelector((state) => state.auth);
    const dispatch = useDispatch()
    const deadlineColor = DeadlineStatusColor(deadline_status);
    const { Text } = Typography;
    console.log(created_by)
    const Edit = (id) => {
        localStorage.setItem("editDataId", id);
        dispatch(editIdQuery(id));
    };
    const Delete = (id) => {
    };
    console.log(tag)
  return (
      <Card
          className={"TaskCard"}
          style={{
              borderLeft: "6px",
            borderStyle: "solid",
              borderLeftColor: `${deadlineColor}`,
          }}
          size={'small'}

      >

          <Space style={{width: "100%"}} size={10} direction={"vertical"}>
              <Flex align={"center"} justify={"space-between"}>
                  <Text>
                      {title}
                  </Text>
                  <AvatarUserProfile size={35} key={tag?.id} company={tag?.title} image={tag?.image_light}/>
              </Flex>
              <Space style={{width: "100%"}} size={5} direction={"vertical"}>
                  <Progress
                      percent={Math.round((doneCountTask / allCountTask) * 100)}

                      size={["100%", 5]}
                      style={{fontWeight: 800, fontSize: '16px'}}
                      strokeColor={`#0C8CE8`}
                      className={"progress"}
                  />
                  <Flex wrap={true} justify={"space-between"} gap={5} align={"center"}>
                      <Tooltip title={<p>Начало времени:</p>} placement="top">
                          <Flex align={"center"} wrap={"nowrap"} gap={8}>
                              <IoCalendarOutline className={"icon"}/>
                              <Text style={{fontSize: '12px'}}>
                                  {dayjs(created_at).format("DD.MM.YYYY")}
                              </Text>
                          </Flex>
                      </Tooltip>

                      <Tooltip title={<p>Окончание срока:</p>} placement="top">
                          <Flex wrap={"nowrap"} align={"center"} gap={8}>
                              <FieldTimeOutlined className={"icon"}/>
                              <Text style={{fontSize: '12px'}}>
                                  {dayjs(deadline).format("DD.MM.YYYY")}
                              </Text>
                          </Flex>
                      </Tooltip>
                  </Flex>
              </Space>

              <Space style={{width: "100%"}} size={5} direction={"vertical"}>
                  {
                      responsible_user?.id && <Flex align={"center"} justify={"space-between"} gap={5}>
                          <Text style={{fontSize: '12px'}}>Ответственный:</Text>
                          <AvatarUserProfile size={30} key={responsible_user?.id} full_name={responsible_user?.full_name}
                                             moduls={responsible_user?.roles[0]?.position} image={responsible_user?.image}/>
                      </Flex>
                  }


                  <Flex align={"center"} wrap={true} gap={5} justify={"space-between"}>
                      {/*<Text type={"secondary"}>*/}
                      {/*  {dayjs(lastUpdate).format("DD.MM.YYYY")}*/}
                      {/*</Text>*/}
                      <Avatar.Group size={"small"}>
                          {included_users?.map((user) => (
                              <AvatarUserProfile size={30} key={user?.id} full_name={user?.full_name}
                                                 moduls={user?.roles[0]?.position} image={user?.image}/>

                          ))}
                      </Avatar.Group>
                  </Flex>
                  <Divider/>
                  <Flex align={"center"} justify={"space-between"} gap={5}>
                      <Text style={{fontSize: '12px'}}>{created_by?.full_name}</Text>
                      <AvatarUserProfile size={30} key={created_by?.id} full_name={created_by?.full_name}
                                         moduls={created_by?.roles[0]?.position} image={created_by?.image}/>
                  </Flex>
              </Space>

              <Row gutter={5}>
                  {
                      user?.id === created_by?.id &&
                      <>
                          <Col span={8}>
                              <Link to={`/task/add`}>
                                  <Button icon={<EditOutlined/>} style={{textAlign: "center", width: '100%'}}
                                          type={"default"} onClick={()=>Edit(id)}>
                                  </Button>
                              </Link>
                          </Col>
                          <Col span={8}>
                              <Popconfirm
                                  title={"Вы уверены, что хотите удалить это?"}
                                  description={"Удалить"}
                                  onConfirm={() => Delete(id)}
                              >
                                  <Button style={{textAlign: "center", width: '100%'}} type="primary" danger
                                          icon={<DeleteOutlined/>}/>
                              </Popconfirm>
                          </Col>
                      </>
                  }
                  <Col span={user?.id === created_by?.id ? 8 : 24}>
                          <Link to={link}>
                              <Badge dot={isChecking}>
                                  <Button  icon={<FaRegEye style={{fontSize: "23px"}}/>} style={{textAlign: "center", width: '100%'}}
                                           type={"primary"}>
                                      {
                                          !(user?.id === created_by?.id) &&

                                          "Подробнее"
                                      }
                                  </Button>
                              </Badge>
                          </Link>
                  </Col>
              </Row>

          </Space>
      </Card>
  );
};

export default TaskCard