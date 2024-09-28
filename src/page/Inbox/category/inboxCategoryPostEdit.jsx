import React, {useEffect, useState} from 'react';
import {Button, Card, Col, Form, Row} from "antd";
import {AppLoader, FormInput} from "../../../components";
import {useSelector} from "react-redux";
import {EditGetById, SetInitialValue, SuccessCreateAndEdit} from "../../../hooks";
import { useEditQuery, useGetByIdQuery, usePostQuery} from "../../../service/query/Queries";
import dayjs from "dayjs";


const initialValueForm = {
    name: "",
}





const InboxCategoryPostEdit = ({setIsModalOpen,categoryRefetch,link,isModalOpen}) => {
    const [form] = Form.useForm();
    const {editId} = useSelector(state => state.query)
    // query-inbox
    const {
        mutate: postInboxCategoryMutate,
        isLoading: postInboxCategoryLoading,
        isSuccess: postInboxCategorySuccess
    } = usePostQuery()
    // query-edit
    const {
        isLoading: editInboxCategoryLoading,
        data: editInboxCategoryData,
        refetch: editInboxCategoryRefetch,
        isSuccess: editInboxCategorySuccess
    } = useGetByIdQuery(false, "edit-inbox", editId, '/users/inbox-category')
    // put-query
    const {
        mutate: putInboxCategory,
        isLoading: putInboxCategoryLoading,
        isSuccess: putInboxCategorySuccess
    } = useEditQuery()


    // ================================ useEffect =============================
    // inbox success
    SuccessCreateAndEdit(postInboxCategorySuccess, putInboxCategorySuccess, link)
    useEffect(() => {
        if (postInboxCategorySuccess || putInboxCategorySuccess) {
            form.resetFields()
            setIsModalOpen(false)
            categoryRefetch()
        }
    }, [postInboxCategorySuccess,putInboxCategorySuccess]);
    // if edit inbox
    EditGetById(editInboxCategoryRefetch)
    // if no edit inbox
    SetInitialValue(form, initialValueForm)
    // useEffect(() => {
    //     if (!isModalOpen){
    //         form.setFieldsValue(initialValueForm)
    //
    //     }
    // }, [isModalOpen]);

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
            console.log('render')
            localStorage.removeItem('editDataId')
            localStorage.removeItem('myFormValues')
            window.removeEventListener('beforeunload', handleBeforeUnload);
        }
    }, []);
    //edit inbox
    useEffect(() => {
        if (editInboxCategorySuccess) {
            const edit = {
                name: editInboxCategoryData.name,
            }
            form.setFieldsValue(edit)
        }

    }, [editInboxCategoryData])

    const onFinish = (value) => {
        const data = {
            ...value,

        }

        if (editInboxCategoryData) {
            putInboxCategory({url: '/users/inbox-category', data, id: editId})
        } else {
            postInboxCategoryMutate({url: "/users/inbox-category/", data});
        }
    }


    return (<div>
        {(postInboxCategoryLoading || editInboxCategoryLoading || putInboxCategoryLoading) ?
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


                    <Col span={24}>
                        <FormInput
                            required={true}
                            required_text={'Требуется название'}
                            label={'Название тег'}
                            name={'name'}
                        />
                    </Col>
                </Row>


                <Button type="primary" htmlType="submit" style={{width: "100%", marginTop: "20px"}}>
                    {editInboxCategorySuccess ? 'Изменить' : 'Создать'}
                </Button>
            </Form>
        }
    </div>)

}


export default InboxCategoryPostEdit;