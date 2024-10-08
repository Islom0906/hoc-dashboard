import {Button, Flex, Menu} from 'antd';
import Sider from 'antd/es/layout/Sider';
import './index.scss';
import SubMenu from 'antd/es/menu/SubMenu';
import { Link } from 'react-router-dom';
import { samplePagesConfigs} from "../../page/routerPage";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {MenuFoldOutlined, MenuUnfoldOutlined} from "@ant-design/icons";

const AppSidebar = () => {
  const [userRole ,setUserRole] = useState(null)
    const [collapsed, setCollapsed] = useState(false);
  const {data:{user}} = useSelector(state => state.auth)

useEffect(() => {
  if(user) {
  user?.roles.map(item => (
      setUserRole([item.name])
  ))
  }
} , [user])

  const isPermitted = (roles) => roles.some(role => userRole.includes(role));
    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };
  return (
      <>

          <Sider
              width={300}
              breakpoint={'lg'}
              style={{position:'relative'}}
              collapsed={collapsed}
          >
              <Flex style={{height:'100%'}} vertical={true} justify={"center"}>

              <Menu
                  className={'app-aside'}
                  mode="inline"
                  inlineCollapsed={collapsed}
              >
                  {userRole && samplePagesConfigs
                      .filter(menu => isPermitted(menu.permittedRole) && !menu.noIndex)
                      .map((menu) => (
                          menu.items ? (
                              <SubMenu
                                  key={menu.key}
                                  title={<LinkItem icon={menu?.icon} label={menu.label} />}
                              >
                                  <Menu.ItemGroup>
                                      {menu.items
                                          .filter(menuItem => isPermitted(menuItem.permittedRole) && !menuItem.noIndex)
                                          .map((menuItem) => (
                                              <Menu.Item key={menuItem.key}>
                                                  <Link to={`${menuItem.path}`}>
                                                      <LinkItem icon={menuItem?.icon} label={collapsed ? '':menuItem.label} />
                                                  </Link>
                                              </Menu.Item>
                                          ))}
                                  </Menu.ItemGroup>
                              </SubMenu>
                          ) : (
                              <Menu.Item key={menu.key}>
                                  <Link to={`${menu.path}`}>
                                      <LinkItem icon={menu?.icon} label={collapsed ?'':menu.label} />
                                  </Link>
                              </Menu.Item>
                          )
                      ))}
              </Menu>
                  <Button
                      type="primary"
                      onClick={toggleCollapsed}
                      style={{ marginBottom: 16 }}
                  >
                      {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                  </Button>
              </Flex>

          </Sider>
      </>
  );
};
export default AppSidebar;
export const LinkItem = ({icon, label}) => {
  return (
      <Flex gap={20} >
        <span>{icon}</span>
        <span>{label}</span>
      </Flex>
  );
};
