import {
    Company,
    TaskList,
    UserProfile,
    CalendarTask,
    TaskInner,
    CompanyPostEdit,
    CreateWorker,
    CreateWorkerPostEdit,
    Support,
    Module,
    ModulePostEdit,
    BossTracking,
    TaskCreated,
    TaskPostEdit,
    SuccessTask,
    ResponsibleUser,
    Dashboard,
    Inbox, InboxInner, InboxPostEdit, AddLocationMap,PressCenter

} from './index'
import {RiContractFill, RiPlayListAddLine} from "react-icons/ri";
import { BsBuildingAdd } from "react-icons/bs";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { VscFileSubmodule } from "react-icons/vsc";
import {IoCalendarOutline, IoCheckmarkDoneOutline} from "react-icons/io5";
import { PiShuffleBold } from "react-icons/pi";
import {
    InboxOutlined,
    OrderedListOutlined, UserOutlined,
} from "@ant-design/icons";
import {RxDashboard} from "react-icons/rx";
import {BiSupport} from "react-icons/bi";
import {GiNewspaper} from "react-icons/gi";

// import TaskEditBoss from "./TaskEditBoss";
// import TaskEdit from "./TaskEditBoss/TaskEdit";
// import {CgController} from "react-icons/cg";


export const authRole = {
    admin: 'admin',
    boss: 'boss',
    user: 'staff',
    director:'director',
    general_director:'general_director'
}


