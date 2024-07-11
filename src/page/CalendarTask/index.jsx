import React, { useState} from 'react';
import {Alert, Badge, Calendar, Modal, Space} from 'antd';
import dayjs from 'dayjs';

const birthdays=[
    {
        "id": 20,
        "first_name": "Boss Staff User1",
        "last_name": "Boss Staff User",
        "birthday": "09.10.1998",
        "roles": [
            {
                "id": 3,
                "name": "staff"
            }
        ]
    },
    {
        "id": 17,
        "first_name": "Bobur",
        "last_name": "Berdiev",
        "birthday": "10.10.2002",
        "roles": [
            {
                "id": 2,
                "name": "boss"
            }
        ]
    },
    {
        "id": 18,
        "first_name": "Javlon",
        "last_name": "Baxtiyorov",
        "birthday": "09.10.2006",
        "roles": [
            {
                "id": 3,
                "name": "staff"
            }
        ]
    },
    {
        "id": 19,
        "first_name": "Qudrat",
        "last_name": "Qudrat",
        "birthday": "09.10.1999",
        "roles": [
            {
                "id": 1,
                "name": "admin"
            }
        ]
    },
    {
        "id": 25,
        "first_name": "Islom",
        "last_name": "Abdugofurov",
        "birthday": "07.01.2024",
        "roles": [
            {
                "id": 3,
                "name": "staff"
            }
        ]
    },
    {
        "id": 29,
        "first_name": "Aziz",
        "last_name": "aziz",
        "birthday": "04.07.2024",
        "roles": [
            {
                "id": 3,
                "name": "staff"
            }
        ]
    }
]

const CalendarTask = () => {
    const [value, setValue] = useState(() => dayjs());
    const [selectedValue, setSelectedValue] = useState(() => dayjs());
    const [isModalOpen, setIsModalOpen] = useState(false);

    const onSelect = (newValue) => {
        setValue(newValue);
        setSelectedValue(newValue);
        setIsModalOpen(true)
    };
    const onPanelChange = (newValue) => {
        setValue(newValue);
    };

    const birthdayMap = birthdays.reduce((acc, birthday) => {
        console.log(acc)
        const date = dayjs(birthday.birthday, 'DD.MM.YYYY'); // convert to moment object
        const key = date.format('YYYY-MM-DD'); // get the YYYY-MM-DD format
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(birthday);
        return acc;
    }, {});

    const dateCellRender = (value) => {
        const dateStr = value.format('YYYY-MM-DD');
        const birthdaysOnDate = birthdayMap[dateStr] || [];
        return (
            <ul className="events">
                {birthdaysOnDate.map(birthday => (
                    <li key={birthday.id}>
                        <Badge status="success" text={`${birthday.first_name} ${birthday.last_name}`} />
                    </li>
                ))}
            </ul>
        );
    };






    return (
        <Space direction={"vertical"} size={20}>
            <h1>
                Календарь
            </h1>
            <Alert message={`Вы выбрали дату: ${selectedValue?.format('YYYY-MM-DD')}`}/>
            <Calendar value={value} onSelect={onSelect} onPanelChange={onPanelChange} cellRender={dateCellRender}/>
            <DayModalTaskList title={`${selectedValue?.format('YYYY-MM-DD')} daily task list`} isModalOpen={isModalOpen}
                              setIsModalOpen={setIsModalOpen}/>
        </Space>
    );
};

export const DayModalTaskList = ({isModalOpen, setIsModalOpen, title}) => {
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    return (
        <Modal title={title} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
        </Modal>
    );

}
export default CalendarTask;

