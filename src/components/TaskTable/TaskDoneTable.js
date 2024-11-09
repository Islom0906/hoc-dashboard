import {Avatar, Badge, Button, Flex, Table, Tag,} from "antd";
import {useNavigate} from "react-router-dom";
import dayjs from "dayjs";
import {AvatarUserProfile, EyeButton, HistoryCard} from "../../components";
import {FaFileDownload, FaRegEye} from "react-icons/fa";
import './index.scss'
import useBreakpoint from "antd/es/grid/hooks/useBreakpoint";

const TaskDoneTable = ({ data,  getTagCompanyArray , isLoading , pagination, handleTableChange }) => {
    const navigate = useNavigate();
    const {md,xs,xl} = useBreakpoint();
    const handleTaskInnerGet = (id) => {
        navigate(`/task-list/${id}`);
    };

    const columns = [
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
            title: "История",
            dataIndex: "history",
            id: "history",
            width: md ? 250:200,
            render: (_, record) => <Flex justify={"space-between"} align={'center'}>
                {
                    record?.histories?.map(item => (
                        <HistoryCard key={item?.user?.id} history={item}/>

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
                            {users.map((user) => (
                                <AvatarUserProfile
                                    key={user?.id}
                                    size={xl ? 40:xs ? 25 : 30}
                                    keyId={user?.id}
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
            fixed:'right',
            width: xs ? 130:110,
            render: (_, record) => (
                <Flex gap={3} >
                    <Badge dot={record?.is_checking}>
                        <EyeButton>
                            <Button
                                size={xs ?'small':"middle"}
                                onClick={() => handleTaskInnerGet(record?.id)}
                                type="primary"
                            >
                                <FaRegEye />
                            </Button>
                        </EyeButton>
                    </Badge>
                    <Button
                        size={xs ?'small':"middle"}
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
            scroll={{ x: md ? 1200 : 800 }}
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
