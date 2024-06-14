import './index.scss'
import {Button} from "antd";

const AppHeader = () => {
    return (
        <div className={'ant--header'}>
            <Button type={'primary'}>Send</Button>
        </div>
    );
};

export default AppHeader;