import AppSidebar from "./AppSidebar";
import {Layout} from "antd";
import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";
import './index.scss'
import AppPage from "./AppPage";

const AppLayout = () => {

    return (
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
    );
};

export default AppLayout;