import React, {useEffect, useState} from 'react';
import {Button, Col, Form, message, Row, Upload} from "antd";
import {AppLoader, FormInput} from "../../components";
import {useDispatch, useSelector} from "react-redux";
import {useMutation, useQuery} from "react-query";
import apiService from "../../service/apis/api";
import {editIdQuery} from "../../store/slice/querySlice";
import {useNavigate} from "react-router-dom";
import {EditGetById, onPreviewImage, SetInitialValue, SuccessCreateAndEdit} from "../../hooks";


const initialValueForm = {
    name: "",
    image: []
};

const CompanyPostEdit = () => {
    const [form] = Form.useForm();
    const {editId} = useSelector(state => state.query)
    const [fileListProps, setFileListProps] = useState([]);
    const dispatch = useDispatch()
    const navigate = useNavigate()
    // query-company
    const {
        mutate: postCompanyMutate,
        data: postCompany,
        isLoading: postCompanyLoading,
        isSuccess: postCompanySuccess,
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
        isLoading: editCompanyLoading,
        data: editCompanyData,
        refetch: editCompanyRefetch,
        isSuccess: editCompanySuccess,
    } = useQuery(["edit-company", editId], () => apiService.getDataByID("/users/companies", editId), {
        enabled: false
    });
    // put-query
    const {
        mutate: putCompany,
        isLoading: putCompanyLoading,
        data: putData,
        isSuccess: putCompanySuccess
    } = useMutation(({
                         url,
                         data,
                         id
                     }) => apiService.editData(url, data, id), {
        onSuccess: () => {
            message.success('Успешно')
        },
        onError: (error) => {
            for (let obj in error.response.data) {
                message.error(`${obj}: ${error.response.data[obj][0]}`)
            }
        }
    });
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

            console.log(editCompanyData)
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