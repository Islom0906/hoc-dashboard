import {Button, Image, Popconfirm, Space, Table, Tag} from "antd";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {editIdQuery} from "../../store/slice/querySlice";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {IoLinkOutline} from "react-icons/io5";
import {useEffect} from "react";

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
        // {
        //     title: 'Социальная сеть',
        //     dataIndex: 'messenger_link1',
        //     id: 'messenger_link1',
        //     render: (text , record) => <Tag color={"blue"} icon={<IoLinkOutline />} style={{display:"flex" , alignItems:"center" , gap:5}}>{record?.messenger_link1}</Tag>,
        // },
        // {
        //     title: 'Компания',
        //     dataIndex: 'companies',
        //     id: 'companies',
        //     render: (text) => (
        //         text?.map(company=> (
        //             <Space key={company?.id} direction={"vertical"} size={"small"}>
        //             <p>{company?.title}</p>
        //
        //             </Space>
        //         ))
        //     ),
        // },

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
                    <Button
                        onClick={() => Edit(record.id)}
                        type='dashed'
                        out
                        icon={<EditOutlined />}/>
                    {
                        record?.position !== 'admin' &&
                    <Popconfirm
                        title={'Вы уверены, что хотите удалить это?'}
                        description={'Удалить'}
                        onConfirm={() => Delete(record.id)}>
                        <Button  type='primary' danger icon={<DeleteOutlined />} />
                    </Popconfirm>
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