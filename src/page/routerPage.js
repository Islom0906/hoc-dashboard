import {
    Company,
    Dashboard,
    Inbox,
    MyApplications,
    TaskList,
    UserProfile,
    CalendarTask,
    TaskInner,
    CompanyPostEdit, CreateWorker, CreateWorkerPostEdit,
    Module,ModulePostEdit
} from './index'
import { PiUserListLight } from "react-icons/pi";
import { RiPlayListAddLine } from "react-icons/ri";
import { BsBuildingAdd } from "react-icons/bs";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { VscFileSubmodule } from "react-icons/vsc";
import { IoCalendarOutline } from "react-icons/io5";
import { RxDashboard } from "react-icons/rx";
import { PiShuffleBold } from "react-icons/pi";
import {
    InboxOutlined,
    OrderedListOutlined,
    UserOutlined
} from "@ant-design/icons";
import TaskCreated from "./TaskCreated";
import TaskPostEdit from "./TaskCreated/TaskPostEdit";
import TaskEditBoss from "./TaskEditBoss";
import TaskEdit from "./TaskEditBoss/TaskEdit";


export const authRole = {
    admin: 'admin',
    boss: 'boss',
    user: 'user'
}


export const samplePagesConfigs = [
    // {
    //     key: 1,
    //     icon: <RxDashboard className={'icon'} style={{fontSize: 24, height: '100%'}}/>,
    //     path: '/dashboard',
    //     label: 'Панель',
    //     element: Dashboard,
    //     permittedRole: ['admin', 'staff', "boss"],
    //     isBackground: false
    // },
    {
        key: 2,
        icon: <OrderedListOutlined className={'icon'} style={{fontSize: 24, height: '100%'}}/>,
        path: '/task-list',
        label: 'Задача',
        element: TaskList,
        permittedRole: ['staff' ,'boss'],
        isBackground: false
    },
    {
        path: '/task-list/:item',
        element:  TaskInner,
        noIndex: true,
        permittedRole: ["boss" , "staff"],
        isBackground: false
    },
    {
        key: 4,
        icon: <IoCalendarOutline className={'icon'} style={{fontSize: 24, height: '100%'}}/>,
        label: 'Календарь',
        path: '/calendar-task',
        element: CalendarTask,
        permittedRole: ['admin', "boss", 'staff'],
        isBackground: true
    },
    // {
    //     key: 5,
    //     icon: <InboxOutlined className={'icon'} style={{fontSize: 24, height: '100%'}}/>,
    //     path: '/inbox',
    //     label: 'Избранный',
    //     element: Inbox,
    //     permittedRole: ['staff', "boss"],
    //     isBackground: false
    // },
    // {
    //     key: 6,
    //     label: 'Мои заявки',
    //     icon: <PiUserListLight className={'icon'} style={{fontSize: 24, height: '100%'}}/>,
    //     path: '/my-applications',
    //     element: MyApplications,
    //     permittedRole: ['staff', 'admin', "boss"],
    //     isBackground: false
    // },
    {
        key: 12132,
        label: 'Создать задачу',
        icon: <RiPlayListAddLine className={'icon'} style={{fontSize: 22, height: '100%'}}/>,
        path: '/taskCreated',
        element: TaskCreated,
        permittedRole: ["admin"],
        isBackground: true
    },
    {
        key: 121322,
        label: 'Распределение задач',
        icon: <PiShuffleBold className={'icon'} style={{fontSize: 22, height: '100%'}}/>,
        path: '/taskEditBoss',
        element: TaskEditBoss,
        permittedRole: ["boss"],
        isBackground: true
    },
    {
        path: '/taskEditBoss/add',
        element: TaskEdit,
        permittedRole: ["boss"],
        isBackground: true,
        noIndex: true
    },
    {
        path: '/task/add',
        element: TaskPostEdit,
        permittedRole: ["admin"],
        isBackground: true,
        noIndex: true
    },
    {
        key: 7,
        label: 'Добавить компанию',
        icon: <BsBuildingAdd className={'icon'} style={{fontSize: 22, height: '100%'}}/>,
        path: '/company',
        element: Company,
        permittedRole: ["admin"],
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
        label: 'Создать рабочий',
        icon: <AiOutlineUsergroupAdd className={'icon'} style={{fontSize: 24, height: '100%'}}/>,
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
        key: 89,
        label: 'Отделы',
        icon: <VscFileSubmodule className={'icon'} style={{fontSize: 24, height: '100%'}}/>,
        path: '/module',
        element: Module,
        permittedRole: ["admin"],
        isBackground: true
    },
    {
        path: '/module/add',
        element: ModulePostEdit,
        permittedRole: ["admin"],
        isBackground: true,
        noIndex: true
    },
    // {
    //     key: 9,
    //     icon: <UserOutlined className={'icon'} style={{fontSize: 24, height: '100%'}}/>,
    //     label: 'Профиль',
    //     path: '/user-profile',
    //     element: UserProfile,
    //     permittedRole: ['admin', 'staff', "boss"],
    //     isBackground: true
    // },
];