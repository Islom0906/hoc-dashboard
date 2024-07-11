import {Button, Image, Popconfirm, Space, Table, Tag} from "antd";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {editIdQuery} from "../../store/slice/querySlice";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import dayjs from "dayjs";

const CreateWorkerTable = ({data,deleteHandle}) => {
    const navigate=useNavigate()
    const dispatch=useDispatch()
    const Delete = async (id) => {
        deleteHandle('/users/users',id)
    };


    const Edit = (id) => {
        localStorage.setItem('editDataId',id)
        dispatch(editIdQuery(id))
        navigate('/create-worker/add')
    };


    const columns = [
        {
            title: 'Имя пользователя',
            dataIndex: 'first_name',
            id: 'first_name',
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Электронная почта',
            dataIndex: 'email',
            id: 'email',
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Birthday',
            dataIndex: 'birthday',
            id: 'birthday',
            render: (text) => <p>{dayjs(text).format("DD.MM.YYYY")}</p>,
        },
        {
            title: 'Позиция',
            dataIndex: 'position',
            id: 'position',
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Телефон',
            dataIndex: 'phone',
            id: 'phone',
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Компания',
            dataIndex: 'companies',
            id: 'companies',
            render: (text) => (
                text?.map(company=> (
                    <Space key={company?.id} direction={"vertical"} size={"small"}>
                    <p>{company?.title}</p>

                    </Space>
                ))
            ),
        },
        {
            title: 'Роль сотрудника',
            dataIndex: 'user_roles',
            id: 'user_roles',
            render: (text) => (
                // text?.map(company=> (
                    <Space key={text[0]?.id} direction={"horizontal"} size={"small"}>
                        <p>{text[0]?.module_name}</p>
                        :
                        <Tag>
                            {text[0]?.user_role_name}
                        </Tag>
                    </Space>
                // ))
            ),
        },
        {
            title: 'Изображение',
            dataIndex: 'images',
            id: 'images',
            render: (image) => {
                return (
                    <Image
                        width={50}
                        height={50}
                        src={image?.image}
                    />
                )},
        },
        {
            title: 'Событие',
            id: 'action',
            fixed: 'right',
            render: (_, record) => (
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
    return <Table
        columns={columns}
        scroll={{
            x: 1500,
        }}
        dataSource={data}
        rowKey={(record) => record.id}
    />

};

export default CreateWorkerTable;