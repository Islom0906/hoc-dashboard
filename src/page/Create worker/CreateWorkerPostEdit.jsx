import React, {useEffect, useMemo, useState} from 'react';
import {Button, Col, DatePicker, Form, Row, Select, Upload} from "antd";
import {AppLoader, FormInput, FormInputEmail, FormInputNumber} from "../../components";
import {useSelector} from "react-redux";
import {EditGetById, onPreviewImage, SetInitialValue, SuccessCreateAndEdit} from "../../hooks";
import dayjs from "dayjs";
import {useDeleteQuery, useEditQuery, useGetByIdQuery, useGetQuery, usePostQuery} from "../../service/query/Queries";
import {CiSquarePlus} from "react-icons/ci";

const initialValueForm = {
    first_name: "",
    last_name: "",
    middle_name: "",
    birthday: "",
    gender: "",
    image: [],
    phone: "",
    email: "",
    password: "",
    roles: [
        {
            company: null,
            module: null,
            role: null,
            position: "",

        }
    ],
    isDirector:false
};

const CreateWorkerPostEdit = () => {
    const [form] = Form.useForm();
    const {editId} = useSelector(state => state.query)
    const [fileListProps, setFileListProps] = useState([]);
    const [isAddDirector, setIsAddDirector] = useState(false)
    const [companyId, setCompanyId] = useState(null)
    // query-company-get
    const {data: companyData, refetch: companyFetch} = useGetQuery(false, 'get-company', '/users/companies', false)

    // query-user-roles-get
    const {data: userRoleData, refetch: userRoleFetch} = useGetQuery(false, 'get-user-roles', '/users/roles', false)
    // query-module-get
    const {
        data: moduleData,
        refetch: moduleFetch
    } = useGetQuery(false, 'get-module', `/users/modules${companyId ? `?company_id=${companyId}` : ''}`, false)
    // query-image
    const {
        mutate: imagesUploadMutate,
        isSuccess: imagesUploadSuccess,
        isLoading: imagesUploadLoading,
        data: imagesUpload
    } = usePostQuery()

    // query-create-worker
    const {
        mutate: postCreateWorkerMutate,
        isLoading: postCreateWorkerLoading,
        isSuccess: postCreateWorkerSuccess
    } = usePostQuery()

    // query-edit
    const {
        isLoading: editCreateWorkerLoading,
        data: editCreateWorkerData,
        refetch: editCreateWorkerRefetch,
        isSuccess: editCreateWorkerSuccess
    } = useGetByIdQuery(false, "edit-create-worker", editId, '/users/users')


    // put-query
    const {
        mutate: putCreateWorker,
        isLoading: putCreateWorkerLoading,
        isSuccess: putCreateWorkerSuccess
    } = useEditQuery()

    // delete image
    const {mutate: imagesDeleteMutate} = useDeleteQuery()

    // ================================ useEffect =============================


    // create-worker success
    SuccessCreateAndEdit(postCreateWorkerSuccess, putCreateWorkerSuccess, '/create-worker')

    // if edit create-worker
    EditGetById(editCreateWorkerRefetch)

    // if no edit create-worker
    SetInitialValue(form, initialValueForm)

    useEffect(() => {
        companyFetch()
        userRoleFetch()
    }, []);

    useEffect(() => {
        if (companyId) moduleFetch()
    }, [companyId]);

    useEffect(() => {
        form.setFieldsValue({isDirector:isAddDirector})
    }, [isAddDirector]);


    //edit create-worker
    useEffect(() => {
        if (editCreateWorkerSuccess) {
            const roles = [{
                module: editCreateWorkerData?.roles[0]?.module?.id,
                role: editCreateWorkerData?.roles[0]?.role?.id,
                company: editCreateWorkerData?.roles[0]?.company?.id,
                position: editCreateWorkerData?.roles[0]?.position,
            }]
            const image = [{
                uid: editCreateWorkerData?.image?.id,
                name: editCreateWorkerData?.image?.id,
                status: "done",
                url: editCreateWorkerData.image?.image
            }];
            // 2-reliz
            // editCreateWorkerData?.roles?.map(role => {
            //     const data = {
            //         module: role?.module,
            //         user_role: role?.user_role
            //     }
            //     roles.push(data)
            // })
            const edit = {
                first_name: editCreateWorkerData?.first_name,
                last_name: editCreateWorkerData?.last_name,
                middle_name: editCreateWorkerData?.middle_name,
                birthday: dayjs(editCreateWorkerData?.birthday,"DD.MM.YYYY"),
                gender: editCreateWorkerData?.gender,
                image,
                phone: editCreateWorkerData?.phone,
                position: editCreateWorkerData?.position,
                email: editCreateWorkerData?.email,
                password: editCreateWorkerData?.password,
                roles
            }
            if (!roles[0]?.module) {
                setIsAddDirector(true)
            }
            setCompanyId(editCreateWorkerData?.roles[0]?.company?.id)
            setFileListProps(image)
            form.setFieldsValue(edit)
        }

    }, [editCreateWorkerData])

    const onFinish = (value) => {

        const data = {
            first_name: value?.first_name,
            last_name: value?.last_name,
            middle_name: value?.middle_name,
            birthday: dayjs(value?.birthday).format('DD.MM.YYYY'),
            gender: value?.gender,
            image: fileListProps[0]?.uid,
            phone: value?.phone,
            email: value?.email,
            password: value?.password,
            roles: isAddDirector ? [{
                    company: value?.roles[0].company,
                    position: value?.roles[0].position,
                    role: value?.roles[0].role,
                }] :
                value.roles
        }

        if (editCreateWorkerData) {
            putCreateWorker({url: '/users/users', data, id: editId})
        } else {
            postCreateWorkerMutate({url: "/users/users/", data});
        }
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
            if (fileListProps[0]?.name) {
                imagesDeleteMutate({url: "users/images", id});
            }
            setFileListProps([])
        } else if (newFileList.length !== 0) {
            formData.append("image", newFileList[0].originFileObj);
            imagesUploadMutate({url: "/users/images/", data: formData});
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
                label: option?.name,
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
    // option Tag

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

    const selectDirectorOrStaff = useMemo(() => {

        return [
            {
                value: false,
                label: 'Сотрудник',
            },
            {
                value: true,
                label: 'Директор',
            }
        ]


    }, []);

    const onChangeCompany = (value) => {
        setCompanyId(value)
    }


    const selectPosition=(value)=>{
        setIsAddDirector(value)
    }
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
                initialValues={initialValueForm}
                onFinish={onFinish}
                autoComplete="off"
            >
                <Row gutter={20}>
                    <Col span={8}>
                        <FormInput
                            required={true}
                            required_text={'Укажите имя'}
                            label={'Имя'}
                            name={'first_name'}
                        />
                    </Col>
                    <Col span={8}>
                        <FormInput
                            required={true}
                            required_text={'Укажите фамилию'}
                            label={'Фамилия'}
                            name={'last_name'}
                        />
                    </Col>
                    <Col span={8}>
                        <FormInput
                            required={true}
                            required_text={'Укажите отчество'}
                            label={'Отчество'}
                            name={'middle_name'}
                        />
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label='Изображение'
                            name={'image'}
                            rules={[{required: true, message: 'Загрузите изображение'}]}>
                            {/*<ImgCrop>*/}
                            <Upload
                                maxCount={1}
                                fileList={fileListProps}
                                listType='picture-card'
                                onChange={onChangeImage}
                                onPreview={onPreviewImage}
                                beforeUpload={() => false}
                            >
                                {fileListProps.length > 0 ? "" : <CiSquarePlus style={{fontSize:'30px'}}  />}
                            </Upload>
                            {/*</ImgCrop>*/}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label="Дата рождения"
                            name={'birthday'}
                            rules={[{
                                required: true, message: 'Укажите дату'
                            }]}
                        >
                            <DatePicker/>
                        </Form.Item>

                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label={'Пол'}
                            name={'gender'}
                            rules={[{
                                required: true, message: 'Укажите пол '
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
                    <Col span={24}>
                        <FormInputNumber
                            required={true}
                            required_text={'Укажите номер телефона'}
                            label={'Номер телефона'}
                            name={'phone'}
                        />

                    </Col>

                    <Col span={12}>
                        <FormInputEmail
                            required={true}
                            required_text={'Укажите электронную почту'}
                            label={'Электронная почта'}
                            name={'email'}
                        />
                    </Col>
                    <Col span={12}>
                        <FormInput
                            disabled={editCreateWorkerSuccess}
                            required={!editCreateWorkerSuccess}
                            required_text={'Укажите пароль'}
                            label={'Пароль'}
                            name={'password'}
                        />
                    </Col>


                    <Col span={24}>
                        <Form.Item
                            label={'Хотите добавить директор?'}
                            rules={[{
                                required: true, message: 'Выберите позиция'
                            }]}
                            name={'isDirector'}
                            wrapperCol={{
                                span: 24,
                            }}
                        >
                            <Select
                                style={{
                                    width: '100%',
                                }}
                                placeholder='Выберите одну позиция'
                                optionLabelProp='label'
                                onChange={selectPosition}
                                options={selectDirectorOrStaff}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.List name="roles">
                    {(fields, {add, remove}) => (
                        <>
                            {fields.map((field, index) => {
                                return (
                                    <div key={field.fieldKey} style={{marginBottom: 20}}>
                                        <Row gutter={20}>
                                            <Col span={12}>
                                                <Form.Item
                                                    label={'Компания'}
                                                    name={[field.name, 'company']}
                                                    rules={[{
                                                        required: true, message: 'Укажите компания'
                                                    }]}
                                                    wrapperCol={{
                                                        span: 24,
                                                    }}
                                                >
                                                    <Select
                                                        style={{
                                                            width: '100%',
                                                        }}
                                                        placeholder='Укажите только одну компания'
                                                        optionLabelProp='label'
                                                        onChange={onChangeCompany}
                                                        options={optionsCompany}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            {
                                                !isAddDirector &&
                                                <>


                                                    <Col span={12}>
                                                <Form.Item
                                                    label={'Отдел '}
                                                    name={[field.name, 'module']}
                                                    wrapperCol={{
                                                        span: 24,
                                                    }}
                                                >
                                                    <Select
                                                        style={{
                                                            width: '100%',
                                                        }}
                                                        placeholder='Укажите только один отдел'
                                                        optionLabelProp='label'
                                                        options={optionsModule}
                                                    />
                                                </Form.Item>
                                            </Col>
                                                </>

                                            }
                                            <Col span={12}>
                                                <Form.Item
                                                    label={'Роль'}
                                                    name={[field.name, 'role']}
                                                    rules={[{
                                                        required: true, message: 'Укажите роль'
                                                    }]}
                                                    wrapperCol={{
                                                        span: 24,
                                                    }}
                                                >
                                                    <Select
                                                        style={{
                                                            width: '100%',
                                                        }}
                                                        placeholder='Укажите только одну роль'
                                                        optionLabelProp='label'
                                                        options={optionsUserRole}
                                                    />
                                                </Form.Item>
                                            </Col>

                                            <Col span={12}>
                                                <FormInput
                                                    required={true}
                                                    required_text={'Укажите должность'}
                                                    label={'Должность'}
                                                    name={[field.name, 'position']}
                                                />
                                            </Col>
                                        </Row>


                                        {/*<MinusCircleOutlined*/}
                                        {/*    onClick={() => remove(field.name)}/>*/}


                                    </div>

                                );
                            })}
                            {/*<Form.Item>*/}
                            {/*    <CustomButton type="primary" onClick={() => add()} block*/}
                            {/*            style={{backgroundColor: '#28a745'}}>*/}
                            {/*        Открыть новый раздел для характеристика*/}
                            {/*    </CustomButton>*/}
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