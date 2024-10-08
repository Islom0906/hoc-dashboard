import React, {useEffect, useMemo} from 'react';
import {Button, Col,  Form, message, Row, Select} from "antd";
import {AppLoader, FormInput} from "../../components";
import {useSelector} from "react-redux";
import {EditGetById,  SetInitialValue, SuccessCreateAndEdit} from "../../hooks";
import {useEditQuery, useGetByIdQuery, useGetQuery, usePostQuery} from "../../service/query/Queries";

const initialValueForm = {
    name: "",
    company: null,

};

const ModulePostEdit = () => {
    const [form] = Form.useForm();
    const {editId} = useSelector(state => state.query)

    // query-company-get
    const {data: companyData, refetch: companyFetch} = useGetQuery(false, 'get-company', '/users/companies', false)



    // query-module
    const {
        mutate: postModuleMutate,
        isLoading: postModuleLoading,
        isSuccess: postModuleSuccess
    } = usePostQuery()
    ;

    // query-edit
    const {
        isLoading: editModuleLoading,
        data: editModuleData,
        refetch: editModuleRefetch,
        isSuccess: editModuleSuccess
    } = useGetByIdQuery(false, "edit-module", editId, '/users/modules')


    // put-query
    const {
        mutate: putModule,
        isLoading: putModuleLoading,
        isSuccess: putModuleSuccess
    } = useEditQuery()


    // ================================ useEffect =============================


    // module success
    SuccessCreateAndEdit(postModuleSuccess, putModuleSuccess, '/module')

    // if edit module
    EditGetById(editModuleRefetch)

    // if no edit module
    SetInitialValue(form, initialValueForm)

    useEffect(() => {
        companyFetch()
    }, []);

    //edit module
    useEffect(() => {
        if (editModuleSuccess) {


            const edit = {
                name: editModuleData?.name,
                company: editModuleData?.companies?.id
            }

            form.setFieldsValue(edit)
        }

    }, [editModuleData])

    const onFinish = (value) => {

        const data = {
            name: value?.name,
            company: value?.company,
        }

        if (editModuleData) {
            putModule({url: '/users/modules', data, id: editId})
        } else {
            postModuleMutate({url: "/users/modules/", data});
        }


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
        {(postModuleLoading || editModuleLoading || putModuleLoading ) ?
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
                initialValues={initialValueForm}
                onFinish={onFinish}
                autoComplete="off"
            >
                <Row gutter={20}>
                    <Col span={12}>
                        <FormInput
                            required={true}
                            required_text={'Укажите название'}
                            label={'Название'}
                            name={'name'}
                        />
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label={'Компания'}
                            name={'company'}
                            rules={[{
                                required: true, message: 'Выберите компанию'
                            }]}
                            wrapperCol={{
                                span: 24,
                            }}
                        >
                            <Select
                                style={{
                                    width: '100%',
                                }}
                                placeholder='Выберите компанию'
                                optionLabelProp='label'
                                options={optionsCompany}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Button type="primary" htmlType="submit" style={{width: "100%", marginTop: "20px"}}>
                    {editModuleSuccess ? 'Редактировать' : 'Создать'}
                </Button>
            </Form>}
    </div>);
};

export default ModulePostEdit;