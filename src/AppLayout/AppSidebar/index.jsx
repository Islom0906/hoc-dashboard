import { Button, Flex, Menu } from 'antd';
import Sider from 'antd/es/layout/Sider';
import './index.scss';
import { Link } from 'react-router-dom';
import { samplePagesConfigs } from "../../page/routerPage";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { BsBoxArrowInLeft, BsBoxArrowInRight } from "react-icons/bs";

const AppSidebar = () => {
    const [userRole, setUserRole] = useState(null);
    const [collapsed, setCollapsed] = useState(false);
    const { data: { user } } = useSelector(state => state.auth);

    useEffect(() => {
        if (user) {
            const roles = user.roles.map(item => item.role.name);
            setUserRole(roles);
        }
    }, [user]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 992) {
                setCollapsed(true);
            } else {
                setCollapsed(false);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const isPermitted = (roles) => roles.some(role => userRole.includes(role));
    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    const menuItems = userRole ? samplePagesConfigs.filter(menu => isPermitted(menu.permittedRole) && !menu.noIndex).map((menu) => {
            if (menu.items) {
                return {
                    key: menu.key,
                    label: <LinkItem icon={menu.icon} label={menu.label} />,
                    children: menu.items
                        .filter(menuItem => isPermitted(menuItem.permittedRole) && !menuItem.noIndex)
                        .map((menuItem) => ({
                            key: menuItem.key,
                            label: (
                                <Link to={menuItem.path}>
                                    <LinkItem icon={menuItem.icon} label={menuItem.label} />
                                </Link>
                            ),
                        })),
                };
            }
            return {
                key: menu.key,
                label: (
                    <Link to={menu.path}>
                        <LinkItem icon={menu.icon} label={menu.label} />
                    </Link>
                ),
            };
        }) : [];

    return (
        <>
            <Sider
                width={300}
                collapsedWidth={60}
                breakpoint={'lg'}
                style={{ position: 'relative' }}
                collapsed={collapsed}
            >
                <Flex style={{ height: '100%' }} vertical={true} justify={"center"}>
                    <Menu
                        className="app-aside"
                        mode="inline"
                        items={menuItems}
                    />
                    <Button
                        icon={collapsed ? <BsBoxArrowInRight style={{ fontSize: 24, height: '100%' }} /> :
                            <BsBoxArrowInLeft style={{ fontSize: 24, height: '100%' }} />}
                        onClick={toggleCollapsed}
                        style={{ marginBottom: 16, width: '100%', border: 0 }}
                        variant="text"
                    >
                        {!collapsed && 'Закрыть '}
                    </Button>
                </Flex>
            </Sider>
        </>
    );
};

export default AppSidebar;

export const LinkItem = ({ icon, label }) => {
    return (
        <Flex gap={20}>
            <span>{icon}</span>
            {label && <span className="link-label">{label}</span>}
        </Flex>
    );
};
