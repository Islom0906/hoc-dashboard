import {Avatar, Button, Popconfirm, Space, Table} from "antd";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {editIdQuery} from "../../store/slice/querySlice";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import dayjs from "dayjs";
import DeadlineStatusColor from "../../hooks/deadlineStatusColor";
import {AvatarUserProfile} from "../../components";

  const TaskTable = ({data,deleteHandle,pagination,setPagination}) => {
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
      title: 'Название задачи',
      dataIndex: 'title',
      id: 'title',
      render: (title) => <p>{title}</p>,
    },
    // {
    //   title: 'данное время',
    //   dataIndex: 'created_at',
    //   id: 'created_at',
    //   render: (text) => <p>{dayjs(text).format('DD.MM.YYYY')}</p>
    // },
    {
      title: 'Крайний срок',
      dataIndex: 'deadline',
      id: 'deadline',
      render: (text) => <p>{dayjs(text).format('DD.MM.YYYY')}</p>
    },
    {
      title: 'Статус задачи',
      dataIndex: 'deadline_status',
      id: 'deadline_status',
      render: (deadline_status) =>{
        const deadlineColor= DeadlineStatusColor(deadline_status)|| 'black'
        return ( <div style={{
          width:'20px',
          height:'20px',
          borderRadius:'100%',
          backgroundColor:deadlineColor
        }}></div>)
      }

    },
    {
      title: 'Команда',
      dataIndex: ['moduls', 'included_users'],
      id: 'team',
      render: (text, record) => {
        const users = [record?.responsible_user,...(record.included_users || [])];
        return (
            <Avatar.Group size={"small"}>
              {
                users.map(user => (
                    <AvatarUserProfile key={user?.id} full_name={user?.full_name} moduls={user?.roles?.[0]?.name} image={user?.image}/>
                ))
              }
            </Avatar.Group>
        );
      }
    },
    {
      title: 'Событие',
      id: 'action',
      fixed: 'right',
      width:120,
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

  const handleTableChange = (pagination) => {
    setPagination(pagination)
  };

  return <Table
      columns={columns}
      pagination={{
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: pagination.total,
      }}
      scroll={{
        x: 1500,
      }}
      onChange={handleTableChange}
      dataSource={data}
      rowKey={(record) => record?.id}
  />

};

export default TaskTable;