import * as React from 'react';
import { Route, Redirect } from "react-router-dom";
import { isAuthenticated } from "../api/Auth";
import { Layout, Menu } from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
const { Header, Sider, Content } = Layout;

export const MenuHOC = ({ component: Component, ...rest }) => {
    const [collapsed, setCollapse] = React.useState(false);


    return (

        <Route
            {...rest}
            render={props =>
                isAuthenticated() ? (
                    <Layout style={{ minHeight: '100vh' }}>
                        <Sider trigger={null} collapsible collapsed={collapsed}>
                            <div className="logo" />
                            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                                <Menu.Item key="1" icon={<UserOutlined />}>
                                    Мониторинг
                                   </Menu.Item>
                                <Menu.Item key="2" icon={<VideoCameraOutlined />}>
                                    Статистика
                                   </Menu.Item>
                                <Menu.Item key="3" icon={<UploadOutlined />}>
                                    <Link to="/create/point">
                                        <span>Добавать точку</span>
                                    </Link>
                                </Menu.Item>
                            </Menu>
                        </Sider>
                        <Layout className="site-layout">
                            <Header className="site-layout-background" style={{ padding: 0 }}>
                                {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                                    className: 'trigger',
                                    onClick: () => setCollapse(!collapsed),
                                })}
                            </Header>
                            <Content
                                className="site-layout-background"
                                style={{
                                    margin: '24px 16px',
                                    padding: 24,
                                    minHeight: 280,
                                }}
                            >   <Component {...props} />
                            </Content>
                        </Layout>

                    </Layout>
                ) : (
                        <Redirect
                            to={{
                                pathname: "/",
                                state: { from: props.location }
                            }}
                        />
                    )
            }
        />
    )
}

