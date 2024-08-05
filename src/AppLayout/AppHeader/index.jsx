import './index.scss'
import { MoonOutlined, SunOutlined, UserOutlined} from "@ant-design/icons";
import { Button, Dropdown, Flex} from "antd";
import logoLight from './evolution-logo1.svg'
import logoDark from './evolution-logo1-dark.svg'
import {Header} from "antd/es/layout/layout";
import {useDispatch, useSelector} from "react-redux";
import {changeThemeMode} from "../../store/slice/themeSlice";
import {authData} from "../../store/slice/authSlice";
import {Link, useNavigate} from "react-router-dom";
import {BsMoon} from "react-icons/bs";



const AppHeader = () => {
  const {systemMode}=useSelector(state => state.theme)
  const {data:{user}}=useSelector(state => state.auth)
  const {company} = useSelector(state => state.companySlice)

    const dispatch=useDispatch()
  const navigate=useNavigate()
    const isDarkHandle=()=>{
        dispatch(changeThemeMode())
    }

  const logOut =() => {
    localStorage.removeItem('token')
    localStorage.removeItem('refToken')
    dispatch(authData({
      user: null,
      isLoading: false,
      isAuthenticated: false
    }))
    navigate('/login')
  }
    return (
        <Header className={'app-header'}>
          <Flex style={{width:'250px' ,height:70 }} align={"center"} justify={"center"}>
              {
                  systemMode === 'light' ?
                      <img src={company?.image_light} className={'logo'} alt={'logo'}
                           style={{width: '100%', height: '100%', objectFit: 'contain'}}/>
                      :
                      <img src={company?.image_dark} className={'logo'} alt={'logo'}
                           style={{width: '100%', height: '100%', objectFit: 'contain'}}/>
              }
          </Flex>
            <Flex align={"center"} gap={10} >
                {/*<Badge dot className={'notification'} >*/}
                {/*  <BellOutlined className={'icon'} />*/}
            {/*</Badge>*/}
              <Button onClick={isDarkHandle} type={'dashed'}>
                  {
                      systemMode==='light'?
                          <BsMoon className={'icon'} style={{fontSize:18}} />:
                          <SunOutlined className={'icon'} style={{fontSize:18}}/>
                  }
              </Button>
            <UserAccount user={user} logOut={logOut}  />
          </Flex>
        </Header>
    );
};

export default AppHeader;

export  const  UserAccount = ({ user , logOut})=> {


    const items = [
        {
            key: '1',
            label: (
                <Link  rel="noopener noreferrer" to="/">
                    Редактировать
                </Link>
            ),
        },
        {
            key: '2',
            label: (
                <div onClick={logOut}>
                    Выход
                </div>
            ),
        },
    ];


  return(
      <Dropdown menu={{ items }} placement="topRight" className={'userDropdown'} arrow>
        <Button>
          {
            user?.image ?
          <img src={user?.image} alt="icon"/>
                :
                <UserOutlined className={'icon'} />
          }
          <span className={'content'}>
            <Flex className={'title'} gap={5}><span>{user.first_name}</span> <span>{user.last_name}</span></Flex>
          </span>

        </Button>
      </Dropdown>
  )
}