import AppSidebar from "./AppSidebar";
import {Layout} from "antd";
import AppHeader from "./AppHeader";
import AppPage from "./AppPage";
import AppFooter from "./AppFooter";

const AppLayout = () => {

    return (
        <Layout>
            <AppSidebar/>
            <Layout>
                <AppHeader></AppHeader>
                <AppPage></AppPage>
                <AppFooter></AppFooter>
            </Layout>
        </Layout>
    );
};

export default AppLayout;