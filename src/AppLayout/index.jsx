import AppSidebar from "./AppSidebar";
import {ConfigProvider, Layout, theme} from "antd";
import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";
import './index.scss'
import AppPage from "./AppPage";
import {configDark, configLight} from "../constants/theme";
import {useSelector} from "react-redux";
import {Routes, Route} from 'react-router-dom';
import Login from "../page/auth/Login";
import AuthRoutes from "../page/auth/AuthRoutes";
import utc from 'dayjs/plugin/utc';
import dayjs from "dayjs";
import ruRU from "antd/es/locale/ru_RU";

dayjs.extend(utc);
dayjs.locale('ru');

const AppLayout = () => {
    const {systemMode} = useSelector((state) => state.theme)
    const {data: {isAuthenticated}} = useSelector(state => state.auth)

    const {defaultAlgorithm, darkAlgorithm} = theme
    return (
        <ConfigProvider locale={ruRU}
            theme={{
            algorithm: systemMode === 'dark' ? darkAlgorithm : defaultAlgorithm,
            token: systemMode === 'dark' ? configDark : configLight,
        }}>
            <AuthRoutes>
                {
                    !isAuthenticated ?
                        <Routes>
                            <Route path="/login" element={<Login/>}/>
                        </Routes>
                        :
                        <Layout>
                            <AppHeader/>
                            <Layout>
                                <AppSidebar/>
                                <Layout className={'ant--page'}>
                                    <AppPage/>
                                    <AppFooter/>
                                </Layout>
                            </Layout>
                        </Layout>
                }
            </AuthRoutes>
        </ConfigProvider>
    );
};

export default AppLayout;