import React, {useEffect, useMemo, useState} from 'react';
import {Button, Card, Col, DatePicker, Flex, Form, Row, Select, Typography} from "antd";
import {AppLoader, FormInput, FormTextArea} from "../../components";
import {useSelector} from "react-redux";
import successCreateAndEdit from "../../hooks/successCreateAndEdit";
import editGetById from "../../hooks/editGetById";
import setInitialValue from "../../hooks/setInitialValue";
import dayjs from "dayjs";
import {useEditQuery, useGetByIdQuery, useGetQuery, usePostQuery} from "../../service/query/Queries";
import CreatSubTask from "./CreatSubTask";
import AddStaffTask from "./AddStaffTask";
const {Title,Text} = Typography
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
            module: null,
            file: null,
        }
    ]
}
const TaskPostEdit = () => {
    const [form] = Form.useForm();
    const [selectModulesID, setSelectModulesID] = useState(null)
    const [fileListProps, setFileListProps] = useState([[]]);
    const {companyID} = useSelector(state => state.companySlice)
    const [selectAddSubTask, setSelectAddSubTask] = useState(false)
    const [subTaskStaffs, setSubTaskStaffs] = useState([])
    const {editId} = useSelector(state => state.query)
    // get-responsibleUser
    const {
        data: responsibleUser,
        refetch: refetchResponsibleUser
    } = useGetQuery(false, 'get-responsibleUser', `users/user-filter-by-company?company_id=${companyID}`, false)
    const {
        data: getTag,
        refetch: refetchGetTag
    } = useGetQuery(false, 'get-tag', `users/tags/${companyID}`, false)
    // get modules
    const {
        data: getModules,
        refetch: refetchGetModules
    } = useGetQuery(false, 'get-modules', `/users/module-filter?company_id=${companyID}`, false)
    // get-user
    const {
        data: getUserByModules,
        refetch: refetchGetUserByModules
    } = useGetQuery(false, 'get-user', `/users/user-filter?module_id=${selectModulesID}`, false)
    // post task
    const {
        mutate: postTaskMutate,
        isLoading: postTaskLoading,
        isSuccess: postTaskSuccess
    } = usePostQuery()
    // get by id
    const {
        isLoading: editTaskLoading,
        data: editTaskData,
        refetch: editTaskRefetch,
        isSuccess: editTaskSuccess
    } = useGetByIdQuery(false, "edit-task", editId, '/users/tasks')
    // put task
    const {
        mutate: putTask,
        isLoading: putTaskLoading,
        isSuccess: putTaskSuccess
    } = useEditQuery()

    // tasks success
    successCreateAndEdit(postTaskSuccess, putTaskSuccess, '/taskCreated')
    editGetById(editTaskRefetch)
    setInitialValue(form, initialValueForm)
    //edit company
    useEffect(() => {
        const subTask = []
        const editFileProps=[]
        const allModuls = []
        const subModuleStaff = []
        const allModuleStaff = []
        editTaskData?.sub_tasks?.map(item => {
            subTask.push({
                title: item?.title,
                text: item?.text,
                deadline: dayjs(item?.deadline) || null,
                staff: item?.staff,
                module: item?.module?.id,
                file: item?.file_id
            })
            editFileProps.push([{
                uid: item?.file_id,
                name:item?.file_url,
                status: "done",
                url: item?.file_url
            }])
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
                tag: editTaskData?.tag?.id,
                moduls: editTaskData?.moduls,
                sub_tasks: subTask,
                allModuls
            }
            setFileListProps(editFileProps)
            form.setFieldsValue(edit)
        }
    }, [editTaskData])
    const onFailed = (value) => {
        console.log(value)
    }
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
                deadline:dayjs(subTask.deadline).format('YYYY-MM-DDTHH:mm:ss.SSS')
            }
        })
        const data = {
            title: value.title,
            text: value.text,
            deadline: dayjs(value?.deadline).format('YYYY-MM-DDTHH:mm:ss.SSS'),
            tag: value?.tag,
            company: companyID,
            moduls: selectAddSubTask ? [] : selectModuls,
            users: selectAddSubTask ? [] : selectStaff,
            sub_tasks: value?.sub_tasks ? subTask : [],
            responsible_user: value?.responsible_user,
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
                label: `${option?.full_name}  Позиция- (${option?.position})`,
            };
        });
    }, [responsibleUser]);

    // option module
    const optionTag = useMemo(() => {
        return getTag?.map((option) => {
            return {
                value: option?.id,
                label: option?.name,
            };
        });
    }, [getTag]);
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
    useEffect(() => {
        if (companyID) {
            refetchGetModules()
            refetchResponsibleUser()
            refetchGetTag()
        }
    }, [companyID]);

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
                onFinishFailed={onFailed}
                autoComplete="off"
            >
                <Row gutter={20}>
                    <Col span={24}>
                        <Title level={2}>
                            Создать задачу:
                        </Title>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label={'Выберите компанию'}
                            name={'tag'}
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
                                placeholder='Выберите компанию'
                                optionLabelProp='label'
                                options={optionTag}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <FormInput
                            required={true}
                            required_text={'Требуется название задачи'}
                            label={'Название задачи'}
                            name={'title'}
                        />
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="Выберите крайний срок"
                            name={'deadline'}
                            rules={[{
                                required: true, message: 'Укажите крайний срок.'
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
                            required_text={'Подробно о подзадаче'}
                            label={'Подробно о подзадаче'}
                            name={'text'}
                        />
                    </Col>

                    <Col>
                            <Button  type={"primary"} style={{marginBottom: 30}}
                                     onClick={() => setSelectAddSubTask(prev => !prev)}>
                                {
                                    selectAddSubTask ? 'Добавить сотрудника' : '  Добавить подзадачу'
                                }
                            </Button>
                    </Col>
                    <Col>
                        <div style={{marginTop: '10px'}}>
                            <Text type="danger" >{ selectAddSubTask ? 'А теперь  вы добавите подзадачу!' : ' Щас вы добавите  сотрудника!'}</Text>
                        </div>
                    </Col>
                    {/*<Col span={24}>*/}
                    {/*    <Card bordered={true} style={{border: 1, borderStyle: "dashed", borderColor: "white"}}>*/}
                    {/*        <Flex align={'center'} vertical={true} justify={"center"} style={{height: "100%"}}>*/}
                    {/*            <CreatSubTask  form={form}  onChangeModules={onChangeModules} optionsModules={optionsModules}*/}
                    {/*                          optionsUserByModules={editTaskSuccess && subTaskStaffs?.length > 0 ? subTaskStaffs : optionsUserByModules}*/}
                    {/*                           fileListProps={fileListProps}*/}
                    {/*                           setFileListProps={setFileListProps}*/}
                    {/*            />*/}
                    {/*        </Flex>*/}
                    {/*    </Card>*/}
                    {/*</Col>*/}

                    {
                        selectAddSubTask ?
                            <Col span={24}>
                                <Card bordered={true} style={{border: 1, borderStyle: "dashed", borderColor: "white"}}>
                                    <Flex align={'center'} vertical={true} justify={"center"} style={{height: "100%"}}>
                                        <CreatSubTask  form={form}  onChangeModules={onChangeModules} optionsModules={optionsModules}
                                                       optionsUserByModules={editTaskSuccess && subTaskStaffs?.length > 0 ? subTaskStaffs : optionsUserByModules}
                                                       fileListProps={fileListProps}
                                                       setFileListProps={setFileListProps}
                                        />
                                    </Flex>
                                </Card>

                            </Col>
                            :
                            <Col span={24}>
                                <Card bordered={true} style={{border: 1, borderStyle: "dashed", borderColor: "white"}}>
                                    <Flex align={'center'} vertical={true} justify={"center"} style={{height: "100%"}}>
                                        <AddStaffTask optionsModules={optionsModules}
                                                  optionsUserByModules={editTaskSuccess && subTaskStaffs?.length > 0 ? subTaskStaffs : optionsUserByModules}
                                                  onChangeModules={onChangeModules}

                                        />
                                    </Flex>
                                </Card>
                            </Col>
                    }
                    <Col span={24}>
                        <Form.Item
                            label={'Ответственный'}
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
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Button type="primary" htmlType="submit" style={{width: "100%", marginTop: "20px"}}>
                    {editTaskSuccess ? 'Редактировать' : 'Создать'}
                </Button>
            </Form>}
    </div>);
};

export default TaskPostEdit;
