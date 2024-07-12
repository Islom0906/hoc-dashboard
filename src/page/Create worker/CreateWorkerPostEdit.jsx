import React, {useEffect, useMemo, useState} from 'react';
import {Button, Col, DatePicker, Form, message, Row, Select, Upload} from "antd";
import {AppLoader, FormInput, FormInputEmail, FormInputNumber} from "../../components";
import {useSelector} from "react-redux";
import {useMutation, useQuery} from "react-query";
import apiService from "../../service/apis/api";
import {EditGetById, onPreviewImage, SetInitialValue, SuccessCreateAndEdit} from "../../hooks";
import dayjs from "dayjs";
const initialValueForm = {
    first_name: "",
    last_name: "",
    birthday: "",
    gender: "",
    image: [],
    phone: "",
    position: "",
    email: "",
    password: "",
    company: [],
    user_roles: [
        {
            module: null,
            user_role: null
        }
    ]
};

const CreateWorkerPostEdit = () => {
    const [form] = Form.useForm();
    const {editId} = useSelector(state => state.query)
    const [fileListProps, setFileListProps] = useState([]);
    // const dispatch = useDispatch()
    // const navigate = useNavigate()

    // query-company-get
    const {data: companyData, refetch: companyFetch} = useQuery(
        'get-company',
        () => apiService.getData('/users/companies'),
        {
            enabled: false,
        },
    );
    // query-user-roles-get
    const {data: userRoleData, refetch: userRoleFetch} = useQuery(
        'get-user-roles',
        () => apiService.getData('/users/roles'),
        {
            enabled: false,
        },
    );
    // query-module-get
    const {data: moduleData, refetch: moduleFetch} = useQuery(
        'get-module',
        () => apiService.getData('/users/modules'),
        {
            enabled: false,
        },
    );


    // query-image
    const {
        mutate: imagesUploadMutate,
        data: imagesUpload,
        isLoading: imagesUploadLoading,
        isSuccess: imagesUploadSuccess,
    } = useMutation(({url, formData}) => apiService.postData(url, formData), {

        onSuccess: () => {

            message.success('Успешно')
        },
        onError: (error) => {
            for (let obj in error.response.data) {
                message.error(`${obj}: ${error.response.data[obj][0]}`)
            }
        }
    });


    // query-create-worker
    const {
        mutate: postCreateWorkerMutate,
        isLoading: postCreateWorkerLoading,
        isSuccess: postCreateWorkerSuccess,
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
    // delete image

    const {mutate: imagesDeleteMutate} = useMutation(({url, id}) => apiService.deleteData(url, id), {
        onSuccess: () => message.success('Success'),
        onError: (error) => message.error(error.message)
    });
    // ================================ useEffect =============================


    // create-worker success
    SuccessCreateAndEdit(postCreateWorkerSuccess, putCreateWorkerSuccess, '/create-worker')

    // if edit create-worker
    EditGetById(editCreateWorkerRefetch)

    // if no edit create-worker
    SetInitialValue(form, initialValueForm)

    useEffect(() => {
        companyFetch()
        moduleFetch()
        userRoleFetch()
    }, []);

    //edit create-worker
    useEffect(() => {
        if (editCreateWorkerSuccess) {
            const user_roles = [{
                module: editCreateWorkerData?.user_roles[0]?.module,
                user_role: editCreateWorkerData?.user_roles[0]?.user_role
            }]
            const image = [{
                uid: editCreateWorkerData?.images?.id,
                name: editCreateWorkerData?.images?.id,
                status: "done",
                url: editCreateWorkerData.images?.image
            }];
            // 2-reliz
            // editCreateWorkerData?.user_roles?.map(role => {
            //     const data = {
            //         module: role?.module,
            //         user_role: role?.user_role
            //     }
            //     user_roles.push(data)
            // })
            const edit = {
                first_name: editCreateWorkerData?.first_name,
                last_name: editCreateWorkerData?.last_name,
                birthday: dayjs(editCreateWorkerData?.birthday,"DD.MM.YYYY"),
                gender: editCreateWorkerData?.gender,
                image,
                phone: editCreateWorkerData?.phone,
                position: editCreateWorkerData?.position,
                email: editCreateWorkerData?.email,
                password: editCreateWorkerData?.password,
                company: editCreateWorkerData?.companies[0]?.id,
                user_roles
            }

            setFileListProps(image)
            form.setFieldsValue(edit)
        }

    }, [editCreateWorkerData])

    const onFinish = (value) => {

        const data = {
            first_name: value?.first_name,
            last_name: value?.last_name,
            birthday: dayjs(value?.birthday).format('DD.MM.YYYY'),
            gender: value?.gender,
            image: fileListProps[0]?.uid,
            phone: value?.phone,
            position: value?.position,
            email: value?.email,
            password: value?.password,
            company: [
                value?.company
            ],
            user_roles: value?.user_roles
        }

        if (editCreateWorkerData) {
            putCreateWorker({url: '/users/users', data, id: editId})
        } else {
            postCreateWorkerMutate({url: "/users/users/", data});
        }


    }

    const onFinishFailed = (value) => {
        console.log(value)
    }

    // refresh page again get data
    useEffect(() => {


        const storedValues = JSON.parse(localStorage.getItem('myFormValues'));
        if (storedValues) {
            // storedValues.image = []
            setFileListProps(storedValues.image)
            const data = {
                ...storedValues,
                birthday: dayjs(storedValues?.birthday)
            }
            form.setFieldsValue(data);
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

    useEffect(() => {

        if (imagesUploadSuccess) {
            const uploadImg = [{
                uid: imagesUpload?.id,
                name: imagesUpload?.id,
                status: "done",
                url: imagesUpload?.image
            }]

            form.setFieldsValue({image: uploadImg});
            setFileListProps(uploadImg);
        }

    }, [imagesUpload]);

    const onChangeImage = ({fileList: newFileList}) => {
        const formData = new FormData();

        if (fileListProps.length !== 0 || newFileList.length === 0) {
            form.setFieldsValue({image: []});
            const id = [fileListProps[0]?.uid];

            imagesDeleteMutate({url: "users/images", id});
            setFileListProps([])
        } else if (newFileList.length !== 0) {
            formData.append("image", newFileList[0].originFileObj);
            imagesUploadMutate({url: "/users/images/", formData});
        }
    };


    // option company
    const optionsCompany = useMemo(() => {
        return companyData?.map((option) => {
            return {
                value: option?.id,
                label: option?.title,
            };
        });
    }, [companyData]);
    // option user role
    const optionsUserRole = useMemo(() => {
        return userRoleData?.map((option) => {
            return {
                value: option?.id,
                label: option?.name === "boss" ? 'Болим бошлиғи' : 'Ходим',
            };
        });
    }, [userRoleData]);
    // option module
    const optionsModule = useMemo(() => {
        return moduleData?.map((option) => {
            return {
                value: option?.id,
                label: option?.name,
            };
        });
    }, [moduleData]);
    //option gender
    const optionsGender = useMemo(() => {

        return [
            {
                value: 'male',
                label: 'Мужской',
            },
            {
                value: 'female',
                label: 'Женский',
            }
        ]


    }, []);

    return (<div>
        {(postCreateWorkerLoading || editCreateWorkerLoading || putCreateWorkerLoading || imagesUploadLoading) ?
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
                            required_text={'Требуется название имя'}
                            label={'Имя сотрудника'}
                            name={'first_name'}
                        />
                    </Col>
                    <Col span={12}>
                        <FormInput
                            required={true}
                            required_text={'Требуется название фамилия'}
                            label={'Фамилия сотрудника'}
                            name={'last_name'}
                        />
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="День рождения сотрудника"
                            name={'birthday'}
                            rules={[{
                                required: true, message: 'Укажите день рождения.'
                            }]}
                        >
                            <DatePicker/>
                        </Form.Item>

                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={'Выберите пол'}
                            name={'gender'}
                            rules={[{
                                required: true, message: 'Вы должны пол'
                            }]}
                            wrapperCol={{
                                span: 24,
                            }}
                        >
                            <Select
                                style={{
                                    width: '100%',
                                }}
                                placeholder='Выберите одну пол'
                                optionLabelProp='label'
                                options={optionsGender}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <FormInputNumber
                            required={true}
                            required_text={'Требуется номер телефона'}
                            label={'Номер телефона'}
                            name={'phone'}
                        />

                    </Col>
                    <Col span={12}>
                        <FormInput
                            required={true}
                            required_text={'Требуется позиция'}
                            label={'Позиция'}
                            name={'position'}
                        />
                    </Col>
                    <Col span={12}>
                        <FormInputEmail
                            required={true}
                            required_text={'Требуется электронная почта'}
                            label={'Электронная почта'}
                            name={'email'}
                        />
                    </Col>
                    <Col span={12}>
                        <FormInput
                            disabled={editCreateWorkerSuccess}
                            required={!editCreateWorkerSuccess}
                            required_text={'Требуется пароль'}
                            label={'Пароль'}
                            name={'password'}
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
                <Form.List name="user_roles">
                    {(fields, {add, remove}) => (
                        <>
                            {fields.map((field, index) => {
                                return (
                                    <div key={field.fieldKey} style={{marginBottom: 20}}>
                                        <Row gutter={20}>

                                            <Col span={12}>
                                                <Form.Item
                                                    label={'Выберите раздел'}
                                                    name={[field.name, 'module']}
                                                    rules={[{
                                                        required: true, message: 'Вы должны раздел'
                                                    }]}
                                                    wrapperCol={{
                                                        span: 24,
                                                    }}
                                                >
                                                    <Select
                                                        style={{
                                                            width: '100%',
                                                        }}
                                                        placeholder='Выберите одну раздел'
                                                        optionLabelProp='label'
                                                        options={optionsModule}
                                                    />
                                                </Form.Item>

                                            </Col>
                                            <Col span={12}>
                                                <Form.Item
                                                    label={'Выберите роль сотрудника'}
                                                    name={[field.name, 'user_role']}
                                                    rules={[{
                                                        required: true, message: 'Вы должны роль сотрудника'
                                                    }]}
                                                    wrapperCol={{
                                                        span: 24,
                                                    }}
                                                >
                                                    <Select
                                                        style={{
                                                            width: '100%',
                                                        }}
                                                        placeholder='Выберите роль сотрудника'
                                                        optionLabelProp='label'
                                                        options={optionsUserRole}
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>


                                        {/*<MinusCircleOutlined*/}
                                        {/*    onClick={() => remove(field.name)}/>*/}


                                    </div>

                                );
                            })}
                            {/*<Form.Item>*/}
                            {/*    <Button type="primary" onClick={() => add()} block*/}
                            {/*            style={{backgroundColor: '#28a745'}}>*/}
                            {/*        Открыть новый раздел для характеристика*/}
                            {/*    </Button>*/}
                            {/*</Form.Item>*/}

                        </>
                    )}
                </Form.List>
                <Button type="primary" htmlType="submit" style={{width: "100%", marginTop: "20px"}}>
                    {editCreateWorkerSuccess ? 'Изменить' : 'Создать'}
                </Button>
            </Form>}
    </div>);
};

export default CreateWorkerPostEdit;