import {Content} from "antd/es/layout/layout";
import './index.scss'
import {theme} from "antd";
import {UserProfile, TaskList, CalendarTask} from "../../page";

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

                <UserProfile/>
                <TaskList/>
                <CalendarTask />
            </div>
        </Content>
    );
};

export default AppPage;