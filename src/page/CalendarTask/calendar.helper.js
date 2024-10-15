import { useMemo} from "react";
import dayjs from "dayjs";
import {Button, Card, Flex, Popover, Typography, Tag, Avatar, Switch, theme,} from "antd";
import {FaBirthdayCake, FaExternalLinkAlt} from "react-icons/fa";

const {Title,Text}=Typography
const contentPopoverBirthday = (content) => {
    return (
        <Card
            style={{
                borderRadius: '10px',
                textAlign: 'center',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                padding: '20px',
                backgroundColor: '#F9F9F9',
            }}
            bodyStyle={{ padding: '0' }}

        >
            <div >
                <FaBirthdayCake
                    size={50}
                    color="#2176FF"
                    style={{ marginBottom: '20px' }}
                />
                {content.first_name && (
                    <p style={{ fontSize: '16px', color: '#333' }}>{`День рождения: ${content.first_name} ${content.last_name}`}</p>
                )}
            </div>
        </Card>
    );
};

const contentPopoverDeadline = () => {

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
                console.warn(`Invalid Date: ${birthday.birthday}`);
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
    changeMeeting
) => {
    const {
        token: {
            colorTextCalendar,

        },
    } = theme.useToken();
    // const {systemMode}=useSelector(state => state.theme)
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
            <div className={'date-number'}>{value.date()}</div>
            <ul className="events" style={{color:colorTextCalendar}}>

                {birthdaysOnDate?.map(birthday => (
                    <li key={birthday.id} className={'birthday'}>
                        <Popover key={birthday?.id} content={contentPopoverBirthday(birthday)}>
                            <Flex gap={2} align={"center"}>

                                <Text type="" >
                                    {birthday.first_name} {birthday.last_name}
                                </Text>
                            </Flex>
                        </Popover>
                    </li>

                ))}
                {meetingsOnDate?.map((meeting) => (
                    <li onClick={(e) => changeMeeting(e, meeting?.id)} key={meeting.id} className={'meeting'}>
                        <Popover content={contentPopoverMeeting(meeting)}>
                            <Flex gap={2} align={"center"}>

                                <Text >
                                    {meeting.title}
                                </Text>
                            </Flex>
                        </Popover>
                    </li>
                ))}
                {deadlineOnDate?.map((deadline) => (
                    <li key={deadline.id} className={'deadline'}>
                        <Popover key={deadline?.id} content={contentPopoverDeadline(deadline)}
                                 title={<div>
                                     <Title level={5}>
                                         {deadline?.title}
                                     </Title>
                                     <Text style={{fontSize: '11px'}} type={"secondary"}>
                                         срок: {dayjs(deadline.created_at).format('DD.MM.YYYY')} - {dayjs(deadline.deadline).format('DD.MM.YYYY')}
                                     </Text>
                                     <Button type={'success'} href={`/task-list/${deadline?.id}`}>
                                         <FaExternalLinkAlt/>
                                     </Button>
                                 </div>}
                                 style={{border: `1px , solid ${colorMeeting.deadline.color}`}}>
                            <Flex gap={2} align={"center"}>

                                <Text >
                                    {deadline.title}
                                </Text>
                            </Flex>
                        </Popover>
                    </li>
                ))}
            </ul>
        </div>

    );
};

