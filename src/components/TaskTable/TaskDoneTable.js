import {Avatar, Badge, Button, Flex, Popconfirm, Progress, Table, Tag, Tooltip} from "antd";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {editIdQuery} from "../../store/slice/querySlice";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import dayjs from "dayjs";
import DeadlineStatusColor from "../../hooks/deadlineStatusColor";
import {AvatarUserProfile, EyeButton} from "../../components";
import {deadlineColor} from "../../constants/deadlineColor";
import {FaRegEye} from "react-icons/fa";

const TaskTable = ({ data,  getTagCompanyArray , pagination, setPagination, handleTableChange }) => {
    const navigate = useNavigate();

    const handleTaskInnerGet = (id) => {
        navigate(`/task-list/${id}`);
    };

    const columns = [
        {
            title: "Компания",
            dataIndex: "company",
            id: "company",
            filters: getTagCompanyArray,
            render: (text , record) =>
                <AvatarUserProfile
                    size={'large'}
                    key={record?.company?.id}
                    company={record?.company?.title}
                    image={record?.company?.image_light}
                />,
        },
        {
            title: "Создано",
            dataIndex: "created_by",
            id: "created_by",
            render: (text , record) =>
                <AvatarUserProfile
                    size={'large'}
                    key={record?.created_by?.id}
                    company={record?.created_by?.roles[0].position}
                    full_name={record?.created_by?.full_name}
                    image={record?.created_by?.image}
                />,
        },

        {
            title: "Задача",
            dataIndex: "title",
            id: "title",
            render: (title) => <p>{title}</p>,
        },


        {
            title: "Крайний срок",
            dataIndex: "deadline",
            id: "deadline",
            width: 150,
            render: (_, record) =>  <Tag color={"purple"} > {dayjs(record?.created_at).format("DD.MM.YYYY")}-{ dayjs(record?.deadline).format("DD.MM.YYYY")}</Tag>,
        },
        {
            title: "Ответственный и Участники",
            dataIndex: "included_users",
            id: "team",
            render: (text, record) => {
                const users = [...(record.included_users || [])];
                return (
                    <Flex justify={"space-between"} align={'center'}>
                        <Avatar.Group >
                            <AvatarUserProfile
                                key={record?.responsible_user?.id}
                                full_name={record?.responsible_user?.full_name}
                                moduls={record?.responsible_user?.roles[0].position}
                                image={record?.responsible_user?.image}
                            />
                        </Avatar.Group>
                        <Avatar.Group  max={{
                            count: 4,
                            style: { color: "#f56a00", backgroundColor: "#fde3cf" },
                        }} >
                            {users.map((user) => (
                                <AvatarUserProfile
                                    key={user?.id}
                                    full_name={user?.full_name}
                                    moduls={user?.roles[0].position}
                                    image={user?.image}
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
            width: 140,
            render: (_, record) => (

                <Flex gap={10} justify={'end'}>
                    <Badge dot={record?.is_checking}>
                        <EyeButton>
                            <Button

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
            size={"medium"}
            columns={columns}
            // pagination={{
            //     current: pagination.current,
            //     pageSize: pagination.pageSize,
            //     total: pagination.total,
            // }}
            // onChange={handleTableChange}
            dataSource={data}
            rowKey={(record) => record?.id}
        />
    );
};
export default TaskTable;
