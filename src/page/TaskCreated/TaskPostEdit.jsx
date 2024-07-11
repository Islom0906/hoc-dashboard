import React, {useEffect, useMemo, useState} from 'react';
import {Button, Card, Col, DatePicker, Flex, Form, message, Row, Select, Typography} from "antd";
import {AppLoader, FormInput, FormTextArea} from "../../components";
import {useSelector} from "react-redux";
import {useMutation, useQuery, useQueryClient} from "react-query";
import apiService from "../../service/apis/api";
import {MinusCircleOutlined} from "@ant-design/icons";
import successCreateAndEdit from "../../hooks/successCreateAndEdit";
import editGetById from "../../hooks/editGetById";
import setInitialValue from "../../hooks/setInitialValue";
import dayjs from "dayjs";

const {Title} = Typography


const initialValueForm = {
    title: '',
    text: '',
    deadline: '',
    company: null,
    moduls: [],
    responsible_user: null,
    users: [],
    allModuls: [
        {
            moduls: null,
            user: null
        }
    ],
    sub_tasks: [
        {
            title: "",
            text: "",
            deadline: '',
            staff: null,
            module: null
        }
    ]
}


const TaskPostEdit = () => {
    const queryClient = useQueryClient()
    const [form] = Form.useForm();
    const [selectCompanyID, setSelectCompanyID] = useState(null)
    const [selectModulesID, setSelectModulesID] = useState(null)
    const [selectAddSubTask, setSelectAddSubTask] = useState(false)
    const [subTaskStaffs, setSubTaskStaffs] = useState([])
    const {editId} = useSelector(state => state.query)
    // get-responsibleUser
    const {
        data: responsibleUser,
        refetch: refetchResponsibleUser,
    } = useQuery('get-responsibleUser', () => apiService.getData(`users/user-filter-by-company?company_id=${selectCompanyID}`), {
        enabled: false,
        onError: (error) => {
            message.error(error.message);
        },
    });

    // get-company
    const {
        data: getCompany,
        refetch: refetchGetCompany,
    } = useQuery('get-company', () => apiService.getData(`/users/companies/`), {
        enabled: false,
        onError: (error) => {
            message.error(error.message);
        },
    });

    const {
        data: getModules,
        refetch: refetchGetModules,
    } = useQuery('get-modules', () => apiService.getData(`/users/module-filter?company_id=${selectCompanyID}`), {
        enabled: false,
        onError: (error) => {
            message.error(error.message);
        },
    });
    // get-user
    const {
        data: getUserByModules,
        refetch: refetchGetUserByModules,
    } = useQuery('get-user', () => apiService.getData(`/users/user-filter?module_id=${selectModulesID}`), {
        enabled: false,
        onError: (error) => {
            message.error(error.message);
        },
    });
    // post task
    const {
        mutate: postTaskMutate,
        isLoading: postTaskLoading,
        isSuccess: postTaskSuccess,
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
    const {
        isLoading: editTaskLoading,
        data: editTaskData,
        refetch: editTaskRefetch,
        isSuccess: editTaskSuccess,
    } = useQuery(["edit-task", editId], () => apiService.getDataByID("/users/tasks", editId), {
        enabled: false
    });
    // put task
    const {
        mutate: putTask,
        isLoading: putTaskLoading,
        isSuccess: putTaskSuccess
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

    useEffect(() => {
        refetchGetCompany()


        return () => {
            queryClient.removeQueries()
        }
    }, [])
    // tasks success

    successCreateAndEdit(postTaskSuccess, putTaskSuccess, '/taskCreated')
    editGetById(editTaskRefetch)
    setInitialValue(form, initialValueForm)

    //edit company
    useEffect(() => {
        const subTask = []
        const allModuls = []
        const subModuleStaff = []
        const allModuleStaff = []
        editTaskData?.sub_tasks?.map(item => {
            subTask.push({
                title: item?.title,
                text: item?.text,
                deadline: dayjs(item?.deadline) || null,
                staff: item?.staff,
                module: item?.module?.id
            })

            const optionSubModuleStaff = item?.module?.staffs?.map((option) => {
                return {
                    value: option?.id,
                    label: `${option?.full_name}(${option?.position})`,
                };
            });

            subModuleStaff.push(optionSubModuleStaff)
        })
        editTaskData?.included_users?.map(included => {
            allModuls.push({
                moduls: included?.modules?.id,
                user: included?.id
            })
            const optionModuleStaff = included?.modules?.included_users?.map((option) => {
                return {
                    value: option?.id,
                    label: `${option?.full_name}(${option?.position})`,
                };
            });
            allModuleStaff.push(optionModuleStaff)

        })


        if (!editTaskData?.moduls?.length > 0 && editTaskSuccess) {
            setSelectAddSubTask(true)
            setSubTaskStaffs(subModuleStaff)
        } else {
            setSubTaskStaffs(allModuleStaff)
        }
        if (editTaskSuccess) {
            const edit = {
                title: editTaskData?.title,
                text: editTaskData?.title,
                deadline: dayjs(editTaskData?.deadline),
                responsible_user: editTaskData?.responsible_user?.id,
                company: editTaskData?.company?.id,
                moduls: editTaskData?.moduls,
                sub_tasks: subTask,
                allModuls
            }
            setSelectCompanyID(editTaskData?.company?.id)
            form.setFieldsValue(edit)
        }
    }, [editTaskData])

    const onFinish = (value) => {
        const selectStaff = []
        const selectModuls = []
        value?.allModuls?.map(item => {
            if (item.user) {
                selectStaff.push(item.user)
            }
            if (item.moduls) {
                selectModuls.push(item.moduls)
            }
        })
       const subTask=value?.sub_tasks?.map((subTask)=>{
            return{
                ...subTask,
                deadline:dayjs(subTask.deadline).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
            }
        })
        console.log(subTask)

        const data = {
            title: value.title,
            text: value.text,
            deadline: dayjs(value?.deadline).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
            company: value?.company,
            moduls: selectAddSubTask ? [] : selectModuls,
            users: selectAddSubTask ? [] : selectStaff,
            sub_tasks: value?.sub_tasks ? subTask : [],
            responsible_user: value?.responsible_user
        }
        if (editTaskData) {
            putTask({url: '/users/tasks', data: data, id: editId})
        } else {
            postTaskMutate({url: "/users/tasks/", data: data});
        }
    }

    // refresh page again get data
    useEffect(() => {
        // const storedValues = JSON.parse(localStorage.getItem('myFormValues'));
        // if (storedValues) {
        //     // storedValues.image = []
        //     const data = {
        //         ...storedValues,
        //         deadline: dayjs(storedValues?.deadline)
        //     }
        //     form.setFieldsValue(data);
        // }
        const handleBeforeUnload = (event) => {
            event.preventDefault()
            // localStorage.setItem(
            //     'myFormValues',
            //     JSON.stringify(form.getFieldsValue()),
            // );
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            localStorage.removeItem('editDataId')
            // localStorage.removeItem('myFormValues')
            window.removeEventListener('beforeunload', handleBeforeUnload);
        }
    }, []);
    // option Company
    const optionsResponsibleUser = useMemo(() => {
        return responsibleUser?.results?.map((option) => {
            return {
                value: option?.id,
                label: `${option?.full_name}(${option?.position})`,
            };
        });
    }, [responsibleUser]);
    // option Company
    const optionsCompany = useMemo(() => {
        return getCompany?.map((option) => {
            return {
                value: option?.id,
                label: option?.title,
            };
        });
    }, [getCompany]);
    // option module
    const optionsModules = useMemo(() => {
        return getModules?.results?.map((option) => {
            return {
                value: option?.id,
                label: option?.name,
            };
        });
    }, [getModules]);
    // option module
    const optionsUserByModules = useMemo(() => {
        return getUserByModules?.results?.map((option) => {
            return {
                value: option?.id,
                label: `${option?.full_name}(${option?.position})`,
            };
        });
    }, [getUserByModules]);

    const onChangeCompany = (id) => {
        setSelectCompanyID(id)
    }
    const onChangeModules = (id, index) => {
        setSelectModulesID(id)
        setSubTaskStaffs([])
        if (selectAddSubTask) {
            const getValueStaff = form.getFieldValue('sub_tasks')
            getValueStaff[index] = {...getValueStaff[index], staff: null}
            form.setFieldsValue({sub_tasks: getValueStaff})
        } else {
            const getValueModules = form.getFieldValue('allModuls')
            getValueModules[index] = {...getValueModules[index], user: null}
            form.setFieldsValue({allModuls: getValueModules})
        }
    }


    const onFinishFailed = value => {
        console.log(value)
    }


    useEffect(() => {
        if (selectCompanyID) {
            refetchGetModules()
            refetchResponsibleUser()
        }
    }, [selectCompanyID]);
    useEffect(() => {
        if (selectModulesID) {
            refetchGetUserByModules()
        }
    }, [selectModulesID]);


    return (<div>
        {(postTaskLoading || editTaskLoading || putTaskLoading) ?
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
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Row gutter={20}>
                    <Col span={24}>
                        <Title level={2}>
                            создайте задачу:
                        </Title>
                    </Col>
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
                            label="Выберите крайний срок"
                            name={'deadline'}
                            rules={[{
                                required: true, message: 'Укажите день  крайний срок.'
                            }]}
                        >
                            <DatePicker
                                showTime
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <FormTextArea
                            required={true}
                            required_text={'текст к заданию'}
                            label={'текст к заданию'}
                            name={'text'}
                        />
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label={'Выберите компания'}
                            name={'company'}
                            rules={[{
                                required: true, message: 'Выберите компания'
                            }]}
                            wrapperCol={{
                                span: 24,
                            }}
                        >
                            <Select
                                style={{
                                    width: '100%',
                                }}
                                placeholder='Выберите компания'
                                optionLabelProp='label'
                                options={optionsCompany}
                                onChange={onChangeCompany}
                            />
                        </Form.Item>
                    </Col>
                    <Col>
                        <Button type={"primary"} style={{marginBottom: 30}}
                                onClick={() => setSelectAddSubTask(prev => !prev)}>
                            добавить подзадачу
                        </Button>
                    </Col>
                    {
                        selectAddSubTask ?
                            <Col span={24}>
                                <Card bordered={true} style={{border: 1, borderStyle: "dashed", borderColor: "white"}}>
                                    <Flex align={'center'} vertical={true} justify={"center"} style={{height: "100%"}}>
                                        <CreatSubTask onChangeModules={onChangeModules} optionsModules={optionsModules}
                                                      optionsUserByModules={editTaskSuccess && subTaskStaffs?.length > 0 ? subTaskStaffs : optionsUserByModules}

                                        />
                                    </Flex>
                                </Card>

                            </Col>
                            :
                            <Col span={24}>
                                <Card bordered={true} style={{border: 1, borderStyle: "dashed", borderColor: "white"}}>
                                    <Flex align={'center'} vertical={true} justify={"center"} style={{height: "100%"}}>
                                        <AddStaff optionsModules={optionsModules}
                                                  optionsUserByModules={editTaskSuccess && subTaskStaffs?.length > 0 ? subTaskStaffs : optionsUserByModules}
                                                  onChangeModules={onChangeModules}

                                        />
                                    </Flex>
                                </Card>
                            </Col>
                    }
                    <Col span={24}>
                        <Form.Item
                            label={'Ответственный человек'}
                            name={'responsible_user'}
                            rules={[{
                                required: true, message: 'Выберите человек'
                            }]}
                            wrapperCol={{
                                span: 24,
                            }}
                        >
                            <Select
                                style={{
                                    width: '100%',
                                }}
                                placeholder='Выберите человек'
                                optionLabelProp='label'
                                options={optionsResponsibleUser}
                                // onChange={onChangeCompany}
                            />
                        </Form.Item>
                    </Col>


                </Row>
                <Button type="primary" htmlType="submit" style={{width: "100%", marginTop: "20px"}}>
                    {editTaskSuccess ? 'Изменить' : 'Создать'}
                </Button>
            </Form>}
    </div>);
};

export default TaskPostEdit;

const AddStaff = ({optionsUserByModules, optionsModules, onChangeModules}) => {

    return (
        <Form.List name="allModuls">
            {(fields, {add, remove}) => (
                <>
                    {fields.map((field, index) => {
                        return (
                            <div key={field.fieldKey} style={{marginBottom: 20}}>
                                <Row gutter={20}>
                                    <Col span={11}>

                                        <Form.Item
                                            label={'Выберите департамент'}
                                            name={[field.name, 'moduls']}
                                            rules={[{
                                                required: true,
                                                message: 'Выберите департамент'
                                            }]}
                                            wrapperCol={{
                                                span: 24,
                                            }}
                                        >
                                            <Select
                                                style={{
                                                    width: '100%',
                                                }}
                                                placeholder='Выберите департамент'
                                                optionLabelProp='label'
                                                options={optionsModules}
                                                onChange={(id) => onChangeModules(id, index)}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={11}>
                                        <Form.Item
                                            label={'Выберите сотрудник'}
                                            name={[field.name, 'user']}
                                            wrapperCol={{
                                                span: 24,
                                            }}
                                        >
                                            <Select
                                                style={{
                                                    width: '100%',
                                                }}
                                                placeholder='Выберите сотрудник'
                                                optionLabelProp='label'
                                                options={optionsUserByModules && optionsUserByModules[0]?.length > 0 ? optionsUserByModules[index] : optionsUserByModules}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={2}>
                                        <Button type={"dashed"} danger onClick={() => remove(field.name)}
                                                style={{marginTop: 10}}>
                                            <MinusCircleOutlined
                                            />
                                        </Button>
                                    </Col>
                                </Row>
                            </div>
                        );
                    })}
                    <Form.Item>
                        <Button type="primary" onClick={() => add()} block
                                style={{backgroundColor: '#28a745'}}>
                            добавить сотрудника
                        </Button>
                    </Form.Item>

                </>
            )}
        </Form.List>
    )
}


const CreatSubTask = ({optionsUserByModules, optionsModules, onChangeModules}) => {
    return (
        <Form.List name="sub_tasks">
            {(fields, {add, remove}) => (
                <>
                    {fields.map((field, index) => {
                        return (
                            <div key={field.fieldKey} style={{marginBottom: 10}}>
                                <Row gutter={[20, 10]}>
                                    <Col span={20}>
                                        <Title level={3}>
                                            Lorem ipsum dolor sit amet.
                                        </Title>
                                    </Col>
                                    <Col span={2}>
                                        <Button type={"dashed"} danger onClick={() => remove(field.name)}>
                                            <MinusCircleOutlined
                                            />
                                        </Button>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item
                                            label="Выберите крайний срок"
                                            name={[field.name, 'deadline']}
                                            rules={[{
                                                required: true, message: 'Укажите день  крайний срок.'
                                            }]}
                                        >
                                            <DatePicker
                                                showTime
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label={'Выберите департамент'}
                                            name={[field.name, 'module']}
                                            rules={[{
                                                required: true, message: 'Выберите департамент'
                                            }]}
                                            wrapperCol={{
                                                span: 24,
                                            }}
                                        >
                                            <Select
                                                style={{
                                                    width: '100%',
                                                }}
                                                placeholder='Выберите департамент'
                                                optionLabelProp='label'
                                                options={optionsModules}
                                                onChange={(id) => onChangeModules(id, index)}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label={'Выберите сотрудник'}
                                            name={[field.name, 'staff']}
                                            wrapperCol={{
                                                span: 24,
                                            }}
                                        >
                                            <Select
                                                style={{
                                                    width: '100%',
                                                }}
                                                placeholder='Выберите сотрудник'
                                                optionLabelProp='label'
                                                options={optionsUserByModules && optionsUserByModules[0]?.length > 0 ? optionsUserByModules[index] : optionsUserByModules}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                        >
                                            <FormInput
                                                label={'Название компания'}
                                                name={[field.name, 'title']}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <FormTextArea
                                            label={'текст к заданию'}
                                            name={[field.name, 'text']}
                                        />
                                    </Col>
                                </Row>
                            </div>

                        );
                    })}
                    <Form.Item>
                        <Button type="primary" onClick={() => add()} block
                                style={{backgroundColor: '#28a745'}}>
                            создать подзадачу
                        </Button>
                    </Form.Item>

                </>
            )}
        </Form.List>
    )
}