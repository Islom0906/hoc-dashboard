import {
  AppstoreOutlined,
  InboxOutlined,
  MailOutlined, OrderedListOutlined,
  PieChartOutlined,
  SettingOutlined,
  UserOutlined
} from '@ant-design/icons';

const items = [
  {
    key:100,
    icon: <PieChartOutlined className={'icon'} style={{fontSize:24}} />,
    label: 'Dashboard',
    path:'/'
  },
  {
    key:120,
    icon: <UserOutlined className={'icon'}  style={{fontSize:24}} />,
    label: 'Profile',
    path:'/user-profile'
  },
  {
    key:121,
    icon: <OrderedListOutlined className={'icon'}  style={{fontSize:24}} />,
    label: 'Task',
    path:'/task-list'
  },
  {
    key:122,
    icon: <InboxOutlined className={'icon'}  style={{fontSize:24}} />,
    label: 'Inbox',
    path:'/inbox'
  },
  // {
  //   key: '1',
  //   icon: <MailOutlined />,
  //   label: 'Dashboard',
  //   children: [
  //     {
  //       key: '11',
  //       label: 'Dashboard 1',
  //     },
  //     {
  //       key: '12',
  //       label: 'Dashboard 2',
  //     },
  //     {
  //       key: '13',
  //       label: 'Dashboard 3',
  //     },
  //     {
  //       key: '14',
  //       label: 'Dashboard 4',
  //     },
  //   ],
  // },
  // {
  //   key: '2',
  //   icon: <AppstoreOutlined />,
  //   label: 'Email',
  //   children: [
  //     {
  //       key: '21',
  //       label: 'Email 1',
  //     },
  //     {
  //       key: '22',
  //       label: 'Email 2',
  //     },
  //     {
  //       key: '23',
  //       label: 'pocta',
  //       icon: <AppstoreOutlined />,
  //       children: [
  //         {
  //           key: '231',
  //           label: 'pocta 1',
  //         },
  //         {
  //           key: '232',
  //           label: 'pocta 2',
  //         },
  //         {
  //           key: '233',
  //           label: 'pocta 3',
  //         },
  //       ],
  //     },
  //     {
  //       key: '24',
  //       label: 'Submenu 2',
  //       children: [
  //         {
  //           key: '241',
  //           label: 'Option 1',
  //         },
  //         {
  //           key: '242',
  //           label: 'Option 2',
  //         },
  //         {
  //           key: '243',
  //           label: 'Option 3',
  //         },
  //       ],
  //     },
  //   ],
  // },
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
        key: '232',
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

export  default  items
