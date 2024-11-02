// TaskStatus.js
import React from 'react';
import { Button, Popconfirm, Tag, Tooltip } from 'antd';
import { IoMdCheckboxOutline } from 'react-icons/io';
import { CgDanger } from 'react-icons/cg';

const TaskStatusChecking = ({ id, task_manager, task_status, roles, user_id, creat_by_id, updateStatus, responsible_user_id }) => {
    const handleStatusUpdate = (status) => updateStatus(id, status);

    if (task_manager === user_id) {
        if (task_status === 'done') {
            return <Tag color="green">Done</Tag>;
        } else if (task_status === 'progress') {
            return (
                <Popconfirm
                    cancelText="Отменить"
                    okText="Завершить"
                    title="Завершить задачу"
                    description="Вы уверены, что хотите завершить задачу?"
                    onConfirm={() => handleStatusUpdate('checking')}
                >
                    <Tooltip title="Установить для проверки" placement="top">
                        <Button type="primary">
                            <IoMdCheckboxOutline />
                        </Button>
                    </Tooltip>
                </Popconfirm>
            );
        } else if (task_status === 'checking') {
            return <Tag color="gold">Checking</Tag>;
        }
    }

    if (roles === 'general_director' || roles === 'director' || responsible_user_id === user_id || (roles === 'boss' && creat_by_id !== user_id)) {
        if (task_status === 'done') {
            return <Tag color="green">Done</Tag>;
        } else if (task_status === 'progress') {
            return <Tag color="blue">Progress</Tag>;
        } else if (task_status === 'checking') {
            return <Tag color="gold">Checking</Tag>;
        }
    } else if (creat_by_id === user_id || roles === 'admin') {
        if (task_status === 'done') {
            return <Tag color="green">Done</Tag>;
        } else if (task_status === 'progress') {
            return <Tag color="blue">Progress</Tag>;
        } else if (task_status === 'checking') {
            return (
                <>
                    <Popconfirm
                        cancelText="Отменить"
                        okText="Завершить"
                        title="Завершить задачу"
                        description="Вы уверены, что хотите завершить задачу?"
                        onConfirm={() => handleStatusUpdate('done')}
                    >
                        <Tooltip title="Сделанный" placement="top">
                            <Button type="primary">
                                <IoMdCheckboxOutline />
                            </Button>
                        </Tooltip>
                    </Popconfirm>
                    <Popconfirm
                        cancelText="Отменить"
                        okText="Завершить"
                        title="Завершить задачу"
                        description="Вы уверены, что хотите завершить задачу?"
                        onConfirm={() => handleStatusUpdate('progress')}
                    >
                        <Tooltip title="Установить на Прогресс" placement="top">
                            <Button type="primary" danger>
                                <CgDanger />
                            </Button>
                        </Tooltip>
                    </Popconfirm>
                </>
            );
        }
    }

    return null;
};

export default TaskStatusChecking;
