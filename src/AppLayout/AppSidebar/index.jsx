import { Flex, Menu } from 'antd';
import Sider from 'antd/es/layout/Sider';
import './index.scss';
import SubMenu from 'antd/es/menu/SubMenu';
import { Link } from 'react-router-dom';
import { samplePagesConfigs} from "../../page/routerPage";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import EHOC from './EHOC.png'

const AppSidebar = () => {
  const [userRole ,setUserRole] = useState(null)
  const {data:{user}} = useSelector(state => state.auth)

useEffect(() => {
  if(user) {
  user?.roles.map(item => (
      setUserRole([item.name])
  ))
  }
} , [user])

  const isPermitted = (roles) => roles.some(role => userRole.includes(role));

  return (
      <Sider width={300} breakpoint={'lg'} style={{position:'relative'}}>
        <Menu className={'app-aside'} mode="inline" >
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
                                      <LinkItem icon={menuItem?.icon} label={menuItem.label} />
                                    </Link>
                                  </Menu.Item>
                              ))}
                        </Menu.ItemGroup>
                      </SubMenu>
                  ) : (
                      <Menu.Item key={menu.key}>
                        <Link to={`${menu.path}`}>
                          <LinkItem icon={menu?.icon} label={menu.label} />
                        </Link>
                      </Menu.Item>
                  )
              ))}
        </Menu>
        <Flex style={{position:"absolute" , bottom:'10px'  ,left:'50%' , transform:'translateX(-50%)'}}>
          <img
              src={EHOC}
              style={{width: '150px', height: '70px', objectFit: "contain" , background:"#fff30"}}
          />
        </Flex>

      </Sider>
  );
};

export default AppSidebar;

export const LinkItem = ({icon, label}) => {
  return (
      <Flex gap={25} >
        <span>{icon}</span>
        <span>{label}</span>
      </Flex>
  );
};
