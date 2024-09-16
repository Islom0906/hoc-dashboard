import {Avatar, Button, Popconfirm, Progress, Space, Table, Tooltip} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { editIdQuery } from "../../store/slice/querySlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";
import DeadlineStatusColor from "../../hooks/deadlineStatusColor";
import { AvatarUserProfile } from "../../components";
import { deadlineColor } from "../../constants/deadlineColor";
import {FaRegEye} from "react-icons/fa";

const TaskTable = ({ data, deleteHandle, getTagCompanyArray , pagination, setPagination, handleTableChange }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const Delete = async (id) => {
    deleteHandle("/users/tasks", id);
  };

  const Edit = (id) => {
    localStorage.setItem("editDataId", id);
    dispatch(editIdQuery(id));
    navigate("/task/add");
  };

  const handleTaskInnerGet = (id) => {
    navigate(`/task-list/${id}`);
  };

  const columns = [

    {
      title: "Процесс",
      dataIndex: "process",
      id: "process",
      render: (text, record) => {
        return(
            <Tooltip key={record?.id} title={`${record?.done_sub_tasks_count} / ${record?.sub_tasks_count}`} >
              <Progress size={50} type="circle" percent={ Math.round(record?.done_sub_tasks_count / record?.sub_tasks_count * 100)
              }/>

            </Tooltip>)
      },
    },
    {
      title: "Задача",
      dataIndex: "title",
      id: "title",
      render: (title) => <p>{title}</p>,
    },
    {
      title: "Компания",
      dataIndex: "tag",
      id: "tag",
      filters: getTagCompanyArray,
      render: (text , record) =>
    <AvatarUserProfile
        size={'large'}
        key={record?.tag?.id}
        company={record?.tag?.name}
        image={record?.tag?.image_light}
    />,
    },
    {
      title: "Создана",
      dataIndex: "created_at",
      id: "created_at",
      width: 150,
      render: (text) => <p>{dayjs(text).format("DD.MM.YYYY")}</p>,
    },
    {
      title: "Крайний срок",
      dataIndex: "deadline",
      id: "deadline",
      width: 150,
      sorter: {multiple: 3},
      render: (text) => <p>{dayjs(text).format("DD.MM.YYYY")}</p>,
    },
    {
      title: "Статус",
      dataIndex: "deadline_status",
      id: "deadline_status",
      width: 150,
      filters: [
        {
          text: deadlineColor.started.name,
          value: deadlineColor.started.name,
        },
        {
          text: deadlineColor.soon.name,
          value: deadlineColor.soon.name,
        },
        {
          text: deadlineColor.progress.name,
          value: deadlineColor.progress.name,
        },
        {
          text: deadlineColor.failed.name,
          value: deadlineColor.failed.name,
        },
      ],
      render: (deadline_status) => {
        const color = DeadlineStatusColor(deadline_status) || "black";
        return (
            <div
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "100%",
                  backgroundColor: color,
                }}
            />
        );
      },
    },
    {
      title: "Участники",
      dataIndex: "included_users",
      id: "team",
      render: (text, record) => {
        const users = [...(record.included_users || [])];


        return (
            <Avatar.Group size={"small"}>
              {users.map((user) => (
                    <AvatarUserProfile
                        messenger1={user?.messenger_link1}
                        messenger2={user?.messenger_link2}
                        key={user?.id}
                        full_name={user?.full_name}
                        moduls={user?.roles?.[0]?.name}
                        image={user?.image}
                    />
              ))}
            </Avatar.Group>
        );
      },
    },
    {
      title: "Ответственный",
      dataIndex: ['responsible_user'],
      id: "responsible_user",
      width: 100,
      render: (responsible_user) => {
        return (
            <Avatar.Group size={"small"}>
              <AvatarUserProfile
                  messenger2={responsible_user?.messenger_link2}
                  messenger1={responsible_user?.messenger_link1}
                  key={responsible_user?.id}
                  full_name={responsible_user?.full_name}
                  moduls={responsible_user?.roles?.[0]?.name}
                  image={responsible_user?.image}
              />
            </Avatar.Group>
        );
      },
    },
    {
      title: "Редактировать",
      id: "action",
      fixed: "right",
      width: 140,
      render: (_, record) => (
          <Space size={10}>
            <Button
                onClick={() => handleTaskInnerGet(record?.id)}
                type="dashed"
                icon={<FaRegEye />}
            />
            <Button
                onClick={() => Edit(record.id)}
                type="dashed"
                icon={<EditOutlined />}
            />
            <Popconfirm
                title={"Вы уверены, что хотите удалить это?"}
                description={"Удалить"}
                onConfirm={() => Delete(record.id)}
            >
              <Button type="primary" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
      ),
    },
  ];
  return (
      <Table
          size={"medium"}
          columns={columns}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
          }}
          onChange={handleTableChange}
          dataSource={data}
          rowKey={(record) => record?.id}
      />
  );
};
export default TaskTable;
