import AppSidebar from "./AppSidebar";
import {ConfigProvider, Layout, theme} from "antd";
import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";
import './index.scss'
import AppPage from "./AppPage";
import {configDark, configLight} from "../constants/theme";
import {useSelector} from "react-redux";

const AppLayout = () => {
    const {systemMode} = useSelector((state) => state.theme)


    const {defaultAlgorithm, darkAlgorithm} = theme
    return (
        <ConfigProvider theme={{
            algorithm: systemMode === 'dark' ? darkAlgorithm : defaultAlgorithm,
            token: systemMode === 'dark' ? configDark : configLight,
        }}>
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
        </ConfigProvider>
    );
};

export default AppLayout;