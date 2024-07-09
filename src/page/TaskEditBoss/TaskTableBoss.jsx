import {Avatar, Button, Popconfirm, Space, Table, Tooltip} from "antd";
import {DeleteOutlined, EditOutlined, UserOutlined} from "@ant-design/icons";
import {editIdQuery} from "../../store/slice/querySlice";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import dayjs  from "dayjs";
const TaskTableBoss = ({data}) => {
  const navigate=useNavigate()
  const dispatch=useDispatch()
  const Edit = (id) => {
    localStorage.setItem('editDataId',id)
    dispatch(editIdQuery(id))
    navigate('/taskEditBoss/add')
  };

  console.log( 'table boss users' , data?.included_users)

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
      render: (text) => <p>{dayjs(text).format('l')}</p>
    },
    {
      title: 'крайний срок',
      dataIndex: 'deadline',
      id: 'deadline',
      render: (text) => <p>{dayjs(text).format('l')}</p>
    },
    {
      title: 'статус задачи',
      dataIndex: 'task_status',
      id: 'task_status',
      render: (text) => <p>{text}</p>
    },
    {
      title: 'команда',
      dataIndex: ['moduls', 'included_users'],
      id: 'team',
      render: (text, record) => {
        const users = [record?.responsible_user,...(record.included_users || [])];

        return (
            <>
              <Avatar.Group size={"small"}>
                {
                  users.map(user => (
                      <Tooltip
                          title={<p><span>{user?.full_name}</span></p>}
                          placement="top"
                          key={user?.id}
                      >
                        <Avatar
                            style={{ backgroundColor: '#87d068' }}
                            icon={user?.image ? <img src={user?.image} alt={user?.full_name} /> : <UserOutlined />}
                        />
                      </Tooltip>
                  ))
                }
              </Avatar.Group>
              <Avatar.Group size={"small"}>
                {
                  record?.moduls.map(company => (
                      <Tooltip
                          title={<p><span>{company?.name}</span></p>}
                          placement="top"
                          key={company?.id}
                      >
                        <Avatar
                            style={{ backgroundColor: '#87d068' }}
                            icon={company?.image ? <img src={company?.image} alt={company?.name} /> : <UserOutlined />}
                        />
                      </Tooltip>
                  ))
                }
              </Avatar.Group>
            </>

        );
      }
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

export default TaskTableBoss;