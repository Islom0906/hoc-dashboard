import {Button, Col, Flex, Form, Input, message, Row, theme} from "antd";
import {setAuthToken} from "../../../service/auth/axios";
import {useDispatch, useSelector} from "react-redux";
import {authData} from "../../../store/slice/authSlice";
import apiService from "../../../service/apis/api";
import './index.scss'
import {useNavigate} from "react-router-dom";
import {useCallback, useEffect} from "react";
import {BsMoon} from "react-icons/bs";
import {SunOutlined} from "@ant-design/icons";
import {changeThemeMode} from "../../../store/slice/themeSlice";
import {selectCompany} from "../../../store/slice/companySlice";
import BackgroundContent from "../../../AppLayout/AppPage/BackgrountContent";
const Login = () => {
    const {data:{isLoading}}=useSelector(state => state.auth)
    const dispatch = useDispatch()
    const navigate=useNavigate()
    const {systemMode}=useSelector(state => state.theme)
    const isDarkHandle=()=>{
        dispatch(changeThemeMode())
    }
    const {
        token: {mainBg , colorPrimary},
    } = theme.useToken();

    const onFinish = useCallback(async (values) => {
        dispatch(authData({
            user: null,
            isLoading: true,
            isAuthenticated: false,
        }));
        if (localStorage.getItem('token')) {
            localStorage.removeItem('refToken');
        }
        try {
            const data = await apiService.postData('/users/user/token/', values);
            localStorage.setItem('token', data?.access);
            localStorage.setItem('refToken', data?.refresh);
            setAuthToken(data.access);
            const userInfo = await apiService.getData('/users/user/me');
            dispatch(authData({
                user: userInfo,
                isLoading: false,
                isAuthenticated: true,
            }));
            dispatch(selectCompany(userInfo?.roles[0].company?.id))

            navigate('/');
            message.success('Успешно');
        } catch (error) {
            message.error(error?.response?.data?.detail);
            dispatch(authData({
                user: null,
                isLoading: false,
                isAuthenticated: false,
            }));
        }
    }, [dispatch, navigate]);

    useEffect(() => {
        if(user) {

        }
    } , [user])

    return (
        <div
            style={{
                background: mainBg,
            }}
            className={'login--page'} >
            {<BackgroundContent>
                        <div className={'login-card'}>
                            {
                                systemMode === 'light' ?
                                    <img
                                        src={`${process.env.REACT_APP_LOGO_API_URL}logo-light.png`}
                                        style={{width: '150px', height: '70px', objectFit: "contain", background: "#fff30"}}
                                    /> :
                                    <img
                                        src={`${process.env.REACT_APP_LOGO_API_URL}logo-dark.png`}
                                        style={{width: '150px', height: '70px', objectFit: "contain", background: "#fff30"}}
                                    />
                            }
                            <Form
                                name="basic"
                                labelCol={{
                                    span: 24,
                                }}
                                wrapperCol={{
                                    span: 24,
                                }}
                                style={{
                                    maxWidth: 600,
                                }}
                                initialValues={{
                                    email: '',
                                    password: ''
                                }}
                                onFinish={onFinish}
                                autoComplete="off"
                            >
                                <Form.Item
                                    label="Электронная почта"
                                    name="email"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please put your email!',
                                        },
                                    ]}
                                >
                                    <Input placeholder={'Введите адрес электронной почты'}/>
                                </Form.Item>

                                <Form.Item
                                    label="Пароль"
                                    name="password"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please put your password!',
                                        },
                                    ]}
                                >
                                    <Input.Password placeholder={'Напишите свой пароль'}/>
                                </Form.Item>
                                <Form.Item
                                    wrapperCol={{
                                        span: 24,
                                    }}
                                >
                                    <Row gutter={10} justify={'center'}>
                                        <Col span={20}>
                                        <Button type="primary" htmlType="submit" style={{width:'100%'}} disabled={isLoading}>
                                            Вход
                                        </Button>
                                        </Col>
                                        <Col span={4}>
                                            <Button onClick={isDarkHandle} type="primary">
                                                {
                                                    systemMode==='light'?
                                                        <BsMoon className={'icon'} style={{fontSize:18}} />:
                                                        <SunOutlined className={'icon'} style={{fontSize:18}}/>
                                                }
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form.Item>
                            </Form>
                        </div>
                </BackgroundContent>
            }
        </div>

    );
};

export default Login;