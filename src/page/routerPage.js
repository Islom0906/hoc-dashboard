import {
    Company,
    TaskList,
    UserProfile,
    CalendarTask,
    TaskInner,
    CompanyPostEdit, CreateWorker, CreateWorkerPostEdit,
    Module, ModulePostEdit, BossTracking, TaskCreated, TaskPostEdit, SuccessTask, ResponsibleUser
} from './index'
import {RiContractFill, RiPlayListAddLine} from "react-icons/ri";
import { BsBuildingAdd } from "react-icons/bs";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { VscFileSubmodule } from "react-icons/vsc";
import {IoCalendarOutline, IoCheckmarkDoneOutline} from "react-icons/io5";
import { PiShuffleBold } from "react-icons/pi";
import {
    OrderedListOutlined, UserOutlined,
} from "@ant-design/icons";
// import TaskEditBoss from "./TaskEditBoss";
// import TaskEdit from "./TaskEditBoss/TaskEdit";
// import {CgController} from "react-icons/cg";


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
        label: 'Задачи',
        element: TaskList,
        permittedRole: ['staff' ,'boss'],
        isBackground: true
    },
    {
        path: '/task-list/:item',
        element:  TaskInner,
        noIndex: true,
        permittedRole: ["boss" , "staff" , "admin"],
        isBackground: true
    },
    {
        path: '/success-task/:item',
        element:  TaskInner,
        noIndex: true,
        permittedRole: ["boss" , "staff" , "admin"],
        isBackground: true
    },
    {
        key: 223212434223,
        icon: <IoCheckmarkDoneOutline className={'icon'} style={{fontSize: 24, height: '100%'}}/>,
        path: '/success-task',
        label: 'Выполненные задачи',
        element: SuccessTask,
        permittedRole: ['staff' ,'boss'],
        isBackground: true
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
        label: 'Задачи',
        icon: <RiPlayListAddLine className={'icon'} style={{fontSize: 22, height: '100%'}}/>,
        path: '/taskCreated',
        element: TaskCreated,
        permittedRole: ["admin"],
        isBackground: true
    },
    // {
    //     key: 121325,
    //     label: 'Панель контроллера',
    //     icon: <CgController className={'icon'} style={{fontSize: 22, height: '100%'}}/>,
    //     path: '/controllerPanel',
    //     element: ControllerPanel,
    //     permittedRole: ["admin", "boss"],
    //     isBackground: true
    // },
    {
        key: 121322,
        label: 'Контроль задач в отделе',
        icon: <PiShuffleBold className={'icon'} style={{fontSize: 22, height: '100%'}}/>,
        path: '/taskEditBoss',
        element: BossTracking,
        permittedRole: ["boss"],
        isBackground: true
    },
    {
        key: 1213222,
        label: 'Ответственный',
        icon:  <RiContractFill className={'icon'} style={{fontSize: 22, height: '100%'}}/>,
        path: '/Responsible',
        element: ResponsibleUser,
        permittedRole: ["boss", 'staff'],
        isBackground: true
    },
    // {
    //     path: '/taskEditBoss/add',
    //     element: TaskEdit,
    //     permittedRole: ["boss"],
    //     isBackground: true,
    //     noIndex: true
    // },
    {
        path: '/task/add',
        element: TaskPostEdit,
        permittedRole: ["admin"],
        isBackground: true,
        noIndex: true
    },
    {
        key: 7,
        label: 'Компании',
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
        label: 'Сотрудники',
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
    {
        key: 9,
        icon: <UserOutlined className={'icon'} style={{fontSize: 24, height: '100%'}}/>,
        label: 'Профиль',
        path: '/user-profile',
        element: UserProfile,
        permittedRole: ['admin', 'staff', "boss"],
        isBackground: false
    },
];