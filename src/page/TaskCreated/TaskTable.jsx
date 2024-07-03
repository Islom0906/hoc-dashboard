import React from 'react';
import {Avatar, Button, Popconfirm, Space, Table, Tooltip} from "antd";
import {DeleteOutlined, EditOutlined, UserOutlined} from "@ant-design/icons";
import {editIdQuery} from "../../store/slice/querySlice";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";

const TaskTable = ({data,deleteHandle}) => {
  const navigate=useNavigate()
  const dispatch=useDispatch()
  const Delete = async (id) => {
    deleteHandle('/users/tasks',id)
  };
  const Edit = (id) => {
    localStorage.setItem('editDataId',id)
    dispatch(editIdQuery(id))
    navigate('/task/add')
  };


  const columns = [
    {
      title: 'Название задачу',
      dataIndex: 'title',
      id: 'title',
      render: (title) => <p>{title}</p>,
    },
    {
      title: 'данное время',
      dataIndex: 'created_at',
      id: 'created_at',
      render: (text) => <p>{text}</p>
    },
    {
      title: 'крайний срок',
      dataIndex: 'deadline',
      id: 'deadline',
      render: (text) => <p>{text}</p>
    },
    {
      title: 'команда',
      dataIndex: 'moduls',
      id: 'moduls',
      render: (moduls) => <Avatar.Group size={"small"} >
        {
          moduls?.map(user => (
              <Tooltip title={<p>
                    <span>
                      {user?.name
                      }
                    </span>
              </p>} placement="top">
                <Avatar
                    style={{
                      backgroundColor: '#87d068',
                    }}
                    icon={user?.image? <img src={user?.image} alt={user?.first_name} />: <UserOutlined />}
                />
              </Tooltip>
          ))
        }
      </Avatar.Group>
    },

    {
      title: 'Событие',
      id: 'action',
      render: (_, record ) => (
          <Space size={20}>
            <Button
                onClick={() => Edit(record.id)}
                type='dashed'
                out
                icon={<EditOutlined />}/>
            <Popconfirm
                title={'Вы уверены, что хотите удалить это?'}
                description={'Удалить'}
                onConfirm={() => Delete(record.id)}>
              <Button  type='primary' danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
      ),
    },
  ];
  return <Table
      columns={columns}
      dataSource={data}
      rowKey={(record) => record.id}
  />

};

export default TaskTable;