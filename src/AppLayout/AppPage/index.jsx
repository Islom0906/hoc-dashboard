import {Content} from "antd/es/layout/layout";
import './index.scss'
import {Button, Input, theme} from "antd";
import {UserProfile} from "../../page";

const AppPage = () => {
    const {
        token: { colorBgContainer, borderRadiusLG,contentBg },
    } = theme.useToken();
    return (
        <Content
            style={{
                padding: 30,
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
            <Button type={"primary"}>
                Salom
            </Button>
            <Input placeholder="Basic usage" />
            </div>
        </Content>
    );
};

export default AppPage;