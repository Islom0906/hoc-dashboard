import './index.scss'
import {SunOutlined, UserOutlined} from "@ant-design/icons";
import {Avatar, Button, Dropdown, Flex} from "antd";
import {Header} from "antd/es/layout/layout";
import {useDispatch, useSelector} from "react-redux";
import {changeThemeMode} from "../../store/slice/themeSlice";
import {authData} from "../../store/slice/authSlice";
import {useNavigate} from "react-router-dom";
import {BsMoon} from "react-icons/bs";
import useBreakpoint from "antd/es/grid/hooks/useBreakpoint";

const AppHeader = () => {
  const {systemMode}=useSelector(state => state.theme)
  const {data:{user}}=useSelector(state => state.auth)

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
          <Flex style={{width:100 ,height:30 }} align={"center"} justify={"center"}>
              {
                systemMode === 'light' ?
                  <img className={'logo'}
                      src={`${process.env.REACT_APP_LOGO_API_URL}logo-light.png`}
                      style={{width:'100%', height:'100%', objectFit: "contain"}}
                  /> :
                  <img
                      className={'logo'}
                      src={`${process.env.REACT_APP_LOGO_API_URL}logo-dark.png`}
                      style={{width:'100%', height:'100%', objectFit: "contain"}}
                  />
            }
          </Flex>
          <Flex align={"center"} gap={10}>
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
    const screens = useBreakpoint();
    const chartHeight = screens.md;
    const items = [
        // {
        //     key: '1',
        //     label: (
        //         <Link  rel="noopener noreferrer" to="/profile">
        //             Редактировать
        //         </Link>
        //     ),
        // },
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
        <Button type={'dashed'}>
          {
            user?.image ?
                <Avatar icon={<img
                    src={user?.image}
                    style={{width: '100%', height: '100%', objectFit: "contain" , flexShrink:0}}
                /> } size={'small'} key={user?.id}/>
            :
            <UserOutlined className={'icon'} />
          }
            {
                chartHeight &&
              <span className={'content'} style={{padding:'10 0'}}>
                <Flex className={'title'} gap={5} style={{fontSize:12}}><span>{user.full_name}</span></Flex>
                <Flex className={'title'} gap={5} style={{fontSize:9}}><span>{user.roles[0].position}</span></Flex>
              </span>
            }
        </Button>
      </Dropdown>
  )
}