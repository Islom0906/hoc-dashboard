import {Col, Menu, Row, theme} from "antd";
import Personal from "./personal";
import './index.scss'
import {FaUser} from "react-icons/fa";
import {RiLockPasswordFill} from "react-icons/ri";
import {useState} from "react";
import ChangePassword from "./ChangePassword";

const UserProfile = () => {
    const [checkInfo, setCheckInfo] = useState('personal')

    const handleMenu = (key) => {
        setCheckInfo(key)
    }

    const {
        token: {contentBg},
    } = theme.useToken();
    return (
        <Row gutter={30}>
            <Col span={8}>
                <div className={'card-personal'} style={{backgroundColor: contentBg}}>
                    <Menu
                        mode="inline"

                        selectedKeys={[checkInfo]}
                        style={{height: '100%', borderRight: 0}}
                        onClick={({key}) => handleMenu(key)}
                    >
                        <Menu.Item key="personal" icon={<FaUser/>}>Личная информация</Menu.Item>
                        <Menu.Item key="password" icon={<RiLockPasswordFill/>}>Пароль</Menu.Item>
                    </Menu>

                </div>
            </Col>
            <Col span={16}>
                <div className={'card-personal'} style={{backgroundColor: contentBg}}>
                    {
                        checkInfo === 'personal' ?
                            <Personal/> :
                            <ChangePassword setCheckInfo={setCheckInfo}/>
                    }

                </div>
            </Col>
        </Row>
    );
};

export default UserProfile;