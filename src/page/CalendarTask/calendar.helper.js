import {useMemo} from "react";
import dayjs from "dayjs";
import {Avatar, Button, Card, Flex, Popover, Space, Tag, theme, Typography,} from "antd";
import {IoCalendarOutline} from "react-icons/io5";
import {AvatarUserProfile} from "../../components";
import {Link} from "react-router-dom";
import DeadlinePopover from "../../components/CustomPopover/deadlinePopover";

const {Title,Text}=Typography
const contentPopoverBirthday = (content) => {
    return (
        <Card
            style={{
                borderRadius: '10px',
                textAlign: 'center',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                padding: '20px',
                backgroundColor: '#CED232B2',


            }}
            bodyStyle={{ padding: '0' }}

        >
            <Flex align={"center"} gap={10} >
                <img src="/birthday.gif" alt="birthday" style={{width:35,height:35}}/>
                {content.first_name && (
                    <Flex align={"start"}  vertical={true}>

                    <p style={{ fontSize: '10px', color: '#FFFFFF80' }}>День рождения</p>
                    <p style={{ fontSize: '16px', color: '#FFFFFFC2' }}>{ `${content.first_name} ${content.last_name}`}</p>
                    </Flex>
                )}
            </Flex>
        </Card>
    );
};

const contentPopoverDeadline = (deadline, systemMode) => {
    return (
        <Space size={5} direction={"vertical"}>
            <Flex align={"center"} gap={10} justify={"space-between"}>
            <Title level={5} style={{marginBottom:0}}>
                {deadline?.title}
            </Title>
                <AvatarUserProfile size={25} key={deadline?.created_by?.id} full_name={deadline?.created_by?.full_name}
                                   moduls={deadline?.created_by?.roles[0]?.module?.name}
                                   image={deadline?.created_by?.image}/>


        </Flex>
        <Flex align={"center"} gap={5}>
            <IoCalendarOutline style={{fontSize: 10}}/>
            <Text style={{fontSize: 10}}>
                {dayjs(deadline.created_at).format('DD.MM.YYYY')} - {dayjs(deadline.deadline).format('DD.MM.YYYY')}
            </Text>
        </Flex>
            <Flex align={"center"} gap={10} justify={"space-between"}>
                <img style={{width: 25, height: 25, objectFit: 'cover',border:'0.5px solid black',borderRadius:'100%'}}
                     src={systemMode === 'dark' ? deadline?.company?.image_dark : deadline?.company?.image_light}
                     alt={deadline?.company?.title}/>

                <Avatar.Group size={"small"}>
                    {deadline?.included_users?.map((user) => (
                        <AvatarUserProfile size={25} key={user?.id} full_name={user?.full_name}
                                           moduls={user?.roles?.[0]?.name} image={user?.image}/>

                    ))}
                </Avatar.Group>
            </Flex>
                <Flex justify={"end"}>
            <Link to={`/task-list/${deadline?.id}`}>

            <Button style={{
                backgroundColor:'#fff',
                color:'#000',
                fontSize:10
            }}
            shape={'round'}
                    size={'small'}
            >
                Подробнее
            </Button>
            </Link>
                </Flex>
        </Space>
    )

}

const contentPopoverMeeting = ({meeting}) => {

    return(
    <Card
        style={{
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            padding: '16px',
        }}
        bodyStyle={{ padding: 0 }}
    >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
                <h3 style={{ marginBottom: 0 }}>Design Discussion</h3>
                <p style={{ color: 'gray', marginBottom: '16px' }}>12:30 - 15:45</p>
            </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <Tag color="blue">Team</Tag>
            <Tag color="red">Meeting</Tag>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Avatar.Group maxCount={2}>
                <Avatar src="https://example.com/avatar1.jpg" />
                <Avatar src="https://example.com/avatar2.jpg" />
                <Avatar>+4</Avatar>
            </Avatar.Group>
        </div>
    </Card>)
}
export const useBirthdayMap = (dataBirthDay) => {
    return useMemo(() => {
        return dataBirthDay?.reduce((acc, birthday) => {
            const parsedDate = dayjs(birthday.birthday, 'DD.MM.YYYY');
            if (!parsedDate.isValid()) {
                return acc;
            }
            const key = parsedDate.format('MM-DD');
            acc[key] = acc[key] || [];
            acc[key].push(birthday);
            return acc;
        }, {});
    }, [dataBirthDay])
}

