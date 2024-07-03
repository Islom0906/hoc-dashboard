import React, {useEffect, useMemo, useState} from 'react';
import {Button, Col, DatePicker, Form, message, Row, Select, Upload} from "antd";
import {AppLoader, FormInput, FormInputEmail, FormInputNumber} from "../../components";
import {useSelector} from "react-redux";
import {useMutation, useQuery} from "react-query";
import apiService from "../../service/apis/api";
import moment from "moment";
import {EditGetById, onPreviewImage, SetInitialValue, SuccessCreateAndEdit} from "../../hooks";

const initialValueForm = {
    name: "",
    company: null,

};

const ModulePostEdit = () => {
    const [form] = Form.useForm();
    const {editId} = useSelector(state => state.query)

    // query-company-get
    const {data: companyData, refetch: companyFetch} = useQuery(
        'get-company',
        () => apiService.getData('/users/companies'),
        {
            enabled: false,
        },
    );


    // query-create-worker
    const {
        mutate: postModuleMutate,

        isLoading: postModuleLoading,
        isSuccess: postModuleSuccess,
    } = useMutation(({url, data}) => apiService.postData(url, data), {
        onSuccess: () => {

            message.success('Успешно')
        },
        onError: (error) => {
            for (let obj in error.response.data) {
                message.error(`${obj}: ${error.response.data[obj][0]}`)
            }
        }
    });

    // query-edit
    const {
        isLoading: editCreateWorkerLoading,
        data: editCreateWorkerData,
        refetch: editCreateWorkerRefetch,
        isSuccess: editCreateWorkerSuccess,
    } = useQuery(["edit-create-worker", editId], () => apiService.getDataByID("/users/users", editId), {
        enabled: false
    });
    // put-query
    const {
        mutate: putCreateWorker,
        isLoading: putCreateWorkerLoading,
        isSuccess: putCreateWorkerSuccess
    } = useMutation(({
                         url,
                         data,
                         id
                     }) => apiService.editData(url, data, id), {
        onSuccess: () => {
            message.success('Success')
        },
        onError: (error) => {
            for (let obj in error.response.data) {
                message.error(`${obj}: ${error.response.data[obj][0]}`)
            }
        }
    });

    // ================================ useEffect =============================


    // create-worker success
    SuccessCreateAndEdit(postModuleSuccess, putCreateWorkerSuccess, '/module')

    // if edit create-worker
    EditGetById(editCreateWorkerRefetch)

    // if no edit create-worker
    SetInitialValue(form, initialValueForm)

    useEffect(() => {
        companyFetch()
    }, []);

    //edit create-worker
    useEffect(() => {
        if (editCreateWorkerSuccess) {


            const edit = {
                name: editCreateWorkerData?.name,
                company: editCreateWorkerData?.company
            }

            form.setFieldsValue(edit)
        }

    }, [editCreateWorkerData])

    const onFinish = (value) => {

        const data = {
            name: value?.name,
            company: value?.company,
        }

        if (editCreateWorkerData) {
            putCreateWorker({url: '/users/users', data, id: editId})
        } else {
            postModuleMutate({url: "/users/users/", data});
        }


    }

    const onFinishFailed = (value) => {
        console.log(value)
    }

    // refresh page again get data
    useEffect(() => {


        const storedValues = JSON.parse(localStorage.getItem('myFormValues'));
        if (storedValues) {

            form.setFieldsValue(storedValues);
        }

        const handleBeforeUnload = () => {

            localStorage.setItem(
                'myFormValues',
                JSON.stringify(form.getFieldsValue()),
            );
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            localStorage.removeItem('editDataId')
            localStorage.removeItem('myFormValues')
            window.removeEventListener('beforeunload', handleBeforeUnload);
        }
    }, []);


    // option company
    const optionsCompany = useMemo(() => {
        return companyData?.map((option) => {
            return {
                value: option?.id,
                label: option?.title,
            };
        });
    }, [companyData]);


    return (<div>
        {(postModuleLoading || editCreateWorkerLoading || putCreateWorkerLoading || imagesUploadLoading) ?
            <AppLoader/> :
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
                onFinishFailed={onFinishFailed}
                initialValues={initialValueForm}
                onFinish={onFinish}
                autoComplete="off"
            >
                <Row gutter={20}>
                    <Col span={12}>
                        <FormInput
                            required={true}
                            required_text={'Требуется модуль'}
                            label={'Модуль'}
                            name={'name'}
                        />
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label={'Выберите компания'}
                            name={'company'}
                            rules={[{
                                required: true, message: 'Вы должны компания'
                            }]}
                            wrapperCol={{
                                span: 24,
                            }}
                        >
                            <Select
                                style={{
                                    width: '100%',
                                }}
                                placeholder='Выберите одну компания'
                                optionLabelProp='label'
                                options={optionsCompany}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Button type="primary" htmlType="submit" style={{width: "100%", marginTop: "20px"}}>
                    {editCreateWorkerSuccess ? 'Изменить' : 'Создать'}
                </Button>
            </Form>}
    </div>);
};

export default ModulePostEdit;