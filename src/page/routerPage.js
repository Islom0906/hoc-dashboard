import {
    Company,
    Dashboard,
    Inbox,
    MyApplications,
    TaskList,
    UserProfile,
    CalendarTask,
    TaskInner,
    CompanyPostEdit, CreateWorker, CreateWorkerPostEdit
} from './index'
import {CalendarOutlined, InboxOutlined, OrderedListOutlined, PieChartOutlined, UserOutlined} from "@ant-design/icons";


export const authRole = {
    admin: 'admin',
    boss: 'boss',
    user: 'user'
}


export const samplePagesConfigs = [
    {
        key: 1,
        icon: <PieChartOutlined className={'icon'} style={{fontSize: 24}}/>,
        path: '/dashboard',
        label: 'Dashboard',
        element: Dashboard,
        permittedRole: ['admin', 'staff', "boss"],
        isBackground: false
    },
    {
        key: 2,
        icon: <OrderedListOutlined className={'icon'} style={{fontSize: 24}}/>,
        path: '/task-list',
        label: 'Task',
        element: TaskList,
        permittedRole: ['staff', 'admin', "boss"],
        isBackground: false
    },
    {

        icon: <OrderedListOutlined className={'icon'} style={{fontSize: 24}}/>,
        path: '/task-list',
        label: 'Task User',
        element: TaskInner,
        permittedRole: ["boss","admin"],
        noIndex: true,
        isBackground: false
    },
    {
        key: 3,
        icon: <OrderedListOutlined className={'icon'} style={{fontSize: 24}}/>,
        path: '/task-list/item',
        label: 'Task Inner',
        element: TaskList,
        permittedRole: ["boss"],
        isBackground: false
    },
    {
        key: 4,
        icon: <CalendarOutlined/>,
        label: 'Calendar',
        path: '/calendar-task',
        element: CalendarTask,
        permittedRole: ['admin', "boss", 'staff'],
        isBackground: false
    },
    {
        key: 5,
        icon: <InboxOutlined className={'icon'} style={{fontSize: 24}}/>,
        path: '/inbox',
        label: 'Inbox',
        element: Inbox,
        permittedRole: ['staff', "boss"],
        isBackground: false
    },
    {
        key: 6,
        label: 'My Applications',
        icon: <InboxOutlined className={'icon'} style={{fontSize: 24}}/>,
        path: '/my-applications',
        element: MyApplications,
        permittedRole: ['staff', 'admin', "boss"],
        isBackground: false
    },
    {
        key: 7,
        label: 'Company',
        icon: <InboxOutlined className={'icon'} style={{fontSize: 24}}/>,
        path: '/company',
        element: Company,
        permittedRole: ["admin", "boss"],
        isBackground: true
    },
    {
        path: '/company/add',
        element: CompanyPostEdit,
        permittedRole: ["admin"],
        isBackground: true,
        noIndex: true
    },
    {
        key: 8,
        label: 'Create Worker',
        icon: <InboxOutlined className={'icon'} style={{fontSize: 24}}/>,
        path: '/create-worker',
        element: CreateWorker,
        permittedRole: ["admin"],
        isBackground: true
    },
    {
        path: '/create-worker/add',
        element: CreateWorkerPostEdit,
        permittedRole: ["admin"],
        isBackground: true,
        noIndex: true
    },
    {
        key: 9,
        icon: <UserOutlined className={'icon'} style={{fontSize: 24}}/>,
        label: 'Profile',
        path: '/user-profile',
        element: UserProfile,
        permittedRole: ['admin', 'staff', "boss"],
        isBackground: true
    },
];