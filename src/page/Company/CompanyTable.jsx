import React from 'react';
import {Button, Image, Popconfirm, Space, Table} from "antd";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";

const CompanyTable = ({data}) => {
    const Delete = async (id) => {
        // deleteHandle('/House',id)
    };


    const Edit = (id) => {
        // localStorage.setItem('editDataId',id)
        // dispatch({type:EDIT_DATA,payload:id})
        // navigate('/house/add')
    };


    const columns = [
        {
            title: 'Название компании',
            dataIndex: 'title',
            id: 'title',
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Изображение',
            dataIndex: 'image',
            id: 'image',
            render: (image) => {
                return (
                    <Image
                        width={50}

                        src={image}
                    />
                )},
        },
        {
            title: 'Событие',
            id: 'action',
            render: (_, record) => (
                <Space size={20}>
                    <Button
                        onClick={() => Edit(record.id)}
                        type='primary'
                        icon={<EditOutlined />}>
                        Изменить
                    </Button>
                    <Popconfirm
                        title={'Вы уверены, что хотите удалить это?'}
                        description={'Удалить'}
                        onConfirm={() => Delete(record.id)}>
                        <Button type='danger' icon={<DeleteOutlined />}>
                            Удалить
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];
    return <Table
            columns={columns}
            dataSource={data}
            rowKey={(record) => record.id}
        />

};

export default CompanyTable;