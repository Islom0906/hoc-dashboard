import React from 'react';

export const authRole = {
  admin:['user' , 'admin'],
  boss: ['user' , 'boss'],
  user: ['user']
}

const Dashboard = React.lazy(() => import('./Dashboard'));
const CalendarTask = React.lazy(() => import('./CalendarTask'));
const Inbox = React.lazy(() => import('./Inbox'));
const MyApplications = React.lazy(() => import('./MyApplications'));
const TaskList = React.lazy(() => import('./TaskList'));
const UserProfile = React.lazy(() => import('./UserProfile'));



export const samplePagesConfigs = [
  {
    permittedRole: authRole.user,
    path: '/dashboard',
    element: <Dashboard/>,
  },
  {
    permittedRole: authRole.admin,
    path: '/calendar',
    element: <CalendarTask/>,
  },
];
