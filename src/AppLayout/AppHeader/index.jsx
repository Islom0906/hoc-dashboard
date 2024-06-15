import './index.scss'
import {BellOutlined, MoonOutlined, UserOutlined} from "@ant-design/icons";
import {Badge, Button, Dropdown} from "antd";
import logo from './evolution-logo1.svg'
import {Header} from "antd/es/layout/layout";

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
        <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
         quit
        </a>
    ),
  },
];

const AppHeader = () => {
    const isDarkHandle=()=>{}
    return (
        <Header className={'app-header'}>
            <img src={logo} className={'logo'} alt={'logo'}/>
          <div className={'content'}>
            <Badge dot className={'notification'} >
              <BellOutlined className={'icon'} />
            </Badge>
            <MoonOutlined className={'icon'} />
            <UserAccount items={items} />
          </div>
        </Header>
    );
};

export default AppHeader;

export  const  UserAccount = ({items , src})=> {
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