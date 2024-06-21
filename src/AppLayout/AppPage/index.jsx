import {Content} from "antd/es/layout/layout";
import './index.scss'
import {UserProfile, TaskList, CalendarTask, Inbox, MyApplications} from "../../page";
import BackgroundContent from "./BackgrountContent";
import Login from "../../page/auth/Login";

const AppPage = () => {

    return (
        <Content
            style={{
                padding: 30,
                overflowY:"scroll"
            }}
        >
            <BackgroundContent>
                <CalendarTask />

            </BackgroundContent>
                <Login/>
            <BackgroundContent>
                <UserProfile/>
            </BackgroundContent>
                <TaskList/>
                <Inbox />
                <MyApplications />
        </Content>
    );
};

export default AppPage;