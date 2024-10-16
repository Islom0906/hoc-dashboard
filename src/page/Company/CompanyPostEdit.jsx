import React, {useEffect, useState} from 'react';
import {Button, Col, Form,  Row, Upload} from "antd";
import {AppLoader, FormInput} from "../../components";
import { useSelector} from "react-redux";
import {EditGetById, onPreviewImage, SetInitialValue, SuccessCreateAndEdit} from "../../hooks";
import {useEditQuery, useGetByIdQuery, usePostQuery} from "../../service/query/Queries";
import {useQueryClient} from "react-query";


const initialValueForm = {
    title: "",
    image_dark: [],
    image_light: []
};

const CompanyPostEdit = () => {
    const [form] = Form.useForm();
    const {editId} = useSelector(state => state.query)
    const [fileListPropsDark, setFileListPropsDark] = useState([]);
    const [fileListPropsLight, setFileListPropsLight] = useState([]);

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
            const image_dark = [{
                uid: editCompanyData.id,
                name: editCompanyData.id,
                status: "done",
                url: editCompanyData.image_dark
            }];
            const image_light = [{
                uid: editCompanyData.id,
                name: editCompanyData.id,
                status: "done",
                url: editCompanyData.image_light
            }];
            const edit = {
                image_light,image_dark,
                title: editCompanyData?.title
            }
            setFileListPropsDark(image_dark)
            setFileListPropsLight(image_light)
            form.setFieldsValue(edit)
        }
    }, [editCompanyData])

    const onFinish = (value) => {
        const formData = new FormData();
        formData.append('title', value.title);
        if (fileListPropsDark[0]?.originFileObj) {
            formData.append('image_dark', fileListPropsDark[0]?.originFileObj);
        }
        if (fileListPropsLight[0]?.originFileObj) {
            formData.append('image_light', fileListPropsLight[0]?.originFileObj);
        }
        if (editCompanyData) {
            putCompany({url: `/users/companies`, data: formData, id: editId})
        } else {
            postCompanyMutate({url: `/users/companies/`, data: formData});
        }
    }
    const onChangeImageLight = ({fileList: newFileList } ) => {
        setFileListPropsLight(newFileList);
    };
    const onChangeImageDark = ({fileList: newFileList } ) => {
        setFileListPropsDark(newFileList);
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
                    <Col span={24}>
                        <FormInput
                            required={true}
                            required_text={'Требуется название компании'}
                            label={'Название компании'}
                            name={'title'}
                        />
                    </Col>
                    <Col span={12}>

                        <Form.Item
                            label='Логотип для тёмной темы:'
                            name={'image_dark'}
                            rules={[{required: true, message: 'Требуется изображение'}]}>
                            {/*<ImgCrop>*/}
                            <Upload
                                maxCount={1}
                                fileList={fileListPropsDark}
                                listType='picture-card'
                                onChange={onChangeImageDark}
                                onPreview={onPreviewImage}
                                beforeUpload={() => false}
                            >
                                {fileListPropsDark.length > 0 ? "" : "Upload"}
                            </Upload>
                            {/*</ImgCrop>*/}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label='Логотип для светлой темы:'
                            name={'image_light'}
                            rules={[{required: true, message: 'Требуется изображение'}]}>
                            {/*<ImgCrop>*/}
                            <Upload
                                maxCount={1}
                                fileList={fileListPropsLight}
                                listType='picture-card'
                                onChange={onChangeImageLight}
                                onPreview={onPreviewImage}
                                beforeUpload={() => false}
                            >
                                {fileListPropsLight.length > 0 ? "" : "Upload"}
                            </Upload>
                            {/*</ImgCrop>*/}
                        </Form.Item>
                    </Col>
                </Row>
                <Button type="primary" htmlType="submit" style={{width: "100%", marginTop: "20px"}}>
                    {editCompanySuccess ? 'Редактировать' : 'Создать'}
                </Button>
            </Form>}
    </div>);
};

export default CompanyPostEdit;