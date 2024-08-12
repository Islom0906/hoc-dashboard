import {Button, Flex, Form, Input, message, theme , Typography} from "antd";
import {setAuthToken} from "../../../service/auth/axios";
import {useDispatch, useSelector} from "react-redux";
import {authData} from "../../../store/slice/authSlice";
import apiService from "../../../service/apis/api";
import './index.scss'
import {AppLogo} from "../../../components";
import BackgroundContent from "../../../AppLayout/AppPage/BackgrountContent";
import {useNavigate} from "react-router-dom";
import {MdArrowBackIos} from "react-icons/md";
import {clearCompany} from "../../../store/slice/companySlice";
import {useCallback} from "react";
const {Title} = Typography

const Login = () => {
    const {data:{isLoading}}=useSelector(state => state.auth)
    const dispatch = useDispatch()
    const navigate=useNavigate()
    const {
        token: {mainBg},
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


    console.log(isLoading)
    return (
        <div
            style={{
                background: mainBg,
            }}
            className={'login--page'}>
            {
                    <BackgroundContent>
                        <div className={'login-card'}>
                            {/*<div className={'logo-login'}>*/}
                            {/*    <AppLogo/>*/}
                            {/*</div>*/}
                            <Title level={1}>
                                HOC
                            </Title>
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
                                    <Flex gap={20} justify={'center'}>
                                        <Button type="primary" htmlType="submit" style={{width:'100%'}} disabled={isLoading}>
                                            Вход
                                        </Button>
                                    </Flex>
                                </Form.Item>
                            </Form>
                        </div>
                    </BackgroundContent>
            }
        </div>

    );
};

export default Login;