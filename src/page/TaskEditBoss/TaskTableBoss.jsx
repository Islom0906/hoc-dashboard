import {Avatar, Button, Space, Table, Tooltip} from "antd";
import { EditOutlined, UserOutlined} from "@ant-design/icons";
import {editIdQuery} from "../../store/slice/querySlice";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import dayjs  from "dayjs";
import AvatarUserProfile from "../../components/AvatarUserProfile/AvatarUserProfile";
const TaskTableBoss = ({data}) => {
  const navigate=useNavigate()
  const dispatch=useDispatch()

  const Edit = (id) => {
    localStorage.setItem('editDataId',id)
    dispatch(editIdQuery(id))
    navigate('/taskEditBoss/add')
  };


  const columns = [
    {
      title: 'Название задачи',
      dataIndex: 'main_task_title',
      id: 'main_task_title',
      render: (main_task_title) => <p>{main_task_title}</p>,
    },
    {
      title: 'Данное время',
      dataIndex: 'created_at',
      id: 'created_at',
      render: (text) => <p>{dayjs(text).format('DD.MM.YYYY')}</p>
    },
    {
      title: 'Крайний срок',
      dataIndex: 'deadline',
      id: 'deadline',
      render: (text) => <p>{dayjs(text).format('DD.MM.YYYY')}</p>
    },
    {
      title: 'Статус задачи',
      dataIndex: 'task_status',
      id: 'task_status',
      render: (text) => <p>{text}</p>
    },
    {
      title: 'Команда',
      dataIndex: ['moduls', 'included_users'],
      id: 'team',
      render: (text, record) => {
        const users = [record?.responsible_user,...(record.included_users || [])];

        return (
            <>
              <Avatar.Group size={"small"}>
                {
                  users.map(user => (
                      <AvatarUserProfile key={user?.id} full_name={user?.full_name} image={user?.image} />

                  ))
                }
              </Avatar.Group>
              <Avatar.Group size={"small"}>
                {
                  record?.moduls.map(company => (
                      <AvatarUserProfile key={company?.id} full_name={company?.name} image={company?.image} />

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
                onClick={() => Edit(record.main_task_id)}
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