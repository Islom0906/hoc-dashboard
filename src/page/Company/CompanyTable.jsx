import React from 'react';
import {Button, Image, Popconfirm, Space, Table} from "antd";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {editIdQuery} from "../../store/slice/querySlice";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";

const CompanyTable = ({data,deleteHandle}) => {
    const navigate=useNavigate()
    const dispatch=useDispatch()
    const Delete = async (id) => {
        deleteHandle('/users/tag',id)
    };


    const Edit = (id) => {
        localStorage.setItem('editDataId',id)
        dispatch(editIdQuery(id))
        navigate('/company/add')
    };


    const columns = [
        {
            title: 'Название компании',
            dataIndex: 'name',
            id: 'name',
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Логотип тёмный',
            dataIndex: 'image_dark',
            id: 'image_dark',
            render: (image_dark) => {
                return (
                    <Image
                        width={50}
                        height={50}
                        src={image_dark}
                    />
                )},
        },
        {
            title: 'Логотип светлый',
            dataIndex: 'image_light',
            id: 'image_light',
            render: (image_light) => {
                return (
                    <Image
                        width={50}
                        height={50}
                        src={image_light}
                    />
                )},
        },
        {
            title: 'Редактировать',
            id: 'action',
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
            dataSource={data}
            rowKey={(record) => record.id}
        />

};

export default CompanyTable;