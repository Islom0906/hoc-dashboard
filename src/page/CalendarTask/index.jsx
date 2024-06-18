import React, { useState } from 'react';
import {Alert, Calendar, Modal, Space} from 'antd';
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



  return (
        <Space direction={"vertical"} size={20}>
          <h1>
            Calendar
          </h1>
          <Alert message={`You selected date: ${selectedValue?.format('YYYY-MM-DD')}`}/>
          <Calendar value={value} onSelect={onSelect}  onPanelChange={onPanelChange} o />
          <DayModalTaskList title={`${selectedValue?.format('YYYY-MM-DD')} daily task list`} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
        </Space>
  );
};

export  const DayModalTaskList =({isModalOpen ,setIsModalOpen , title}) =>{
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
        <Modal title={title} open={isModalOpen} onOk={handleOk} onCancel={handleCancel} >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>
  );

}
export default CalendarTask;