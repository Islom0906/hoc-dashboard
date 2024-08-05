import DeadlineStatusColor from "../../hooks/deadlineStatusColor";
import {Avatar,  Card, Flex, Progress, Space, Tooltip, Typography} from "antd";
import { FieldTimeOutlined} from "@ant-design/icons";
import dayjs from "dayjs";
import {AvatarUserProfile} from "../index";
import {LuCalendarDays} from "react-icons/lu";

const TaskCardForBoss = ({   title , deadline_status  ,created_at ,deadline , doneCountTask ,allCountTask ,responsible_user , lastUpdate ,included_users }) => {
  const deadlineColor = DeadlineStatusColor(deadline_status);
  const { Text } = Typography;


  return (
      <Card
          className={"TaskCard"}
          style={{
            borderColor: `${deadlineColor}`,
            borderTop: "6px",
            borderStyle: "solid",
            borderTopColor: `${deadlineColor}`,
          }}
          size={'default'}
          title={title}
      >
        <Space style={{ width: "100%" }} size={20} direction={"vertical"}>
          <Flex wrap={true} justify={"space-between"} gap={5} align={"center"}>
            <Tooltip title={<p>Начало времени:</p>} placement="top">
              <Flex align={"center"} wrap={"nowrap"} gap={8}>
                <LuCalendarDays  className={"icon"} />

                <Text type={"secondary"}>
                  {dayjs(created_at).format("DD.MM.YYYY")}
                </Text>
              </Flex>
            </Tooltip>

            <Tooltip title={<p>Окончание срока:</p>} placement="top">
              <Flex wrap={"nowrap"} align={"center"} gap={8}>
                <FieldTimeOutlined className={"icon"} />
                <Text type={"secondary"}>
                  {dayjs(deadline).format("DD.MM.YYYY")}
                </Text>
              </Flex>
            </Tooltip>
          </Flex>
          <Progress
              percent={(doneCountTask/allCountTask) * 100}
              percentPosition={{
                align: "center",
                type: "outer",
              }}
              size={["100%", 3]}
              strokeColor={`${deadlineColor}`}
              className={"progress"}
          />
          <Flex align={"center"} justify={"space-between"} gap={5}>
            <Text>Ответственный:</Text>
            <AvatarUserProfile key={responsible_user?.id} full_name={responsible_user?.full_name} moduls={responsible_user?.modules?.[0]?.name} image={responsible_user?.image} messenger1={responsible_user?.messenger_link1} messenger2={responsible_user?.messenger_link2} />
          </Flex>

          <Flex align={"center"} wrap={true} gap={5} justify={"space-between"}>
            {/*<Text type={"secondary"}>*/}
            {/*  {dayjs(lastUpdate).format("DD.MM.YYYY")}*/}
            {/*</Text>*/}

            <Avatar.Group size={"small"}>
              {included_users?.map((user) => (
                  <AvatarUserProfile key={user?.id} full_name={user?.full_name} moduls={user?.roles?.[0]?.name} image={user?.image} messenger1={user?.messenger_link1} messenger2={user?.messenger_link2}/>
              ))}
            </Avatar.Group>
          </Flex>

        </Space>
      </Card>
  );
};

export default TaskCardForBoss