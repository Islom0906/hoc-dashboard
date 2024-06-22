import React from 'react';

export const authRole = {
  admin:'admin',
  boss: 'boss',
  user: 'user'
}

const Dashboard = React.lazy(() => import('./Dashboard'));
const CalendarTask = React.lazy(() => import('./CalendarTask'));
const Inbox = React.lazy(() => import('./Inbox'));
const MyApplications = React.lazy(() => import('./MyApplications'));
const TaskList = React.lazy(() => import('./TaskList'));
const UserProfile = React.lazy(() => import('./UserProfile'));



export const samplePagesConfigs = [
  { path: '/dashboard', element: Dashboard, permittedRole: ['admin', 'user' , 'boss'] },
  { path: '/user-profile', element: UserProfile, permittedRole: ['admin', 'user'] },
  { path: '/task-list', element: TaskList, permittedRole: ['user'] },
  { path: '/calendar-task', element: CalendarTask, permittedRole: ['admin'] },
  { path: '/inbox', element: Inbox, permittedRole: ['user'] },
  { path: '/my-applications', element: MyApplications, permittedRole: ['boss'] },
];