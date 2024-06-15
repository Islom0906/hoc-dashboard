import AppSidebar from "./AppSidebar";
import {Layout} from "antd";
import AppHeader from "./AppHeader";
import AppPage from "./AppPage";
import AppFooter from "./AppFooter";
import './index.scss'

const AppLayout = () => {

    return (
        <Layout>
            <AppHeader/>
            <Layout>
                <AppSidebar/>
                <Layout className={'ant--page'}>
                    <AppPage></AppPage>
                    <AppFooter></AppFooter>
                </Layout>

            </Layout>
        </Layout>
    );
};

export default AppLayout;