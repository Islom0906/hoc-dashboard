import {Content} from "antd/es/layout/layout";
import './index.scss'
import {Button, Input} from "antd";

const AppPage = () => {
    return (
        <Content>
            <Button type={"primary"}>
                Salom
            </Button>
            <Input placeholder="Basic usage" />
        </Content>
    );
};

export default AppPage;