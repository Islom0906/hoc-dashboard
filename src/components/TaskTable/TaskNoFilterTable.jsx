import {Avatar, Badge, Button, Flex, Progress, Table, Tag, Tooltip} from "antd";
import {editIdQuery} from "../../store/slice/querySlice";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import dayjs from "dayjs";
import DeadlineStatusColor from "../../hooks/deadlineStatusColor";
import {AvatarUserProfile, EyeButton} from "../../components";
import {FaRegEye} from "react-icons/fa";
import './index.scss'
import useBreakpoint from "antd/es/grid/hooks/useBreakpoint";

const TaskNoFilterTable = ({ data, deleteHandle, getTagCompanyArray , pagination, handleTableChange }) => {
    const navigate = useNavigate();

    const {md,xs,xl} = useBreakpoint();

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
            width:md ? 150:180,
            render: (_, record) =>  <Tag className={'deadline-tag'} color={"purple"} > {dayjs(record?.created_at).format("DD.MM.YYYY")}-{ dayjs(record?.deadline).format("DD.MM.YYYY")}</Tag>,
        },
        {
            title: "Статус",
            dataIndex: "deadline_status",
            id: "deadline_status",
            width: md ? 100:80,
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
            title: "Ответственный и Участники",
            dataIndex: "included_users",
            id: "team",
            width: md ? 250:200,
            render: (text, record) => {
                return (
                    <Flex justify={"space-between"} align={'center'}>
                            {
                                record?.responsible_user &&
                            <AvatarUserProfile
                                keyId={record?.responsible_user?.id}
                                full_name={record?.responsible_user?.full_name}
                                moduls={record?.responsible_user?.roles[0].position}
                                image={record?.responsible_user?.image}
                                size={xl ? 40:xs ? 25 : 30}
                            />
                            }
                        <Avatar.Group  max={{
                            count: 4,
                            style: { color: "#f56a00", backgroundColor: "#fde3cf" },
                        }} >
                            {record?.included_users?.map((user) => (
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
            fixed: "right",
            width: 80,
            render: (_, record) => (

                <Flex gap={10} justify={'center'}>
                    <Badge dot={record?.is_checking} style={{width:'100%'}}>
                        <EyeButton>
                            <Button
                                style={{width:'100%'}}
                                size={xs ?'small':"middle"}
                                onClick={() => handleTaskInnerGet(record?.id)}
                                type="primary"
                            >
                                <FaRegEye />
                            </Button>
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
export default TaskNoFilterTable;
