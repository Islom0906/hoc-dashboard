import React, { useState } from 'react';
import { Menu } from 'antd';
import Sider from "antd/es/layout/Sider";
import items from '../../page/sidebarConfig'
import './index.scss'
const AppSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const getLevelKeys = (items1) => {
    const key = {};
    const func = (items2, level = 1) => {
      items2.forEach((item) => {
        if (item.key) {
          key[item.key] = level;
        }
        if (item.children) {
          func(item.children, level + 1);
        }
      });
    };
    func(items1);
    return key;
  }
  const levelKeys = getLevelKeys(items);
  const [stateOpenKeys, setStateOpenKeys] = useState(['2', '23']);
  const onOpenChange = (openKeys) => {
    const currentOpenKey = openKeys.find((key) => stateOpenKeys.indexOf(key) === -1);
    // open
    if (currentOpenKey !== undefined) {
      const repeatIndex = openKeys
          .filter((key) => key !== currentOpenKey)
          .findIndex((key) => levelKeys[key] === levelKeys[currentOpenKey]);
      setStateOpenKeys(
          openKeys
              // remove repeat key
              .filter((_, index) => index !== repeatIndex)
              // remove current level all child
              .filter((key) => levelKeys[key] <= levelKeys[currentOpenKey]),
      );
    } else {
      // close
      setStateOpenKeys(openKeys);
    }
  };
  return (
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <Menu
            className={'app-aside'}
            theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items}
            openKeys={stateOpenKeys}
            onOpenChange={onOpenChange}

        />
      </Sider>
  );
};

export default AppSidebar;