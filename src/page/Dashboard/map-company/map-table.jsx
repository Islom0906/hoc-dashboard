import {Table} from "antd";


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
];
const MapTable = () => {
  return (
      <div>
        <Table dataSource={dataSource} columns={columns} pagination={false} />
      </div>
  );
};

export default MapTable;