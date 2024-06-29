import {Content} from "antd/es/layout/layout";
import './index.scss'
import { Routes, Route} from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import {samplePagesConfigs} from "../../page/routerPage";

const AppPage = () => {
    console.log('render page')


    return (
        <Content
            style={{
                padding: 30,
                overflowY: "scroll"
            }}
        >
            <Routes>
                {samplePagesConfigs.map((route, index) => (
                    <Route
                        key={index}
                        path={route.path}
                        element={
                            <PrivateRoute
                                component={route.element}
                                isBackground={route.isBackground}
                                permittedRoles={route.permittedRole}
                            />
                        }
                    />
                ))}
                <Route path="*" element={<div>Salom</div>}/>
            </Routes>
        </Content>
    );
};

export default AppPage;