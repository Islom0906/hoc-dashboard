import DeadlineStatusColor from "../../hooks/deadlineStatusColor";
import {Avatar, Button, Card, Flex, Progress, Space, Tag, Tooltip, Typography} from "antd";
import {Link} from "react-router-dom";
import {FieldTimeOutlined} from "@ant-design/icons";
import dayjs from "dayjs";
import {AvatarUserProfile} from "../index";
import {LuCalendarDays} from "react-icons/lu";
import {useDispatch, useSelector} from "react-redux";
import {editIdQuery} from "../../store/slice/querySlice";

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
                      created_by
                  }) => {
    const {data: {user} = {}} = useSelector((state) => state.auth);
    const dispatch = useDispatch()
    const deadlineColor = DeadlineStatusColor(deadline_status);
    const { Text } = Typography;

    const Edit = (id) => {
        localStorage.setItem("editDataId", id);
        dispatch(editIdQuery(id));
    };
  return (
      <Card
          className={"TaskCard"}
          style={{
            borderColor: `${deadlineColor}`,
            borderTop: "6px",
            borderStyle: "solid",
            borderTopColor: `${deadlineColor}`,
          }}
          size={'small'}
          title={title}
          extra={
        <div style={{padding:'8px 0'}}>
            <AvatarUserProfile size={'large'} key={tag?.id} company={tag?.name} image={tag?.image_light}/>
        </div>
          }
      >
        <Space style={{ width: "100%" }} size={20} direction={"vertical"}>
          <Flex wrap={true} justify={"space-between"} gap={5} align={"center"}>
            <Tooltip title={<p>Начало времени:</p>} placement="top">
              <Flex align={"center"} wrap={"nowrap"} gap={8}>
                <LuCalendarDays  className={"icon"} />
                <Text style={{fontSize:'12px'}} >
                  {dayjs(created_at).format("DD.MM.YYYY")}
                </Text>
              </Flex>
            </Tooltip>

            <Tooltip title={<p>Окончание срока:</p>} placement="top">
                <Tag color={deadlineColor}>
              <Flex  wrap={"nowrap"} align={"center"} gap={8}>
                <FieldTimeOutlined className={"icon"} />
                  <Text style={{fontSize:'12px' , color:"white"}} >
                    {dayjs(deadline).format("DD.MM.YYYY")}
                  </Text>
              </Flex>
                </Tag>
            </Tooltip>
          </Flex>
          <Progress
              percent={Math.round((doneCountTask/allCountTask) * 100) }
              percentPosition={{
                align: "center",
                type: "outer",
              }}
              size={["100%", 6]}
              style={{fontWeight:800 , fontSize:'16px'}}
              strokeColor={`${deadlineColor}`}
              className={"progress"}
          />
          <Flex align={"center"} justify={"space-between"} gap={5}>
            <Text style={{fontSize:'12px'}}>Ответственный:</Text>
            <AvatarUserProfile size={40} key={responsible_user?.id} full_name={responsible_user?.full_name} moduls={responsible_user?.modules?.[0]?.name} image={responsible_user?.image}  />
          </Flex>

          <Flex align={"center"} wrap={true} gap={5} justify={"space-between"}>
            {/*<Text type={"secondary"}>*/}
            {/*  {dayjs(lastUpdate).format("DD.MM.YYYY")}*/}
            {/*</Text>*/}
            <Avatar.Group size={"small"}>
              {included_users?.map((user) => (
                    <AvatarUserProfile size={30} key={user?.id} full_name={user?.full_name} moduls={user?.roles?.[0]?.name} image={user?.image} />

              ))}
            </Avatar.Group>
          </Flex>
          {
          }
          <Flex align={"center"} gap={5}>
              {
                  user?.id===created_by?.id &&
              <Button style={{textAlign: "center", width: '100%'}} type={"primary"} onClick={Edit(id)}>
                  <Link to={`/task/add`}>
                      {/*<LuDoorOpen style={{ fontSize: "23px" }} />*/}
                      Редактировать
                  </Link>
              </Button>
              }

            <Button  style={{textAlign:"center" , width:'100%'}} type={"primary"}  >
              <Link to={`${link}`}>
                {/*<LuDoorOpen style={{ fontSize: "23px" }} />*/}
                Подробнее
              </Link>
            </Button>
          </Flex>
        </Space>
      </Card>
  );
};

export default TaskCard