import React, {useEffect} from 'react';
import {Button, Col,  Form, Row, Space, Spin} from "antd";
import {FormInput} from "../../components";
import { SetInitialValue} from "../../hooks";
import { useEditQuery} from "../../service/query/Queries";

const initialValueForm = {
    old_password: "",
    new_password: ""
};

const ChangePassword = ({setCheckInfo}) => {
    const [form] = Form.useForm();
    const {
        mutate: putChangePassword,
        isLoading: putChangePasswordLoading,
        isSuccess: putChangePasswordSuccess
    } = useEditQuery()


    useEffect(() => {
        if  (putChangePasswordSuccess){
            setCheckInfo('personal')
        }
    }, [putChangePasswordSuccess]);

    SetInitialValue(form,initialValueForm)

    const onFinish = (value) => {

        const data = {
            old_password: value?.old_password,
            new_password: value?.new_password,
        }

        putChangePassword({url: '/users/change-password', data, id: ''})

    }

    return (
        <Spin spinning={putChangePasswordLoading}>

            <Space direction={"vertical"} style={{width:'100%'}}  >
                <h1>
                    Установить новый пароль
                </h1>
                <Form
                    form={form}
                    name="basic"
                    labelCol={{
                        span: 24
                    }}
                    wrapperCol={{
                        span: 24
                    }}
                    style={{
                        maxWidth: "100%"
                    }}
                    initialValues={initialValueForm}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Row gutter={20}>
                        <Col span={12}>
                            <FormInput
                                required={true}
                                required_text={'Укажите старый пароль'}
                                label={'Старый пароль'}
                                name={'old_password'}
                            />
                        </Col>
                        <Col span={12}>
                            <FormInput
                                required={true}
                                required_text={'Укажите новый пароль'}
                                label={'Новый пароль'}
                                name={'new_password'}
                            />
                        </Col>

                    </Row>
                    <Button type="primary" htmlType="submit" style={{width: "100%"}}>
                        Редактировать
                    </Button>
                </Form>

            </Space>
        </Spin>
    );
};

export default ChangePassword;