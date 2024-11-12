import {Button,  Popconfirm, Space, Table} from "antd";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {editIdQuery} from "../../store/slice/querySlice";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";

const ModuleTable = ({data,deleteHandle}) => {
    const navigate=useNavigate()
    const dispatch=useDispatch()
    const Delete = async (id) => {
        deleteHandle('/users/modules',id)
    };


    const Edit = (id) => {
        localStorage.setItem('editDataId',id)
        dispatch(editIdQuery(id))
        navigate('/module/add')
    };


    const columns = [
        {
            title: 'Отделы',
            dataIndex: 'name',
            id: 'name',
            render: (text) => <p>{text}</p>,
        },

        {
            title: 'Компания',
            dataIndex: 'company',
            id: 'company',
            render: (text) =><p>{text?.title}</p>,
        },

        {
            title: 'Редактировать',
            id: 'action',
            fixed: 'right',
            render: (_, record) => (
                <Space size={20}>
                    <Button
                        onClick={() => Edit(record.id)}
                        type='dashed'
                        out={"true"}
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

export default ModuleTable;