import {Avatar, Card, Flex, Progress, Tooltip, Typography} from "antd";
import React, {useMemo} from "react";
import {UserOutlined} from "@ant-design/icons";
import dayjs from "dayjs";

 const TaskInnerCard = ({
                                main_task_responsible_user,
                                main_task_deadline,
                                main_task_created_at,
                                taskPercent,
                                main_deadline_status
                              }) => {
  const {Text} = Typography;
  const deadlineColor = useMemo(() => {
    const deadlineStatus = main_deadline_status;
    let color = '#3FA2F6';
    if (deadlineStatus === 'soon') {
      color = '#FAFFAF';
    } else if (deadlineStatus === 'failed') {
      color = '#C80036';
    } else if (deadlineStatus === 'progress') {
      color = '#FF7F3E';
    }
    return color;
  }, [main_deadline_status]);


  return (
      <Card size={"small"} style={{
        borderColor: `${deadlineColor}`,
        borderTop: '6px',
        borderStyle: 'solid',
        borderTopColor: `${deadlineColor}`
      }} title="Детали:">
        <Flex vertical={true} gap={10}>
          <Flex align={'center'} justify={'space-between'}>

            <Text type={'secondary'}> Ответственный человек:</Text>
            <Flex align={"center"} gap={10}>
              <Tooltip
                  title={
                    <p>
                      <span>{main_task_responsible_user?.full_name}</span>
                    </p>
                  }
                  placement="top"
              >
                <Avatar
                    style={{backgroundColor: '#87d068'}}
                    icon={main_task_responsible_user?.image ?
                        <img src={main_task_responsible_user?.image} alt={main_task_responsible_user?.full_name}/> :
                        <UserOutlined/>}
                />
              </Tooltip>
            </Flex>
          </Flex>
          {/*<Flex align={'center'} justify={'space-between'}>*/}
          {/*  <Text type={'secondary'}> Статус:</Text>*/}
          {/*  <Text type={'success'}>Active</Text>*/}
          {/*</Flex>*/}
          <Flex align={'center'} justify={'space-between'}>
            <Text type={'secondary'}> Время начала:</Text>
            <Text type={'success'}>{dayjs(main_task_deadline).format('DD.MM.YYYY')}</Text>
          </Flex>
          <Flex align={'center'} justify={'space-between'}>
            <Text type={'secondary'}> Крайний срок:</Text>
            <Text type={'success'}>{dayjs(main_task_created_at).format('DD.MM.YYYY')}</Text>
          </Flex>
          <Flex align={'center'} justify={'space-between'}>

              <Progress percent={taskPercent}
                        percentPosition={{
                          type: 'inner',
                        }}
                        size={['100%', 12]}
                        strokeColor="red" className={'progress'}/>

          </Flex>
          {/*<Flex align={'left'} gap={2} vertical>*/}
          {/*  <Text type={'secondary'}> Progress:</Text>*/}
          {/*  <p>*/}
          {/*    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab beatae, delectus deserunt error excepturi perspiciatis sapiente suscipit tempora vitae voluptatum.*/}
          {/*  </p>*/}

          {/*</Flex>*/}
        </Flex>

      </Card>
  )

}
export default  TaskInnerCard