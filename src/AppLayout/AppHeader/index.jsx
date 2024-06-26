import './index.scss'
import {BellOutlined, MoonOutlined, SunOutlined, UserOutlined} from "@ant-design/icons";
import {Badge, Button, Dropdown} from "antd";
import logo from './evolution-logo1.svg'
import {Header} from "antd/es/layout/layout";
import {useDispatch, useSelector} from "react-redux";
import {changeThemeMode} from "../../store/slice/themeSlice";



const AppHeader = () => {
    const {systemMode}=useSelector(state => state.theme)
    const dispatch=useDispatch()
    const isDarkHandle=()=>{
        dispatch(changeThemeMode())
    }
    return (
        <Header className={'app-header'}>
            <img src={logo} className={'logo'} alt={'logo'}/>
          <div className={'content'}>
            <Badge dot className={'notification'} >
              <BellOutlined className={'icon'} />
            </Badge>
              <div onClick={isDarkHandle}>
                  {
                      systemMode==='light'
                          ?
            <MoonOutlined className={'icon'} />:
                          <SunOutlined className={'icon'}/>
                  }
              </div>
            <UserAccount  />
          </div>
        </Header>
    );
};

export default AppHeader;

export  const  UserAccount = ({ src})=> {
    const logout=()=>{
        console.log('render')
    }
    const items = [
        {
            key: '1',
            label: (
                <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
                    changle
                </a>
            ),
        },
        {
            key: '2',
            label: (
                <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
                    edit
                </a>
            ),
        },
        {
            key: '3',
            label: (
                <div onClick={logout}>
                    quit
                </div>
            ),
        },
    ];


  return(
      <Dropdown menu={{ items }} placement="topRight" className={'userDropdown'} arrow>
        <Button>
          {
            src ?
          <img src={src} alt="icon"/>
                :
                <UserOutlined className={'icon'} />
          }
          <span className={'content'}>
            <p className={'title'}>admin user</p>
            <p>system manager</p>
          </span>

        </Button>
      </Dropdown>
  )
}