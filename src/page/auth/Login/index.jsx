import {Button, Flex, Form, Input, message, Spin, theme} from "antd";
import {setAuthToken} from "../../../service/auth/axios";
import {useDispatch, useSelector} from "react-redux";
import {authData} from "../../../store/slice/authSlice";
import apiService from "../../../service/apis/api";
import './index.scss'
import {AppLogo} from "../../../components";
import BackgroundContent from "../../../AppLayout/AppPage/BackgrountContent";
import {useNavigate} from "react-router-dom";
import SelectCompany from "./SelectCompany/SelectCompany";
import {MdArrowBackIos} from "react-icons/md";
import {clearCompany} from "../../../store/slice/companySlice";
import {useCallback} from "react";

const Login = () => {
    const dispatch = useDispatch()
    const navigate=useNavigate()
    const {company} = useSelector(state => state.companySlice)
    const {
        token: {mainBg},
    } = theme.useToken();

    const onFinish = useCallback(async (values) => {
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
    return (
        <div
            style={{
                background: mainBg,
            }}
            className={'login--page'}>
            {
                company === null ?
                    <SelectCompany/>:
                    <BackgroundContent>
                        <div className={'login-card'}>
                            <div className={'logo-login'}>
                                <AppLogo/>
                            </div>
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
                                // initialValues={{
                                //     email: 'sirofim012@gmail.com',
                                //     password: 'admin001'
                                // }}
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
                                        <Button type="primary" htmlType="submit" style={{width:'100%'}}>
                                            Вход
                                        </Button>


                                        <Button  type="link" onClick={() => dispatch(clearCompany())}   style={{width:'100%'}} icon={<MdArrowBackIos />}>
                                            Назад
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