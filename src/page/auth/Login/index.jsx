import {Button, Form, Input, message, theme} from "antd";
import {setAuthToken} from "../../../service/auth/axios";
import {useDispatch} from "react-redux";
import {authData} from "../../../store/slice/authSlice";
import apiService from "../../../service/apis/api";
import './index.scss'
import {AppLogo} from "../../../components";
import BackgroundContent from "../../../AppLayout/AppPage/BackgrountContent";
import {useNavigate} from "react-router-dom";

const Login = () => {
    const dispatch = useDispatch()
    const navigate=useNavigate()
    const {
        token: {mainBg},
    } = theme.useToken();

    const onFinish = async (values) => {
        if (localStorage.getItem('token')) {
            localStorage.removeItem('refToken')
        }
        try {
            const data = await apiService.postData('/users/user/token/', values)
            localStorage.setItem('token', data?.access)
            localStorage.setItem('refToken', data?.refresh)
            setAuthToken(data.access)

            const userInfo = await apiService.getData('/users/user/me')
            dispatch(authData({
                user: userInfo,
                isLoading: false,
                isAuthenticated: true,
            }))
            navigate('/')
            message.success('Успешно')
        } catch (error) {
            console.log(error.response)
            message.error(error?.response?.data?.detail)
            dispatch(authData({
                user: null,
                isLoading: false,
                isAuthenticated: false,
            }))
        }

    };


    return (
        <div
            style={{
                background: mainBg,
            }}
            className={'login--page'}>

            <BackgroundContent
            >
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
                    initialValues={{
                        email: 'sirofim012@gmail.com',
                        password: 'admin001'
                    }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your email!',
                            },
                        ]}
                    >
                        <Input placeholder={'Enter email'}/>
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                        ]}
                    >
                        <Input.Password placeholder={'Enter password'}/>
                    </Form.Item>


                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
                </div>

            </BackgroundContent>
        </div>

    );
};

export default Login;