export const useMeetingMap = (dataMeeting) => {
    return useMemo(() => {
        return dataMeeting?.reduce((acc, meeting) => {
            const key = dayjs(meeting?.meeting_date).format('YYYY-MM-DD');
            acc[key] = acc[key] || [];
            acc[key].push(meeting);
            return acc;
        }, {});
    }, [dataMeeting])
}

export const useDeadlineMap = (dataDeadline) => {
    return useMemo(() => {
        return dataDeadline?.reduce((acc, deadline) => {
            const key = dayjs(deadline?.deadline).format('YYYY-MM-DD');
            acc[key] = acc[key] || [];
            acc[key].push(deadline);
            return acc;
        }, {});
    }, [dataDeadline])
}


export const dateCellRender = (
    value,
    birthdayMap,
    meetingMap,
    deadlineMap,
    filterForColor,
    colorMeeting,
    changeMeeting,
    systemMode
) => {
    const {
        token: {
            colorTextCalendar,
            deadlineBg,
            birthdayBg,
            meetingBg
        },
    } = theme.useToken();
    const today = value.isSame(new Date(), 'day');
    const birthdayStr = value.format('MM-DD');
    const dateStr = value.format('YYYY-MM-DD');
    let meetingsOnDate = [];
    let birthdaysOnDate = [];
    let deadlineOnDate = [];
    if (filterForColor === 'all') {
        if (birthdayMap) {
            birthdaysOnDate = birthdayMap[birthdayStr] || [];
        }
        if (meetingMap) {
            meetingsOnDate = meetingMap[dateStr] || [];
        }
        if (deadlineMap) {
            deadlineOnDate = deadlineMap[dateStr] || [];
        }
    }
    if (birthdayMap && colorMeeting.birthday.name === filterForColor) {
        birthdaysOnDate = birthdayMap[birthdayStr] || [];
    }
    if (meetingMap && colorMeeting.meeting.name === filterForColor) {
        meetingsOnDate = meetingMap[dateStr] || [];
    }
    if (deadlineMap && colorMeeting.deadline.name === filterForColor) {
        deadlineOnDate = deadlineMap[dateStr] || [];
    }



    return (
        <div className={`custom-td`}>
            <div className={`date-number `}><span className={`${today ? 'today' : ""}`}>{value.date()}</span></div>
            <ul className="events" style={{color:colorTextCalendar}}>

                {birthdaysOnDate?.map(birthday => (
                    <DeadlinePopover bg={birthdayBg}>
                        <Popover
                            trigger={'click'}
                            key={birthday?.id}
                            content={contentPopoverBirthday(birthday)}
                        >
                            <li className={'birthday'}>
                            <Flex gap={2} align={"center"}>

                                <Text type="" >
                                    {birthday.first_name} {birthday.last_name}
                                </Text>
                            </Flex>
                            </li>
                        </Popover>
                    </DeadlinePopover>

                ))}
                {meetingsOnDate?.map((meeting) => (
                    <DeadlinePopover bg={meetingBg}>

                    <Popover key={meeting?.id} content={contentPopoverMeeting(meeting)}>
                    <li onClick={(e) => changeMeeting(e, meeting?.id)} key={meeting.id} className={'meeting'}>
                            <Flex gap={2} align={"center"}>

                                <Text >
                                    {meeting.title}
                                </Text>
                            </Flex>
                    </li>
                        </Popover>
                    </DeadlinePopover>
                ))}
                {deadlineOnDate?.map((deadline) => (
                    <DeadlinePopover bg={deadlineBg}>
                    <Popover
                            className={'deadline-popover'}
                            trigger={'click'}
                            placement={"topLeft"}
                            key={deadline?.id}
                            content={contentPopoverDeadline(deadline, systemMode)}
                            style={{
                                border: `1px , solid ${colorMeeting.deadline.color}`,
                            }}
                        >
                            <li className={'deadline'} onClick={(e) => e.stopPropagation()}>

                            <Flex gap={2} align={"center"}>

                                <Text >
                                    {deadline.title}
                                </Text>
                            </Flex>
                            </li>
                        </Popover>
                    </DeadlinePopover>
                ))}
            </ul>
        </div>

    );
};

