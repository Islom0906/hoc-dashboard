import {Avatar, Badge, Button, Flex, Popconfirm, Progress, Table, Tag, Tooltip, Typography} from "antd";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {editIdQuery} from "../../store/slice/querySlice";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import dayjs from "dayjs";
import DeadlineStatusColor from "../../hooks/deadlineStatusColor";
import {AvatarUserProfile, EyeButton, HistoryCard} from "../../components";
import {deadlineColor} from "../../constants/deadlineColor";
import {FaRegEye} from "react-icons/fa";
import './index.scss'
import useBreakpoint from "antd/es/grid/hooks/useBreakpoint";

const TaskTable = ({ data, deleteHandle, getTagCompanyArray , pagination, setPagination, handleTableChange }) => {
    const navigate = useNavigate();
    const {data:{user}}=useSelector(state => state.auth)
    const dispatch = useDispatch();
    const {Title, Text} = Typography
    const {md,xs,xl} = useBreakpoint();

    const Delete =  (id) => {
        deleteHandle("/users/tasks", `${id}/`);
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
            width:md ? 120:80,
            render: (text, record) => {
                return(
                    <Tooltip key={record?.id} title={`${record?.done_sub_tasks_count} / ${record?.sub_tasks_count}`} >
                        <Progress size={xl ? 50:xs ? 30 : 40} type="circle" percent={ Math.round(record?.done_sub_tasks_count / record?.sub_tasks_count * 100)
                        }/>

                    </Tooltip>)
            },
        },
        {
            title: "Компания",
            dataIndex: "company",
            id: "company",
            width: md ? 120:80,
            filters: getTagCompanyArray,
            render: (text , record) =>
                <AvatarUserProfile
                    size={xl ? 50:xs ? 30 : 40}
                    keyId={record?.company?.id}
                    company={record?.company?.title}
                    image={record?.company?.image_light}
                />,
        },
        {
            title: "Создано",
            dataIndex: "created_by",
            id: "created_by",
            width: md ? 120:80,
            render: (text , record) =>
                <AvatarUserProfile
                    size={xl ? 50:xs ? 30 : 40}
                    keyId={record?.created_by?.id}
                    company={record?.created_by?.roles[0].position}
                    full_name={record?.created_by?.full_name}
                    image={record?.created_by?.image}
                />,
        },

        {
            title: "Задача",
            dataIndex: "title",
            id: "title",
            width: 200,
            render: (title) => <p>{title}</p>,
        },


        {
            title: "Крайний срок",
            dataIndex: "deadline",
            id: "deadline",
            sorter: {multiple: 3},
            width:md ? 150:180,
            render: (_, record) =>  <Tag className={'deadline-tag'} color={"purple"} > {dayjs(record?.created_at).format("DD.MM.YYYY")}-{ dayjs(record?.deadline).format("DD.MM.YYYY")}</Tag>,
        },
        {
            title: "Статус",
            dataIndex: "deadline_status",
            id: "deadline_status",
            width: md ? 100:80,
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
                        className={'tag-status'}
                        style={{

                            borderRadius: "100%",
                            backgroundColor: color,
                        }}
                    />
                );
            },
        },
        {
            title: "История",
            dataIndex: "history",
            id: "history",
            width: md ? 250:200,
            render: (_, record) => <Flex justify={"space-between"} align={'center'}>
                {
                    record?.histories.map(item => (
                        <HistoryCard key={item?.user?.id} history={item} />

                    ))
                }
            </Flex>,
        },
        {
            title: "Ответственный и Участники",
            dataIndex: "included_users",
            id: "team",
            width: md ? 250:200,
            render: (text, record) => {
                const users = [...(record.included_users || [])];
                return (
                    <Flex justify={"space-between"} align={'center'}>
                        <Avatar.Group >
                            <AvatarUserProfile
                                size={xl ? 40:xs ? 25 : 30}
                                keyId={record?.responsible_user?.id}
                                full_name={record?.responsible_user?.full_name}
                                moduls={record?.responsible_user?.roles[0].position}
                                image={record?.responsible_user?.image}
                            />
                        </Avatar.Group>
                        <Avatar.Group  max={{
                            count: 4,
                            style: { color: "#f56a00", backgroundColor: "#fde3cf" },
                        }} >
                            {users?.map((user) => (

                                <AvatarUserProfile
                                    key={user?.id}
                                    keyId={user?.id}
                                    full_name={user?.full_name}
                                    moduls={user?.roles[0].position}
                                    image={user?.image}
                                    size={xl ? 40:xs ? 25 : 30}
                                />
                            ))}
                        </Avatar.Group>
                    </Flex>
                );
            },
        },

        {
            title: "Редактировать",
            id: "action",
            fixed:'right',
            width: xs ? 130:110,
            render: (_, record) => (

                <Flex gap={5} justify={'center'}>
                    {
                        user?.roles[0]?.role?.name !== 'director' ?
                            record?.done_sub_tasks_count ===0 &&
                            <>
                                <Button
                                    size={xs ?'small':"middle"}
                                    onClick={() => Edit(record.id)}
                                    type="primary"
                                    icon={<EditOutlined />}
                                />
                                <Popconfirm
                                    title={"Вы уверены, что хотите удалить это?"}
                                    description={"Удалить"}
                                    onConfirm={() => Delete(record.id)}
                                >
                                    <Button
                                        size={xs ?'small':"middle"} type="primary" danger icon={<DeleteOutlined />} />
                                </Popconfirm>
                            </>
                            :
                            record?.company?.id === user?.roles[0].company.id && record?.done_sub_tasks_count ===0  &&
                            <>
                                <Button
                                    size={xs ?'small':"middle"}
                                    onClick={() => Edit(record.id)}
                                    type="primary"
                                    icon={<EditOutlined />}
                                />
                                <Popconfirm
                                    title={"Вы уверены, что хотите удалить это?"}
                                    description={"Удалить"}
                                    onConfirm={() => Delete(record.id)}
                                >
                                    <Button
                                        size={xs ?'small':"middle"}
                                        type="primary"
                                        danger
                                        icon={<DeleteOutlined />} />
                                </Popconfirm>
                            </>

                    }
                    <Badge dot={record?.is_checking} style={{width:"auto"}}>
                        <EyeButton>
                            <Button
                                size={xs ?'small':"middle"}
                                onClick={() => handleTaskInnerGet(record?.id)}
                                type="primary"
                                icon={<FaRegEye />}
                            />
                        </EyeButton>

                    </Badge>
                </Flex>
            ),
        },
    ];
    return (
        <Table
            className={'task-table'}
            scroll={{ x: md ? 1200 : 800 }}
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
