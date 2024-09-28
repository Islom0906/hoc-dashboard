import {Button, Popconfirm, Space, Table} from "antd";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import React from "react";
import {editIdQuery} from "../../../store/slice/querySlice";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";


const dataSource = [
  {
    key: '1',
    name: 'Mike',
    age: 32,
    address: '10 Downing Street',
  },
  {
    key: '2',
    name: 'John',
    age: 42,
    address: '10 Downing Street',
  },
  {
    key: '1000',
    name: 'Mike',
    age: 32,
    address: '10 Downing Street',
  },
  {
    key: '2000',
    name: 'John',
    age: 42,
    address: '10 Downing Street',
  },
  {
    key: '10',
    name: 'Mike',
    age: 32,
    address: '10 Downing Street',
  },
  {
    key: '20',
    name: 'John',
    age: 42,
    address: '10 Downing Street',
  },
];

const MapTable = () => {
  const navigate=useNavigate()
  const dispatch=useDispatch()
  const Delete = async (id) => {
    // deleteHandle('/users/tag',id)
  };
  const Edit = (id) => {
    localStorage.setItem('editDataId',id)
    dispatch(editIdQuery(id))
    navigate('/map-add')
  };


  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
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

  return (
      <div>
        <Table dataSource={dataSource} columns={columns} pagination={false} />
      </div>
  );
};

export default MapTable;