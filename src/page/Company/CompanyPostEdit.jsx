import React, {useEffect, useState} from 'react';
import {Button, Col, Form, message, Row, Upload} from "antd";
import {AppLoader, FormInput} from "../../components";
import { useSelector} from "react-redux";
import {EditGetById, onPreviewImage, SetInitialValue, SuccessCreateAndEdit} from "../../hooks";
import {useEditQuery, useGetByIdQuery, usePostQuery} from "../../service/query/Queries";


const initialValueForm = {
    name: "",
    image: []
};

const CompanyPostEdit = () => {
    const [form] = Form.useForm();
    const {editId} = useSelector(state => state.query)
    const [fileListProps, setFileListProps] = useState([]);
    // query-company
    const {
        mutate: postCompanyMutate,
        isLoading: postCompanyLoading,
        isSuccess: postCompanySuccess
    } = usePostQuery()
    // query-edit
    const {
        isLoading: editCompanyLoading,
        data: editCompanyData,
        refetch: editCompanyRefetch,
        isSuccess: editCompanySuccess
    } = useGetByIdQuery(false, "edit-company", editId, '/users/companies')
    // put-query
    const {
        mutate: putCompany,
        isLoading: putCompanyLoading,
        isSuccess: putCompanySuccess
    } = useEditQuery()

    // ================================ useEffect =============================
    // company success
    SuccessCreateAndEdit(postCompanySuccess,putCompanySuccess,'/company')
    // if edit compant
    EditGetById(editCompanyRefetch)
    // if no edit company
    SetInitialValue(form,initialValueForm)



    //edit company
    useEffect(() => {
        if (editCompanySuccess) {

            const image = [{
                uid: editCompanyData.id,
                name: editCompanyData.id,
                status: "done",
                url: editCompanyData.image
            }];

            const edit = {
                image,
                title: editCompanyData?.title
            }


            setFileListProps(image)
            form.setFieldsValue(edit)
        }

    }, [editCompanyData])

    const onFinish = (value) => {
        const formData = new FormData();
        formData.append('title', value.title);

        if (fileListProps[0]?.originFileObj) {
            formData.append('image', fileListProps[0]?.originFileObj);
        }

        if (editCompanyData) {
            putCompany({url: '/users/companies', data: formData, id: editId})
        } else {
            postCompanyMutate({url: "/users/companies/", data: formData});
        }


    }


    // refresh page again get data
    useEffect(() => {
        const storedValues = JSON.parse(localStorage.getItem('myFormValues'));
        if (storedValues) {
            storedValues.image = []
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


    // image
    const onChangeImage = ({fileList: newFileList}) => {
        setFileListProps(newFileList);
        form.setFieldsValue({image: newFileList});
    };

    return (<div>
        {(postCompanyLoading || editCompanyLoading || putCompanyLoading) ?
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
                            required_text={'Требуется название компания'}
                            label={'Название компания'}
                            name={'title'}
                        />
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label='Изображение'
                            name={'image'}
                            rules={[{required: true, message: 'Требуется изображение'}]}>
                            {/*<ImgCrop>*/}
                            <Upload
                                maxCount={1}
                                fileList={fileListProps}
                                listType='picture-card'
                                onChange={onChangeImage}
                                onPreview={onPreviewImage}
                                beforeUpload={() => false}
                            >
                                {fileListProps.length > 0 ? "" : "Upload"}
                            </Upload>
                            {/*</ImgCrop>*/}
                        </Form.Item>
                    </Col>
                </Row>


                <Button type="primary" htmlType="submit" style={{width: "100%", marginTop: "20px"}}>
                    {editCompanySuccess ? 'Изменить' : 'Создать'}
                </Button>
            </Form>}
    </div>);
};

export default CompanyPostEdit;