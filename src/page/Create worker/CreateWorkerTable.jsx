import {Button, Image, Popconfirm, Space, Table, Tag} from "antd";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {editIdQuery} from "../../store/slice/querySlice";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {FaFileDownload, FaRegEye} from "react-icons/fa";
import './index.scss'
import useBreakpoint from "antd/es/grid/hooks/useBreakpoint";

const CreateWorkerTable = ({data, deleteHandle}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const ScreenMD = useBreakpoint().md;
    const {data: {user} = {}} = useSelector((state) => state.auth);
    const roleName = user?.roles[0]?.role?.name;

    const Delete = async (id) => {
        deleteHandle('/users/users', id);
    };
    const Edit = (id) => {
        localStorage.setItem('editDataId', id);
        dispatch(editIdQuery(id));
        navigate('/create-worker/add');
    };
    const handleUserProfile = (id) => {
        navigate(`/vie-user?user=${id}`);
    };

    const columns = [
        {
            title: 'Изображение',
            dataIndex: 'image',
            width: ScreenMD ? 125 : 100,
            render: (image) => (
                <Image
                    style={{ objectFit: 'cover' , borderRadius:'100%' }}
                    width={ScreenMD ? 50 : 40}
                    height={ScreenMD ? 50 : 40}
                    src={image?.image}
                />
            ),
        },
        {
            title: 'Ф.И.О',
            dataIndex: 'first_name',
            render: (text, record) => <p>{record?.first_name} {record?.last_name} {record?.middle_name}</p>,
        },
        {
            title: 'Роль',
            dataIndex: 'roles',
            render: (text) => (
                <Space key={text[0]?.id} direction={"vertical"} size={3}>
                    <p>{text[0]?.module?.name}</p>
                    <Tag color={'success'}>
                        {text[0]?.role?.name === 'boss' ? 'Руководитель' : "Сотрудник"}
                    </Tag>
                </Space>
            ),
        },
        {
            title: 'Должность',
            dataIndex: 'roles',
            render: (text) => <p>{text[0]?.position}</p>,
        },
        {
            title: 'Электронная почта',
            dataIndex: 'email',
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Телефон',
            dataIndex: 'phone',
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Событие',
            fixed: 'right',
            width: ScreenMD ? 125: 70,
            render: (_, record) => (
                <Space direction={ScreenMD ? 'horizontal' : 'vertical'}  size={[3 , 10]}>
                    {roleName === 'admin' && (
                        <>
                            <Button size={ScreenMD ? 'middle' : 'small'  } onClick={() => Edit(record.id)} type='dashed' icon={<EditOutlined />} />
                            <Popconfirm
                                title={'Вы уверены, что хотите удалить это?'}
                                onConfirm={() => Delete(record.id)}>
                                <Button type='primary' size={"small"} danger icon={<DeleteOutlined />} />
                            </Popconfirm>
                        </>
                    )}
                    {roleName === 'general_director' && (
                        <>
                            <Button size={ScreenMD ? 'middle' : 'small'  } onClick={() => handleUserProfile(record?.id)} type="primary">
                                <FaRegEye />
                            </Button>
                            <Button
                                size={ScreenMD ? 'middle' : 'small'  }
                                href={`${process.env.REACT_APP_EXCEL_EXPORT_API_URL}?staff_id=${record?.id}`}
                                type="primary">
                                <FaFileDownload />
                            </Button>
                        </>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <Table
            className={'create-worker'}
            size='small'
            columns={columns}
            dataSource={data}
            rowKey={(record) => record.id}
            scroll={{   x: ScreenMD ? 1200 : 800 }}
            pagination={{ responsive: true }}
        />
    );
};

export default CreateWorkerTable;
