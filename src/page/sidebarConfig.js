import {
  AppstoreOutlined,
  InboxOutlined,
  MailOutlined,
  OrderedListOutlined,
  PieChartOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';

const MenuList = [
  {
    key: '100',
    icon: <PieChartOutlined className={'icon'} style={{ fontSize: 24 }} />,
    label: 'Dashboard',
    path: '/dashboard',
  },
  {
    key: '120',
    icon: <UserOutlined className={'icon'} style={{ fontSize: 24 }} />,
    label: 'Profile',
    path: '/user-profile',
  },
  {
    key: '121',
    icon: <OrderedListOutlined className={'icon'} style={{ fontSize: 24 }} />,
    label: 'Task',
    path: '/task-list',
  },
  {
    key: '122',
    icon: <InboxOutlined className={'icon'} style={{ fontSize: 24 }} />,
    label: 'Inbox',
    path: '/inbox',
  },
  {
    key: '3',
    icon: <SettingOutlined />,
    label: 'Navigation Three',
    children: [
      {
        key: '31',
        label: 'Option 1',
      },
      {
        key: '32',
        label: 'Option 2',
      },
      {
        key: '33',
        label: 'Option 3',
      },
      {
        key: '34',
        label: 'Option 4',
      },
    ],
  },
];

export default MenuList;
