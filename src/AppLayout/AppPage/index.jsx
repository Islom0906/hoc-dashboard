import {Content} from "antd/es/layout/layout";
import './index.scss'
import {theme} from "antd";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import {samplePagesConfigs} from "../../page/routerPage";
import {UserProfile, TaskList, CalendarTask, Inbox, MyApplications} from "../../page";
import BackgroundContent from "./BackgrountContent";
import Login from "../../page/auth/Login";

const AppPage = () => {


  console.log(samplePagesConfigs)
    return (
        <Content
            style={{
              padding: 30,
              overflowY:"scroll"
            }}
        >
            {/*<BackgroundContent>*/}
            {/*    <CalendarTask />*/}
            {/*</BackgroundContent>*/}
            {/*    <Login/>*/}
            {/*<BackgroundContent>*/}
            {/*    <UserProfile/>*/}
            {/*</BackgroundContent>*/}
            {/*    <TaskList/>*/}
            {/*    <Inbox />*/}
            {/*    <MyApplications />*/}

          <Router>
            <Routes>
              {samplePagesConfigs.map((route, index) => (
                  <Route
                      key={index}
                      path={route.path}
                      element={
                        <PrivateRoute
                            component={route.element}
                            permittedRoles={route.permittedRole}
                        />
                      }
                  />
              ))}
              <Route path="/" element={<div>Home Page</div>} />
              <Route path="*" element={<Login/>} />
            </Routes>
          </Router>
        </Content>
    );
};

export default AppPage;