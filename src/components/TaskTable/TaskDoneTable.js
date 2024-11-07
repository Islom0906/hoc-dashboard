import {Avatar, Badge, Button, Flex,  Table, Tag, } from "antd";
import {useNavigate} from "react-router-dom";
import dayjs from "dayjs";
import {AvatarUserProfile, EyeButton ,HistoryCard} from "../../components";
import {FaFileDownload, FaRegEye} from "react-icons/fa";
import './index.scss'
import useBreakpoint from "antd/es/grid/hooks/useBreakpoint";

const TaskDoneTable = ({ data,  getTagCompanyArray , isLoading , pagination, handleTableChange }) => {
    const navigate = useNavigate();
    const screens = useBreakpoint();
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
                    size={screens.xl ? 50:screens.xs ? 30 : 40}
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
                    size={screens.xl ? 50:screens.xs ? 30 : 40}
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
            render: (_, record) =>  <Tag className={'deadline-tag'} color={"purple"} > {dayjs(record?.created_at).format("DD.MM.YYYY")}-{ dayjs(record?.deadline).format("DD.MM.YYYY")}</Tag>,
        },
        {
            title: "История",
            dataIndex: "history",
            id: "history",
            render: (_, record) => <Flex justify={"space-between"} align={'center'}>
                {
                    record?.histories.map(item => (
                        <HistoryCard history={item} />

                    ))
                }
            </Flex>,
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
                                size={screens.xl ? 50:screens.xs ? 30 : 40}
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
                                    size={screens.xl ? 50:screens.xs ? 30 : 40}
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
            render: (_, record) => (
                <Flex gap={3} >
                    <Badge dot={record?.is_checking}>
                        <EyeButton>
                            <Button
                                size={screens.xs ?'small':"middle"}
                                onClick={() => handleTaskInnerGet(record?.id)}
                                type="primary"
                            >
                                <FaRegEye />
                            </Button>
                        </EyeButton>
                    </Badge>
                    <Button
                        size={screens.xs ?'small':"middle"}
                        href={`${process.env.REACT_APP_EXCEL_EXPORT_API_URL}?task_id=${record?.id}`}
                        type="primary"
                    >
                        <FaFileDownload  />
                    </Button>
                </Flex>
            ),
        },
    ];
    return (
        <Table
            className={'task-table'}
            scroll={{ x: 1200 }}
            size={"medium"}
            columns={columns}
            pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total,
            }}
            onChange={handleTableChange}
            loading={isLoading}
            dataSource={data}
            rowKey={(record) => record?.id}
        />
    );
};
export default TaskDoneTable;
