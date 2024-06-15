import {Content} from "antd/es/layout/layout";
import './index.scss'
import {Button, Input} from "antd";
import {UserProfile} from "../../page";

const AppPage = () => {
    return (
        <Content>
            <UserProfile/>
            <Button type={"primary"}>
                Salom
            </Button>
            <Input placeholder="Basic usage" />
        </Content>
    );
};

export default AppPage;