import React, {useEffect, useState} from 'react';
import {Alert, Badge, Calendar, Modal, Space} from 'antd';
import dayjs from 'dayjs';

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

    // useEffect(() => {
    //     const socket=new WebSocket(`ws://95.46.96.95:82/hoc/backend/ws/notify`)
    //
    //     socket.onopen=(e)=>{
    //         console.log('Success socket')
    //     }
    //
    //     socket.onerror=(e)=>{
    //         console.log(e)
    //     }
    //
    //     socket.onmessage = (event) => {
    //         const data = JSON.parse(event.data);
    //         console.log(data)
    //     };
    // }, []);


    const monthCellRender = (value) => {
        const num = getMonthData(value);
        return num ? (
            <div className="notes-month">
                <section>{num}</section>
                <span>Backlog number</span>
            </div>
        ) : null;
    };
    const dateCellRender = (value) => {
        const listData = getListData(value);
        return (
            <ul className="events">
                {listData.map((item) => (
                    <li key={item.content}>
                        <Badge status={item.type} text={item.content} />
                    </li>
                ))}
            </ul>
        );
    };
    const cellRender = (current, info) => {
        if (info.type === 'date') return dateCellRender(current);
        if (info.type === 'month') return monthCellRender(current);
        return info.originNode;
    };

    return (
        <Space direction={"vertical"} size={20}>
            <h1>
                Calendar
            </h1>
            <Alert message={`You selected date: ${selectedValue?.format('YYYY-MM-DD')}`}/>
            <Calendar value={value} onSelect={onSelect} onPanelChange={onPanelChange} cellRender={cellRender}/>
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

const getListData = (value) => {
    let listData = []; // Specify the type of listData
    switch (value.date()) {
        case 8:
            listData = [
                {
                    type: 'warning',
                    content: 'This is warning event.',
                },
                {
                    type: 'success',
                    content: 'This is usual event.',
                },
            ];
            break;
        case 10:
            listData = [
                {
                    type: 'warning',
                    content: 'This is warning event.',
                },
                {
                    type: 'success',
                    content: 'This is usual event.',
                },
                {
                    type: 'error',
                    content: 'This is error event.',
                },
            ];
            break;
        case 15:
            listData = [
                {
                    type: 'warning',
                    content: 'This is warning event',
                },
                {
                    type: 'success',
                    content: 'This is very long usual event......',
                },
                {
                    type: 'error',
                    content: 'This is error event 1.',
                },
                {
                    type: 'error',
                    content: 'This is error event 2.',
                },
                {
                    type: 'error',
                    content: 'This is error event 3.',
                },
                {
                    type: 'error',
                    content: 'This is error event 4.',
                },
            ];
            break;
        default:
    }
    return listData || [];
};
const getMonthData = (value) => {
    if (value.month() === 8) {
        return 1394;
    }
};