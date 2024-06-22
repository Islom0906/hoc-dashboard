import {Content} from "antd/es/layout/layout";
import './index.scss'
import {theme} from "antd";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import {samplePagesConfigs} from "../../page/routerPage";

const AppPage = () => {
    const {
        token: { colorBgContainer, borderRadiusLG,contentBg },
    } = theme.useToken();
    return (
        <Content
            style={{
                padding: 30,
                overflowY:"scroll"
            }}
        >
            <div
                style={{
                    padding:40,
                    minHeight: 360,
                    background: contentBg,
                    borderRadius: borderRadiusLG,
                }}
            >
              <Router>
                <Routes>
                  {samplePagesConfigs.map((route, index) => (
                      <Route
                          key={index}
                          path={route.path}
                          element={
                            <PrivateRoute
                                component={route.element}
                                permittedRoles={route.permittedRoles}
                            />
                          }
                      />
                  ))}
                  <Route path="/" element={<div>Home Page</div>} />
                  <Route path="*" element={<div>404 Not Found</div>} />
                </Routes>
              </Router>

            </div>
        </Content>
    );
};

export default AppPage;



{/*<UserProfile/>*/}
{/*<TaskList/>*/}
{/*<CalendarTask />*/}
{/*<Inbox />*/}
{/*<MyApplications />*/}

// import {UserProfile, TaskList, CalendarTask, Inbox, MyApplications} from "../../page";
