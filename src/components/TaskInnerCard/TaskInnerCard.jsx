import { Card, Flex, Progress,  Typography} from "antd";
import dayjs from "dayjs";
import DeadlineStatusColor from "../../hooks/deadlineStatusColor";
import {AvatarUserProfile} from "../index";

 const TaskInnerCard = ({       tag,
                                main_task_responsible_user,
                                main_task_deadline,
                                main_task_created_at,
                                taskPercent,
                                main_deadline_status
     ,created_by
                              }) => {
  const {Text} = Typography;

   const deadlineColor= DeadlineStatusColor(main_deadline_status)


  return (
      <Card size={"small"} style={{
        width:'100%',
        borderColor: `${deadlineColor}`,
        borderTop: '6px',
        borderStyle: 'solid',
        borderTopColor: `${deadlineColor}`
      }} title="Информация о задаче">
        <Flex vertical={true} gap={10}>
          <Flex align={'center'} justify={'space-between'}>
            <Text type={'secondary'}> Компания:</Text>
            <Flex align={"center"} gap={10}>
              <AvatarUserProfile keyId={tag?.id} company={tag?.title} image={tag?.image_light}  />
            </Flex>
          </Flex>
            <Flex align={'center'} justify={'space-between'}>
                <Text type={'secondary'}> Таскер:</Text>
                <Flex align={"center"} gap={10}>
                    <AvatarUserProfile keyId={created_by?.id} full_name={created_by?.full_name} image={created_by?.image} moduls={created_by?.roles[0].position} />
                </Flex>
            </Flex>
            {
                main_task_responsible_user?.id &&
                <Flex align={'center'} justify={'space-between'}>
                    <Text type={'secondary'}> Ответственный:</Text>
                    <Flex align={"center"} gap={10}>
                        <AvatarUserProfile keyId={main_task_responsible_user?.id} full_name={main_task_responsible_user?.full_name} image={main_task_responsible_user?.image}  />
                    </Flex>
                </Flex>
            }
          <Flex align={'center'} justify={'space-between'}>
            <Text type={'secondary'}> Время начала:</Text>
            <Text type={'secondary'}>{dayjs(main_task_created_at).format('DD.MM.YYYY')}</Text>
          </Flex>
          <Flex align={'center'} justify={'space-between'}>
            <Text type={'secondary'}> Крайний срок:</Text>
            <Text type={'secondary'}>{dayjs(main_task_deadline).format('DD.MM.YYYY')}</Text>
          </Flex>
              <Flex align={'center'} justify={'space-between'}>
                <Progress percent={Math.round(taskPercent)}
                          percentPosition={{
                            align: 'center',
                            type: 'outer',
                          }}
                          size={['100%', 20]}
                          strokeColor={`${deadlineColor}`} className={'progress'}/>
              </Flex>
        </Flex>

      </Card>
  )

}
export default  TaskInnerCard