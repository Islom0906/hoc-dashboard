import React from 'react';
import DeadlineStatusColor from "../../hooks/deadlineStatusColor";
import {colorStatus, translateStatus} from "../../helper/translate.status";
import {Tag} from "antd";

const StatusTag = ({status,text}) => {
    console.log(colorStatus(status))
    return <Tag color={colorStatus(status)} style={{ fontSize: 11, margin:0}} >
        {translateStatus(text)}
    </Tag>;
};

export default StatusTag;