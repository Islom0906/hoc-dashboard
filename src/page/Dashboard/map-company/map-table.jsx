import {Button, Image, Popconfirm, Space, Table} from "antd";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import React from "react";
import {editIdQuery} from "../../../store/slice/querySlice";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";



const MapTable = ({data,deleteHandle}) => {
  const navigate=useNavigate()
  const dispatch=useDispatch()
  const {data: {user} = {}} = useSelector((state) => state.auth);
  const roleName = user?.roles[0]?.role?.name
  const Delete = async (id) => {
    deleteHandle('/users/offices',id)
  };
  const Edit = (id) => {
    localStorage.setItem('editDataId',id)
    dispatch(editIdQuery(id))
    navigate('/map-add')
  };

  const columns = [
    {
      title: 'Заголовок',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Изображение',
      dataIndex: 'image',
      id: 'image',
      render: (image) => {
        return (
            <Image
                width={50}
                height={50}
                src={image}
            />
        )},
    },

    {
      title: 'Редактировать',
      id: 'action',
      render: (_, record) => (

            roleName === 'admin' &&

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

  return (
      <div>
        <Table dataSource={data} columns={columns} pagination={false} rowKey={(record) => record.id}/>
      </div>
  );
};

export default MapTable;