import {Button, Image, Popconfirm, Space, Table, Tag} from "antd";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {editIdQuery} from "../../store/slice/querySlice";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {IoLinkOutline} from "react-icons/io5";
import {useEffect} from "react";
import {FaFileDownload, FaRegEye} from "react-icons/fa";

const CreateWorkerTable = ({data,deleteHandle }) => {
    const navigate=useNavigate()


    const dispatch=useDispatch()
    const {data: {user} = {}} = useSelector((state) => state.auth);
    const roleName = user?.roles[0]?.role?.name

    const Delete = async (id) => {
        deleteHandle('/users/users',id)
    };
    const Edit = (id) => {
        localStorage.setItem('editDataId',id)
        dispatch(editIdQuery(id))
        navigate('/create-worker/add')
    };
    const handleUserProfile = (id) => {
        navigate(`/vie-user?user=${id}`)
    }
    const columns = [
        {
            title: 'Изображение',
            dataIndex: 'image',
            width:125,
            id: 'image',
            render: (image) => {

                return (
                    <Image
                        style={{
                            objectFit:'cover'
                        }}
                        width={50}
                        height={50}
                        src={image?.image}
                    />
                )},
        },
        {
            title: 'Ф.И.О',
            dataIndex: 'first_name',
            id: 'first_name',
            render: (text , record) => <p>{record?.first_name} {record?.last_name} {record?.middle_name}</p>,
        },
        {
            title: 'Роль',
            dataIndex: 'roles',
            id: 'roles',
            render: (text) => (
                // text?.map(company=> (
                <Space key={text[0]?.id} direction={"vertical"} size={3}>
                    <p>{text[0]?.module?.name }</p>
                    <Tag color={'success'}>
                        {text[0]?.role?.name==='boss' ? 'Руководитель':  "Сотрудник" }
                    </Tag>
                </Space>
                // ))
            ),
        },
        {
            title: 'Должность ',
            dataIndex: 'roles',
            id: 'roles',
            render: (text) => <p>{text[0]?.position}</p>,
        },
        {
            title: 'Электронная почта',
            dataIndex: 'email',
            id: 'email',
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Телефон',
            dataIndex: 'phone',
            id: 'phone',
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'День рождения',
            dataIndex: 'birthday',
            id: 'birthday',
            render: (text) => <p>{text}</p>
            // <p>{dayjs(text).format("DD.MM.YYYY")}</p>,
        },
        {
            title: 'Событие',
            id: 'action',
            fixed: 'right',
            render: (_, record) => (
                <Space size={20}>

                    {
                        roleName === 'admin' &&

                        <>

                        <Button
                            onClick={() => Edit(record.id)}
                            type='dashed'
                            out
                            icon={<EditOutlined />}/>
                        {
                            roleName !== 'admin' &&
                            <Popconfirm
                                title={'Вы уверены, что хотите удалить это?'}
                                description={'Удалить'}
                                onConfirm={() => Delete(record.id)}>
                                <Button  type='primary' danger icon={<DeleteOutlined />} />
                            </Popconfirm>
                        }

                        </>

}
                    {
                        roleName === 'general_director'  &&
                        <>
                            <Button

                                onClick={() => handleUserProfile(record?.id)}
                                type="primary"
                            >
                                <FaRegEye />
                            </Button>
                            <Button
                                href={`${process.env.REACT_APP_EXCEL_EXPORT_API_URL}?staff_id=${record?.id}`}
                                type="primary"
                            >
                                <FaFileDownload />
                            </Button>
                        </>

                    }

                </Space>

            ),
        },
    ];
    return <Table
        size={'small'}
        columns={columns}
        scroll={{
            x: 1800,
        }}
        dataSource={data}
        rowKey={(record) => record.id}
    />

};

export default CreateWorkerTable;