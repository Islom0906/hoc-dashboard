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
import {BrowserRouter as Router} from 'react-router-dom';

const AppLayout = () => {
    const {systemMode} = useSelector((state) => state.theme)
    const {data:{isAuthenticated}}=useSelector(state => state.auth)

    const {defaultAlgorithm, darkAlgorithm} = theme
    return (
        <ConfigProvider theme={{
            algorithm: systemMode === 'dark' ? darkAlgorithm : defaultAlgorithm,
            token: systemMode === 'dark' ? configDark : configLight,
        }}>
          <Router>
                {
                    !isAuthenticated ?
                        <Routes>
                            <Route path="/" element={<Login/>}/>
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

            </Router>


        </ConfigProvider>
    );
};

export default AppLayout;