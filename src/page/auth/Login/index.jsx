import {Button, Form, Input} from "antd";
import {setAuthToken} from "../../../service/auth/axios";
import {useDispatch} from "react-redux";
import {authData} from "../../../store/slice/authSlice";
import apiService from "../../../service/apis/api";

const Login = () => {
    const dispatch = useDispatch()



    const onFinish = async (values) => {

        try {
            const data = await apiService.postData('/users/user/token/', values)
            localStorage.setItem('token', data?.access)
            localStorage.setItem('refToken', data?.refresh)
            setAuthToken(data.access)
            const userInfo=await apiService.getData('/users/user/me')
            dispatch(authData({
                user: userInfo,
                isLoading: false,
                isAuthenticated: true,
            }))
        } catch (error) {
            dispatch(authData({
                user: null,
                isLoading: false,
                isAuthenticated: false,
            }))
        }

    };


    return (
        <Form
            name="basic"
            labelCol={{
                span: 8,
            }}
            wrapperCol={{
                span: 16,
            }}
            style={{
                maxWidth: 600,
            }}
            initialValues={{
                email: 'baxtiyorovjavlon8@gmail.com',
                password: 'javlon001'
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
                <Input/>
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
                <Input.Password/>
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
    );
};

export default Login;