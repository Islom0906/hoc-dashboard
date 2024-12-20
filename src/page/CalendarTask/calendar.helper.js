import {useMemo} from "react";
import dayjs from "dayjs";
import {Avatar, Button, Flex, Popover, Space, Tag, theme, Typography,} from "antd";
import {IoCalendarOutline} from "react-icons/io5";
import {AvatarUserProfile} from "../../components";
import {Link} from "react-router-dom";
import DeadlinePopover from "../../components/CustomPopover/deadlinePopover";
import {MdAccessTime} from "react-icons/md";

const {Title,Text}=Typography
const contentPopoverBirthday = (content,birthdayColor) => {
    return (

            <Flex align={"center"} gap={10} >
                <img src="/birthday.gif" alt="birthday" style={{width:35,height:35}}/>
                {content.first_name && (
                    <Flex align={"start"}  vertical={true}>

                    <p style={{ fontSize: '10px', color: `${birthdayColor}80` }}>День рождения</p>
                    <p style={{ fontSize: '16px', color: birthdayColor }}>{ `${content.first_name} ${content.last_name}`}</p>
                    </Flex>
                )}
            </Flex>
    );
};

const contentPopoverDeadline = (deadline, systemMode) => {
    return (
        <Space size={5} direction={"vertical"}>
            <Flex align={"center"} gap={10} justify={"space-between"}>
            <Title level={5} style={{marginBottom:0}}>
                {deadline?.title}
            </Title>
                <AvatarUserProfile
                    size={25}
                    keyId={deadline?.created_by?.id}
                    full_name={deadline?.created_by?.full_name}
                    moduls={deadline?.created_by?.roles[0]?.module?.name}
                    image={deadline?.created_by?.image}/>


        </Flex>
        <Flex align={"center"} gap={5}>
            <IoCalendarOutline style={{fontSize: 12}}/>
            <Text style={{fontSize: 12}}>
                {dayjs(deadline.created_at).format('DD.MM.YYYY')} - {dayjs(deadline.deadline).format('DD.MM.YYYY')}
            </Text>
        </Flex>
            <Flex align={"center"} gap={10} justify={"space-between"}>
                <img style={{width: 25, height: 25, objectFit: 'cover',border:'0.5px solid black',borderRadius:'100%'}}
                     src={systemMode === 'dark' ? deadline?.company?.image_dark : deadline?.company?.image_light}
                     alt={deadline?.company?.title}/>
                {
                    deadline?.included_users?.length>0  ?
                        <Avatar.Group size={"small"}>
                            {deadline?.included_users?.map((user) => (
                                <AvatarUserProfile key={user?.id} size={25} keyId={user?.id} full_name={user?.full_name}
                                                   moduls={user?.roles?.[0]?.name} image={user?.image}/>

                            ))}
                        </Avatar.Group>
                        :<Tag

                        style={{borderRadius:'20px',margin:0,fontSize:10,padding:'0 5px'}}
                            color={'#C68488'}>
                            Все сотрудники
                        </Tag>

                }

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

const contentPopoverMeeting = (meeting, systemMode) => {
    return(
        <Space size={5} direction={"vertical"}>
            <Flex align={"center"} gap={20} justify={"space-between"}>
                <Title level={5} style={{marginBottom:0}}>
                    {meeting?.title}
                </Title>
                <AvatarUserProfile
                    size={25}
                    keyId={meeting?.created_by?.id}
                    full_name={meeting?.created_by?.full_name}
                    moduls={meeting?.created_by?.roles[0]?.module?.name}
                    image={meeting?.created_by?.image}/>


            </Flex>
            <Flex align={"center"} gap={5}>
                <MdAccessTime style={{fontSize: 14}}/>
                <Text style={{fontSize: 12}}>
                    {dayjs(meeting?.meeting_date).format('hh:mm')}
                </Text>
            </Flex>
            <Flex align={"center"} gap={2}  style={{marginRight:10}}>
                {
                    meeting?.companies.map((item,ind)=> (
                        <div   key={item?.id}>
                        <img style={{
                            width: 25,
                            height: 25,
                            objectFit: 'cover',
                            border: '0.5px solid black',
                            borderRadius: '100%'
                        }}
                             src={systemMode === 'dark' ? item?.image_dark : item?.image_light}
                             alt={item?.title}/>
                            {
                                ind!==meeting?.companies.length-1 && '|'
                            }

                        </div>
                    ))
                }



            </Flex>
            <Flex justify={'end'}>
                {
                    meeting?.users?.length>0 ?
            <Avatar.Group size={"small"} >
                {meeting?.users?.map((user) => (
                    <AvatarUserProfile key={user?.id} size={25} keyId={user?.id} full_name={user?.full_name}
                                       moduls={user?.roles?.[0]?.name} image={user?.image}/>

                ))}
            </Avatar.Group>
                    :
                        <Tag

                            style={{borderRadius:'20px',margin:'0 0 0 10px',fontSize:10,padding:'0 5px'}}
                            color={'#a8b6d3'}>
                            Все сотрудники
                        </Tag>
                }
            </Flex>
        </Space>)
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
            meetingBg,birthdayColor
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
            <div className={`date-number `}><p className={`${today ? 'today' : ""}`}><span>{value.date()}</span></p></div>
            <ul className="events" style={{color:colorTextCalendar}}>

                {birthdaysOnDate?.map(birthday => (
                    <DeadlinePopover key={birthday?.id} bg={birthdayBg}>
                        <Popover
                            trigger={'hover'}
                            key={birthday?.id}
                            content={contentPopoverBirthday(birthday,birthdayColor)}
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
                    <DeadlinePopover key={meeting?.id} bg={meetingBg}>

                        <Popover
                            trigger={'hover'}
                            key={meeting?.id}
                            content={contentPopoverMeeting(meeting, systemMode)}
                        >
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
                    <DeadlinePopover key={deadline?.id} bg={deadlineBg}>
                    <Popover
                            className={'deadline-popover'}
                            trigger={'hover'}
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

