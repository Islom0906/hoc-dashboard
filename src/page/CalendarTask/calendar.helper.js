import {useMemo} from "react";
import dayjs from "dayjs";
import {Button, Flex, Popover,Typography} from "antd";
import {FaExternalLinkAlt} from "react-icons/fa";
const {Title,Text}=Typography


const contentPopover = (content) => {
    return (
        <div className={'popover-card'}>
            {content.meeting_date &&
                <p>Время: {dayjs(content.meeting_date).format("HH:mm:ss")}</p>}
            {content.text &&
                <p>О чем: {content.text}</p>}
        </div>
    );
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
        <ul className="events">

            {birthdaysOnDate?.map(birthday => (
                <li key={birthday.id}>
                    <Popover key={birthday?.id} content={contentPopover(birthday)}
                             title={`День рождения: ${birthday.first_name} ${birthday.last_name}`}
                             style={{border: `1px , solid ${colorMeeting.birthday.color}`}}>
                        <Flex gap={2} align={"center"}>
                            <div className={'color-badge'}
                                 style={{backgroundColor: colorMeeting.birthday.color, borderRadius: '100%'}}/>
                            <Text type="warning">
                                {birthday.first_name} {birthday.last_name}
                            </Text>
                        </Flex>
                    </Popover>
                </li>

            ))}
            {meetingsOnDate?.map((meeting) => (
                <li onClick={(e) => changeMeeting(e, meeting?.id)} key={meeting.id}>
                    <Popover content={contentPopover(meeting)} title={`Встреча: ${meeting.title}`}
                             style={{border: `1px , solid ${colorMeeting.meeting.color}`}}>
                        <Flex gap={2} align={"center"}>
                            <div className={'color-badge'}
                                 style={{backgroundColor: colorMeeting.meeting.color, borderRadius: '100%'}}/>
                            <Text style={{color: colorMeeting.meeting.color}}>
                                {meeting.title}
                            </Text>
                        </Flex>
                    </Popover>
                </li>
            ))}
            {deadlineOnDate?.map((deadline) => (
                <li key={deadline.id}>
                    <Popover key={deadline?.id} content={contentPopover(deadline)}
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
                            <div className={'color-badge'}
                                 style={{backgroundColor: colorMeeting.deadline.color, borderRadius: '100%'}}/>
                            <Text style={{color: colorMeeting.deadline.color}}>
                                {deadline.title}
                            </Text>
                        </Flex>
                    </Popover>
                </li>
            ))}
        </ul>
    );
};
