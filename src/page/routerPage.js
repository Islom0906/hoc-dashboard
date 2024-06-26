import React from 'react';
import Dashboard from './Dashboard'
import Inbox from './Inbox'
import MyApplications from './MyApplications'
import TaskList from './TaskList'
import UserProfile from './UserProfile'
import CalendarTask from './CalendarTask'

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
        path: '/dashboard',
        element: Dashboard,
        permittedRole: ['admin', 'user', 'boss']},
    {
        path: '/user-profile',
        element: UserProfile,
        permittedRole: ['admin', 'user',"boss"]},
    {
        path: '/task-list',
        element: TaskList,
        permittedRole: ['user',"boss"]},
    {
        path: '/calendar-task',
        element: CalendarTask,
        permittedRole: ['admin',"boss"]},
    {
        path: '/inbox',
        element: Inbox,
        permittedRole: ['user',"boss"]},
    {
        path: '/my-applications',
        element: MyApplications,
        permittedRole: ['boss']},
];