export const samplePagesConfigs = [
    {
        key: 1,
        icon: <RxDashboard className={'icon'} style={{fontSize: 24, height: '100%'}}/>,
        path: '/dashboard',
        label: 'Панель',
        element: Dashboard,
        permittedRole: [authRole.admin, authRole.boss,authRole.director, authRole.general_director],
        isBackground: false
    },
    {
        path: '/map-add',
        element:  AddLocationMap,
        noIndex: true,
        permittedRole: [authRole.admin],
        isBackground: true
    },

    // {
    //     key: 2,
    //     icon: <OrderedListOutlined className={'icon'} style={{fontSize: 24, height: '100%'}}/>,
    //     label: 'Задачи',
    //     path: '/tasks',
    //     permittedRole: [authRole.admin, authRole.boss, authRole.user],
    //     items: [  // Submenu items
    //         {
    //             key: 'task-list',
    //             path: '/task-list',
    //             label: 'Список задач',
    //             icon: <RiPlayListAddLine className={'icon'} style={{fontSize: 22, height: '100%'}}/>,
    //             element: TaskList,
    //             permittedRole: [authRole.user ,authRole.boss]
    //         },
    //         {
    //             key: 'success-task',
    //             path: '/success-task',
    //             label: 'Выполненные задачи',
    //             icon: <IoCheckmarkDoneOutline className={'icon'} style={{fontSize: 24, height: '100%'}}/>,
    //             element: SuccessTask,
    //             permittedRole: [authRole.user ,authRole.boss]
    //         }
    //     ]
    // },
    {
        key: 2,
        icon: <OrderedListOutlined className={'icon'} style={{fontSize: 24, height: '100%'}}/>,
        path: '/task-list',
        label: 'Задачи',
        element: TaskList,
        permittedRole: [authRole.user ,authRole.boss],
        isBackground: true
    },

    {
        path: '/task-list/:item',
        element:  TaskInner,
        noIndex: true,
        permittedRole: [authRole.boss , authRole.user , authRole.admin ,authRole.director ,authRole.general_director],
        isBackground: true
    },
    {
        path: '/success-task/:item',
        element:  TaskInner,
        noIndex: true,
        permittedRole: [authRole.boss , authRole.user , authRole.admin ,authRole.director ,authRole.general_director],
        isBackground: true
    },
    {
        key: 223212434223,
        icon: <IoCheckmarkDoneOutline className={'icon'} style={{fontSize: 24, height: '100%'}}/>,
        path: '/success-task',
        label: 'Выполненные задачи',
        element: SuccessTask,
        permittedRole: [authRole.user ,authRole.boss ,authRole.director, authRole.general_director],
        isBackground: true
    },
    {
        key: 4,
        icon: <IoCalendarOutline className={'icon'} style={{fontSize: 24, height: '100%'}}/>,
        label: 'Календарь',
        path: '/calendar-task',
        element: CalendarTask,
        permittedRole: [authRole.admin, authRole.boss, authRole.user,authRole.director ,authRole.general_director],
        isBackground: true
    },
    {
        key: 5,
        icon: <InboxOutlined className={'icon'} style={{fontSize: 24, height: '100%'}}/>,
        path: '/inbox',
        label: 'Избранный',
        element: Inbox,
        permittedRole: [authRole.admin,authRole.boss,authRole.user,authRole.director , authRole.general_director],
        isBackground: false
    },
    {
        path: '/inbox/:id',
        element: InboxInner,
        noIndex: true,
        permittedRole: [authRole.admin,authRole.boss,authRole.user,authRole.director , authRole.general_director],
        isBackground: false
    },
    {
        path: '/inbox-add',
        element: InboxPostEdit,
        noIndex: true,
        permittedRole: [authRole.admin,authRole.boss,authRole.user,authRole.director ,authRole.general_director],
        isBackground: false
    },
    // {
    //     key: 6,
    //     label: 'Мои заявки',
    //     icon: <PiUserListLight className={'icon'} style={{fontSize: 24, height: '100%'}}/>,
    //     path: '/my-applications',
    //     element: MyApplications,
    //     permittedRole: [authRole.user, authRole.admin, authRole.boss"],
    //     isBackground: false
    // },
    {
        key: 12132,
        label: 'Задачи',
        icon: <RiPlayListAddLine className={'icon'} style={{fontSize: 22, height: '100%'}}/>,
        path: '/taskCreated',
        element: TaskCreated,
        permittedRole: [authRole.admin , authRole.director ,authRole.general_director],
        isBackground: true
    },
    // {
    //     key: 121325,
    //     label: 'Панель контроллера',
    //     icon: <CgController className={'icon'} style={{fontSize: 22, height: '100%'}}/>,
    //     path: '/controllerPanel',
    //     element: ControllerPanel,
    //     permittedRole: [authRole.admin, authRole.boss"],
    //     isBackground: true
    // },
    {
        key: 121322,
        label: 'Контроль задач в отделе',
        icon: <PiShuffleBold className={'icon'} style={{fontSize: 22, height: '100%'}}/>,
        path: '/taskEditBoss',
        element: BossTracking,
        permittedRole: [authRole.boss ],
        isBackground: true
    },
    {
        path: '/view-task-director',
        noIndex: true,
        element: TaskCreated,
        permittedRole: [authRole.director ,authRole.general_director],
        isBackground: true
    },
    {
        key: 1213222,
        label: 'Ответственный',
        icon:  <RiContractFill className={'icon'} style={{fontSize: 22, height: '100%'}}/>,
        path: '/Responsible',
        element: ResponsibleUser,
        permittedRole: [authRole.boss, authRole.user],
        isBackground: true
    },
    // {
    //     path: '/taskEditBoss/add',
    //     element: TaskEdit,
    //     permittedRole: [authRole.boss"],
    //     isBackground: true,
    //     noIndex: true
    // },
    {
        path: '/task/add',
        element: TaskPostEdit,
        permittedRole: [authRole.admin , authRole.director ,authRole.general_director],
        isBackground: true,
        noIndex: true
    },
    {
        key: 7,
        label: 'Компании',
        icon: <BsBuildingAdd className={'icon'} style={{fontSize: 22, height: '100%'}}/>,
        path: '/company',
        element: Company,
        permittedRole: [authRole.admin],
        isBackground: true
    },
    {
        path: '/company/add',
        element: CompanyPostEdit,
        permittedRole: [authRole.admin],
        isBackground: true,
        noIndex: true
    },
    {
        key: 8,
        label: 'Сотрудники',
        icon: <AiOutlineUsergroupAdd className={'icon'} style={{fontSize: 24, height: '100%'}}/>,
        path: '/create-worker',
        element: CreateWorker,
        permittedRole: [authRole.admin],
        isBackground: true
    },
    {
        path: '/create-worker/add',
        element: CreateWorkerPostEdit,
        permittedRole: [authRole.admin],
        isBackground: true,
        noIndex: true
    },
    {
        key: 89,
        label: 'Отделы',
        icon: <VscFileSubmodule className={'icon'} style={{fontSize: 24, height: '100%'}}/>,
        path: '/module',
        element: Module,
        permittedRole: [authRole.admin],
        isBackground: true
    },
    {
        path: '/module/add',
        element: ModulePostEdit,
        permittedRole: [authRole.admin],
        isBackground: true,
        noIndex: true
    },
    {
        key: 9,
        icon: <UserOutlined className={'icon'} style={{fontSize: 24, height: '100%'}}/>,
        label: 'Профиль',
        path: '/user-profile',
        element: UserProfile,
        permittedRole: [authRole.admin, authRole.user, authRole.boss , authRole.director , authRole.general_director],
        isBackground: false
    },
    {
        key: 900000,
        icon: <GiNewspaper className={'icon'} style={{fontSize: 24, height: '100%'}}/>,
        label: 'Пресс-центр',
        path: '/press-center',
        element: PressCenter,
        permittedRole: [authRole.admin, authRole.user, authRole.boss , authRole.director , authRole.general_director],
        isBackground: false
    },
    {
        key: 12321232312312312,
        icon: <BiSupport className={'icon'} style={{fontSize: 24, height: '100%'}}/>,
        path: '/support',
        label: 'Поддерживать',
        element: Support,
        permittedRole: [authRole.admin, authRole.user, authRole.boss ,  authRole.director , authRole.general_director],
        isBackground: false
    },
];