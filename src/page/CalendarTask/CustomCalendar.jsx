import { useMemo, useState } from 'react';
import { Button, Calendar, Col, Flex, Popover, Row, Select, Typography, ConfigProvider } from "antd";
import dayjs from "dayjs";
import 'dayjs/locale/ru';
import ruRU from 'antd/es/locale/ru_RU';
import ModalCalendar from "./ModalCalendar";
import { useDispatch, useSelector } from "react-redux";
import { editIdQuery } from "../../store/slice/querySlice";
import { FaExternalLinkAlt } from "react-icons/fa";

dayjs.locale('ru');

const { Title, Text } = Typography;

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

const CustomCalendar = ({ dataBirthDay, dataMeeting, refetchMeeting, dataDeadline, colorMeeting }) => {
    const [value, setValue] = useState(() => dayjs());
    const [filterForColor, setFilterForColor] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data: { user } } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const changeMeeting = (e, id) => {
        e.stopPropagation();
        dispatch(editIdQuery(id));
        if (user?.roles[0]?.name === 'admin') {
            setIsModalOpen(true);
        }
    }


    const birthdayMap = useMemo(() => {
        return dataBirthDay?.reduce((acc, birthday) => {
            const key = dayjs(birthday.birthday).format('DD-MM');
            acc[key] = acc[key] || [];
            acc[key].push(birthday);
            return acc;
        }, {});
    }, [dataBirthDay]);

    const meetingMap = useMemo(() => {
        return dataMeeting?.reduce((acc, meeting) => {
            const key = dayjs(meeting.meeting_date).format('YYYY-MM-DD');
            acc[key] = acc[key] || [];
            acc[key].push(meeting);
            return acc;
        }, {});
    }, [dataMeeting]);

    const deadlineMap = useMemo(() => {
        return dataDeadline?.results?.reduce((acc, deadline) => {
            const key = dayjs(deadline.deadline).format('YYYY-MM-DD');
            acc[key] = acc[key] || [];
            acc[key].push(deadline);
            return acc;
        }, {});
    }, [dataDeadline?.results]);

    const dateCellRender = (value) => {
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
        } else {
            if (birthdayMap && colorMeeting.birthday.name === filterForColor) {
                birthdaysOnDate = birthdayMap[birthdayStr] || [];
            }
            if (meetingMap && colorMeeting.meeting.name === filterForColor) {
                meetingsOnDate = meetingMap[dateStr] || [];
            }
            if (deadlineMap && colorMeeting.deadline.name === filterForColor) {
                deadlineOnDate = deadlineMap[dateStr] || [];
            }
        }

        return (
            <ul className="events">
                {birthdaysOnDate?.map(birthday => (
                    <li key={birthday.id}>
                        <Popover key={birthday?.id} content={contentPopover(birthday)}
                                 title={`День рождения: ${birthday.first_name} ${birthday.last_name}`}
                                 style={{ border: `1px , solid ${colorMeeting.birthday.color}` }}>
                            <Flex gap={2} align={"center"}>
                                <div className={'color-badge'}
                                     style={{ backgroundColor: colorMeeting.birthday.color, borderRadius: '100%' }} />
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
                                 style={{ border: `1px , solid ${colorMeeting.meeting.color}` }}>
                            <Flex gap={2} align={"center"}>
                                <div className={'color-badge'}
                                     style={{ backgroundColor: colorMeeting.meeting.color, borderRadius: '100%' }} />
                                <Text style={{ color: colorMeeting.meeting.color }}>
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
                                     <Text style={{ fontSize: '11px' }} type={"secondary"}>
                                         срок: {dayjs(deadline.created_at).format('DD.MM.YYYY')} - {dayjs(deadline.deadline).format('DD.MM.YYYY')}
                                     </Text>
                                     <Button type={'success'} href={`/task-list/${deadline?.id}`}>
                                         <FaExternalLinkAlt />
                                     </Button>
                                 </div>}
                                 style={{ border: `1px , solid ${colorMeeting.deadline.color}` }}>
                            <Flex gap={2} align={"center"}>
                                <div className={'color-badge'}
                                     style={{ backgroundColor: colorMeeting.deadline.color, borderRadius: '100%' }} />
                                <Text style={{ color: colorMeeting.deadline.color }}>
                                    {deadline.title}
                                </Text>
                            </Flex>
                        </Popover>
                    </li>
                ))}
            </ul>
        );
    };

    const onSelect = (newValue, info) => {
        if (info.source === 'date' && user?.roles[0]?.name === 'admin') {
            setValue(newValue);
            setIsModalOpen(true);
        }
    };

    return (
        <ConfigProvider locale={ruRU}> {/* Set Ant Design locale to Russian */}
            <Calendar
                headerRender={({ value, onChange }) => (
                    <CustomHeader setFilterForColor={setFilterForColor} filterForColor={filterForColor}
                                  colorMeeting={colorMeeting} value={value} onChange={onChange} />
                )}
                cellRender={dateCellRender}
                onSelect={onSelect}
            />
            <ModalCalendar
                refetchMeeting={refetchMeeting}
                date={value}
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
            />
        </ConfigProvider>
    );
};

export default CustomCalendar;

const CustomHeader = ({ value, onChange, colorMeeting, setFilterForColor, filterForColor }) => {
    const year = value.year();
    const month = value.month();
    const yearRange = Array.from({ length: 2030 - 1950 + 1 }, (_, i) => 1950 + i);
    const handleYearChange = (newYear) => {
        const newValue = value.year(newYear);
        onChange(newValue);
    };
    const handleMonthChange = (newMonth) => {
        const newValue = value.month(newMonth);
        onChange(newValue);
    };
    const selectFilter = (btn) => {
        setFilterForColor(btn);
    }

    const showBtnSelected = useMemo(() => {
        return Object.entries(colorMeeting).map(([key, obj]) => (
            <Button type={filterForColor === obj?.name ? 'primary' : 'default'} key={key}
                    onClick={() => selectFilter(obj?.name)}>
                {obj?.name}
            </Button>));
    }, [colorMeeting, filterForColor]);

    return (
        <div style={{ padding: 10 }}>
            <Row justify={"space-between"}>
                <Flex gap={10}>
                    <Button type={filterForColor === 'all' ? 'primary' : 'default'} onClick={() => selectFilter('all')}>
                        Все
                    </Button>
                    {showBtnSelected}
                </Flex>
                <Row gutter={10}>
                    <Col>
                        <Select
                            style={{ width: '100%' }}
                            className="my-year-select"
                            value={String(year)}
                            onChange={(newYear) => handleYearChange(Number(newYear))}
                        >
                            {yearRange.map(year => (
                                <Select.Option key={year} value={String(year)}>
                                    {year}
                                </Select.Option>
                            ))}
                        </Select>
                    </Col>
                    <Col>
                        <Select
                            style={{ width: '100px' }}
                            value={String(month)}
                            onChange={(newMonth) => handleMonthChange(Number(newMonth))}
                        >
                            {Array.from({ length: 12 }, (_, i) => i).map(month => (
                                <Select.Option key={month} value={String(month)}>
                                    {dayjs().month(month).format('MMM')}
                                </Select.Option>
                            ))}
                        </Select>
                    </Col>
                </Row>
            </Row>
        </div>
    );
};
