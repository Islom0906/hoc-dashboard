import Dashboard from './Dashboard'
import Inbox from './Inbox'
import MyApplications from './MyApplications'
import TaskList from './TaskList'
import TaskInner from './TaskList/TaskInner/'
import UserProfile from './UserProfile'
import CalendarTask from './CalendarTask'
import {CalendarOutlined, InboxOutlined, OrderedListOutlined, PieChartOutlined, UserOutlined} from "@ant-design/icons";

export const authRole = {
    admin: 'admin',
    boss: 'boss',
    user: 'user'
}


// const Dashboard = React.lazy(() => import('./Dashboard'));
// const CalendarTask = React.lazy(() => import('./CalendarTask'));
// const Inbox = React.lazy(() => import('./Inbox'));
// const MyApplications = React.lazy(() => import('./MyApplications'));
// const TaskList = React.lazy(() => import('./TaskList'));
// const UserProfile = React.lazy(() => import('./UserProfile'));


export const samplePagesConfigs = [
    {
        key: 100,
        icon: <PieChartOutlined className={'icon'} style={{ fontSize: 24 }} />,
        path: '/dashboard',
        label: 'Dashboard',
        element: Dashboard,
        permittedRole: [ 'admin', 'staff',"boss"]},
    {
        key: 125,
        icon: <OrderedListOutlined className={'icon'} style={{ fontSize: 24 }} />,
        path: '/task-list',
        label: 'Task',
        element: TaskList,
        permittedRole: ['staff' , 'admin',"boss"]},
    {
        icon: <OrderedListOutlined className={'icon'} style={{ fontSize: 24 }} />,
        path: '/task-list',
        label: 'Task User',
        element: TaskInner,
        permittedRole: ["boss"],
        noIndex: false
    },
    {
        key: 1276,
        icon: <OrderedListOutlined className={'icon'} style={{ fontSize: 24 }} />,
        path: '/task-list/item',
        label: 'Task Inner',
        element: TaskList,
        permittedRole: ["boss"]
    },
    {
        key:121,
        icon:<CalendarOutlined />,
        label: 'Calendar',
        path: '/calendar-task',
        element: CalendarTask,
        permittedRole: ['admin',"boss" , 'staff']},
    {
        key: 122,
        icon: <InboxOutlined className={'icon'} style={{ fontSize: 24 }} />,
        path: '/inbox',
        label: 'Inbox',
        element: Inbox,
        permittedRole: ['staff',"boss"]},
    {
        key:1212,
        label: 'My Applications',
        icon:<InboxOutlined className={'icon'} style={{ fontSize: 24 }} />,
        path: '/my-applications',
        element: MyApplications,
        permittedRole: ['staff','admin',"boss"]
    },
    {
        key: 120,
        icon: <UserOutlined className={'icon'} style={{ fontSize: 24 }} />,
        label: 'Profile',
        path: '/user-profile',
        element: UserProfile,
        permittedRole: ['admin', 'staff',"boss"]},
];